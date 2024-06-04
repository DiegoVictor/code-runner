module.exports.handler = () => {
  const output = execSync("npx prisma migrate deploy");
  console.log(output.toString());
};
