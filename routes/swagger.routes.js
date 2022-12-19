import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };

const SwaggerRouter = express.Router();

SwaggerRouter.use("/", swaggerUi.serve);
SwaggerRouter.get("/", swaggerUi.setup(swaggerDocument));

export { SwaggerRouter };
