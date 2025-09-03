const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All three fields are required" });
    }
    const existignUser = await User.findOne({ where: { email } });

    if (existignUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const JWT_SECRET = process.env.JWT_SECRET;
    const payload = {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      // Send the token back to the client upon successful registration
      res.status(201).json({
        message: "User created and logged in successfully.",
        token: token,
      });
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Create and send the JWT without an expiration
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.json({
        message: "Logged in successfully.",
        token: token,
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
