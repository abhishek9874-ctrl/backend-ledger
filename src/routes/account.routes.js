const express=require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const accountController=require("../controllers/account.controller")


const router=express.Router();
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController)

/**
 * api/account/balance/:accountId
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController)
router.get(
    "/all",
    authMiddleware.authMiddleware,
    accountController.getAllAccountsController
);


module.exports=router