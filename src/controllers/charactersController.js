import { PrismaClient } from "@prisma/client";
import { parseCSV } from "../utils/cvs.js";

const prisma = new PrismaClient();

export async function uploadCharacters(req, res) {
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

    await prisma.character.deleteMany();
    await prisma.character.createMany({
      data: records.map((row) => ({
        name: row.name,
        imageChar: row.imageChar,
        element: row.element,
        imageElement: row.imageElement,
        specialization: row.specialization,
        imageSpec: row.imageSpec,
        rarity: parseInt(row.rarity, 10),
      })),
    });

    return res.send({ status: "ok", count: records.length });
  } catch (err) {
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}
export async function getAllCharacters(req, res) {
  try {
    const characters = await prisma.character.findMany();

    if (!characters || characters.length === 0) {
      return res.status(404).send({ error: "Персонажи не найдены" });
    }

    return res.status(200).send(characters);
  } catch (error) {
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}
