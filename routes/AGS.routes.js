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
      user: {
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
    try {
      console.log(req.body);
      const loggedInUser = req.currentUser;
      let Model;
      if (req.body.role === "MED") Model = MedicoModel;
      if (req.body.role === "PAC") Model = PacienteModel;

      console.log(Model);

      if (!req.body.role)
        return res.status(401).json({ msg: `Informe a ROLE` });

      const { password, cpf, rg, CRM } = req.body;

      if (!password) {
        return res.status(400).json({ msg: "Senha não atende os requisitos!" });
      }

      if (!cpf || !cpf.match(/[0-9]{11}/gm)) {
        return res.status(400).json({
          msg: "CPF não atende os requisitos! (Digite apenas números)",
        });
      }

      if (!rg || !rg.match(/[0-9]{9}/gm)) {
        return res.status(400).json({
          msg: "RG não atende os requisitos! (Digite apenas números)",
        });
      }

      if (req.body.role === "MED") {
        if (!CRM || !CRM.match(/[0-9]{6}/gm)) {
          return res.status(400).json({
            msg: "CRM não atende os requisitos! (Digite apenas números)",
          });
        }
      }

      if (
        !req.body.dataNascimento.match(/(\d{2})[-.\/](\d{2})[-.\/](\d{4})/gm)
      ) {
        return res
          .status(400)
          .json({ msg: "Insira uma data válida: DD/MM/AAAA" });
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

AGSRouter.get("/allmed", isAuth, attachCurrentUser, isAGS, async (req, res) => {
  try {
    const all = await MedicoModel.find({}, { passwordHash: 0 });
    return res.status(200).json(all);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

AGSRouter.get("/allpac", isAuth, attachCurrentUser, isAGS, async (req, res) => {
  try {
    const all = await PacienteModel.find({}, { passwordHash: 0 });
    return res.status(200).json(all);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

AGSRouter.patch(
  "/editMED/:id",
  isAuth,
  attachCurrentUser,
  isAGS,
  async (req, res) => {
    try {
      delete req.body._id;
      const oldUser = await MedicoModel.findOne(
        { _id: req.params.id },
        { passwordHash: 0 },
        { createdBy: 0 },
        { consultas: 0 }
      );

      const newUser = await MedicoModel.findOneAndUpdate(
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

AGSRouter.patch(
  "/editPAC/:id",
  isAuth,
  attachCurrentUser,
  isAGS,
  async (req, res) => {
    try {
      delete req.body._id;
      const oldUser = await PacienteModel.findOne(
        { _id: req.params.id },
        { passwordHash: 0 },
        { createdBy: 0 },
        { consultas: 0 }
      );

      const newUser = await PacienteModel.findOneAndUpdate(
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
  "/deleteMED/:id",
  isAuth,
  attachCurrentUser,
  isAGS,
  async (req, res) => {
    try {
      const deletedUser = await MedicoModel.deleteOne({
        _id: req.params.id,
      });

      return res.status(200).json(deletedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

AGSRouter.delete(
  "/deletePAC/:id",
  isAuth,
  attachCurrentUser,
  isAGS,
  async (req, res) => {
    try {
      const deletedUser = await PacienteModel.deleteOne({
        _id: req.params.id,
      });

      return res.status(200).json(deletedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

AGSRouter.get("/profile", isAuth, attachCurrentUser, isAGS, (req, res) => {
  const loggedInUser = req.currentUser;
  return res.status(200).json(loggedInUser);
});

export { AGSRouter };
