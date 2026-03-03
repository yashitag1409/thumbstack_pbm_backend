const mongoose = require("mongoose");
const { Schema } = mongoose;

const corsSchema = new Schema(
  {
    origin: {
      type: String,
      required: [true, "Origin URL is required"],
      trim: true, // Removes accidental spaces
      lowercase: true,
    },
    credentials: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // Tracking history of who changed what
    updateHistory: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = corsSchema;
