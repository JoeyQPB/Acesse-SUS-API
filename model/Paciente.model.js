import { Schema, model, Types } from "mongoose";

const pacienteSchema = new Schema({
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
  },
  rg: {
    type: String,
    required: true,
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
  nomesocial: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  suscard: {
    type: String,
    required: true,
  },
  nacionalidade: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  dataNascimento: {
    type: String,
    required: true,
    match: /(\d{2})[-.\/](\d{2})[-.\/](\d{4})/gm,
  },
  cor: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  sexo: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  nomeDaMae: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  tel: {
    type: Number,
    trim: true,
    required: true,
  },
  pulmaoDoenca: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  fumante: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  usaAlcool: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  usaDrogas: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  hipertenso: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  diabetes: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  avcderrame: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  infarto: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  cardioDoenca: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  problemaRins: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  createdBy: {
    type: String,
    uppercase: true,
  },
  updateBy: {
    type: String,
    uppercase: true,
  },
  consulta: {
    type: String,
  },
});

export const PacienteModel = model("Paciente", pacienteSchema);
