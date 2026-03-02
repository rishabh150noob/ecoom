const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

// here we get a blog , we have raw blog details , comment , user details 
// we send all this to views to render it 


// creating a comment by blogId
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,

  });
  return res.redirect(`/blog/${req.params.blogId}`);
});



router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user: req.user    })
})

router.get("/:id",async(req,res)=>{

    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");

    //This sends data to:views/blog.ejs  
    return res.render("blog",{
        user: req.user,
        blog , 
        comments,
    });
    
});

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../services/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_covers",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });
// creating a blog post
router.post("/", upload.single("coverImage"), async (req, res) => {

  const { title, body ,price ,category} = req.body;

  const blog = await Blog.create({
    body,
    title,
    price: price ? Number(price) : null,
    category,
    createdBy: req.user._id,
    coverImageURL:req.file.path,
  });

  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;

/*
User clicks "Create Blog"
        ↓
GET /blog/add-new
        ↓
Server sends form page
        ↓
User fills form + image
        ↓
User presses Submit
        ↓
POST /blog
        ↓
Server saves blog
        ↓
Redirect → /blog/:id
        ↓
User sees created blog
*/