import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyCookie from "fastify-cookie";
import fastifySession from "fastify-session";
import fetch from "node-fetch";
dotenv.config();
const app = Fastify();
// 1. Куки
app.register(fastifyCookie);
// 2. Сессии
app.register(fastifySession, {
    secret: process.env.SESSION_SECRET, // Должен быть длинный случайный ключ
    cookie: {
        secure: false, // true если HTTPS
    },
});
// 3. Авторизация через Discord
app.get("/auth/discord", async (request, reply) => {
    const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
    const clientId = process.env.DISCORD_CLIENT_ID;
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
    reply.redirect(discordAuthUrl);
});
// 4. Callback от Discord
app.get("/auth/discord/callback", async (request, reply) => {
    const code = request.query.code;
    if (!code) {
        return reply.code(400).send({ error: "Code is missing" });
    }
    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI);
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });
    const tokenData = (await tokenResponse.json());
    const access_token = tokenData.access_token;
    const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const userData = (await userResponse.json());
    // Сохраняем данные пользователя в сессию
    request.session.user = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
    };
    return reply.redirect("/profile");
});
// 5. Защищённая страница
app.get("/profile", async (request, reply) => {
    if (!request.session.user) {
        return reply.redirect("/auth/discord");
    }
    return {
        message: "Вы авторизованы!",
        user: request.session.user,
    };
});
app.get("/", async (request, reply) => {
    return { message: "API is working!" };
});
const start = async () => {
    try {
        await app.listen({
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0",
        });
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start().catch(console.error);
