const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    projectName:{type:String},
    images:[],
    link:{type:String},
    description:{type:String},
    createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
},{timestamps:true});
const projects=mongoose.model("project",schema);
module.exports=projects;