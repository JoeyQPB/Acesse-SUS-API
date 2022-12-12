import express from "express";
import { GenerateToken } from "../config/jwt.config.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isMED } from "../middlewares/isMED.js";
import { MedicoModel } from "../model/Medico.model.js";

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

export { MEDrouter };
