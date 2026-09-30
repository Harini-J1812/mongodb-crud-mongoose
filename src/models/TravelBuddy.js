const mongoose = require("mongoose");

const travelBuddySchema = new mongoose.Schema({
  buddyId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  budget: { type: Number, required: true },
  tripDuration: { type: Number, required: true },
  interests: { type: String },
  status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("TravelBuddy", travelBuddySchema);
