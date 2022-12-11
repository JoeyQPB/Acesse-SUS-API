import { Schema, model, Types } from "mongoose";

const medicoSchema = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String },
  cpf: { type: Number, required: true },
  rg: { type: Number, required: true },
  posto: [{ type: Types.ObjectId, ref: "Posto" }],
  foto: {
    type: String,
    default:
      "https://res.cloudinary.com/dqeehrnvz/image/upload/v1670727739/Acesse%20Sus%20Pasta/default_img_ml07es.png",
  },
  CRM: { type: Number, required: true },
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
  especialidade: { type: String, required: true, trim: true },
  consultas: [{ type: Types.ObjectId, ref: "Consulta" }],
  posto: [{ type: Types.ObjectId, ref: "Posto" }],
  foto: {
    type: String,
    default:
      "https://res.cloudinary.com/dqeehrnvz/image/upload/v1670727739/Acesse%20Sus%20Pasta/default_img_ml07es.png",
  },
});

export const MedicoModel = model("Medico", medicoSchema);
