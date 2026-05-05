import swaggerJSDoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes REST API",
      version: "1.0.0",
      description:
        "REST API built with Node.js, Express, Mongoose and TypeScript",
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER,
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
              example: 41,
            },
          },
        },

        UserUpdate: {
          type: "object",
          additionalProperties: false,
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
              example: 41,
            },
          },
        },

        NoteOwner: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "661f1f5c9a7b4b001e3f1234",
            },
            username: {
              type: "string",
              example: "esegredo",
            },
          },
        },

        Note: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66201c5e9a7b4b001e3f5678",
            },
            title: {
              type: "string",
              example: "Supermarket",
            },
            body: {
              type: "string",
              example: "Milk, fruit and vegetables",
            },
            color: {
              type: "string",
              example: "yellow",
            },
            owner: {
              $ref: "#/components/schemas/NoteOwner",
            },
          },
        },

        NoteCreate: {
          type: "object",
          required: ["title", "body"],
          properties: {
            title: {
              type: "string",
              example: "Supermarket",
            },
            body: {
              type: "string",
              example: "Milk, fruit and vegetables",
            },
            color: {
              type: "string",
              example: "yellow",
            },
          },
        },

        NoteUpdate: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: {
              type: "string",
              example: "Supermarket",
            },
            body: {
              type: "string",
              example: "Milk, fruit and vegetables",
            },
            color: {
              type: "string",
              example: "yellow",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "User not found",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
