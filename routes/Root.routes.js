import express from "express";
import { GenerateToken } from "../config/jwt.config.js";
import { RootModel } from "../model/root.model.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

import crypto from "crypto";
// const crypto = require("crypto");

import { transport } from "../modules/mailer.js";

const rootRouter = express.Router();
dotenv.config();

rootRouter.post("/", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({ msg: "Senha não atende os requisitos!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdRoot = await RootModel.create({
      ...req.body,
      passwordHash: hashedPassword,
      role: "PAC",
    });

    delete createdRoot._doc.passwordHash;
    return res.status(201).json(createdRoot);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

rootRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const root = await RootModel.findOne({ email: email });

    if (!root || !(await bcrypt.compare(password, root.passwordHash))) {
      return res.status(404).json({ msg: "Email ou Senha inválidos" });
    }

    const token = GenerateToken(root);

    return res.status(200).json({
      root: {
        name: root.name,
        email: root.email,
        _id: root._id,
        role: root.role,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

rootRouter.post("/esqueci_senha", async (req, res) => {
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

rootRouter.post("/recuperar_senha", async (req, res) => {
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

export { rootRouter };
