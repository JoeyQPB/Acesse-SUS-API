import { AgenteDeSaudeModel } from "../model/AgenteDeSaude.model.js";
import { MedicoModel } from "../model/Medico.model.js";
import { PacienteModel } from "../model/Paciente.model.js";
import { RootModel } from "../model/root.model.js";

export default async function AttachCurrentUser(req, res, next) {
  try {
    const userData = req.auth;
    console.log(req.auth);

    if (userData.role === "AGS") {
      const user = await AgenteDeSaudeModel.findOne(
        { _id: userData._id },
        { passwordHash: 0 }
      );

      if (!user) {
        return res.status(404).json({ msg: "Agente de Saude não encontrado" });
      }

      console.log(user);

      req.currentUser = user;
      next();
    }

    if (userData.role === "MED") {
      const user = await MedicoModel.findOne(
        { _id: userData._id },
        { passwordHash: 0 }
      );

      if (!user) {
        return res.status(404).json({ msg: "Médico não encontrado" });
      }

      req.currentUser = user;
      next();
    }

    if (userData.role === "PAC") {
      const user = await PacienteModel.findOne(
        { _id: userData._id },
        { passwordHash: 0 }
      ).populate("consulta");

      if (!user) {
        return res.status(404).json({ msg: "Paciente não encontrado" });
      }

      req.currentUser = user;
      next();
    }

    if (userData.role === "ROOT") {
      const user = await RootModel.findOne(
        { _id: userData._id },
        { passwordHash: 0 }
      );

      if (!user) {
        return res
          .status(404)
          .json({ msg: "Get Out hacker... || Убирайся, хакер..." });
      }

      req.currentUser = user;
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
}
