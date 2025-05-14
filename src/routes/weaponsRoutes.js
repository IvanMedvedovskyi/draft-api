import {
  getAllWeapons,
  uploadWeapons,
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
}

export default weaponsRoutes;
