import { Schema, model, Types } from "mongoose";

const consultaSchema = new Schema({
  info: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  diagnostico: {
    type: String,
    required: true,
    trim: true,
    default: "Indefinido",
    uppercase: true,
  },
  prognostico: {
    type: String,
    required: true,
    trim: true,
    default: "Indefinido",
    uppercase: true,
  },
  receita: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  obs: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    default: "Sem Observações a serem feitas",
  },
  pacienteId: {
    type: String,
  },
  pacienteNome: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "Medico",
  },
  medico: {
    type: String,
  },
  medicoId: {
    type: Types.ObjectId,
    ref: "Medico",
  },
  updatedAt: [{ type: Date }],
  historico: [],
});

export const ConsultaModel = model("Consulta", consultaSchema);
