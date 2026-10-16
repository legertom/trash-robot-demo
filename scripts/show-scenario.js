import { runTrashRobot } from "../src/trashRobot.js";

const tuesday = {
  day: "Tuesday",
  kitchenBags: 1,
  bathroomBags: 1,
  garageBags: 0,
  cartBags: 0,
  cartLocation: "garage",
  pickupComplete: false,
  needsHuman: false,
};

console.log("Tuesday starting state:", tuesday);
console.log("Tuesday result:", runTrashRobot(tuesday));
