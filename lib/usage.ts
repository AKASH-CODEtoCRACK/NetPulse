import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import UsageLog from "@/lib/models/UsageLog";
import { PRICING_TABLE } from "@/lib/config/pricing";

/**
 * Attempts to charge a user for a specific feature.
 * Returns { success: true, remaining: number } if successful.
 * Returns { success: false, error: string } if insufficient funds.
 */
export async function chargeUser(clerkId: string, featureKey: keyof typeof PRICING_TABLE, metadata = {}) {
  await connectToDatabase();
  
  const cost = PRICING_TABLE[featureKey];

  // 1. If it's free, just return success
  if (cost === 0) return { success: true, remaining: -1 };

  // 2. Atomic Check & Deduct
  // We try to find a user who matches the ID AND has enough credits.
  // Then we decrease credits immediately.
  const updatedUser = await User.findOneAndUpdate(
    { 
      clerkId: clerkId, 
      credits: { $gte: cost } // CRITICAL: Only match if they have enough!
    },
    { 
      $inc: { credits: -cost } // Atomically subtract
    },
    { new: true } // Return the user AFTER update
  );

  // 3. If no user returned, it means they didn't have enough credits
  if (!updatedUser) {
    // Double check if user exists at all
    const userExists = await User.findOne({ clerkId });
    if (!userExists) return { success: false, error: "User not found" };
    
    return { success: false, error: "Insufficient credits" };
  }

  // 4. Log the transaction (The Refinement)
  await UsageLog.create({
    clerkId,
    feature: featureKey,
    cost,
    metadata
  });

  return { success: true, remaining: updatedUser.credits };
}