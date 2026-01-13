import User from "@/lib/models/User";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendCriticalAlert(userId: string, title: string, message: string) {
  try {
    // 1. Find User & Check Preferences
    const user = await User.findOne({ clerkId: userId });
    
    // Check if Telegram is connected AND enabled
    if (!user || !user.notifications?.telegramChatId || !user.notifications?.telegram) {
        console.log(`🔕 Alert skipped for ${userId}: Telegram disabled or not connected.`);
        return false;
    }

    const chatId = user.notifications.telegramChatId;

    // 2. Format the Message (Markdown)
    const text = `🚨 *CRITICAL ALERT: ${title}*\n\n${message}\n\n_Time: ${new Date().toLocaleTimeString()}_`;

    // 3. Send to Telegram
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        })
    });

    return true;

  } catch (error) {
    console.error("Failed to send Telegram alert:", error);
    return false;
  }
}