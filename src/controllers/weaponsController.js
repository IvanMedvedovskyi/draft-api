import { PrismaClient } from "@prisma/client";
import { parseCSV } from "../utils/cvs.js";

const prisma = new PrismaClient();

export async function uploadWeapons(req, res) {
  try {
    const parts = req.parts();

    let fileBuffer = null;

    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        fileBuffer = await part.toBuffer();
      }
    }

    if (!fileBuffer) {
      return res.status(400).send({ error: "Файл не загружен" });
    }

    const records = await parseCSV(fileBuffer);

    await prisma.weapon.deleteMany();
    await prisma.weapon.createMany({
      data: records.map((row) => ({
        name: row.name,
        imageWeapon: row.imageWeapon,
        specialization: row.specialization,
        imageSpecialization: row.imageSpecialization,
        rarity: parseInt(row.rarity, 10),
      })),
    });

    return res.send({ status: "ok", count: records.length });
  } catch (err) {
    console.error("uploadWeapons error:", err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}

export async function getAllWeapons(req, res) {
  try {
    const weapons = await prisma.weapon.findMany();

    if (!weapons || weapons.length === 0) {
      return res.status(404).send({ error: "Оружие не найдено" });
    }

    return res.status(200).send(weapons);
  } catch (error) {
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}
