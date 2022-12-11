import { Schema, model, Types } from "mongoose";

const consultaSchema = new Schema({
  info: { type: String, required: true, trim: true },
  suspeitas: { type: String, required: true, trim: true },
  diagnostico: {
    type: String,
    required: true,
    trim: true,
    default: "Indefinido",
  },
  prognostico: {
    type: String,
    required: true,
    trim: true,
    default: "Indefinido",
  },
  receita: { type: String, required: true, trim: true },
  obs: { type: String, required: true, trim: true },
  paciente: { type: Types.ObjectId, red: "Paciente" },
  medico: { type: Types.ObjectId, red: "Medico" },
  createdAt: { type: Date, default: new Date(Date.now()) },
  updatedAt: [{ type: Date }],
  historico: [],
});

export const ConsultaModel = model("Consulta", consultaSchema);
