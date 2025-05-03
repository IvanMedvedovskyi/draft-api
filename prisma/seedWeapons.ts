import { PrismaClient } from "@prisma/client";
import weaponsData from "./weapon.json";

const prisma = new PrismaClient();

async function main() {
  const sanitizedWeapons = weaponsData.map(({ _id, ...rest }) => rest);

  await prisma.weapon.createMany({
    data: sanitizedWeapons,
    skipDuplicates: true,
  });

  console.log("Оружие успешно добавлено!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
