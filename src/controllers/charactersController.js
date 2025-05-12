import { PrismaClient } from "@prisma/client";
import { parseCSV } from "../utils/cvs";

const prisma = new PrismaClient();

export async function uploadCharacters(req, res) {
  const data = await req.file();
  const records = await parseCSV(await data.toBuffer());

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
      return res
        .status(400)
        .send({ error: `Missing required field: ${field}` });
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
