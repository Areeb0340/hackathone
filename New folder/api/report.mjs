import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { reportModel } from "../model.mjs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const upload = multer({ dest: "uploads/" });


router.post("/upload-report/:userId", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const cloudRes = await cloudinary.uploader.upload(req.file.path, {
      folder: "healthmate_reports",
    });
console.log("✅ Uploaded:", cloudRes.secure_url);
    const fileUrl = cloudRes.secure_url;

  
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize this medical report in 5-6 simple lines. Keep it concise and patient-friendly. File URL: ${fileUrl}`;
    const aiRes = await model.generateContent(prompt);
    const summary = aiRes.response.text();


    const newReport = new reportModel({
      userId,
      fileUrl,
      summary,
    });
    await newReport.save();

    res.status(201).json({
      message: "Report uploaded successfully",
      fileUrl,
      summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading report", error });
  }
});


router.get("/get-reports/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await reportModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

export default router;
