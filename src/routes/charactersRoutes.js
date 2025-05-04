import {
  getAllCharacters,
  getAllWeapons,
  updateUserCharacters,
  addCharacterToUser,
  getUserCharacters,
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
              mindscape: { type: "integer" },
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

  app.post("/user/characters/add", {
    schema: {
      description: "Add a character to a user",
      tags: ["Characters"],
      summary: "Adds a character to a user with inherited rank",
      body: {
        type: "object",
        required: ["userId", "characterId"],
        properties: {
          userId: { type: "string" },
          characterId: { type: "string" },
        },
      },
      response: {
        201: {
          description: "Character added successfully",
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            characterId: { type: "string" },
            rank: { type: "integer" },
            mindscape: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        400: {
          description: "Bad Request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        404: {
          description: "Character not found",
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
    handler: addCharacterToUser,
  });

  app.post("/user/characters/get", {
    // POST + body
    schema: {
      description: "Get all characters of a user",
      tags: ["Characters"],
      summary: "Returns a list of user's characters",
      body: {
        type: "object",
        required: ["userId"],
        properties: {
          userId: { type: "string" },
        },
      },
      response: {
        200: {
          description: "List of user's characters",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              userId: { type: "string" },
              characterId: { type: "string" },
              rank: { type: "integer" },
              mindscape: { type: "integer" },
              createdAt: { type: "string", format: "date-time" },
              character: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  code: { type: "string" },
                  rank: { type: "integer" },
                  mindscape: { type: "integer" },
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
                  createdAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          type: "object",
          properties: { error: { type: "string" } },
        },
        500: {
          description: "Internal Server Error",
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
    handler: getUserCharacters,
  });
}

export default charactersRoutes;
