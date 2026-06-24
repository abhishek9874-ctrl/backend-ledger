const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")



const app=express();

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
/**
 * -Routes Required
 */
const authRouter=require("./routes/auth.routes")
const accountRouter=require("./routes/account.routes")
const transactionRoutes=require("./routes/transaction.routes")
const ledgerRoutes = require("./routes/ledger.routes");


app.get("/",(req,res)=>{
    res.send("Ledger services is up and running")
})
/**
 * -use Routes
 */
app.use("/api/auth",authRouter)
app.use("/api/account",accountRouter)
app.use("/api/transactions",transactionRoutes)
app.use("/api/ledger", ledgerRoutes);

module.exports=app;