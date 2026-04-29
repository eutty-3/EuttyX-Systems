import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;

  if (!first_name || !last_name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required"
    });
  }

  try {
    await resend.emails.send({
      from: "EuttyX <onboarding@resend.dev>",
      to: "euttyvirtual@gmail.com",
      subject: `📩 ${subject} - ${first_name} ${last_name}`,
      html: `
        <h2>New Message from EuttyX</h2>
        <p><b>Name:</b> ${first_name} ${last_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`EuttyX backend running on port ${PORT}`);
});