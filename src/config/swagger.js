const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

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
    path.join(__dirname, "../routes/currency.js"),
    path.join(__dirname, "../routes/status.js"),
    path.join(__dirname, "../routes/price.js"),
  ],
};

const spec = swaggerJsdoc(options);

module.exports = spec;
