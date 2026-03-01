const Message = require("../models/message");

function initializeSocket(io) {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
        });

        socket.on("sendMessage", async (data) => {
            try {
                const { sender, receiver, text } = data;

                if (!sender || !receiver || !text || text.trim() === "") return;

                const newMessage = new Message({
                    sender,
                    receiver,
                    text: text.trim()
                });

                await newMessage.save();

                io.to([sender, receiver]).emit("receiveMessage", newMessage);

            } catch (err) {
                console.error("Message error:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });

    });

}

module.exports = initializeSocket;