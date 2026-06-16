import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crypto Tracker API",
      version: "1.0.0",
      description:
        "REST API for managing cryptocurrencies, prices, and wallet addresses",
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
    path.join(__dirname, "../routes/status.ts"),
    path.join(__dirname, "../routes/currency.ts"),
    path.join(__dirname, "../routes/address.ts"),
    path.join(__dirname, "../routes/addressBalance.ts"),
    path.join(__dirname, "../routes/price.ts"),
    path.join(__dirname, "../routes/blockchain.ts"),
  ],
};

export const spec = swaggerJsdoc(options);
