import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
});

export const userModel = mongoose.model("User", userSchema);


const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileUrl: { type: String, required: true },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const reportModel = mongoose.model("Report", reportSchema);


const vitalsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bp: { type: String },
  sugar: { type: String },
  weight: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const vitalsModel = mongoose.model("Vitals", vitalsSchema);
