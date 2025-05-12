import { uploadCharacters } from "../controllers/charactersController.js";

async function charactersRoutes(app, options) {
  app.post("/upload/characters", {
    schema: {
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
}

export default charactersRoutes;
