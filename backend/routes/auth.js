const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");

const bcrypt = require("bcryptjs");
const User = require("../models/User");


// Mail Setup
const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});


// SIGNUP
router.post("/signup", async (req, res) => {

  try {

    const { name, username, mobileNumber, password, email } = req.body;

    // Check Existing User
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone: mobileNumber }
      ]
    });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const newUser = new User({
      name,
      email,
      phone: mobileNumber,
      password: hashedPassword
    });

    await newUser.save();

    // EMAIL SEND
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: "New User Signup",

      html: `
      
        <div style="font-family:Arial;padding:20px">
        
          <h2 style="color:#6d28d9">
            New User Registered
          </h2>

          <hr/>

          <p><b>Name:</b> ${name}</p>

          <p><b>Username:</b> ${username || "—"}</p>

          <p><b>Mobile:</b> ${mobileNumber}</p>

          <p><b>Email:</b> ${email || "—"}</p>

        </div>
      `,
    });

    res.json({
      success: true,
      message: "Signup Successful",
      data: {
        user: {
          id: newUser._id,
          name,
          username: username || undefined,
          mobileNumber,
          email: email || undefined,
          role: "customer",
        },
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Signup Failed",
    });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { loginId, mobileNumber, password } = req.body;

    const resolvedLogin =
      typeof loginId === "string" && loginId.trim()
        ? loginId.trim()
        : typeof mobileNumber === "string"
        ? mobileNumber.trim()
        : "";

    // Find User
    const user = await User.findOne({
      $or: [
        { email: resolvedLogin },
        { phone: resolvedLogin }
      ]
    });

    // User Not Found
    if (!user) {

      return res.status(400).json({
        success: false,
        message: "User not found"
      });

    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong Password
    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });

    }

    // LOGIN EMAIL
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: "User Login Alert",

      html: `
      
        <div style="font-family:Arial;padding:20px">

          <h2 style="color:#2563eb">
            User Logged In
          </h2>

          <hr/>

          <p><b>Email / Mobile:</b> ${resolvedLogin}</p>

        </div>
      `,
    });

    res.json({
      success: true,
      message: "Login Successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          mobileNumber: user.phone,
          email: user.email,
          role: "customer",
        },
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Login Failed",
    });

  }

});

module.exports = router;