const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required for creating a user..!!'],
    unique: [true,"Email already exist...!!!!"],
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  name:{
    type:String,
    required:[true,"Name is requires for creating a user..!!!"]
  },
  password:{
    type:String,
    required:[true,"Password should be required to create an account...!!"],
    minlength:[6,"Password should contain more than 6 characters..!!"],
    select:false
  },
  systemUser:{
    type:Boolean,
    default:false,
    immutable:true,
    select:false
  }
},{
    timestamps:true
});

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return
    }

    const hash=await bcrypt.hash(this.password,10)
    this.password=hash;
    return
})

userSchema.methods.comparePassword=async function (password) {
  return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("user",userSchema)

module.exports=userModel;

