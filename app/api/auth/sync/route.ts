import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";

export async function POST() {
  try {
    // 1. Get the current user from Clerk
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // 2. Connect to MongoDB
    await connectToDatabase();

    // 3. Check if user already exists in OUR database
    const existingUser = await User.findOne({ clerkId: user.id });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists", user: existingUser });
    }

    // 4. If not, create them!
    const newUser = await User.create({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      credits: 100, // Default credits
      plan: 'free'  // Default plan
    });

    console.log("✅ New User Synced to MongoDB:", newUser.email);

    return NextResponse.json({ message: "User created", user: newUser });

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}