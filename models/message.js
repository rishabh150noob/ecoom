const { model , Schema }= require("mongoose")
const { applyTimestamps } = require("./comment")

const messageSchema = new Schema (
    {
        sender :{

            type: Schema.Types.ObjectId,
            ref:"user",
            required : true
        },

        receiver :{

            type: Schema.Types.ObjectId,
            ref:"user",
            required : true
        },

        text :{

            type :String ,
            required:true
        },

        createdAt :{

            type : Date,
            default: Date.now()
        }
    },
    {
        applyTimestamps: true
    }
)

const Message = model("message",messageSchema)
module.exports = Message


