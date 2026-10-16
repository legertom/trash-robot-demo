// Prints what the robot does in three situations from spec.md, so you can
// compare the current behavior with the acceptance criteria by eye.
// Run with: npm run scenario

import { runTrashRobot } from "../src/trashRobot.js";

const scenarios = [
  {
    title: "Tuesday: one bag in the kitchen, one in the bathroom, cart in the garage (AC1)",
    state: {
      day: "Tuesday",
      kitchenBags: 1,
      bathroomBags: 1,
      garageBags: 0,
      cartBags: 0,
      cartLocation: "garage",
      pickupComplete: false,
      needsHuman: false,
    },
  },
  {
    title: "Wednesday: collection is complete, cart is at the curb (AC3)",
    state: {
      day: "Wednesday",
      kitchenBags: 0,
      bathroomBags: 0,
      garageBags: 0,
      cartBags: 2,
      cartLocation: "curb",
      pickupComplete: true,
      needsHuman: false,
    },
  },
  {
    title: "Wednesday: collection is delayed, cart is at the curb (AC4)",
    state: {
      day: "Wednesday",
      kitchenBags: 0,
      bathroomBags: 0,
      garageBags: 0,
      cartBags: 2,
      cartLocation: "curb",
      pickupComplete: false,
      needsHuman: false,
    },
  },
];

function describe(state) {
  return [
    `kitchenBags=${state.kitchenBags}`,
    `bathroomBags=${state.bathroomBags}`,
    `garageBags=${state.garageBags}`,
    `cartBags=${state.cartBags}`,
    `cartLocation=${state.cartLocation}`,
    `pickupComplete=${state.pickupComplete}`,
    `needsHuman=${state.needsHuman}`,
  ].join("  ");
}

for (const { title, state } of scenarios) {
  const result = runTrashRobot(state);
  console.log(title);
  console.log(`  before: ${describe(state)}`);
  console.log(`  after:  ${describe(result)}`);
  console.log("");
}
