import { Schema, model } from "mongoose";

const rootSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ROOT", "MED", "PAC", "AGS"],
  },
  passwordResetToken: {
    type: String,
    select: false, // n vem na req
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
});

export const RootModel = model("Root", rootSchema);
