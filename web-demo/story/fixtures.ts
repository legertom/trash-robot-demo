export type HouseState = {
  day: "Tuesday" | "Wednesday";
  kitchenBags: number;
  bathroomBags: number;
  garageBags: number;
  cartBags: number;
  cartLocation: "garage" | "curb";
  pickupComplete: boolean;
  needsHuman: boolean;
};

const tuesday: HouseState = {
  day: "Tuesday", kitchenBags: 1, bathroomBags: 1, garageBags: 0,
  cartBags: 0, cartLocation: "garage", pickupComplete: false, needsHuman: false,
};

export const fixtures: Record<string, HouseState> = {
  before: tuesday,
  misleading: { ...tuesday, kitchenBags: 0, bathroomBags: 0, garageBags: 2 },
  loaded: { ...tuesday, kitchenBags: 0, bathroomBags: 0, cartBags: 2 },
  failingAc2: { ...tuesday, kitchenBags: 0, bathroomBags: 0, garageBags: 2, cartLocation: "curb" },
  ac1: { ...tuesday, kitchenBags: 0, bathroomBags: 0, cartBags: 2, cartLocation: "curb" },
  curbBefore: { ...tuesday, cartLocation: "curb" },
  ac2: { ...tuesday, kitchenBags: 0, bathroomBags: 0, cartBags: 2, cartLocation: "curb" },
  collectedBefore: { ...tuesday, day: "Wednesday", kitchenBags: 0, bathroomBags: 0, cartBags: 0, cartLocation: "curb", pickupComplete: true },
  ac3: { ...tuesday, day: "Wednesday", kitchenBags: 0, bathroomBags: 0, cartBags: 0, cartLocation: "garage", pickupComplete: true },
  delayedBefore: { ...tuesday, day: "Wednesday", kitchenBags: 0, bathroomBags: 0, cartBags: 2, cartLocation: "curb" },
  ac4: { ...tuesday, day: "Wednesday", kitchenBags: 0, bathroomBags: 0, cartBags: 2, cartLocation: "curb", needsHuman: true },
};

export const criteria = [
  { id: "AC1", title: "Normal Tuesday", short: "Both bags in cart · cart at curb · clear garage", test: "Asserts bins 0 · garage 0 · cart 2 · curb", evidence: "Two bags reach the cart; none touch the garage floor.", fixture: "ac1" },
  { id: "AC2", title: "Cart already out", short: "Same result when cart starts at curb", test: "Asserts bins 0 · garage 0 · cart 2 · curb", evidence: "The starting cart location changes; the result does not.", fixture: "ac2" },
  { id: "AC3", title: "Wednesday collected", short: "Return cart to garage", test: "Asserts cart at garage · needsHuman false", evidence: "Pickup is confirmed, so the empty cart returns.", fixture: "ac3" },
  { id: "AC4", title: "Wednesday delayed", short: "Keep cart out · needsHuman = true", test: "Asserts cart at curb · needsHuman true", evidence: "No pickup confirmation; the owner must decide.", fixture: "ac4" },
] as const;
