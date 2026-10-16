import { test } from "node:test";
import assert from "node:assert/strict";
import { runTrashRobot } from "../src/trashRobot.js";

function state(overrides = {}) {
  return {
    day: "Tuesday",
    kitchenBags: 1,
    bathroomBags: 1,
    garageBags: 0,
    cartBags: 0,
    cartLocation: "garage",
    pickupComplete: false,
    needsHuman: false,
    ...overrides,
  };
}

test("AC1: Tuesday moves both indoor bags into the cart at the curb", () => {
  const before = state();
  const after = runTrashRobot(before);

  assert.equal(after.kitchenBags, 0);
  assert.equal(after.bathroomBags, 0);
  assert.equal(after.garageBags, 0, "the garage is clear");
  assert.equal(after.cartBags, 2, "the outdoor cart holds both bags");
  assert.equal(after.cartLocation, "curb");
  assert.deepEqual(before, state(), "input state stays unchanged");
});

test("AC2: Tuesday works when the cart starts at the curb", () => {
  const after = runTrashRobot(state({ cartLocation: "curb" }));

  assert.equal(after.kitchenBags, 0);
  assert.equal(after.bathroomBags, 0);
  assert.equal(after.garageBags, 0, "the garage is clear");
  assert.equal(after.cartBags, 2, "the outdoor cart holds both bags");
  assert.equal(after.cartLocation, "curb");
});

test("AC3: Wednesday after collection returns the cart to the garage", () => {
  const after = runTrashRobot(state({
    day: "Wednesday",
    kitchenBags: 0,
    bathroomBags: 0,
    cartLocation: "curb",
    pickupComplete: true,
  }));

  assert.equal(after.cartLocation, "garage", "the cart returns after collection");
  assert.equal(after.needsHuman, false);
});

test("AC4: Wednesday delay keeps the cart at the curb for a human decision", () => {
  const after = runTrashRobot(state({
    day: "Wednesday",
    kitchenBags: 0,
    bathroomBags: 0,
    cartLocation: "curb",
    pickupComplete: false,
  }));

  assert.equal(after.cartLocation, "curb");
  assert.equal(after.needsHuman, true, "a delayed pickup goes to the owner");
});
