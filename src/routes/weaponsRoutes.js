import {
  getAllWeapons,
  uploadWeapons,
} from "../controllers/weaponsController.js";

async function charactersRoutes(app, options) {
  app.post("/upload/weapons", {
    schema: {
      summary: "Upload CSV file with weapons",
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
    handler: uploadWeapons,
  });
}

export default charactersRoutes;
