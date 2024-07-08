const { manager } = require("../manager");

const find = async ({ take, cursor }) => {
  const [challenges, total] = await Promise.all([
    manager.prisma.challenge.findMany({
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
    manager.prisma.challenge.count(),
  ]);

  const response = {
    data: challenges,
    cursorId: challenges[challenges.length - 1].id,
    total,
  };

  return response;
};

const findOneById = async (id) => {
  const challenge = await manager.prisma.challenge.findFirst({
    where: { id },
    include: {
      languages: true,
    },
  });

  return challenge;
};

const save = async ({
  title,
  description,
  instructions,
  inputs,
  languages,
}) => {
  await manager.prisma.challenge.create({
    data: {
      title,
      description,
      instructions,
      inputs,
      languages: {
        connect: languages,
      },
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
