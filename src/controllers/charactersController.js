import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllCharacters = async (request, reply) => {
  try {
    const characters = await prisma.character.findMany();

    return reply.status(200).send(characters);
  } catch (error) {
    console.error("Failed to fetch characters:", error);

    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllWeapons = async (request, reply) => {
  try {
    const weapons = await prisma.weapon.findMany();
    return reply.code(200).send(weapons);
  } catch (error) {
    console.error("Failed to fetch weapons:", error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
};

export const updateUserCharacters = async (request, reply) => {
  const { userId, characterIds } = request.body;

  if (!userId || !Array.isArray(characterIds) || characterIds.length === 0) {
    return reply
      .status(400)
      .send({ error: "userId and characterIds are required" });
  }

  try {
    await prisma.userCharacter.createMany({
      data: characterIds.map((characterId) => ({
        userId,
        characterId,
      })),
      skipDuplicates: true,
    });

    if (request.session.user) {
      const characters = await prisma.userCharacter.findMany({
        where: { userId },
        include: { character: true },
      });

      request.session.user.characters = characters.map((uc) => uc.character);
      await request.session.save();
    }

    return reply
      .status(200)
      .send({ message: "Characters updated successfully" });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to update characters" });
  }
};

export const addCharacterToUser = async (req, reply) => {
  const { userId, characterId } = req.body;

  if (!userId || !characterId) {
    return reply.status(400).send({ error: "Missing userId or characterId" });
  }

  try {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      return reply.status(404).send({ error: "Character not found" });
    }

    const userCharacter = await prisma.userCharacter.create({
      data: {
        userId,
        characterId,
        rank: rank ?? character.rank,
        mindscape: mindscape ?? 0,
      },
    });

    return reply.status(201).send(userCharacter);
  } catch (error) {
    console.error("Failed to add character to user:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
