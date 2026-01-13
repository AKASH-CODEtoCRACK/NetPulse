import mongoose, { Schema, model, models } from 'mongoose';

const UsageLogSchema = new Schema({
  clerkId: { type: String, required: true, index: true },
  feature: { type: String, required: true }, // e.g., "AI_RESPONSE"
  cost: { type: Number, required: true },    // e.g., 1
  metadata: { type: Object },                // e.g., { query: "How to install?" }
  timestamp: { type: Date, default: Date.now }
});

const UsageLog = models.UsageLog || model('UsageLog', UsageLogSchema);
export default UsageLog;