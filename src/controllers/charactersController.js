import { PrismaClient } from "@prisma/client";
import { parseCSV } from "../utils/cvs.js";

const prisma = new PrismaClient();

export async function uploadCharacters(req, res) {
  const data = await req.file();
  const records = await parseCSV(await data.toBuffer());

  const requiredFields = ["image", "name", "specialization", "element"];
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
      imageUrl: row.image,
      specialization: row.specialization,
      element: row.element,
    })),
  });

  res.send({ status: "ok", count: records.length });
}
