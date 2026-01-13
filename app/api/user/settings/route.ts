// import { NextResponse } from "next/server";
// import { currentUser } from "@clerk/nextjs/server";
// import connectToDatabase from "@/lib/db";
// import User from "@/lib/models/User";

// export async function POST(req: Request) {
//   try {
//     // 1. Verify User
//     const user = await currentUser();
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // 2. Parse Data
//     // DEVELOPER NOTE: Add future settings fields here (e.g., isLowBandwidth, gdprConsent)
//     const { isCarbonMode } = await req.json();

//     await connectToDatabase();
    
//     // 3. Update Database
//     // We use 'findOneAndUpdate' to ensure we update the correct user
//     const dbUser = await User.findOneAndUpdate(
//       { clerkId: user.id },
//       { 
//         $set: { 
//           isCarbonMode: isCarbonMode,
//           // DEVELOPER NOTE: Map future fields here. Example:
//           // isLowBandwidth: body.isLowBandwidth
//         } 
//       },
//       { new: true } // Return the updated document
//     );

//     return NextResponse.json({ success: true, mode: dbUser.isCarbonMode });

//   } catch (error) {
//     console.error("Settings Update Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     const user = await currentUser();
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     await connectToDatabase();
//     const dbUser = await User.findOne({ clerkId: user.id });

//     // DEVELOPER NOTE: Return all settings flags here for the frontend to use
//     return NextResponse.json({ 
//       isCarbonMode: dbUser?.isCarbonMode || false,
//       // isLowBandwidth: dbUser?.isLowBandwidth || false 
//     });

//   } catch (error) {
//     return NextResponse.json({ error: "Fetch error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";

// POST: Updates specific settings (Carbon Mode, etc)
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json(); // Get entire body
    await connectToDatabase();
    
    // Dynamic Update: This allows updating ANY field sent in the body
    // Be careful: In a real app, you'd whitelist fields. 
    // For now, this lets you easily toggle plans via Postman/API if needed.
    const dbUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      { $set: body }, 
      { new: true }
    );

    return NextResponse.json({ success: true, user: dbUser });

  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// GET: Fetches the FULL User Profile (Plan, Credits, Settings)
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
        return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    // RETURN EVERYTHING THE FRONTEND NEEDS
    return NextResponse.json({ 
      plan: dbUser.plan,           // "free" or "pro"
      credits: dbUser.credits,     // e.g. 100
      isCarbonMode: dbUser.isCarbonMode,
      firstName: dbUser.firstName
    });

  } catch (error) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}