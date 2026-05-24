const express = require("express");
const app = express();

const authMiddleware = require("./middleware/auth");
const statusRoute = require("./routes/status");
const currency = require("./routes/currency");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");



const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Currency API", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const spec = swaggerJsdoc(options);
app.use(express.json());
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
app.use(authMiddleware);
app.use("/currency", currency);
app.use("/status", statusRoute);



module.exports = app;
