import {
  register,
  requestCode,
  login,
} from "../controllers/adminPanelController.js";

export async function adminPanelRoutes(app) {
  app.post("/register", {
    schema: {
      tags: ["Auth"],
      summary: "Регистрация",
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
          },
        },
      },
    },
    handler: register,
  });

  app.post("/auth/request-code", {
    schema: {
      tags: ["Auth"],
      summary: "Запросить одноразовый код на email",
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            ok: { type: "boolean" },
          },
        },
      },
    },
    handler: requestCode,
  });

  app.post("/auth/login", {
    schema: {
      tags: ["Auth"],
      summary: "Войти по email и коду, получить JWT",
      body: {
        type: "object",
        required: ["email", "code"],
        properties: {
          email: { type: "string" },
          code: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            token: { type: "string" },
          },
        },
      },
    },
    handler: login,
  });
}

export default adminPanelRoutes;
