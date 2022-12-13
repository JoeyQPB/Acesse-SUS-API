import express from "express";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

import { AgenteDeSaudeModel } from "../model/AgenteDeSaude.model.js";
import { MedicoModel } from "../model/Medico.model.js";
import { PacienteModel } from "../model/Paciente.model.js";

import crypto from "crypto";
// const crypto = require("crypto");

import { transport } from "../modules/mailer.js";

const recSenhaRouter = express.Router();
dotenv.config();

recSenhaRouter.post("/esqueci_senha", async (req, res) => {
  const { email } = req.body;

  try {
    let user;
    let model;
    user = await AgenteDeSaudeModel.findOne({ email: email });
    model = AgenteDeSaudeModel;
    if (!user) {
      user = await MedicoModel.findOne({ email: email });
      model = MedicoModel;
    } else if (!user) {
      user = await PacienteModel.findOne({ email: email });
      model = PacienteModel;
    } else if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    //rashearsenha
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const tokenHash = await bcrypt.hash(token, salt);

    //alocar senha rasheada
    await model.findByIdAndUpdate(user.id, {
      $set: {
        passwordHash: tokenHash,
      },
    });

    transport.sendMail(
      {
        to: email,
        from: `acessesus@gmail.com`,
        subject: "Acesse Sus Recuperação de Senha",
        text: `Sua nova senha é: ${token}`,
        html: `<p> Sua nova senha é: ${token} </p>`,
      },
      (err) => {
        if (err) {
          return res
            .status(400)
            .send({ error: "Não consigo enviar o email para recuperação" });
        }

        return res.status(200).json({ msg: "OK!" });
      }
    );

    return res.status(200).json({ msg: `Sua nova senha é: ${token}` });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { recSenhaRouter };
