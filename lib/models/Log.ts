import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, index: true }, // Links log to a User
  cpu: { type: Number, required: true },
  ram: { type: Number, required: true },
  disk: { type: Number, required: true },
  //Netwrok speed
  networkIn: { type: Number, default: 0 }, // KB/s received
  networkOut: { type: Number, default: 0 }, // KB/s sent
  
  timestamp: { type: Date, default: Date.now, index: true } // Important for graphs
});

// TTL INDEX: Automatically delete logs older than 30 days to save space
// (Optional: You can adjust '2592000' seconds to whatever you want)
LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

export default Log;