import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProfile = async (req, reply) => {
  if (!req.session.user) {
    return reply.code(401).send({ error: "UNAUTHENTICATED" });
  }
  return { user: req.session.user };
};

export const getAllProfiles = async (request, reply) => {
  const profiles = await prisma.user.findMany();
  return reply.status(200).send(profiles);
};

export const updateProfile = async (request, reply) => {
  const { userId, globalName } = request.body;

  if (!userId || !globalName) {
    return reply
      .status(400)
      .send({ error: "userId and username are required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { globalName },
    });

    return reply.status(200).send(updatedUser);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to update profile" });
  }
};
