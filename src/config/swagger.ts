import swaggerJSDoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes REST API",
      version: "1.0.0",
      description: "REST API built with Node.js, Express, Mongoose and TypeScript",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "661f1f5c9a7b4b001e3f1234",
            },
            name: {
              type: "string",
              example: "Eduardo Segredo",
            },
            username: {
              type: "string",
              example: "esegredo",
            },
            email: {
              type: "string",
              example: "esegredo@ull.edu.es",
            },
            age: {
              type: "integer",
              example: 41,
            },
          },
        },

        UserCreate: {
          type: "object",
          required: ["name", "username", "email"],
          properties: {
            name: {
              type: "string",
              example: "Eduardo Segredo",
            },
            username: {
              type: "string",
              example: "esegredo",
            },
            email: {
              type: "string",
              example: "esegredo@ull.edu.es",
            },
            age: {
              type: "integer",
              example: 41
            },
          },
        },

        UserUpdate: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: {
              type: "string",
              example: "Eduardo Segredo"
            },
            username: {
              type: "string",
              example: "esegredo"
            },
            email: {
              type: "string",
              example: "esegredo@ull.edu.es"
            },
            age: {
              type: "integer",
              example: 41
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "A username must be provided",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);