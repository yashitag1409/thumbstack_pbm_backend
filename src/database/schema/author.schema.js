const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    biography: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    // we will identify the author on the bases of user
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = authorSchema;
