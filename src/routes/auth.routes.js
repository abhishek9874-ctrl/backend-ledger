const express=require("express")
const authController=require("../controllers/auth.controller")

const router=express.Router()

router.post("/register",authController.userRegisterController)
router.post("/login",authController.userLoginController)

/**
 * /api/auth/Logout
 */
router.post("/logout",authController.authLogoutController)
module.exports=router