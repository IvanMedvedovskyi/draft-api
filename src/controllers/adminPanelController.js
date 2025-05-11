import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../mail/mailer.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function register(req, reply) {
  const { email, password } = req.body;

  const exists = await prisma.AdminPanelUser.findUnique({ where: { email } });
  if (exists) return reply.status(400).send({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);
  await prisma.AdminPanelUser.create({ data: { email, passwordHash: hash } });

  reply.send({ success: true });
}

export async function requestCode(req, reply) {
  const { email, password } = req.body;

  const user = await prisma.AdminPanelUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return reply.status(400).send({ error: "Invalid credentials" });
  }

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.AdminPanelUser.update({
    where: { email },
    data: { securityCode: code, codeExpiresAt: expiresAt },
  });

  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your login code",
    text: `Your login code is: ${code}`,
  });

  reply.send({ ok: true });
}

export async function login(req, reply) {
  const { email, code } = req.body;

  const user = await prisma.AdminPanelUser.findUnique({ where: { email } });
  if (!user || user.securityCode !== code || new Date() > user.codeExpiresAt) {
    return reply.status(400).send({ error: "Invalid or expired code" });
  }

  // очистка кода
  await prisma.AdminPanelUser.update({
    where: { email },
    data: { securityCode: null, codeExpiresAt: null },
  });

  // создание токена
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  reply.send({ success: true, token });
}

