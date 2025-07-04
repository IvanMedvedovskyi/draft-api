import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProfile = async (request, reply) => {
  if (!request.session.user) {
    return reply.redirect("/auth/discord");
  }

  try {
    const userId = request.session.user.id;

    const userCharacters = await prisma.userCharacter.findMany({
      where: { userId },
      include: { character: true },
    });

    return reply.send({
      message: "Вы авторизованы!",
      user: {
        ...request.session.user,
        characters: userCharacters.map((uc) => ({
          ...uc.character,
          mindscape: uc.mindscape,
          rank: uc.rank,
          createdAt: uc.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch user characters:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllProfiles = async (request, reply) => {
  const profiles = await prisma.user.findMany({
    include: { characters: true },
  });
  return reply.status(200).send(profiles);
};

export const updateProfile = async (request, reply) => {
  const { userId, customName } = request.body;

  if (!userId || !customName) {
    return reply
      .status(400)
      .send({ error: "userId and username are required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { customName },
    });

    if (request.session.user) {
      request.session.user.customName = updatedUser.customName;
    }

    await request.session.save();

    return reply.status(200).send(updatedUser);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to update profile" });
  }
};
