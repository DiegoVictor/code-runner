const { PrismaClient } = require("@prisma/client");

(async () => {
  const db = new PrismaClient();
  try {
    await db.challenge.createMany({
      data: [
        {
          title: "Caesar Cipher",
          description:
            "A simple Caesar cipher that shifts the characters of a string by a fixed number of positions down the alphabet.",
          instructions:
            "Caesar's cipher shifts each letter by a number of letters. If the shift takes you past the end of the " +
            "alphabet, just rotate back to the front of the alphabet. In the case of a rotation by 3, w, x, y and z would map t" +
            "o z, a, b and c.\n\n```\nOriginal alphabet:      abcdefghijklmnopqrstuvwxyz\nAlphabet rotated +3:    defghijklmnop" +
            "qrstuvwxyzabc\n```\n\n#### Example\n\n```text\ns = There's-a-starman-waiting-in-sky\nk = 3\n```\n\nThe alphabet is" +
            " rotated by `3`, matching the mapping above. The encrypted string is `Wkhuh'v-d-vwdupdq-zdlwlqj-lq-vnb`\n> **Note:*" +
            "* The cipher only encrypts letters; symbols, such as `-`, remain unencrypted.\n\n#### Sample Input\n\n```json\n{\n" +
            '  "input": "middle-Outz",\n  "shift": 2\n}\n```\n\n#### Sample Output\n\n```txt\nokffng-Qwvb\n```\n\nFrom: [Caesar' +
            "Cipher](https://www.hackerrank.com/challenges/caesar-cipher-1/problem)",
          inputs: [
            {
              id: "clwihx1hx000008l83dl877wj",
              value: {
                input: "middle-Outz",
                shift: 2,
              },
              expected: "okffng-Qwvb",
            },
            {
              id: "clwihxhux000108l8hgi44q6b",
              value: {
                input: "Always-Look-on-the-Bright-Side-of-Life",
                shift: 5,
              },
              expected: "Fqbfdx-Qttp-ts-ymj-Gwnlmy-Xnij-tk-Qnkj",
            },
          ],
        },
        {
          title: "Forming a Magic Square",
          description:
            "Given a `3 x 3` matrix, convert it into a magic square at minimal cost.",
          instructions:
            "We define a magic square to be an `n x m` matrix of distinct positive integers from `1` to `n²` where t" +
            "he sum of any row, column, or diagonal of length `n` is always equal to the same number: the magic constant.\n\nYou" +
            " will be given a `3 x 3` matrix `s` of integers in the inclusive range `[1, 9]`. We can convert any digit `a` to an" +
            "y other digit `b` in the range `[1, 9]` at cost of `|a - b|`. Given `s`, convert it into a magic square at minimal " +
            "cost. Print this cost on a new line.\n\n> **Note:** The resulting magic square must contain distinct integers in th" +
            "e inclusive range `[1, 9]`.\n\n#### Example\n\n$s = [[5, 3, 4], [1, 5, 8], [6, 4, 2]]\n\nThe matrix looks like this" +
            ":\n\n```text\n5 3 4\n1 5 8\n6 4 2\n```\nWe can convert it to the following magic square:\n```text\n8 3 4\n1 5 9\n6 " +
            "7 2\n```\n\nThis took three replacements at a cost of `|5 - 8| + | 8 - 9| + |4 - 7| = 7`.\n\n#### Sample Input\n\n`" +
            "``text\n4 9 2\n3 5 7\n8 1 5\n```\n\n#### Sample Output\n\n```text\n1\n```\n\n#### Explanation\n\nIf we change the b" +
            "ottom right value, `s[2][2]`, from `5` to `6` at a cost of `|6 - 5| = 1`,`s` becomes a magic square at the minimum " +
            "possible cost.\n\nFrom: [Forming a Magic Square](https://www.hackerrank.com/challenges/magic-square-forming/problem",
          inputs: [
            {
              id: "clwihxwzz000208l8c3135xod",
              value: [
                [4, 9, 2],
                [3, 5, 7],
                [8, 1, 5],
              ],
              expected: 1,
            },
            {
              id: "clwihy4dc000308l89ygr3zyt",
              value: [
                [4, 8, 2],
                [4, 5, 7],
                [6, 1, 6],
              ],
              expectedOutput: 4,
            },
          ],
        },
      ],
    });
  } catch (e) {
    console.error(e);
  } finally {
    await db.$disconnect();
  }
})();
