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

export async function uploadWeaponCosts(req, res) {
  try {
    const parts = req.parts();

    let fileBuffer = null;
    const metadata = {
      tableName: null,
      ownerContact: null,
      creatorName: null,
      canEditBy: [],
      csvName: null,
    };

    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        fileBuffer = await part.toBuffer();
      } else if (part.type === "field") {
        if (part.fieldname === "canEditBy") {
          try {
            metadata.canEditBy = JSON.parse(part.value);
          } catch {
            return res
              .status(400)
              .send({ error: "Невалидный JSON в canEditBy" });
          }
        } else if (part.fieldname in metadata) {
          metadata[part.fieldname] = part.value;
        }
      }
    }

    if (
      !fileBuffer ||
      !metadata.tableName ||
      !metadata.creatorName ||
      !metadata.ownerContact ||
      !metadata.csvName
    ) {
      return res
        .status(400)
        .send({ error: "Отсутствуют обязательные поля или файл" });
    }

    const parsed = await parseCSV(fileBuffer);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return res
        .status(400)
        .send({ error: "Файл пуст или не содержит данных" });
    }

    // удаляем старые таблицы
    await prisma.weaponCostTable.deleteMany();

    const table = await prisma.weaponCostTable.create({
      data: {
        tableName: metadata.tableName,
        creatorName: metadata.creatorName,
        ownerContact: metadata.ownerContact,
        csvName: metadata.csvName,
        canEditBy: metadata.canEditBy,
      },
    });

    const dataToInsert = parsed.map((row) => ({
      tableId: table.id,
      name: row.name,
      secondName: row.secondName,
      specialization: row.specialization,
      r1: parseInt(row.r1, 10),
      r2: parseInt(row.r2, 10),
      r3: parseInt(row.r3, 10),
      r4: parseInt(row.r4, 10),
      r5: parseInt(row.r5, 10),
      another_r1: parseInt(row.another_r1, 10),
      another_r2: parseInt(row.another_r2, 10),
      another_r3: parseInt(row.another_r3, 10),
      another_r4: parseInt(row.another_r4, 10),
      another_r5: parseInt(row.another_r5, 10),
      offbuild: parseInt(row.offbuild, 10),
    }));

    await prisma.weaponCost.createMany({ data: dataToInsert });

    return res.send({
      status: "ok",
      tableId: table.id,
      count: dataToInsert.length,
    });
  } catch (err) {
    console.error("uploadWeaponCosts error:", err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}

export async function getAllWeaponCosts(req, res) {
  try {
    const tables = await prisma.weaponCostTable.findMany({
      include: { costs: true },
      orderBy: { createdAt: "desc" },
    });

    return res.send(
      tables.map((table) => ({
        id: table.id,
        tableName: table.tableName,
        creatorName: table.creatorName,
        ownerContact: table.ownerContact,
        csvName: table.csvName,
        canEditBy: table.canEditBy,
        costs: table.costs.map((cost) => ({
          id: cost.id,
          name: cost.name,
          secondName: cost.secondName,
          specialization: cost.specialization,
          r1: cost.r1,
          r2: cost.r2,
          r3: cost.r3,
          r4: cost.r4,
          r5: cost.r5,
          another_r1: cost.another_r1,
          another_r2: cost.another_r2,
          another_r3: cost.another_r3,
          another_r4: cost.another_r4,
          another_r5: cost.another_r5,
          offbuild: cost.offbuild,
        })),
      }))
    );
  } catch (err) {
    console.error("getWeaponCosts error:", err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}

export async function deleteWeaponCostTableById(req, res) {
  const { tableId } = req.body;
  if (!tableId) return res.status(400).send({ message: "tableId не указан" });

  const table = await prisma.weaponCostTable.findUnique({
    where: { id: tableId },
  });
  if (!table) return res.status(404).send({ message: "Таблица не найдена" });

  await prisma.weaponCostTable.delete({ where: { id: tableId } });
  return res.send({ message: "Таблица и связанные косты удалены" });
}
