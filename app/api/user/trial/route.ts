import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import { checkAndDowngrade } from "@/lib/trial-logic";

// POST: Activate the 24h Free Trial
export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });

    // 1. Security Check: Has user already used the trial?
    if (dbUser.trialStatus !== 'available') {
      return NextResponse.json({ error: "Trial already used or active" }, { status: 403 });
    }

    // 2. Activate Trial
    const endsAt = new Date();
    endsAt.setHours(endsAt.getHours() + 24); // Add 24 Hours

    dbUser.trialStatus = 'active';
    dbUser.plan = 'pro'; // Give Pro features temporarily
    dbUser.trialEndsAt = endsAt;
    dbUser.credits = 1000; // Boost credits for the trial
    
    await dbUser.save();

    return NextResponse.json({ success: true, endsAt });

  } catch (error) {
    return NextResponse.json({ error: "Trial activation failed" }, { status: 500 });
  }
}

// GET: Check status & Auto-Downgrade if expired
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });

    // AUTO-DOWNGRADE LOGIC
    await checkAndDowngrade(dbUser);
    // if (dbUser.trialStatus === 'active' && new Date() > new Date(dbUser.trialEndsAt)) {
    //   console.log("🔻 Trial Expired. Downgrading user...");
    //   dbUser.trialStatus = 'expired';
    //   dbUser.plan = 'free';
    //   dbUser.credits = 100; // Reset credits
    //   await dbUser.save();
    // }

    return NextResponse.json({ 
      trialStatus: dbUser.trialStatus,
      trialEndsAt: dbUser.trialEndsAt,
      billingHistory: dbUser.billingHistory
    });

  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
