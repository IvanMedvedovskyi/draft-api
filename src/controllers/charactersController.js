import { PrismaClient } from "@prisma/client";
import { parseCSV } from "../utils/cvs.js";

const prisma = new PrismaClient();

export async function uploadCharacters(req, res) {
  const parts = req.parts();

  let fileBuffer = null;

  for await (const part of parts) {
    if (part.type === "file" && part.fieldname === "file") {
      fileBuffer = await part.toBuffer();
      break;
    }
  }

  if (!fileBuffer) {
    return res.status(400).send({ error: "Файл не загружен" });
  }

  const records = await parseCSV(fileBuffer);

  const requiredFields = [
    "name",
    "imageChar",
    "element",
    "imageElement",
    "specialization",
    "imageSpec",
    "rarity",
  ];

  for (const field of requiredFields) {
    if (!records[0]?.[field]) {
      return res.status(400).send({ error: `Отсутствует поле: ${field}` });
    }
  }

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

  res.send({ status: "ok", count: records.length });
}
