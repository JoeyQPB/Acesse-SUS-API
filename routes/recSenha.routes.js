import express from "express";
import { RootModel } from "../model/root.model.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

import crypto from "crypto";
// const crypto = require("crypto");

import { transport } from "../modules/mailer.js";

const recSenhaRouter = express.Router();
dotenv.config();

recSenhaRouter.post("/esqueci_senha", async (req, res) => {
  const { email } = req.body;

  try {
    const root = await RootModel.findOne({ email: email });

    if (!root) return res.status(404).json({ msg: "Usuário não encontrado!" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date(Date.now() + 1);

    await RootModel.findByIdAndUpdate(root.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    const resp = {
      token: token,
      dateNow: now,
    };

    transport.sendMail(
      {
        to: email,
        from: `acessesus@gmail.com`,
        subject: "Acesse Sus Recuperação de Senha",
        text: `Para recuperar a senha utilize esse token: ${token}`,
        html: `<p> Para recuperar a senha utilize esse token: ${token} </p>`,
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

    return res.status(200).json(resp);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

recSenhaRouter.post("/recuperar_senha", async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const root = await RootModel.findOne({ email: email }).select(
      `+passwordResetToken passwordResetExpires`
      // esses campos por padrao nao vem no find
      // com o select alteramos eles para eles virem
    );

    if (!root) return res.status(404).json({ msg: "Usuário não encontrado!" });

    if (token !== root.passwordResetToken) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    // const now = new Date();

    // if (now > root.passwordResetExpires) {
    //   return res.status(400).json({ msg: "Seu token expireou, gere um novo." });
    // }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    root.passwordHash = hashedPassword;

    await RootModel.findOneAndUpdate(
      { email: email },
      { passwordHash: hashedPassword }
    );

    return res.status(200).json(root);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { recSenhaRouter };
