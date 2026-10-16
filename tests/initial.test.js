import { test } from "node:test";
import assert from "node:assert/strict";
import { runTrashRobot } from "../src/trashRobot.js";

test("initial check: Tuesday indoor bins are empty", () => {
  const result = runTrashRobot({
    day: "Tuesday",
    kitchenBags: 1,
    bathroomBags: 1,
    garageBags: 0,
    cartBags: 0,
    cartLocation: "garage",
    pickupComplete: false,
    needsHuman: false,
  });

  assert.equal(result.kitchenBags, 0);
  assert.equal(result.bathroomBags, 0);
});
