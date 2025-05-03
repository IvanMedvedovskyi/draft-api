import { getAllCharacters } from "../controllers/charactersController.js";

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
}

export default charactersRoutes;
