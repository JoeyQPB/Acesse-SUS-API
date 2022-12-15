import express from "express";
import { GenerateToken } from "../config/jwt.config.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isMED } from "../middlewares/isMED.js";
import { MedicoModel } from "../model/Medico.model.js";
import { ConsultaModel } from "../model/Consulta.model.js";
import { PacienteModel } from "../model/Paciente.model.js";

const MEDrouter = express.Router();
dotenv.config();

MEDrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const medico = await MedicoModel.findOne({ email: email });

    if (!medico || !(await bcrypt.compare(password, medico.passwordHash))) {
      return res.status(404).json({ msg: "Email ou Senha inválidos" });
    }

    const token = GenerateToken(medico);

    return res.status(200).json({
      root: {
        name: medico.name,
        email: medico.email,
        _id: medico._id,
        role: medico.role,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

MEDrouter.get("/perfil", isAuth, attachCurrentUser, isMED, (req, res) => {
  const loggedInUser = req.currentUser;
  return res.status(200).json(loggedInUser);
});

MEDrouter.get(
  "/info_paciente",
  isAuth,
  attachCurrentUser,
  isMED,
  async (req, res) => {
    try {
      const paciente = await PacienteModel.findOne(
        { cpf: req.body.cpf },
        { passwordHash: 0 }
      );

      return res.status(200).json(paciente);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

MEDrouter.post(
  "/consulta/:id",
  isAuth,
  attachCurrentUser,
  isMED,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;
      const medico = loggedInUser;

      const paciente = await PacienteModel.findOne(
        { _id: req.params.id },
        { passwordHash: 0 }
      );

      const oldconsulta = await ConsultaModel.findOne({
        pacienteId: req.params.id,
      });

      if (oldconsulta) {
        delete oldconsulta._doc.historico;
        delete oldconsulta._doc.pacienteNome;
        delete oldconsulta._doc.paciente;

        const newConsulta = await ConsultaModel.findOneAndUpdate(
          { _id: oldconsulta._id },
          {
            ...req.body,
            medico: `${medico.name} | ${medico.CRM}/${medico.UF} | ${medico.especialidade}`,
            paciente: req.params.id,
            pacienteNome: paciente.name,
            $push: {
              updatedAt: new Date(Date.now()),
              historico: oldconsulta,
            },
          },
          { new: true, runValidators: true }
        );

        await MedicoModel.findOneAndUpdate(
          { _id: medico._id },
          {
            $push: { consultas: newConsulta._id },
          },
          { new: true }
        );

        return res.status(200).json(newConsulta);
      }

      const consulta = await ConsultaModel.create({
        ...req.body,
        medico: `${medico.name} | ${medico.CRM}/${medico.UF} | ${medico.especialidade}`,
        pacienteId: req.params.id,
        pacienteNome: paciente.name,
        $push: { updatedAt: new Date(Date.now()), historico: oldconsulta },
      });

      await PacienteModel.findOneAndUpdate(
        { _id: paciente._id },
        {
          consulta: consulta._id,
        },
        { new: true }
      );

      await MedicoModel.findOneAndUpdate(
        { _id: medico._id },
        {
          $push: { consultas: consulta._id },
        },
        { new: true }
      );

      return res.status(200).json(consulta);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { MEDrouter };
