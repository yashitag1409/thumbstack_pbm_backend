// 📧 Reusable Email Wrapper (adds consistent header & footer)
const emailWrapper = (title, content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1f3c88, #3456d1); color: #fff; padding: 18px 24px;">
      <h2 style="margin: 0; font-size: 20px;">${title}</h2>
    </div>
    <div style="padding: 24px; color: #333; line-height: 1.6; font-size: 15px;">
      ${content}
    </div>
    <div style="background: #f6f8fb; padding: 12px 24px; font-size: 13px; color: #666; text-align: center;">
      © ${new Date().getFullYear()}  AksharVault - Personal Book Manager,
. 
    </div>
  </div>
`;

const mailMessages = {
  welcomeMessage: (name) => ({
    subject: "Welcome to AksharVault! 📚",
    html: emailWrapper(
      "Your Vault is Ready ✅",
      `
      <p>Namaste <strong>${name}</strong>,</p>

      <p>
        Welcome to <strong>AksharVault</strong>! We are thrilled to have you join our community of readers.
      </p>

      <p>
        Your personal book manager is now active. You can start building your 
        digital library, tracking your reading progress, and organizing your 
        favorite titles all in one secure place.
      </p>

      <div style="margin: 25px 0; border-top: 1px solid #eee; padding-top: 15px;">
        <p style="font-style: italic; color: #555;">
          "A room without books is like a body without a soul."
        </p>
      </div>

      <p>
        Ready to start your journey? Log in to your dashboard and add your first book!
      </p>

      <p style="margin-top: 25px;">
        Happy Reading,<br />
        <strong>The AksharVault Team</strong>
      </p>
      `,
    ),
    text: `
Hi ${name},

Welcome to AksharVault! Your personal book manager is now active.

Start building your digital library and tracking your reading progress today.

Happy Reading,
The AksharVault Team
`,
  }),

  // 🔐 3️⃣ OTP verification (login)
  // 🔒 3️⃣ Verify User OTP
  sendLoginOtp: (email, otp) => ({
    subject: `Secure Your Vault - OTP: ${otp}`,
    html: emailWrapper(
      "Vault Access Code 🔒",
      `
        <p>A request has been made to access the <strong>AksharVault</strong> associated with <strong>${email}</strong>.</p>
        
        <p style="font-size: 16px; margin-top: 15px; color: #444;">
          Please use the following verification code to unlock your library:
        </p>
        
        <div style="background: #f1f4ff; border: 1px dashed #3456d1; border-radius: 8px; padding: 15px; text-align: center; font-size: 26px; letter-spacing: 4px; font-weight: bold; color: #1f3c88; margin: 20px 0;">
          ${otp}
        </div>
        
        <p style="margin-top: 10px; color: #666; font-size: 13px;">
          For your security, this key will expire in <strong>5 minutes</strong>. 
          If you did not request this code, please secure your account immediately.
        </p>
      `,
    ),
  }),

  // 🔁 4️⃣ Resend OTP
  resendOtp: (otp) => ({
    subject: `New Access Key - AksharVault`,
    html: emailWrapper(
      "Resending Access Key 🔁",
      `
        <p>We've successfully generated a new access key for your vault.</p>
        
        <p style="font-size: 16px; margin-top: 15px;">Your new OTP is:</p>
        
        <div style="background: #f1f4ff; border: 1px dashed #3456d1; border-radius: 8px; padding: 15px; text-align: center; font-size: 26px; letter-spacing: 4px; font-weight: bold; color: #1f3c88; margin: 20px 0;">
          ${otp}
        </div>
        
        <p style="margin-top: 10px; color: #666; font-size: 13px;">
          This key is valid for <strong>5 minutes</strong>. Use it to continue organizing your collection at <strong>AksharVault</strong>.
        </p>
      `,
    ),
  }),

  forgotPasswordOtp: (email, otp) => ({
    subject: `Reset Your Vault Access - AksharVault`,
    html: emailWrapper(
      "Recovery Key 🔑",
      `
        <p>We received a request to reset the password for your <strong>AksharVault</strong> account associated with <strong>${email}</strong>.</p>
        
        <p style="font-size: 16px; margin-top: 15px;">Use this temporary recovery key:</p>
        
        <div style="background: #fff5f5; border: 1px dashed #e53e3e; border-radius: 8px; padding: 15px; text-align: center; font-size: 26px; letter-spacing: 4px; font-weight: bold; color: #c53030; margin: 20px 0;">
          ${otp}
        </div>
        
        <p style="margin-top: 10px; color: #666; font-size: 13px;">
          This recovery key expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email; your vault remains secure.
        </p>
      `,
    ),
  }),

  // 🆕 2️⃣ Book Added Successfully
  bookAdded: (name, bookTitle, category, author) => ({
    subject: `New Addition to Your Vault: ${bookTitle} 📖`,
    html: emailWrapper(
      "Book Added ✅",
      `
        <p>Namaste <strong>${name}</strong>,</p>

        <p>Great news! A new title has been successfully added to your <strong>${category}</strong> collection.</p>
        
        <div style="background: #f1f4ff; border-left: 4px solid #3456d1; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 16px; color: #1f3c88;"><strong>Book Details:</strong></p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #444; line-height: 1.5;">
            <li><strong>Title:</strong> ${bookTitle}</li>
            <li><strong>Author:</strong> ${author || "Not Specified"}</li>
            <li><strong>Category:</strong> ${category}</li>
          </ul>
        </div>

        <p>Your vault is growing! Keeping your collection organized is the best way to ensure your favorite stories and knowledge are always within reach.</p>

     

        <p style="margin-top: 25px;">
          Keep on reading,<br />
          <strong>The AksharVault Team</strong>
        </p>
      `,
    ),
  }),

  // 🆕 5️⃣ User signup OTP (Fixed branding)
  userCreated: (email, otp) => ({
    subject: `Verify Your AksharVault Account - ${email}`,
    html: emailWrapper(
      "Verify Your Account ✅",
      `
        <p>Welcome to <strong>AksharVault</strong>!</p>
        <p>Before you start building your library, please verify your account using the OTP below:</p>
        
        <div style="background: #f1f4ff; border: 1px dashed #3456d1; border-radius: 8px; padding: 15px; text-align: center; font-size: 26px; letter-spacing: 4px; font-weight: bold; color: #1f3c88; margin: 20px 0;">
          ${otp}
        </div>
        
        <p style="margin-top: 10px; color: #555;">This verification code expires in 10 minutes.</p>
      `,
    ),
  }),
};

module.exports = { mailMessages };
