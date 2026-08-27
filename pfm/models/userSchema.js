const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    name:{type:String,
        required:true,
        unique:true
    },
    password:{type:String,
        required:true
    },
    profileImage:{type:String},
    visitHist:{
        time:{type:Number},
}
},{timestamps:true});
const users=mongoose.model("user",schema);
module.exports=users;