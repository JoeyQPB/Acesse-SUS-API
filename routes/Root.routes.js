import express from "express";
import { GenerateToken } from "../config/jwt.config.js";
import { RootModel } from "../model/root.model.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

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

export { rootRouter };
