
import mongoose, { Schema, model, models } from 'mongoose';

/**
 * SUB-SCHEMA: BILLING HISTORY
 * Stores individual invoice records. Useful for generating PDF reports later.
 */
const InvoiceSchema = new Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true }, // e.g., 19.00
  plan: { type: String, required: true },   // e.g., "Pro Monthly"
  status: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Paid' },
  invoiceId: { type: String, required: true }, // e.g., "INV-2026-001"
  downloadUrl: String // For future PDF download links
});

/**
 * MAIN USER SCHEMA
 * Designed for SaaS scalability (PLG Model)
 */
const UserSchema = new Schema({
  // --- 1. IDENTITY (From Clerk) ---
  clerkId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  imageUrl: String,

  // --- 2. SUBSCRIPTION & LIMITS ---
  plan: { 
    type: String, 
    enum: ['free', 'pro', 'enterprise'], 
    default: 'free' 
  },
  credits: { type: Number, default: 100 }, // API calls remaining
  
  // Cycle Tracking (for resetting credits)
  planActivatedAt: { type: Date, default: Date.now }, // When they bought Pro
  lastCreditReset: { type: Date, default: Date.now }, // For 24h free tier reset

  // --- 3. FREE TRIAL ENGINE ---
  // Tracks if they are currently in a trial or have already used it.
  trialStatus: { 
    type: String, 
    enum: ['available', 'active', 'expired'], 
    default: 'available' 
  },
  trialEndsAt: { type: Date }, // Exact timestamp when trial dies

  // --- 4. APP PREFERENCES ---
  isCarbonMode: { type: Boolean, default: false }, // Green IT Feature
  
  // --- 5. BILLING RECORDS ---
  billingHistory: [InvoiceSchema],

  // --- 6. NOTIFICATION SETTINGS (Feature 2) ---
  notifications: {
    email: { type: Boolean, default: true },
    telegram: { type: Boolean, default: false },
    telegramChatId: { type: String, default: null }, // Stores their unique Telegram ID
    
    // Preferences
    alertOnCpu: { type: Boolean, default: true },    // Alert if CPU > 80%
    alertOnOffline: { type: Boolean, default: true } // Alert if server dies
  },
  telegramConnectionCode: { type: String },
  // Rate Limiting Field
  lastChatUsedAt: { type: Date, default: null }, // Tracks the exact time of last msg
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Prevent model recompilation error in Next.js hot reload
const User = models.User || model('User', UserSchema);

export default User;