import {
  getProfile,
  getAllProfiles,
  updateProfile,
} from "../controllers/profileController.js";

async function profileRoutes(app, options) {
  app.get(
    "/profile",
    {
      schema: {
        tags: ["Profile"],
        summary: "Получить свой профиль",
        description: "Возвращает данные авторизованного пользователя.",
        response: {
          200: {
            description: "Профиль пользователя успешно получен",
          },
          401: {
            description: "Пользователь не авторизован",
          },
        },
      },
    },
    getProfile
  );

  app.get(
    "/getAllProfiles",
    {
      schema: {
        tags: ["Profile"],
        summary: "Получить все профили",
        description: "Возвращает список всех пользователей в системе.",
        response: {
          200: {
            description: "Список профилей успешно получен",
          },
        },
      },
    },
    getAllProfiles
  );

  app.put(
    "/updateProfile",
    {
      schema: {
        tags: ["Profile"],
        summary: "Обновить профиль",
        description: "Позволяет обновить данные пользователя, например имя.",
        body: {
          type: "object",
          required: ["userId", "customName"],
          properties: {
            userId: { type: "string", description: "ID пользователя" },
            globalName: { type: "string", description: "Новое глобальное имя" },
          },
        },
        response: {
          200: {
            description: "Профиль успешно обновлен",
          },
          400: {
            description: "Неверные данные запроса",
          },
          500: {
            description: "Ошибка сервера при обновлении профиля",
          },
        },
      },
    },
    updateProfile
  );
}

export default profileRoutes;
