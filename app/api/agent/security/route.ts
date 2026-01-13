import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import SecurityEvent from "@/lib/models/SecurityEvent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clerkId, type, message, sourceIp, severity } = body;

    console.log("🔔 SECURITY EVENT RECEIVED:", type); // <--- You should see this now!

    if (!clerkId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await connectToDatabase();

    await SecurityEvent.create({
        clerkId,
        type,
        message,
        sourceIp: sourceIp || "Unknown",
        severity
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Security Ingest Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}