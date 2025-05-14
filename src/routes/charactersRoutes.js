import {
  uploadCharacters,
  getAllCharacters,
} from "../controllers/charactersController.js";

async function charactersRoutes(app, options) {
  app.post("/upload/characters", {
    schema: {
      tags: ["Characters"],
      summary: "Upload CSV file with characters",
      description: "Заменяет всю таблицу персонажей новым CSV",
      consumes: ["multipart/form-data"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            count: { type: "integer" },
          },
        },
      },
    },
    handler: uploadCharacters,
  });

  app.get("/characters", {
    schema: {
      tags: ["Characters"],
      summary: "Get all characters",
      description: "Возвращает список всех персонажей",
      response: {
        200: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  imageChar: { type: "string" },
                  element: { type: "string" },
                  imageElement: { type: "string" },
                  specialization: { type: "string" },
                  imageSpec: { type: "string" },
                  rarity: { type: "integer" },
                },
              },
            },
          },
        },
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        500: {
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
