import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import Log from "@/lib/models/Log";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    // 1. Get User's Telegram Chat ID
    const settings = await User.findOne({ clerkId: user.id });
    if (!settings?.telegramChatId) {
      return NextResponse.json({ error: "Telegram not connected" }, { status: 400 });
    }

    // 2. Get Latest System Stats
    const latestLog = await Log.findOne({ clerkId: user.id }).sort({ timestamp: -1 });
    
    // Default values if no logs yet
    const cpu = latestLog ? latestLog.cpu : 0;
    const ram = latestLog ? latestLog.ram : 0;

    // 3. Send Message to Telegram
    const message = `
📊 <b>System Status Report</b>
━━━━━━━━━━━━━━━━
👤 <b>User:</b> ${user.firstName}
🖥 <b>CPU Load:</b> ${cpu}%
💾 <b>Memory:</b> ${ram}%
✅ <b>Status:</b> Online & Monitoring
━━━━━━━━━━━━━━━━
<i>Sent via NetPulse Dashboard</i>
    `;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message,
        parse_mode: "HTML"
      }),
    });

    if (!response.ok) throw new Error("Telegram API failed");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Send Status Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}