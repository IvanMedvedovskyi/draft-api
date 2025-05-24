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

    const { creatorName, ownerContact, canEditBy, tableName } = fields;

    if (!fileBuffer || !creatorName || !ownerContact || !tableName) {
      return res.status(400).send({ error: "Отсутствуют обязательные поля" });
    }

    const records = await parseCSV(fileBuffer);

    // ❌ Удаляем все предыдущие таблицы и косты
    await prisma.characterCostTable.deleteMany();

    // ✅ Создаём новую таблицу
    const table = await prisma.characterCostTable.create({
      data: {
        tableName,
        creatorName,
        ownerContact,
        canEditBy: canEditBy ? JSON.parse(canEditBy) : [],
      },
    });

    const dataToInsert = [];

    for (const row of records) {
      dataToInsert.push({
        tableId: table.id,
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
      return res.status(400).send({ error: "Нет валидных записей" });
    }

    await prisma.characterCost.createMany({ data: dataToInsert });

    return res.send({
      status: "ok",
      count: dataToInsert.length,
      tableId: table.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}

export async function getAllCharacterCosts(req, res) {
  try {
    const tables = await prisma.characterCostTable.findMany({
      include: {
        costs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (tables.length === 0) {
      return res.send([]);
    }

    const response = tables.map((table) => ({
      id: table.id,
      tableName: table.tableName,
      creatorName: table.creatorName,
      ownerContact: table.ownerContact,
      canEditBy: table.canEditBy,
      costs: table.costs.map((cost) => ({
        id: cost.id,
        characterId: cost.characterId,
        m0: cost.m0,
        m1: cost.m1,
        m2: cost.m2,
        m3: cost.m3,
        m4: cost.m4,
        m5: cost.m5,
        m6: cost.m6,
        noLimit: cost.noLimit,
      })),
    }));

    return res.send(response);
  } catch (err) {
    console.error("getCharacterCosts error:", err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}

export async function deleteCharacterCostTableById(req, res) {
  try {
    const { tableId } = req.body;

    if (!tableId) {
      return res.status(400).send({ message: "tableId не указан" });
    }

    const table = await prisma.characterCostTable.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      return res.status(404).send({ message: "Таблица не найдена" });
    }

    await prisma.characterCostTable.delete({
      where: { id: tableId },
    });

    return res.status(200).send({ message: "Таблица и косты удалены" });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    return res.status(500).send({ message: "Ошибка сервера" });
  }
}
