import { PrismaClient } from "@prisma/client";
import charactersData from "./characters.json";

const prisma = new PrismaClient();

async function main() {
  const sanitizedCharacters = charactersData.map(({ _id, ...rest }) => rest);

  await prisma.character.createMany({
    data: sanitizedCharacters,
    skipDuplicates: true,
  });

  console.log("Персонажи успешно добавлены!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
