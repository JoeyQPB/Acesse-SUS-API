import { Schema, model, Types } from "mongoose";

const pacienteSchema = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String },
  cpf: { type: Number, required: true },
  rg: { type: Number, required: true },
  posto: { type: Types.ObjectId, ref: "Posto" },
  foto: {
    type: String,
    default:
      "https://res.cloudinary.com/dqeehrnvz/image/upload/v1670727739/Acesse%20Sus%20Pasta/default_img_ml07es.png",
  },
  nomesocial: { type: String, trim: true, required: true },
  suscard: { type: Number, required: true },
  nacionalidade: { type: String, trim: true, required: true },
  // dataNascimento: {},
  cor: { type: String, trim: true, required: true },
  sexo: { type: String, trim: true, required: true },
  nomeDaMae: { type: String, trim: true, required: true },
  tel: { type: Number, trim: true, required: true },
  createdBy: { type: Types.ObjectId, ref: "Agente-De-Saude" },
  pulmaoDoenca: { type: String, trim: true, required: true },
  fulmante: { type: String, trim: true, required: true },
  usaAlcool: { type: String, trim: true, required: true },
  usaDrogas: { type: String, trim: true, required: true },
  hipertenso: { type: String, trim: true, required: true },
  diabetes: { type: String, trim: true, required: true },
  avcderrame: { type: String, trim: true, required: true },
  infarto: { type: String, trim: true, required: true },
  cardioDoenca: { type: String, trim: true, required: true },
  problemaRins: { type: String, trim: true, required: true },
  consultas: [],
});

export const PacienteModel = model("Paciente", pacienteSchema);
