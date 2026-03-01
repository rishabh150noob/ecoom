require("dotenv").config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI not defined in .env");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in .env");
}

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const http = require("http")
const {Server} = require("socket.io")
const Message = require("./models/message")
const Blog = require("./models/blog");
const initializeSocket = require("./sockets/chatSocket");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const chatRoute = require("./routes/chat")

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const deployPORT = process.env.PORT || 7000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.resolve("./public")));
app.get("/", async (req, res) => {
  res.render("home", { user: req.user });
});


app.get("/blog/category/:category", async (req, res) => {
  const category = req.params.category;
  let filter = {};
  if (category !== "all") {
    filter.category = category;
  }
  const blogs = await Blog.find(filter);
  res.render("categoryItems", {
    user: req.user,
    blogs,
    selectedCategory: category
  });
});


app.get("/yourproduct", async (req, res) => {

  if (!req.user) {
    return res.redirect("/user/signin");
  }

  const blogs = await Blog.find({
    createdBy: req.user._id
  });

  res.render("categoryItems", {
    user: req.user,
    blogs
  });
});


app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/chat", chatRoute)


const server = http.createServer(app)
const io = new Server(server)
initializeSocket(io)

server.listen(deployPORT, () => {
    console.log(`Server started `);
});





