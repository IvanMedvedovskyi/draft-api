import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";

dotenv.config();

const app = Fastify();

app.register(fastifyCors, {
  origin: process.env.FRONTEND_URL,
  credentials: true,
});

app.register(fastifyCookie);

app.register(fastifySession, {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  saveUninitialized: false,
});

await app.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Draft",
      description: "Draft API Routes",
      version: "1.0.0",
    },
    host:
      process.env.FRONTEND_URL?.replace(/^https?:\/\//, "") || "localhost:3000",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "Auth",
        description: "Авторизация и выход",
      },
      {
        name: "Profile",
        description: "Работа с профилями",
      },
    ],
  },
});

// Swagger UI (/docs)
await app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Регистрируем роуты
app.register(authRoutes);
app.register(profileRoutes);

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
