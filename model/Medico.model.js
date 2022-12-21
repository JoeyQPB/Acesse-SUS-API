import { Schema, model, Types } from "mongoose";

const medicoSchema = new Schema({
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
  role: { type: String, uppercase: true },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  rg: {
    type: String,
    required: true,
    unique: true,
  },
  posto: {
    type: String,
    uppercase: true,
  },
  foto: {
    type: String,
    default:
      "https://res.cloudinary.com/dqeehrnvz/image/upload/v1670727739/Acesse%20Sus%20Pasta/default_img_ml07es.png",
  },
  CRM: {
    type: String,
    required: true,
    unique: true,
  },
  UF: {
    type: String,
    enum: [
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
      "..",
    ],
    required: true,
    default: "..",
  },
  especialidade: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  consultas: [
    {
      type: String,
    },
  ],
  createdBy: {
    type: String,
  },
  updateBy: {
    type: String,
  },
  dataNascimento: {
    type: String,
    required: true,
  },
});

export const MedicoModel = model("Medico", medicoSchema);
