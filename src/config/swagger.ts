import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Currency API",
      version: "1.0.0",
      description: "API for managing currencies",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routes/currency.ts"),
    path.join(__dirname, "../routes/status.ts"),
    path.join(__dirname, "../routes/price.ts"),
  ],
};

export const spec = swaggerJsdoc(options);
