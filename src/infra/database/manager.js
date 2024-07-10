const { PrismaClient } = require("@prisma/client");
const { secretManager } = require("../services/secret-manager");
const { env } = require("../../env");

const manager = {
  client: null,
  orm: "prisma",
  get prisma() {
    return manager.client;
  },
  getUrl: async () => {
    if (env.NODE_ENV === "dev") {
      return process.env.DATABASE_URL;
    }

    const { username, password } = await secretManager.getSecret(
      process.env.CLUSTER_SECRET_ID
    );
    return `postgresql://${username}:${password}@${process.env.CLUSTER_URL}/coderunner?schema=public`;
  },
  connect: async () => {
    if (!manager.client) {
      const datasourceUrl = await manager.getUrl();
      manager.client = new PrismaClient({
        datasourceUrl,
      });
    }
  },
};

module.exports = {
  manager,
};
