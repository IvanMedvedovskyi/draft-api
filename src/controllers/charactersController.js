import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Получить всех персонажей
export const getAllCharacters = async (request, reply) => {
  try {
    const characters = await prisma.character.findMany();
    return reply.status(200).send(characters);
  } catch (error) {
    console.error("Failed to fetch characters:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

// Получить всё оружие
export const getAllWeapons = async (request, reply) => {
  try {
    const weapons = await prisma.weapon.findMany();
    return reply.status(200).send(weapons);
  } catch (error) {
    console.error("Failed to fetch weapons:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

// Обновить список персонажей пользователя
export const updateUserCharacters = async (req, reply) => {
  const { userId, characters } = req.body;

  if (!userId || !Array.isArray(characters)) {
    return reply
      .status(400)
      .send({ error: "Missing userId or characters array" });
  }

  try {
    await prisma.userCharacter.deleteMany({ where: { userId } });

    await prisma.userCharacter.createMany({
      data: characters.map((c) => ({
        userId,
        characterId: c.characterId,
        rank: c.rank,
        mindscape: c.mindscape,
      })),
    });

    return reply
      .status(200)
      .send({ message: "Characters updated successfully" });
  } catch (error) {
    console.error("Failed to update user characters:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
