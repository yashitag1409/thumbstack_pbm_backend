const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      //   unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Optional: useful if you want to allow users to add private categories
    isSystemDefault: {
      type: Boolean,
      default: true,
    },

    // we will identify the category on the bases of user
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

// Safety check to prevent OverwriteModelError
// const CATEGORYMODEL = models.Category || model("Category", categorySchema);

module.exports = categorySchema;
