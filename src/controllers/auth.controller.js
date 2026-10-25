const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);


async function googleLoginController(req, res) {
    try {
        const { credential, action } = req.body;


        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            email,
            name,
            email_verified
        } = payload;

        if (!email || !email_verified) {
            return res.status(401).json({
                message: "Google account email could not be verified"
            });
        }

        let user = await userModel.findOne({ email });

        if (action === "register") {

            if (user) {
                return res.status(409).json({
                    message: "An account with this email already exists. Please login instead."
                });
            }

            user = await userModel.create({
                email,
                name,
                googleId
            });

        } else {

            if (!user) {
                return res.status(404).json({
                    message: "No account found with this Google account. Please register first."
                });
            }

            if (user.googleId && user.googleId !== googleId) {
                return res.status(401).json({
                    message: "This email is linked to a different Google account."
                });
            }

        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "3d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
        });
        console.log("Google login systemUser:", user.systemUser);

        return res.status(200).json({
            message: "Google Login Successfully...!!!",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                systemUser:user.systemUser
            },
            token
        });

    } catch (error) {
        console.error("Google login error:", error);

        return res.status(401).json({
            message: "Google authentication failed"
        });
    }
}


async function userRegisterController(req, res) {
    const { email, name, password } = req.body;

    const isExists = await userModel.findOne({
        email: email
    })
    if (isExists) {
        return res.status(409).json({
            message: "User Already Exists...!!!",
            status: "Failed"
        })
    }
    const user = await userModel.create({
        email, name, password
    })

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET,
        { expiresIn: "3d" })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(201).json({
        message: "User Registered Successfully...!!!!",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            systemUser:user.systemUser
        },
        token
    })
    await emailService.sendRegistrationEmail(user.email, user.name)
}
async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is invalid..!!"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is invalid..!!"
        })
    }


    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_SECRET, { expiresIn: "3d" })


    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
        message: "User Login Successfully...!!!",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            systemUser:user.systemUser,
        },
        token
    })



}

async function authLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]


    if (!token) {
        return res.status(200).json({
            message: "User Logged Out successfully..!!!"
        })
    }


    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully...!!!"
    })
}
const updateProfileController = async (req, res) => {
    try {

        const { name, email } = req.body;

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.name = name;
        user.email = email;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }
};
const changePasswordController = async (req, res) => {
    try {

        const { currentPassword, newPassword } = req.body;

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        const user = await userModel
            .findById(req.user._id)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from the current password",
            });
        }

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
const forgotPasswordController = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await userModel
            .findOne({ email })
            .select("+resetPasswordToken +resetPasswordExpires");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpires =
            Date.now() + 15 * 60 * 1000;

        await user.save();


        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


        await emailService.sendPasswordResetEmail(
            user.email,
            user.name,
            resetUrl
        );

        res.status(200).json({
            message: "Password reset link sent successfully"
        });

    } catch (err) {


        res.status(500).json({
            message: err.message
        });

    }
};
const resetPasswordController = async (req, res) => {
    try {

        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const user = await userModel
            .findOne({
                resetPasswordToken: token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            })
            .select("+password +resetPasswordToken +resetPasswordExpires");

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        user.password = password;

        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (err) {


        res.status(500).json({
            message: err.message
        });
    }
};


module.exports = { userRegisterController, userLoginController, authLogoutController, updateProfileController, changePasswordController, forgotPasswordController, resetPasswordController, googleLoginController }