import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import Log from "@/lib/models/Log";
import SecurityEvent from "@/lib/models/SecurityEvent";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    // 1. Get the very latest performance log (for CPU/RAM cards)
    const latestLog = await Log.findOne({ clerkId: user.id }).sort({ timestamp: -1 });

    // 2. Count total security threats (for Security Events card)
    const threatCount = await SecurityEvent.countDocuments({ clerkId: user.id });

    return NextResponse.json({
      cpu: latestLog ? latestLog.cpu : 0,
      ram: latestLog ? latestLog.ram : 0,
      activeConnections: 0, // We aren't tracking this yet (Phase 3)
      threats: threatCount
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}