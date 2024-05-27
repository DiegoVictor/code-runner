const { prisma } = require("../prisma");

const findBy = async ({ code = [] }) => {
  return prisma.language.findMany({
    where: {
      code: {
        in: code,
      },
    },
    select: {
      id: true,
    },
  });
};

module.exports = {
  languageRepository: {
    findBy,
  },
};
