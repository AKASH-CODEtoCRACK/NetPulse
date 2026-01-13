require('dotenv').config({ path: '.env.local' }); // Load .env variables
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// 1. Setup Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error("❌ Error: TELEGRAM_BOT_TOKEN is missing in .env.local");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
console.log("🤖 NetPulse Bot is running...");

// 2. Connect to MongoDB (Copy your MONGODB_URI from .env.local)
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// 3. Define User Schema (Simplified for the worker)
const userSchema = new mongoose.Schema({
    clerkId: String,
    telegramConnectionCode: String,
    notifications: {
        telegramChatId: String,
        email: Boolean,
        telegram: Boolean,
        alertOnCpu: Boolean,
        alertOnOffline: Boolean
    }
}, { strict: false }); // strict: false allows us to edit partial docs

const User = mongoose.model('User', userSchema);

// 4. LISTEN FOR MESSAGES
bot.onText(/\/connect (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const code = match[1]; // The code user sent (e.g. NET-12345)

    console.log(`📩 Received code: ${code} from ${chatId}`);

    try {
        // ATOMIC UPDATE: Finds and Updates in one shot.
        // This prevents race conditions and ensures data is saved.
        const updatedUser = await User.findOneAndUpdate(
            { telegramConnectionCode: code },
            { 
                $set: { 
                    "notifications.telegramChatId": chatId.toString(),
                    "notifications.telegram": true,
                    telegramConnectionCode: null // Clear the code
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            bot.sendMessage(chatId, "⚠️ Invalid or expired code. Please verify on your dashboard.");
            return;
        }

        bot.sendMessage(chatId, `✅ Success! Your Telegram is now linked to NetPulse.\n\nHello ${updatedUser.firstName || 'User'}, you will receive alerts here.`);
        console.log(`🔗 Linked User ${updatedUser.clerkId} to Telegram ${chatId}`);

    } catch (err) {
        console.error("❌ Worker Error:", err);
        bot.sendMessage(chatId, "❌ System error. Try again later.");
    }
});