const { manager } = require("../manager");

const findBy = async ({ code = [] }) => {
  return manager.prisma.language.findMany({
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
