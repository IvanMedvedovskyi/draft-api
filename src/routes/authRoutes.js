import {
  redirectToDiscord,
  discordCallback,
  logout,
} from "../controllers/authController.js";

async function authRoutes(app, options) {
  app.get("/auth/discord", redirectToDiscord);
  app.get("/auth/discord/callback", discordCallback);
  app.get("/logout", logout);
}

export default authRoutes;
