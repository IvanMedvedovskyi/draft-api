import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import charactersRoutes from "./src/routes/charactersRoutes.js";
import adminPanelRoutes from "./src/routes/adminPanelRoutes.js";

dotenv.config();

const app = Fastify();

app.setSerializerCompiler(() => JSON.stringify);

// --- Настройка CORS ---
app.register(fastifyCors, {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// --- Cookie и Сессии ---
app.register(fastifyCookie);

app.register(fastifySession, {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
  },
  saveUninitialized: false,
});

// --- Swagger ---
await app.register(fastifySwagger, {
  mode: "dynamic", // <<<<<< ПРАВИЛЬНО ВАЖНО
  openapi: {
    info: {
      title: "Draft",
      description: "Draft API Routes",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.BACKEND_URL || "http://localhost:3000",
      },
    ],
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

await app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true, // <<<<<< Обязательно exposeRoute
});

// --- Роуты ---
app.register(authRoutes);
app.register(profileRoutes);
app.register(charactersRoutes);
app.register(adminPanelRoutes);

// --- Запуск сервера ---
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
