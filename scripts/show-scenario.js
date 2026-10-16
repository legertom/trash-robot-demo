// Draws the house before and after the robot runs, for three situations
// from spec.md. Run with: npm run scenario

import { runTrashRobot } from "../src/trashRobot.js";

const scenarios = [
  {
    title: "TUESDAY  (AC1)  take the trash out",
    state: { day: "Tuesday", kitchenBags: 1, bathroomBags: 1, garageBags: 0, cartBags: 0,
             cartLocation: "garage", pickupComplete: false, needsHuman: false },
    want: { kitchenBags: 0, bathroomBags: 0, garageBags: 0, cartBags: 2, cartLocation: "curb" },
    wantText: "bins empty, garage floor clear, cart at the curb with 2 bags",
  },
  {
    title: "TUESDAY  (AC2)  cart was already at the curb",
    state: { day: "Tuesday", kitchenBags: 1, bathroomBags: 1, garageBags: 0, cartBags: 0,
             cartLocation: "curb", pickupComplete: false, needsHuman: false },
    want: { kitchenBags: 0, bathroomBags: 0, garageBags: 0, cartBags: 2, cartLocation: "curb" },
    wantText: "bins empty, garage floor clear, both bags in the cart at the curb",
  },
  {
    title: "WEDNESDAY  (AC3)  trash was collected",
    state: { day: "Wednesday", kitchenBags: 0, bathroomBags: 0, garageBags: 0, cartBags: 2,
             cartLocation: "curb", pickupComplete: true, needsHuman: false },
    want: { cartLocation: "garage" },
    wantText: "cart back in the garage",
  },
  {
    title: "WEDNESDAY  (AC4)  truck has not come yet",
    state: { day: "Wednesday", kitchenBags: 0, bathroomBags: 0, garageBags: 0, cartBags: 2,
             cartLocation: "curb", pickupComplete: false, needsHuman: false },
    want: { cartLocation: "curb", needsHuman: true },
    wantText: "cart stays at the curb, needsHuman is true",
  },
];

function yn(v) { return v ? "yes" : "no "; }

// One picture of the house as a list of equal-width lines.
function draw(s) {
  const inGarage = s.cartLocation === "garage";
  const cart = `[cart: ${s.cartBags} bags]`;
  return [
    ".-----------------------.",
    "|  KITCHEN  | BATHROOM  |",
    `|  bags: ${s.kitchenBags}  |  bags: ${s.bathroomBags}  |`,
    "|-----------+-----------|",
    "|        GARAGE         |",
    `|  floor bags: ${s.garageBags}        |`,
    `|  ${inGarage ? cart.padEnd(21) : "(cart is out)        "}|`,
    "'-----------------------'",
    `  CURB: ${inGarage ? "_______________" : cart.padEnd(15)}  `,
    `  collected: ${yn(s.pickupComplete)}  needsHuman: ${yn(s.needsHuman)}`,
  ].map((line) => line.padEnd(33));
}

function sideBySide(left, right) {
  return left.map((l, i) => `${l}${i === 4 ? "  ===>  " : "        "}${right[i]}`.trimEnd());
}

let matched = 0;
for (const { title, state, want, wantText } of scenarios) {
  const result = runTrashRobot(state);
  const wrong = Object.entries(want)
    .filter(([key, value]) => result[key] !== value)
    .map(([key, value]) => `${key} is ${result[key]} (want ${value})`);
  if (wrong.length === 0) matched += 1;

  console.log(`[o_o]  ${title}`);
  console.log("");
  console.log("BEFORE the robot runs".padEnd(41) + "AFTER the robot runs");
  console.log(sideBySide(draw(state), draw(result)).join("\n"));
  console.log("");
  console.log(`  SPEC WANTS: ${wantText}`);
  console.log(wrong.length === 0
    ? "  RESULT:     ✔ matches the spec"
    : `  RESULT:     ✖ not yet: ${wrong.join(", ")}`);
  console.log("");
  console.log("=".repeat(70));
  console.log("");
}

console.log(`${matched} of ${scenarios.length} scenarios match the spec.`);
if (matched < scenarios.length) {
  console.log("npm test still passes, because the old test only checks the indoor bins.");
  console.log("That gap is what the new tests will catch.");
} else {
  console.log("The robot now does the whole job.");
}
console.log("");
