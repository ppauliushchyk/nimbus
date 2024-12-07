import { faker } from "@faker-js/faker";
import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const account = await prisma.account.upsert({
    create: { id: "6750ce0d3311469c225e256c" },
    update: {},
    where: { id: "6750ce0d3311469c225e256c" },
  });

  const count = 1000
    - (await prisma.transaction.count({
      where: { accountId: account.id },
    }));

  for (let i = 0; i < count; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: faker.finance.amount({ symbol: "" }),
        type: faker.helpers.weightedArrayElement([
          {
            value: TransactionType.UserMoneyIn,
            weight: 8,
          },
          {
            value: TransactionType.UserMoneyOut,
            weight: 2,
          },
        ]),
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
