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
