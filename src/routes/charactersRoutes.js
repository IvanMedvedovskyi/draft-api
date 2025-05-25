import {
  uploadCharacters,
  getAllCharacters,
  getAllCharacterCosts,
  uploadCharacterCosts,
  deleteCharacterCostTableById,
} from "../controllers/charactersController.js";

async function charactersRoutes(app, options) {
  app.post("/upload/characters", {
    schema: {
      tags: ["Characters"],
      summary: "Загрузка CSV с персонажами",
      description: `
Загружает CSV-файл с данными о персонажах. Полностью заменяет текущую таблицу персонажей.

📥 Поля multipart/form-data:
- file: CSV-файл с колонками:
  - name
  - imageChar
  - element
  - imageElement
  - specialization
  - imageSpec
  - rarity (целое число)
    `,
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
      summary: "Получить список персонажей",
      description: "Возвращает все сохранённые персонажи из базы данных.",
      response: {
        200: {
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
      summary: "Загрузка CSV с костами персонажей",
      description: `
Загружает таблицу стоимости прокачки персонажей и полностью заменяет предыдущие таблицы.

📥 Поля multipart/form-data:
- file: CSV-файл с колонками:
  - m0, m1, m2, m3, m4, m5, m6 (все — целые числа)
  - nolimit (строка "true"/"false")

- Дополнительные поля (строки):
  - creatorName (обязательное)
  - ownerContact (обязательное)
  - tableName (обязательное)
  - csvName (обязательное)
  - canEditBy (необязательное) — JSON-массив email-строк (например: ["a@example.com", "b@example.com"])
    `,
      consumes: ["multipart/form-data"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            count: { type: "integer" },
            tableId: { type: "string" },
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
      summary: "Получить таблицы костов персонажей",
      description: `
Возвращает список всех загруженных таблиц стоимости прокачки персонажей с вложенными значениями по каждому персонажу.

Каждая таблица включает:
- tableId, tableName, creatorName, ownerContact, csvName, canEditBy
- costs: массив объектов с полями m0–m6, noLimit, characterId
    `,
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              tableName: { type: "string" },
              creatorName: { type: "string" },
              ownerContact: { type: "string" },
              csvName: { type: "string" },
              canEditBy: {
                type: "array",
                items: { type: "string" },
              },
              costs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    characterId: { type: "string" },
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

  app.delete("/delete/character-costs", {
    schema: {
      tags: ["CharacterCost"],
      summary: "Удаление таблицы костов персонажей",
      description: `
Удаляет таблицу с костами персонажей и все связанные записи.

📥 JSON тело запроса:
- tableId: строка — ID таблицы для удаления
    `,
      body: {
        type: "object",
        properties: {
          tableId: { type: "string" },
        },
        required: ["tableId"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        500: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: deleteCharacterCostTableById,
  });
}

export default charactersRoutes;
