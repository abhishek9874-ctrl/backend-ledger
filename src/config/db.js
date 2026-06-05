const mongoose=require("mongoose");


function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Server is connected to DB..!!")
        console.log("Database Name:", mongoose.connection.name);
    })
    .catch(err=>{
        console.log(err)
        console.log("Error while connected to DB..!! ")
        process.exit(1)
    })
}


module.exports=connectDB