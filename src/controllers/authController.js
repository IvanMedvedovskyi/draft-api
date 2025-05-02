import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const redirectToDiscord = async (request, reply) => {
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const clientId = process.env.DISCORD_CLIENT_ID;

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;

  reply.redirect(discordAuthUrl);
};

export const discordCallback = async (request, reply) => {
  const { code } = request.query;
  if (!code) {
    return reply.redirect(`${process.env.FRONTEND_URL}`);
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.DISCORD_CLIENT_ID);
  params.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI);

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const tokenData = await tokenResponse.json();
  const access_token = tokenData.access_token;

  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const userData = await userResponse.json();

  let user = await prisma.user.findUnique({
    where: { discordId: userData.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        discordId: userData.id,
        username: userData.username,
        globalName: userData.global_name,
        email: userData.email || null,
        avatar: userData.avatar || null,
      },
    });
  }

  request.session.user = {
    id: user.id,
    discordId: user.discordId,
    globalName: userData.global_name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };

  return reply.redirect(`${process.env.FRONTEND_URL}/?authSuccess=true`);
};

export const logout = async (request, reply) => {
  request.session.destroy((err) => {
    if (err) {
      console.error("Ошибка выхода:", err);
    }
    reply.redirect("/");
  });
};
