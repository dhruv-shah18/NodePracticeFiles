const { processUserMessage } = require('../services/chatService');

exports.chatSocket = async (req, res) => {
    try {
        const { message } = req.body;
        // The auth middleware attaches the user object to req.user (as verified in auth.js: req.user = user)
        // User model (file 9) has _id. 
        // We should use req.user._id safely.

        const userId = req.user ? req.user._id.toString() : null;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized user." });
        }

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const responseText = await processUserMessage(userId, message);
        res.json({ response: responseText });

    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Something went wrong processing your request." });
    }
};
