const { prisma } = require("../prisma");

const find = async ({ take, cursor }) => {
  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      take,
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: cursor && 1,
      cursor: cursor && { id: cursor },
      orderBy: { createdAt: "desc" },
    }),
    prisma.challenge.count(),
  ]);

  const response = {
    data: challenges,
    cursorId: challenges[challenges.length - 1].id,
    total,
  };

  return response;
};

const findOneById = async (id) => {
  const challenge = await prisma.challenge.findFirst({
    where: { id },
  });

  return challenge;
};

const save = async ({ title, description, instructions, inputs }) => {
  await prisma.challenge.create({
    data: {
      title,
      description,
      instructions,
      inputs,
    },
  });
};

module.exports = {
  challengeRepository: {
    find,
    findOneById,
    save,
  },
};
