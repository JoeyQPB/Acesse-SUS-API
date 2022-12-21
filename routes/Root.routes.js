import express from "express";
import { GenerateToken } from "../config/jwt.config.js";
import { RootModel } from "../model/root.model.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isROOT } from "../middlewares/isROOT.js";
import { AgenteDeSaudeModel } from "../model/AgenteDeSaude.model.js";

const RootRouter = express.Router();
dotenv.config();

RootRouter.post("/", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
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

RootRouter.post("/login", async (req, res) => {
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

RootRouter.post(
  "/cadastrar_AGS",
  isAuth,
  attachCurrentUser,
  isROOT,
  async (req, res) => {
    try {
      const { password, cpf, rg } = req.body;

      if (!password) {
        return res.status(400).json({ msg: "Senha não atende os requisitos!" });
      }

      if (!cpf || !cpf.match(/[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}/gm)) {
        return res.status(400).json({
          msg: "CPF não atende os requisitos! (Digite apenas números)",
        });
      }

      if (!rg || !rg.match(/[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{2}/gm)) {
        return res.status(400).json({
          msg: "RG não atende os requisitos! (Digite apenas números)",
        });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(password, salt);
      const createdAGS = await AgenteDeSaudeModel.create({
        ...req.body,
        passwordHash: hashedPassword,
        role: "AGS",
      });

      delete createdAGS._doc.passwordHash;
      return res.status(201).json(createdAGS);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

RootRouter.get(
  "/all_AGS",
  isAuth,
  attachCurrentUser,
  isROOT,
  async (req, res) => {
    try {
      const allAGS = await AgenteDeSaudeModel.find({}, { passwordHash: 0 });

      return res.status(200).json(allAGS);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

RootRouter.get(
  "/get-AGS/:id",
  isAuth,
  attachCurrentUser,
  isROOT,
  async (req, res) => {
    try {
      const AGS = await AgenteDeSaudeModel.findOne(
        { _id: req.params.id },
        { passwordHash: 0 }
      );

      return res.status(200).json(AGS);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

RootRouter.patch(
  "/editar_AGS/:id",
  isAuth,
  attachCurrentUser,
  isROOT,
  async (req, res) => {
    try {
      const oldAGS = await AgenteDeSaudeModel.findOne(
        { _id: req.params.id },
        { passwordHash: 0 }
      );

      const newAGS = await AgenteDeSaudeModel.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true, runValidators: true }
      );

      delete newAGS._doc.passwordHash;

      return res.status(200).json(newAGS);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

RootRouter.delete(
  "/delete/:id",
  isAuth,
  attachCurrentUser,
  isROOT,
  async (req, res) => {
    try {
      const deletedAGS = await AgenteDeSaudeModel.deleteOne({
        _id: req.params.id,
      });

      return res.status(200).json(deletedAGS);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { RootRouter };
