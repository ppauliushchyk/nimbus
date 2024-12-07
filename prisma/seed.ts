import { faker } from "@faker-js/faker";
import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const account = await prisma.account.upsert({
    create: {},
    update: {},
    where: { id: "6750ce0d3311469c225e256c" },
  });

  const count = await prisma.transaction.count({
    where: { accountId: account.id },
  });

  const end = 1000 - count;

  for (let i = 0; i < end; i += 1) {
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: faker.finance.amount({ symbol: "" }),
        type: faker.helpers.enumValue(TransactionType),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
