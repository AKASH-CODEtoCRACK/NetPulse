import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";

// POST: Generate a new connection code
export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // Generate unique code
    const code = `NET-${Math.floor(10000 + Math.random() * 90000)}`;

    // Save to DB
    await User.findOneAndUpdate(
      { clerkId: user.id },
      { telegramConnectionCode: code }
    );

    return NextResponse.json({ code });

  } catch (error) {
    return NextResponse.json({ error: "Failed to gen code" }, { status: 500 });
  }
}