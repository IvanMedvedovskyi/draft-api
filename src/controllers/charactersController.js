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

export async function uploadCharacterCosts(req, res) {
  try {
    const parts = req.parts();

    let fileBuffer = null;
    const fields = {};

    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        fileBuffer = await part.toBuffer();
      } else if (part.type === "field") {
        fields[part.fieldname] = part.value;
      }
    }

    const { creatorName, ownerContact, canEditBy } = fields;

    if (!fileBuffer || !creatorName || !ownerContact) {
      return res.status(400).send({ error: "Отсутствуют обязательные поля" });
    }

    const records = await parseCSV(fileBuffer);

    // 💣 Полностью очищаем таблицу
    await prisma.characterCost.deleteMany();

    // ✅ Вставляем все данные (name теперь берётся из CSV, characterId ищем по нему)
    const dataToInsert = [];

    for (const row of records) {
      const character = await prisma.character.findUnique({
        where: { name: row.name },
      });

      if (!character) {
        console.warn(`Персонаж с именем "${row.name}" не найден, пропускаем`);
        continue;
      }

      dataToInsert.push({
        characterId: character.id,
        creatorName,
        ownerContact,
        canEditBy: canEditBy ? JSON.parse(canEditBy) : [],
        m0: parseInt(row.m0, 10),
        m1: parseInt(row.m1, 10),
        m2: parseInt(row.m2, 10),
        m3: parseInt(row.m3, 10),
        m4: parseInt(row.m4, 10),
        m5: parseInt(row.m5, 10),
        m6: parseInt(row.m6, 10),
        noLimit: row.nolimit === "true",
      });
    }

    if (dataToInsert.length === 0) {
      return res
        .status(400)
        .send({ error: "Нет валидных записей для загрузки" });
    }

    await prisma.characterCost.createMany({ data: dataToInsert });

    return res.send({ status: "ok", count: dataToInsert.length });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}

export async function getAllCharacterCosts(req, res) {
  try {
    const costs = await prisma.characterCost.findMany();

    if (!costs || costs.length === 0) {
      return res.status(404).send({ message: "Косты не найдены" });
    }

    return res.status(200).send({ data: costs });
  } catch (err) {
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}
