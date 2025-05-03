import {
  redirectToDiscord,
  discordCallback,
  logout,
} from "../controllers/authController.js";

async function authRoutes(app, options) {
  app.get(
    "/auth/discord",
    {
      schema: {
        tags: ["Auth"],
        summary: "Редирект на Discord OAuth2",
        description:
          "Перенаправление пользователя на страницу авторизации Discord.",
        response: {
          302: {
            description: "Успешный редирект на Discord",
          },
        },
      },
    },
    redirectToDiscord
  );

  app.get(
    "/auth/discord/callback",
    {
      schema: {
        tags: ["Auth"],
        summary: "Callback после авторизации Discord",
        description:
          "Обработка кода авторизации от Discord и получение токена.",
        response: {
          200: {
            description: "Успешная авторизация",
          },
          400: {
            description: "Ошибка авторизации",
          },
        },
      },
    },
    discordCallback
  );

  app.get(
    "/logout",
    {
      schema: {
        tags: ["Auth"],
        summary: "Выход из системы",
        description: "Завершение пользовательской сессии и выход.",
        response: {
          200: {
            description: "Успешный выход",
          },
        },
      },
    },
    logout
  );
}

export default authRoutes;
