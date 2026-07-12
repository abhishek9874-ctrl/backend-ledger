const express=require("express")
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")

const router=express.Router()

router.post("/register",authController.userRegisterController)
router.post("/login",authController.userLoginController)

/**
 * /api/auth/Logout
 */
router.post("/logout",authController.authLogoutController)
router.put("/profile",authMiddleware.authMiddleware,authController.updateProfileController)
router.put("/changedPassword",authMiddleware.authMiddleware,authController.changePasswordController)
module.exports=router