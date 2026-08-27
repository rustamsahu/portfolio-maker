const users=require("./models/userSchema");
const projects=require("./models/projectSchema");
const {setUser,getUser}=require("./setget");
const path=require("path");
const multer=require("multer");
const cloudinary=require("cloudinary").v2;
cloudinary.config({
    cloud_name:"drwtdfz0f",
    api_key:"739452117419444",
    api_secret:"EDGamm-rP6s97Wum9ibWcspUPz4"
});
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto",
    public_id:(req,file)=>{
    return `${Math.floor(Date.now()/1000)}-${file.originalname}`
    }
  }
});
const upload=multer({storage});
function signIn(req,res){
    res.sendFile(path.join(__dirname,"index.html"));
}
async function submitSignIn(req,res) {
    let {name,password}=req.body;
try{
    await users.create({
      name,
      password  
    });
    let user=await users.findOne({name,password});
    setUser(user);
    const link=`${req.protocol}://${req.get('host')}/foreignUser/${getUser()._id}`;
    res.render("cards",{firstTime:true,link});
   }
   catch (err) {
    if (err.code === 11000) {
        res.send("Username already exists");
    } else {
        res.send("Something went wrong");
    }
    }
}
async function submitLogin(req,res) {
    const {name,password}=req.body;
    const user=await users.findOne({name,password});
    if(!user)
    {
        res.redirect("/");
    }
    else
    {  
        setUser(user);
        let gU=getUser();
        const link=`${req.protocol}://${req.get('host')}/foreignUser/${gU._id}`;
        const particularProjects=(await projects.find({createdBy:gU._id})).reverse();
        res.render("cards",{firstTime:false,link,particularProjects,profileImageUrl:gU.profileImage});
    }
}
async function addNewProject(req,res) {
    res.render("addNewProject")
}
async function submitProfileImage(req,res){
    let user= await users.findByIdAndUpdate(getUser()._id,{profileImage:req.file.path},{new:true});
    setUser(user);
    res.redirect("/cards");
}
async function submitProject(req,res){
    let gU=getUser();
    const {projectName,link,description}=req.body;
    let images=[];
    for(i of req.files)
    {
          images.push(i.path)
    }
    await projects.create({
          projectName,
          link,
          description,
          images:images,
          createdBy:gU._id,
    });
    res.redirect("/cards")
}
async function cards(req,res){
    const gU=getUser();
    const LINK=`${req.protocol}://${req.get('host')}/foreignUser/${gU._id}`;
    const particularProjects=(await projects.find({createdBy:gU._id})).reverse();
    res.render("cards",{firstTime:false,link:LINK,particularProjects,profileImageUrl:gU.profileImage});
}
async function particularProject(req,res){
    const _id=req.params.id;
    const aimProject=await projects.findById(_id).populate("createdBy");
    res.render("project",{aimProject});
}
async function foreignUser(req,res) {
    const _id=req.params.id;
    const user=await users.findById(_id);
    const particularProjects=(await projects.find({createdBy:_id})).reverse();
    res.render("cards",{firstTime:false,link:"",particularProjects,profileImageUrl:user.profileImage})
}
function checkAuth(req,res,next){
    if(!getUser())
    res.redirect("/login");
    next();
}
module.exports={signIn,submitSignIn,submitLogin,addNewProject,cards,submitProfileImage,upload,submitProject,particularProject,foreignUser,checkAuth}