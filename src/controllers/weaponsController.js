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
    };

    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        fileBuffer = await part.toBuffer();
      } else if (part.type === "field") {
        if (part.fieldname === "canEditBy") {
          try {
            metadata.canEditBy = JSON.parse(part.value);
          } catch (e) {
            return res
              .status(400)
              .send({ error: "Невалидный JSON в canEditBy" });
          }
        } else if (
          ["tableName", "ownerContact", "creatorName"].includes(part.fieldname)
        ) {
          metadata[part.fieldname] = part.value;
        }
      }
    }

    if (!fileBuffer) {
      return res.status(400).send({ error: "Файл не загружен" });
    }

    // 👇 Замените это на свою функцию чтения CSV из буфера
    const costs = await parseCSV(fileBuffer);

    if (!Array.isArray(costs) || costs.length === 0) {
      return res
        .status(400)
        .send({ error: "Файл пуст или не содержит данных" });
    }

    if (
      !metadata.tableName ||
      !metadata.ownerContact ||
      !metadata.creatorName
    ) {
      return res.status(400).send({ error: "Отсутствуют мета-поля" });
    }

    await prisma.weaponCost.deleteMany();

    await prisma.weaponCost.createMany({
      data: costs.map((row) => ({
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
        tableName: metadata.tableName,
        creatorName: metadata.creatorName,
        ownerContact: metadata.ownerContact,
        canEditBy: metadata.canEditBy,
      })),
    });

    return res.send({
      status: "ok",
      tableName: metadata.tableName,
      ownerContact: metadata.ownerContact,
      creatorName: metadata.creatorName,
      canEditBy: metadata.canEditBy,
      count: costs.length,
    });
  } catch (err) {
    console.error("uploadWeaponCosts error:", err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}

export async function getAllWeaponCosts(req, res) {
  try {
    const all = await prisma.weaponCost.findMany();

    if (all.length === 0) {
      return res.send({
        tableName: null,
        creatorName: null,
        ownerContact: null,
        canEditBy: [],
        costs: [],
      });
    }

    // Берём метаданные из первой записи
    const { tableName, creatorName, ownerContact, canEditBy } = all[0];

    const costs = all.map(
      ({
        id,
        name,
        secondName,
        specialization,
        r1,
        r2,
        r3,
        r4,
        r5,
        another_r1,
        another_r2,
        another_r3,
        another_r4,
        another_r5,
        offbuild,
      }) => ({
        id,
        name,
        secondName,
        specialization,
        r1,
        r2,
        r3,
        r4,
        r5,
        another_r1,
        another_r2,
        another_r3,
        another_r4,
        another_r5,
        offbuild,
      })
    );

    return res.send({
      tableName,
      creatorName,
      ownerContact,
      canEditBy,
      costs,
    });
  } catch (err) {
    console.error("getWeaponCosts error:", err);
    return res.status(500).send({ error: "Ошибка сервера" });
  }
}
