import {
  getAllCharacters,
  getAllWeapons,
  updateUserCharacters,
} from "../controllers/charactersController.js";

async function charactersRoutes(app, options) {
  app.get("/characters", {
    schema: {
      description: "Get all characters",
      tags: ["Characters"],
      summary: "Returns a list of characters",
      response: {
        200: {
          description: "Successful response",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              code: { type: "string" },
              rank: { type: "integer" },
              type: { type: "integer" },
              element: { type: "integer" },
              camp: { type: "integer" },
              en: { type: "string" },
              ru: { type: "string" },
              portrait: { type: "string" },
              icon: { type: "string" },
              halfPortrait: { type: "string" },
              halfPortrait170: { type: "string" },
              iconHoyo: { type: "string" },
              _id: { type: "string" },
            },
          },
        },
        500: {
          description: "Internal Server Error",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: getAllCharacters,
  });

  app.get("/weapons", {
    schema: {
      description: "Get all weapons",
      tags: ["Weapons"],
      summary: "Returns a list of all weapons",
      response: {
        200: {
          description: "List of weapons",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              icon: { type: "string" },
              rank: { type: "integer" },
              type: { type: "integer" },
              en: { type: "string" },
              ru: { type: "string" },
              iconUrl: { type: "string" },
              hoyoIconSrc: { type: "string" },
            },
          },
        },
        500: {
          description: "Server Error",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: getAllWeapons,
  });

  app.post("/user/characters", {
    schema: {
      description: "Update user characters",
      tags: ["Characters"],
      summary: "User selects characters",
      body: {
        type: "object",
        required: ["userId", "characterIds"],
        properties: {
          userId: { type: "string" },
          characterIds: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      response: {
        200: {
          description: "Characters updated successfully",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        400: {
          description: "Bad Request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        500: {
          description: "Internal Server Error",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: updateUserCharacters,
  });
}

export default charactersRoutes;
