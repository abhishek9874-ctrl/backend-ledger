const express=require("express")
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")

const router=express.Router()

router.post("/register",authController.userRegisterController)
router.post("/login",authController.userLoginController)
router.post("/google", authController.googleLoginController)

/**
 * /api/auth/Logout
 */
router.post("/logout",authController.authLogoutController)
router.put("/profile",authMiddleware.authMiddleware,authController.updateProfileController)
router.put("/changedPassword",authMiddleware.authMiddleware,authController.changePasswordController)
router.post("/forgotPassword",authController.forgotPasswordController)
router.post("/reset-password/:token",authController.resetPasswordController)
module.exports=router