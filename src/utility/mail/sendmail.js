const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.GMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) console.log("❌ SMTP Connection Failed:", error.message);
  else console.log("✅ SMTP Server is ready for AksharVault");
});

/**
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body content
 * @param {string} title - The "From" name (e.g., "Book Manager Support")
 */
const sendMail = async (
  to,
  subject,
  html,
  title = "AksharVault - Personal Book Manager",
) => {
  try {
    const mailOptions = {
      from: `${title} <${process.env.GMAIL_FROM || process.env.GMAIL_USERNAME}>`,
      to,
      subject,
      html, // You can also pass plain text via 'text' property if needed
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      status: "success",
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email Error:", error.message);
    return {
      status: "failed",
      message: "Error sending email",
      error: error.message,
      error,
    };
  }
};

module.exports = { sendMail };
