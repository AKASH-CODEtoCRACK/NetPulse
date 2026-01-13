import User from "@/lib/models/User";

// This function checks expiry and downgrades if necessary
export async function checkAndDowngrade(user: any) {
  if (user.trialStatus === 'active' && user.trialEndsAt) {
    const now = new Date();
    const expiry = new Date(user.trialEndsAt);

    if (now > expiry) {
      console.log(`🔻 System: Trial expired for ${user.email}. Downgrading...`);
      
      // Update the user object in memory
      user.trialStatus = 'expired';
      user.plan = 'free';
      user.credits = 100; // Reset to free limits
      
      // Save to database
      await user.save();
      return true; // We made a change
    }
  }
  return false; // No change needed
}