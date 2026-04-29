import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// CONTACT ROUTE
app.post("/contact", async (req, res) => {
  try {
    const { first_name, last_name, email, phone, subject, message } = req.body;

    await resend.emails.send({
      from: "EuttyX <onboarding@resend.dev>",
      to:euttyalex@gmail.com,
      subject: subject || "New Contact Message",
      html: `
        <h2>New Message from EuttyX</h2>
        <p><b>Name:</b> ${first_name} ${last_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
    });

    res.json({ success: true, message: "Email sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

// START SERVER
app.listen(3000, () => {
  console.log("EuttyX backend running on port 3000");
});
