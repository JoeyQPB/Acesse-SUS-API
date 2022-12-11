import { Schema, model, Types } from "mongoose";

const postotSchema = new Schema({
  bairro: {
    type: String,
    trim: true,
    required: true,
  },
  rua: {
    type: String,
    trim: true,
    required: true,
  },
  numero: {
    type: Number,
    trim: true,
    required: true,
  },
  nome: {
    type: String,
    trim: true,
    required: true,
  },
  ags: [
    {
      type: Types.ObjectId,
      ref: "Agentes-De-Saude",
    },
  ],
  med: [
    {
      type: Types.ObjectId,
      ref: "Medicos",
    },
  ],
  pac: [
    {
      type: Types.ObjectId,
      ref: "Pacientes",
    },
  ],
});

export const PostoModel = model("Posto", postotSchema);
