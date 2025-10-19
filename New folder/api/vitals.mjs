import express from "express";
import { vitalsModel } from "../model.mjs";

const router = express.Router();


router.post("/add-vitals/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { bp, sugar, weight } = req.body;

    if (!bp && !sugar && !weight) {
      return res.status(400).json({ message: "Please provide at least one vital value." });
    }

    const newVitals = new vitalsModel({ userId, bp, sugar, weight });
    await newVitals.save();

    res.status(201).json({ message: "Vitals saved successfully", data: newVitals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving vitals" });
  }
});

router.get("/get-vitals/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const vitals = await vitalsModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(vitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vitals" });
  }
});

export default router;
