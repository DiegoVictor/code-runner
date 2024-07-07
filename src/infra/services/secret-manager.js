const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

const secretsManager = new SecretsManager({});

const getSecret = async (SecretId) => {
  const secret = await secretsManager.getSecretValue({
    SecretId,
  });
  return JSON.parse(secret.SecretString);
};

module.exports = {
  getSecret,
};
