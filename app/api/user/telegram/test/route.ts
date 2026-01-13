import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });

    // 1. Check if ID exists
    const chatId = dbUser?.notifications?.telegramChatId;
    if (!chatId) {
      return NextResponse.json({ error: "No Telegram ID found. Please connect again." }, { status: 404 });
    }

    // 2. Send Message via Telegram API
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const text = `🔔 *Test Alert*\n\nHello ${dbUser.firstName}! Your NetPulse notifications are working perfectly.`;
    
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Telegram API Error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}