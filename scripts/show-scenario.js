// Draws the house before and after the robot runs, for three situations
// from spec.md. Run with: npm run scenario

import { runTrashRobot } from "../src/trashRobot.js";

const scenarios = [
  {
    title: "TUESDAY  (AC1)  take the trash out",
    state: { day: "Tuesday", kitchenBags: 1, bathroomBags: 1, garageBags: 0, cartBags: 0,
             cartLocation: "garage", pickupComplete: false, needsHuman: false },
  },
  {
    title: "WEDNESDAY  (AC3)  trash was collected",
    state: { day: "Wednesday", kitchenBags: 0, bathroomBags: 0, garageBags: 0, cartBags: 2,
             cartLocation: "curb", pickupComplete: true, needsHuman: false },
  },
  {
    title: "WEDNESDAY  (AC4)  truck has not come yet",
    state: { day: "Wednesday", kitchenBags: 0, bathroomBags: 0, garageBags: 0, cartBags: 2,
             cartLocation: "curb", pickupComplete: false, needsHuman: false },
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

for (const { title, state } of scenarios) {
  const result = runTrashRobot(state);
  console.log(`[o_o]  ${title}`);
  console.log("");
  console.log("BEFORE the robot runs".padEnd(41) + "AFTER the robot runs");
  console.log(sideBySide(draw(state), draw(result)).join("\n"));
  console.log("");
}
