import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User"; // Assuming you store it here or similar

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    // Find user settings and remove the telegramChatId
    await User.findOneAndUpdate(
      { clerkId: user.id },
      { $unset: { telegramChatId: "" } } // This removes the field
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}