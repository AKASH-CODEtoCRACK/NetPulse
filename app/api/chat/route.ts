
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import { chargeUser } from "@/lib/usage";

// CONFIGURATION
const MAX_RETRIES = 3;
const RATE_LIMIT_SECONDS = 3; // Minimum time between messages

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // 1. INPUT VALIDATION (Security)
    if (!message || message.length > 500) {
        return NextResponse.json({ reply: "Message too long (max 500 chars)." }, { status: 400 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ reply: "Login required." }, { status: 401 });

    await connectToDatabase();
    
    // 2. FETCH USER & CHECK RATE LIMIT (Spam Protection)
    const user = await User.findOne({ clerkId: clerkUser.id });
    
    if (user.lastChatUsedAt) {
        const now = new Date();
        const last = new Date(user.lastChatUsedAt);
        const diff = (now.getTime() - last.getTime()) / 1000;
        
        if (diff < RATE_LIMIT_SECONDS) {
            return NextResponse.json({ 
                reply: "⏳ You are typing too fast! Please wait a few seconds." 
            }, { status: 429 });
        }
    }

    // 3. CHARGE CREDIT (Your existing logic)
    const transaction = await chargeUser(user.clerkId, "AI_RESPONSE", { query: message });
    if (!transaction.success) {
        return NextResponse.json({ 
            reply: `⚠️ Credit Limit Reached. You need ${transaction.remaining} more credits.` 
        });
    }

    // 4. UPDATE TIMESTAMP (Mark usage immediately)
    await User.updateOne(
        { clerkId: clerkUser.id }, 
        { lastChatUsedAt: new Date() }
    );

    // 5. CALL AI WITH RETRY LOGIC (The 503 Fix)
    const reply = await generateWithRetry(message);
    
    return NextResponse.json({ reply });
    
  } catch (error) {
    console.error("Chat Critical Error:", error);
    return NextResponse.json({ reply: "System currently overloaded. Please try again in 1 minute." }, { status: 500 });
  }
}

/**
 * HELPER: Tries to call AI. If 503 error, waits and retries.
 * If 'flash' model fails, falls back to 'pro' model.
 */
async function generateWithRetry(prompt: string, attempt = 1): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey!);
    
    // Strategy: Try Flash first (faster/cheaper), then Pro (stable)
    const modelName = attempt > 2 ? "gemini-pro" : "gemini-2.5-flash"; 
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
        console.log(`🤖 AI Attempt ${attempt} using ${modelName}...`);
        
        const result = await model.generateContent(`
          You are NetBot, a SaaS support AI. 
          User asked: "${prompt}". 
          Keep answer helpful but under 60 words.
        `);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        // If error is 503 (Overloaded) and we have retries left
        if ((error.message.includes("503") || error.message.includes("overloaded")) && attempt <= MAX_RETRIES) {
            console.warn(`⚠️ 503 Error. Retrying in ${attempt} seconds...`);
            
            // Wait (Exponential Backoff: 1s, 2s, 3s)
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            
            // Recursive Retry
            return generateWithRetry(prompt, attempt + 1);
        }
        
        // If final attempt failed
        console.error("❌ All AI attempts failed.");
        return "I apologize, but my AI brain is currently experiencing high traffic from Google. Please ask again in a moment.";
    }
}

