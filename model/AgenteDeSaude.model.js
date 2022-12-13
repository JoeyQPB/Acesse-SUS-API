import { Schema, model } from "mongoose";

const agenteDeSaudeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["MED", "PAC", "AGS"],
  },
  cpf: {
    type: Number,
    required: true,
    unique: true,
  },
  rg: {
    type: Number,
    required: true,
    unique: true,
  },
  posto: {
    type: String,
    required: true,
    uppercase: true,
  },
  foto: {
    type: String,
    default:
      "https://res.cloudinary.com/dqeehrnvz/image/upload/v1670727739/Acesse%20Sus%20Pasta/default_img_ml07es.png",
  },
});

export const AgenteDeSaudeModel = model("Agente-De-Saude", agenteDeSaudeSchema);
