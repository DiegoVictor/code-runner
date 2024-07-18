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
    if (env.NODE_ENV === "prod") {
      const { username, password } = await secretManager.getSecret(
        env.CLUSTER_SECRET_ID
      );
      const encoded = encodeURIComponent(password);

      return `postgresql://${username}:${encoded}@${env.CLUSTER_URL}/coderunner?schema=public`;
    }

    return env.DATABASE_URL;
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
