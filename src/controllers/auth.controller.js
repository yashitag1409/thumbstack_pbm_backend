const USERMODEL = require("../database/model/user.model");
const { uploadToCloudinary } = require("../utility/cloudinary");
const { mailMessages } = require("../utility/mail/mailMessage");
const { sendMail } = require("../utility/mail/sendmail");

// register user
module.exports.RegisterUser = async (req, resp) => {
  try {
    const { contact, email, name, countryCode, password } = req.body;

    // check is user exist with entered email

    const isExistingUser = await USERMODEL.findOne({ email });

    if (isExistingUser) {
      return resp.status(400).json({
        message: "User already exist",
        status: "failed",
      });
    }

    // hasing password and then we will store it in database

    const hashedPassword = await USERMODEL.prototype.hashingPassword(password);
    const new_user = await USERMODEL.create({
      contact,
      email,
      name,
      countryCode,
      password: hashedPassword,
    });

    new_user.password = hashedPassword;
    await new_user.save();

    // console.log(new_user);
    // welcome message
    const send_welcome_html = mailMessages.welcomeMessage(new_user.name);

    await sendMail(
      new_user.email,
      send_welcome_html.subject,
      send_welcome_html.html,
    );

    return resp.status(201).json({
      message: "Account created successfully. Login to continue",
      status: "success",
      //   data: userResponse, not sending user in data only sending that user is registered successfully
    });
  } catch (error) {
    // console.log(error);

    return resp.status(500).json({
      message: error.message || "Internal Server Error",
      status: "error",
      error,
    });
  }
};

// login user

// via a password
module.exports.loginUserByPassword = async (req, resp) => {
  try {
    const { password, email } = req.body;

    // console.log(password, email);

    // console.log(req.body);

    const user = await USERMODEL.findOne({ email }).select("+password");

    if (!user) {
      return resp.status(400).json({
        message: "User not found",
        status: "failed",
      });
    }

    const isMatch = await user.decodingPassword(password);
    if (!isMatch) {
      return resp.status(400).json({
        message: "Password is incorrect",
        status: "failed",
      });
    }

    const token = user.generateToken();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    userResponse.token = token;

    // console.log("user successfully loggedin \n\n");
    // console.log(userResponse);

    return resp.status(200).json({
      message: "User logged in successfully",
      status: "success",
      user: userResponse,
    });
  } catch (error) {
    // console.log(error);

    return resp.status(500).json({
      message: error.message || "Internal Server Error",
      status: "error",
      error,
    });
  }
};

// send loginotp
module.exports.sendLoginOtp = async (req, resp) => {
  try {
    const { email } = req.body;

    const user = await USERMODEL.findOne({ email });

    if (!user) {
      return resp.status(400).json({
        message: "User not found",
        status: "failed",
      });
    }

    const otp = await user.generateOtpAndSave();

    const send_otp_html = mailMessages.sendLoginOtp(email, otp);

    await sendMail(email, send_otp_html.subject, send_otp_html.html);

    return resp.status(200).json({
      message: "OTP sent successfully Please check your mailbox",
      status: "success",
      data: { email },
    });
  } catch (error) {
    // console.log(error);

    return resp.status(500).json({
      message: error.message || "Internal Server Error",
      status: "error",
      error,
    });
  }
};

// verify user via otp
module.exports.loginUserByOtp = async (req, resp) => {
  try {
    const { otp, email } = req.body;

    const user = await USERMODEL.findOne({ email });

    if (!user) {
      return resp.status(400).json({
        message: "User not found",
        status: "failed",
      });
    }

    const isMatch = user.verifyOtp(otp);

    if (!isMatch) {
      return resp.status(400).json({
        message: "OTP is incorrect",
        status: "failed",
      });
    }

    if (isMatch === "expired") {
      return resp.status(400).json({
        message: "OTP is expired",
        status: "failed",
      });
    }

    const token = user.generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    userResponse.token = token;

    console.log("user successfully loggedin \n\n");
    console.log(userResponse);

    return resp.status(200).json({
      message: "User logged in successfully",
      status: "success",
      data: userResponse,
    });
  } catch (error) {
    // console.log(error);
    return resp.status(500).json({
      message: error.message || "Internal Server Error",
      status: "error",
      error,
    });
  }
};

// forgot password
module.exports.forgotPassword = async (req, resp) => {
  try {
    const { email } = req.body;

    const user = await USERMODEL.findOne({ email });

    if (!user) {
      return resp.status(400).json({
        message: "User not found",
        status: "failed",
      });
    }

    const otp = await user.generateOtpAndSave();

    const send_otp_html = mailMessages.forgotPasswordOtp(email, otp);

    await sendMail(email, send_otp_html.subject, send_otp_html.html);

    return resp.status(200).json({
      message: "OTP sent successfully Please check your mailbox",
      status: "success",
      data: { email },
    });
  } catch (error) {
    // console.log(error);

    return resp.status(500).json({
      message: error.message || "Internal Server Error",
      status: "error",
      error,
    });
  }
};

// reset password

module.exports.resetPassword = async (req, resp) => {
  try {
    const { otp, email, new_password } = req.body;

    const user = await USERMODEL.findOne({ email });

    if (!user) {
      return resp.status(400).json({
        message: "User not found",
        status: "failed",
      });
    }

    const isMatch = user.verifyOtp(otp);

    if (!isMatch) {
      return resp.status(400).json({
        message: "OTP is incorrect",
        status: "failed",
      });
    }

    if (isMatch === "expired") {
      return resp.status(400).json({
        message: "OTP is expired",
        status: "failed",
      });
    }

    const hashedPassword = await user.hashingPassword(new_password);

    await USERMODEL.findOneAndUpdate({ email }, { password: hashedPassword });

    return resp.status(200).json({
      message: "Password reset successfully",
      status: "success",
    });
  } catch (error) {
    // console.log(error);

    return resp.status(500).json({
      message: error.message || "Internal Server Error",
      status: "error",
      error,
    });
  }
};

// Update user profile details and image
module.exports.updateProfile = async (req, resp) => {
  try {
    const userId = req.user._id; // Populated by your protect middleware
    let updateData = { ...req.body };
    console.log("uypdateData", updateData);

    // 1. Check for profile image upload
    if (req.file) {
      // Upload to specific user profile folder
      const imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "AksharVault/Users/Profiles",
      );
      if (imageUrl) {
        updateData.profileImage =
          imageUrl.secure_url ?? updateData.profileImage;
      }
    }

    // 2. Update the user in the database
    const updatedUser = await USERMODEL.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return resp.status(404).json({
        message: "User not found",
        status: "failed",
      });
    }
    console.log("updatedUser successfully", updatedUser);

    return resp.status(200).json({
      message: "Profile updated successfully",
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    // console.log(error);
    return resp.status(500).json({
      message: error.message || "Internal Server Error",
      status: "error",
      error,
    });
  }
};
