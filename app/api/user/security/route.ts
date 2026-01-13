import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import SecurityEvent from "@/lib/models/SecurityEvent";

export const dynamic = 'force-dynamic';

/**
 * API Handler for fetching Security Events
 * Supports query param ?all=true to fetch history
 */
export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json([], { status: 401 });

    await connectToDatabase();

    // Parse Query Parameters (e.g., /api/user/security?all=true)
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get('all') === 'true';

    // Limit: 5 for dashboard card, 50 for audit modal
    const limit = fetchAll ? 50 : 5;

    const events = await SecurityEvent.find({ clerkId: user.id })
      .sort({ timestamp: -1 }) // Newest first
      .limit(limit);

    return NextResponse.json(events);

  } catch (error) {
    console.error("Failed to fetch security events:", error);
    return NextResponse.json([], { status: 500 });
  }
}