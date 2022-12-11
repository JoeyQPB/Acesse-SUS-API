import { Schema, model } from "mongoose";

const pacienteSchema = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["MED", "PAC", "AGS"] },
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
});

export const PacienteModel = model("Paciente", pacienteSchema);
