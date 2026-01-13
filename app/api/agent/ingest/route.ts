import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Log from "@/lib/models/Log"; // <--- Import the new Model
import { sendCriticalAlert } from "@/lib/telegram-alert";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clerkId, cpu, ram, disk,networkIn, networkOut } = body;

    if (!clerkId) return NextResponse.json({ error: "Missing Agent ID" }, { status: 400 });

    await connectToDatabase();

    // 1. --- SAVE DATA (The Memory) ---
    await Log.create({
        clerkId,
        cpu,
        ram,
        disk: disk || 0 ,// Default to 0 if missing

        networkIn: networkIn || 0,
        networkOut: networkOut ||0
    });

    // 2. --- CRITICAL LOGIC CHECK (The Alarm) ---
    if (cpu > 90) {
        console.log(`🔥 Critical CPU for ${clerkId}: ${cpu}%`);
        await sendCriticalAlert(
            clerkId, 
            "High CPU Load", 
            `Your server is running at *${cpu}% CPU* usage.\nImmediate action recommended.`
        );
    } 
    else if (ram > 95) {
         await sendCriticalAlert(
            clerkId, 
            "Memory Critical", 
            `RAM usage reached *${ram}%*. Server may crash.`
        );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Ingest Error:", error);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}