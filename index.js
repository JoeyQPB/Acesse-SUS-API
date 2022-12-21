import express from "express";
import * as dotenv from "dotenv";
import { DBconnect } from "./config/db.config.js";

import { RootRouter } from "./routes/Root.routes.js";
import { AGSRouter } from "./routes/AGS.routes.js";
import { PACRouter } from "./routes/Pacientes.routes.js";
import { MEDrouter } from "./routes/medico.routes.js";

import { uploadImgRouter } from "./routes/uplouadImage.routes.js";

import { recSenhaRouter } from "./routes/recSenha.routes.js";

import { SwaggerRouter } from "./routes/swagger.routes.js";

import cors from "cors";

dotenv.config();
DBconnect();

const app = express();

// app.use(cors({ origin: process.env.REACT_APP_URL }));
app.use(cors());

app.use(express.json());

const API_VERSION = "1.0";

app.use(`/API/${API_VERSION}/Root`, RootRouter);

app.use(`/API/${API_VERSION}`, recSenhaRouter);

app.use(`/API/${API_VERSION}/AGS`, AGSRouter);

app.use(`/API/${API_VERSION}/PAC`, PACRouter);

app.use(`/API/${API_VERSION}/MED`, MEDrouter);

app.use(`/API/${API_VERSION}/upload_img`, uploadImgRouter);

app.use(`/doc`, SwaggerRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up and running at DOOR: ${process.env.PORT}`);
});
