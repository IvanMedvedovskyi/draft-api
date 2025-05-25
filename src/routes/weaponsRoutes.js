import {
  getAllWeapons,
  uploadWeapons,
  uploadWeaponCosts,
  getAllWeaponCosts,
  deleteWeaponCostTableById,
} from "../controllers/weaponsController.js";

async function weaponsRoutes(app, options) {
  app.post("/upload/weapons", {
    schema: {
      tags: ["Weapons"],
      summary: "Загрузка CSV с оружием",
      description: `
Загружает CSV-файл с данными об оружии и полностью заменяет текущую таблицу оружия.

📥 Поля multipart/form-data:
- file: CSV-файл с колонками:
  - name
  - imageWeapon
  - specialization
  - imageSpecialization
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
    handler: uploadWeapons,
  });

  app.get("/weapons", {
    schema: {
      tags: ["Weapons"],
      summary: "Получить список оружий",
      description: "Возвращает все оружия из базы данных.",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              imageWeapon: { type: "string" },
              specialization: { type: "string" },
              imageSpecialization: { type: "string" },
              rarity: { type: "string" },
            },
          },
        },
      },
    },
    handler: getAllWeapons,
  });

  app.post("/upload/weapon-costs", {
    schema: {
      tags: ["Weapon Costs"],
      summary: "Загрузка CSV с костами оружия",
      description: `
Загружает таблицу стоимости оружия и заменяет старые записи.

📥 Поля multipart/form-data:
- file: CSV-файл с колонками:
  - name, secondName, specialization,
  - r1, r2, r3, r4, r5,
  - another_r1, another_r2, another_r3, another_r4, another_r5,
  - offbuild
- tableName: строка — название таблицы
- creatorName: строка — имя создателя
- ownerContact: строка — контакт владельца
- csvName: строка — название CSV-файла
- canEditBy: JSON-массив строк (email), напр.: ["a@example.com", "b@example.com"]
    `,
      consumes: ["multipart/form-data"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            tableId: { type: "string" },
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
    handler: uploadWeaponCosts,
  });

  app.get("/weapon-costs", {
    schema: {
      tags: ["Weapon Costs"],
      summary: "Получить таблицы стоимости оружия",
      description: `
Возвращает список всех таблиц стоимости оружия и связанные с ними записи.

Каждая таблица содержит:
- id, tableName, creatorName, ownerContact, csvName, canEditBy
- costs: массив записей по каждому оружию
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
                    name: { type: "string" },
                    secondName: { type: "string" },
                    specialization: { type: "string" },
                    r1: { type: "integer" },
                    r2: { type: "integer" },
                    r3: { type: "integer" },
                    r4: { type: "integer" },
                    r5: { type: "integer" },
                    another_r1: { type: "integer" },
                    another_r2: { type: "integer" },
                    another_r3: { type: "integer" },
                    another_r4: { type: "integer" },
                    another_r5: { type: "integer" },
                    offbuild: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: getAllWeaponCosts,
  });

  app.delete("/delete/weapon-costs", {
    schema: {
      tags: ["Weapon Costs"],
      summary: "Удалить таблицу стоимости по ID",
      description: `
Удаляет таблицу и все связанные записи стоимости оружия.

📥 Тело запроса (JSON):
- tableId: строка — ID таблицы, которую нужно удалить
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
      },
    },
    handler: deleteWeaponCostTableById,
  });
}

export default weaponsRoutes;
