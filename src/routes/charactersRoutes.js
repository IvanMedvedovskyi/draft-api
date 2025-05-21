import {
  uploadCharacters,
  getAllCharacters,
  getAllCharacterCosts,
  uploadCharacterCosts,
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

  app.post("/upload/character-costs", {
    schema: {
      tags: ["CharacterCost"],
      summary: "Upload CSV file with character costs",
      description:
        "Заменяет всю таблицу костов персонажей новым CSV. Обязательные поля: file, name, creatorName, ownerContact. Поле canEditBy — необязательное (JSON-массив строк).",
      consumes: ["multipart/form-data"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            count: { type: "integer" },
          },
        },
        400: {
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

    handler: uploadCharacterCosts,
  });

  app.get("/character-costs", {
    schema: {
      tags: ["CharacterCost"],
      summary: "Get all character costs",
      description: "Возвращает список всех костов персонажей",
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
                  m0: { type: "integer" },
                  m1: { type: "integer" },
                  m2: { type: "integer" },
                  m3: { type: "integer" },
                  m4: { type: "integer" },
                  m5: { type: "integer" },
                  m6: { type: "integer" },
                  noLimit: { type: "boolean" },
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
    handler: getAllCharacterCosts,
  });
}

export default charactersRoutes;
