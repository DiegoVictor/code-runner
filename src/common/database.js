const getURL = (username, password) =>
  `postgresql://${username}:${password}@${process.env.CLUSTER_URL}/coderunner?schema=public`;

module.exports.getURL = getURL;
