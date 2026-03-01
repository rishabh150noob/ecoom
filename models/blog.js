const { Schema, model}= require("mongoose");

const blogSchema = new Schema (
    {
        title:{
            type:String,
            required:true,
        },

        body :{
            type:String,
            required:true,
        },
        coverImageURL:{
            type:String,
            required:false,
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"user",
        },

        price :{
            type :Number,
            required:false,
        },

        category: {
            type: String,
            enum: ["mobiles", "laptops", "cycles", "coolers", "random"],
            default: "random"
        },

        roles:{
            type:String,
            enum:["user","admin"],
            default:"user"
        }
    },
    {
        timestamps:true,
    }
);

const Blog = model("blog",blogSchema);
module.exports= Blog;
