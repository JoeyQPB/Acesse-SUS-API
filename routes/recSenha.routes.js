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

recSenhaRouter.post("/esqueci_senha", async (req, res, next) => {
  try {
    const { email } = req.body;

    const token = crypto.randomBytes(12).toString("hex");

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const tokenHash = await bcrypt.hash(token, salt);

    if (req.body.role === "AGS") {
      await AgenteDeSaudeModel.findOneAndUpdate(
        { email: email },
        {
          passwordHash: tokenHash,
        }
      );
    }

    if (req.body.role === "MED") {
      await MedicoModel.findOneAndUpdate(
        { email: email },
        {
          passwordHash: tokenHash,
        }
      );
    }

    if (req.body.role === "PAC") {
      await PacienteModel.findOneAndUpdate(
        { email: email },
        {
          passwordHash: tokenHash,
        }
      );
    }

    transport.sendMail(
      {
        to: email,
        from: `Projeto Acesse SUS ${process.env.EMAIL_ADDRESS}`,
        subject: "Acesse Sus Nova Senha",
        text: `Sua nova senha é: ${token}`,
        html: `<b> Sua nova senha é: ${token} </b>`,
      },
      (err) => {
        if (err) {
          return res
            .status(400)
            .send({ error: "Não consigo gerar nova senha :(" });
        }
      }
    );

    return res.status(200).json({ msg: `Sua nova senha é: ${token}` });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { recSenhaRouter };
