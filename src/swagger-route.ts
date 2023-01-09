import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Oasis API",
      version: "1.0.0",
    },
  },
  apis: ["./**/*.routes.ts"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

export const swaggerRoute = Router();

swaggerRoute.use(swaggerUi.serve, swaggerUi.setup(openapiSpecification));
