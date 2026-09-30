const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  clubName: { type: String, required: true, trim: true },
  yearOfStudy: { type: String, required: true },
  role: { type: String, required: true },
  points: { type: Number, required: true, min: 0 },
  interests: { type: String },
  status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);
