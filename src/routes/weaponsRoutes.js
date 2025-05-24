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
      summary: "Upload CSV file with weapons",
      description: "Заменяет всю таблицу оружия новым CSV",
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
      summary: "Get all weapons",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
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
      summary: "Upload weapon costs CSV file",
      description:
        "Заменяет всю таблицу стоимости оружия. Все старые записи будут удалены.",
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
      summary: "Get all weapon cost tables",
      description:
        "Возвращает список таблиц с костами оружия, включая связанные записи",
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
      summary: "Delete a weapon cost table by ID",
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
