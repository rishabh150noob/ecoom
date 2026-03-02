const { Router }= require("express");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");

const router = Router();

router.get("/signin",(req,res)=>{
    return res.render("signin");
})

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post("/signin", async (req,res)=>{

    const { email , password}= req.body;

    try{

        const token = await User.matchPasswordAndGenerateToken(email , password);
        return res.cookie("token",token).redirect("/");
    }
    catch(error){

        return res.render("signin", {
            error:"incorrect password or email"
        })
    }; 
}); 


const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../services/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });


router.post("/signup", upload.single("profileImageURL"),async (req,res)=>{

    const { fullName , email , password} = req.body ;

    await User.create({
        fullName,
        email,
        password,
        profileImageURL:req.file.path,
    });

    return res.redirect("/");

});

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports= router;