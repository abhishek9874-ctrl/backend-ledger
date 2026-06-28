const accountModel=require("../models/account.model")

async function createAccountController(req,res) {
    const user=req.user

    const account=await accountModel.create({
        user:user._id
    })

    res.status(201).json({
        message:"Account created Successfully...!!!!",
        account
    })
}

/**
 * Get all accounts of logged in user 
 */
async function getUserAccountsController(req,res) {
    const accounts=await accountModel.find({user:req.user._id})

    res.status(200).json({
        accounts
    })
}



async function getAccountBalanceController(req,res) {
    const { accountId }=req.params

    console.log(accountId)

    const account=await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })
    console.log(account)

    if(!account){
        return res.status(404).json({
            message:'Account not Found....!!!!'
        })
    }

    const balance=await account.getBalance()

    res.status(200).json({
        accountId:account._id,
        balance:balance
    })
}


async function getAllAccountsController(req,res) {
    try {
        const accounts=await accountModel.find({
            user:{$ne:req.user._id},
            status:"ACTIVE"
        })
        .populate("user","name");

        res.status(200).json({
            accounts
        });
    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}


module.exports={
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController,
    getAllAccountsController
}