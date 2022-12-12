import express, { json } from "express";
import { GenerateToken } from "../config/jwt.config.js";
import { AgenteDeSaudeModel } from "../model/AgenteDeSaude.model.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isAGS } from "../middlewares/isAGS.js";
import { PacienteModel } from "../model/Paciente.model.js";
import { MedicoModel } from "../model/Medico.model.js";

import crypto from "crypto";
// const crypto = require("crypto");

import { transport } from "../modules/mailer.js";

const AGSRouter = express.Router();
dotenv.config();

AGSRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const AGS = await AgenteDeSaudeModel.findOne({ email: email });

    if (!AGS || !(await bcrypt.compare(password, AGS.passwordHash))) {
      return res.status(404).json({ msg: "Email ou Senha inválidos" });
    }

    const token = GenerateToken(AGS);

    return res.status(200).json({
      root: {
        name: AGS.name,
        email: AGS.email,
        _id: AGS._id,
        role: AGS.role,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

AGSRouter.post(
  "/signup",
  isAuth,
  attachCurrentUser,
  isAGS,
  async (req, res) => {
    const loggedInUser = req.currentUser;

    try {
      let Model;
      if (req.body.role === "MED") Model = MedicoModel;
      if (req.body.role === "PAC") Model = PacienteModel;

      if (!req.body.role)
        return res.status(401).json({ msg: `Informe a ROLE` });

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
      const create = await Model.create({
        ...req.body,
        role: req.body.role,
        passwordHash: hashedPassword,
        createdBy: `name: ${loggedInUser.name} | CPF: ${loggedInUser.cpf}`,
      });

      delete create._doc.passwordHash;
      return res.status(201).json(create);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

AGSRouter.get("/all", isAuth, attachCurrentUser, isAGS, async (req, res) => {
  let Model;
  if (req.body.role === "MED") Model = MedicoModel;
  if (req.body.role === "PAC") Model = PacienteModel;
  try {
    const all = await Model.find({}, { passwordHash: 0 });

    return res.status(200).json(all);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

AGSRouter.get("/:id", isAuth, attachCurrentUser, isAGS, async (req, res) => {
  let Model;
  if (req.body.role === "MED") Model = MedicoModel;
  if (req.body.role === "PAC") Model = PacienteModel;
  try {
    const user = await Model.findOne(
      { _id: req.params.id },
      { passwordHash: 0 }
    );

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

AGSRouter.patch(
  "/edit/:id",
  isAuth,
  attachCurrentUser,
  isAGS,
  async (req, res) => {
    let Model;
    if (req.body.role === "MED") Model = MedicoModel;
    if (req.body.role === "PAC") Model = PacienteModel;
    try {
      delete req.body._id;
      const oldUser = await Model.findOne(
        { _id: req.params.id },
        { passwordHash: 0 },
        { createdBy: 0 },
        { consultas: 0 }
      );

      const newUser = await Model.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true, runValidators: true }
      );

      delete newUser._doc.passwordHash;

      return res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

AGSRouter.delete(
  "/delete/:id",
  isAuth,
  attachCurrentUser,
  isAGS,
  async (req, res) => {
    let Model;
    if (req.body.role === "MED") Model = MedicoModel;
    if (req.body.role === "PAC") Model = PacienteModel;

    try {
      const deletedUser = await Model.deleteOne({
        _id: req.params.id,
      });

      return res.status(200).json(deletedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { AGSRouter };