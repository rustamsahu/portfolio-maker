const {signIn,submitSignIn,submitLogin,addNewProject,cards,submitProfileImage,upload,submitProject,particularProject,foreignUser,checkAuth}=require("./handlers");
const express=require("express");
const router=express.Router();
router.get("/",signIn);
router.post("/submitSignIn",submitSignIn);
router.post("/submitLogin",submitLogin);
router.get("/addNewProject",checkAuth,addNewProject);
router.get("/cards",checkAuth,cards);
router.post("/submitProfileImage",upload.single("profileImage"),submitProfileImage);
router.post("/submitProject",upload.array("projectImages"),submitProject);
router.get("/favicon.ico",(req,res)=>{
      res.status(204).end();
});
router.get("/:id",particularProject);
router.get("/foreignUser/:id",foreignUser);
module.exports=router;