import {
  getAllWeapons,
  uploadWeapons,
  uploadWeaponCosts,
  getAllWeaponCosts,
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
      summary: "Upload structured JSON with weapon costs",
      description:
        "Заменяет всю таблицу стоимости оружия структурированным JSON",
      // body: {
      //   type: "object",
      //   required: ["tableName", "ownerContact", "adminEmails", "costs"],
      //   properties: {
      //     tableName: { type: "string" },
      //     ownerContact: { type: "string" },
      //     adminEmails: {
      //       type: "array",
      //       items: { type: "string" },
      //     },
      //     costs: {
      //       type: "array",
      //       items: {
      //         type: "object",
      //         required: [
      //           "name",
      //           "secondName",
      //           "specialization",
      //           "r1",
      //           "r2",
      //           "r3",
      //           "r4",
      //           "r5",
      //           "another_r1",
      //           "another_r2",
      //           "another_r3",
      //           "another_r4",
      //           "another_r5",
      //           "offbuild",
      //         ],
      //         properties: {
      //           name: { type: "string" },
      //           secondName: { type: "string" },
      //           specialization: { type: "string" },
      //           r1: { type: "integer" },
      //           r2: { type: "integer" },
      //           r3: { type: "integer" },
      //           r4: { type: "integer" },
      //           r5: { type: "integer" },
      //           another_r1: { type: "integer" },
      //           another_r2: { type: "integer" },
      //           another_r3: { type: "integer" },
      //           another_r4: { type: "integer" },
      //           another_r5: { type: "integer" },
      //           offbuild: { type: "integer" },
      //         },
      //       },
      //     },
      //   },
      // },
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            tableName: { type: "string" },
            ownerContact: { type: "string" },
            admins: {
              type: "array",
              items: { type: "string" },
            },
            count: { type: "integer" },
          },
        },
      },
    },
    handler: uploadWeaponCosts,
  });

  app.get("/weapon-costs", {
    schema: {
      tags: ["Weapon Costs"],
      summary: "Get all weapon cost entries",
      response: {
        200: {
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
    handler: getAllWeaponCosts,
  });
}

export default weaponsRoutes;
