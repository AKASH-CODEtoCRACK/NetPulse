import mongoose from "mongoose";

const SecurityEventSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, index: true },
  type: { type: String, required: true }, // e.g., "SSH_FAIL", "PORT_SCAN"
  message: { type: String, required: true }, // e.g., "Failed password for root"
  sourceIp: { type: String }, // The hacker's IP
  severity: { type: String, enum: ["low", "medium", "critical"], default: "medium" },
  timestamp: { type: Date, default: Date.now }
});

// Auto-delete events older than 30 days
SecurityEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

const SecurityEvent = mongoose.models.SecurityEvent || mongoose.model("SecurityEvent", SecurityEventSchema);

export default SecurityEvent;