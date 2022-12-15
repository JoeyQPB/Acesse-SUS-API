import express from "express";
import { GenerateToken } from "../config/jwt.config.js";
import { PacienteModel } from "../model/Paciente.model.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isPAC } from "../middlewares/isPAC.js";

const PACRouter = express.Router();
dotenv.config();

PACRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const paciente = await PacienteModel.findOne({ email: email });

    if (!paciente || !(await bcrypt.compare(password, paciente.passwordHash))) {
      return res.status(404).json({ msg: "Email ou Senha inválidos" });
    }

    const token = GenerateToken(Paciente);

    return res.status(200).json({
      root: {
        name: paciente.name,
        email: paciente.email,
        _id: paciente._id,
        role: paciente.role,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

PACRouter.get("/perfil", isAuth, attachCurrentUser, isPAC, (req, res) => {
  const loggedInUser = req.currentUser;
  return res.status(200).json(loggedInUser);
});

export { PACRouter };
