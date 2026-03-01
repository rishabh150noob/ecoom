const express = require("express")
const router = express.Router()
const Message = require("../models/message")
const User = require("../models/user")


router.get("/",  async ( req, res)=>{

    const UserId = req.user._id

    const messages = await  Message.find ({

        $or : [

            { sender : UserId },
            {
                receiver : UserId
            }
        ]
    }).populate("sender receiver")

    const UserMap = new Map 

    messages.forEach(msg => {

        if( msg.receiver._id.toString() !== UserId.toString())
        {
            UserMap.set(msg.receiver._id.toString(), msg.receiver)
        }

        if( msg.sender._id.toString() !== UserId.toString())
        {
            UserMap.set(msg.sender._id.toString(), msg.sender)
        }
        
    });

    const users = Array.from(UserMap.values());

    res.render("chat/chatList", { users });


})


router.get("/:id" ,  async (req,res)=>{

    const receiverId = req.params.id
    const senderId = req.user._id

    const messages = await Message.find({

        $or :[

            { receiver: receiverId , sender : senderId},
            { receiver : senderId , sender : receiverId}
        ]
    }).sort("createdAt")

    const receiver = await User.findById(receiverId);

    res.render("chat/chat", {
        messages,
        receiver,
        currentUser: req.user
    });

})

module.exports = router;
