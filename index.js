import express from "express";
import * as dotenv from "dotenv";
import { DBconnect } from "./config/db.config.js";

import { rootRouter } from "./routes/root.routes.js";
import { AGSRouter } from "./routes/AGS.routes.js";

import { recSenhaRouter } from "./routes/recSenha.routes.js";

dotenv.config();
DBconnect();

const app = express();

app.use(express.json());

const API_VERSION = "1.0";

const API_ROOT = process.env.API_ROOT;

app.use(`/API/${API_ROOT}/Root`, rootRouter);

app.use(`/API/${API_VERSION}`, recSenhaRouter);

app.use(`/API/${API_VERSION}/AGS`, AGSRouter);

app.listen(Number(process.env.DOOR), () => {
  console.log(`Server up and running at DOOR: ${process.env.DOOR}`);
});
