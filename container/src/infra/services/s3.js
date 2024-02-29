const { S3 } = require("@aws-sdk/client-s3");

const getFileContent = async ({ Bucket, Key }) => {
  const s3 = new S3();

  const file = await s3.getObject({
    Bucket,
    Key,
  });

  return file.Body.transformToString();
};

module.exports.getFileContent = getFileContent;
