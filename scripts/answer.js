// Copies an answer file into place. Used by: npm run answer:tests / npm run answer:code
import { copyFileSync } from "node:fs";

const which = process.argv[2];
const files = {
  tests: ["solution/answer-tests.js", "tests/contract.test.js"],
  code: ["solution/answer-code.js", "src/trashRobot.js"],
};

if (!files[which]) {
  console.error("Usage: npm run answer:tests   or   npm run answer:code");
  process.exit(1);
}

const [from, to] = files[which];
copyFileSync(from, to);
console.log(`Copied ${from}  -->  ${to}`);
console.log("Now run: npm test");
