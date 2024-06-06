INSERT INTO "languages" ("id", "name", "code", "template", "createdAt", "updatedAt")
VALUES ('9458cda6-a32d-42f6-b520-69f69aa13935','JavaScript','js',
e'async function run({ input }) {\n  return null;\n}', NOW(), NOW());

INSERT INTO "languages" ("id", "name", "code", "template", "createdAt", "updatedAt")
VALUES ('aff24034-cfb2-4d12-ac26-f346c51eed6e', 'Python', 'python',
e'def run(input):\n  return None', NOW(), NOW());

INSERT INTO "languages" ("id", "name", "code", "template", "createdAt", "updatedAt")
VALUES ('d67c842f-cc49-4c49-aedd-4adcb2962f73', 'Go', 'go',
e'func run(input interface{}) interface{} {\n  return nil\n}', NOW(), NOW());

INSERT INTO "languages" ("id", "name", "code", "template", "createdAt", "updatedAt")
VALUES (
  'f6e881b8-bafd-472b-b81e-eadeea82f42d',
  'TypeScript',
  'ts',
  e'async function run({ input }: { input: any }): Promise<null> {\n  return null;\n}',
  NOW(),
  NOW()
);
