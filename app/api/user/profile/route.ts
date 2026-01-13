import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import { checkAndDowngrade } from "@/lib/trial-logic";

export async function GET() {
  try {
    // 1. Authenticate Request
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Find User (or create if missing - sync logic backup)
    let user = await User.findOne({ clerkId: clerkUser.id });
    
    if (!user) {
      // Emergency Sync if user is missing
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName,
        imageUrl: clerkUser.imageUrl
      });
    }

    // 3. --- INTELLIGENT TRIAL CHECK by creating central logic checkAndDowngrade ---
    await checkAndDowngrade(user);

    // If user is on a trial, but the time has passed, downgrade them NOW.
    // if (user.trialStatus === 'active' && user.trialEndsAt) {
    //   const now = new Date();
    //   if (now > new Date(user.trialEndsAt)) {
    //     console.log(`[Auto-Downgrade] Trial expired for ${user.email}`);
    //     user.trialStatus = 'expired';
    //     user.plan = 'free';
    //     user.credits = 100; // Reset to free limits
    //     await user.save();
    //   }
    // }

    // 4. Return Data
    return NextResponse.json({
      plan: user.plan,
      credits: user.credits,
      trialStatus: user.trialStatus || 'available',
      trialEndsAt: user.trialEndsAt,
      billingHistory: user.billingHistory || [],
      isCarbonMode: user.isCarbonMode,

      // FIX: Tell UI if Telegram is already linked
      isTelegramConnected: !!user.notifications?.telegramChatId
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}