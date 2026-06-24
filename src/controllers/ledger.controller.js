const ledgerModel=require("../models/ledger.model");


const getLedgerEntriesController=async (req,res)=>{
    try {
        const {accountId}=req.params;

        const entries=await ledgerModel.find({
            account:accountId
        })

        res.status(200).json({
            entries
        })
    } catch (err) {
        res.status(500).json({
            message:err.message,
        });
    }
};

module.exports={
    getLedgerEntriesController
}