import express from 'express';
import { userModel } from '../model.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET = process.env.SECRET_TOKEN;
const router = express.Router();



router.post("/sign-up", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({ message: "Required parameter missing" });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);
    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).send({ message: "User already exists" });

    await userModel.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hash,
    });

    res.status(201).send({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ message: "Required parameter missing" });

  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).send({ message: "User not found" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).send({ message: "Password incorrect" });

    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
      },
      SECRET
    );

    res.cookie("Token", token, {
      maxAge: 86400000,
      httpOnly: true,
      secure: false,
 
    });
    console.log("Token cookie set", token);

    res.status(200).send({
      message: "User Logged in",
      user: {
        user_id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});
export default router;