import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";

dotenv.config();

const app = Fastify();

app.register(fastifyCors, {
  credentials: true,
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Origin not allowed by CORS"));
  },
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest",
});

app.register(fastifySession, {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  saveUninitialized: false,
});

// Регистрируем роуты
app.register(authRoutes);
app.register(profileRoutes);

// Тестовый корневой роут
app.get("/", async (request, reply) => {
  return { message: "API is working!" };
});

// Запуск сервера
const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT || 3000}`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
