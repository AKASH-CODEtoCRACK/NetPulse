import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import UsageLog from "@/lib/models/UsageLog";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // Fetch logs, sort by newest first, limit to last 50
    const logs = await UsageLog.find({ clerkId: user.id })
      .sort({ timestamp: -1 })
      .limit(50);

    return NextResponse.json({ logs });

  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}