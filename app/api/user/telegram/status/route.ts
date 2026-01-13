import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ connected: false });

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    
    // Check if Chat ID exists
    const isConnected = !!dbUser?.notifications?.telegramChatId;

    return NextResponse.json({ connected: isConnected });
  } catch (error) {
    return NextResponse.json({ connected: false });
  }
}