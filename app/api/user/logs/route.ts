import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import Log from "@/lib/models/Log";

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json([], { status: 401 });

    await connectToDatabase();

    // Fetch last 20 logs, sorted by time
    const logs = await Log.find({ clerkId: user.id })
      .sort({ timestamp: -1 }) // Newest first
      .limit(20);

    // Reverse them so the graph goes Left (Old) -> Right (New)
    return NextResponse.json(logs.reverse());

  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}