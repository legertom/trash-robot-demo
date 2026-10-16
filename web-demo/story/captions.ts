// Per-frame narration stays with the authored story, not with the view.
export const houseCaptions: Record<string, string[]> = {
  pass: ["The house before the run", "Robot reaches the kitchen bin", "Kitchen bag in hand", "Robot reaches the bathroom bin", "Both bins empty · two bags in hand", "Test passes · destination still unknown"],
  ac1: ["Starting state · two indoor bags", "Kitchen bag in hand", "Both bins empty · two bags in hand", "Bags loaded into the garage cart", "Cart at curb · garage clear"],
  ac2: ["Fresh bags · empty cart already at curb", "Kitchen bag in hand", "Both bins empty · two bags in hand", "Robot carries bags to curbside cart", "Both bags in curbside cart · garage clear"],
  ac3: ["Pickup confirmed · empty cart at curb", "Robot reaches the collected cart", "Empty cart returned to garage"],
  ac4: ["Pickup pending · two bags still at curb", "Cart stays out · owner decision needed"],
  route: ["Route begins", "Robot reaches the kitchen bin", "Kitchen bag in hand", "Robot reaches the bathroom bin", "Both bags in hand", "Bags loaded in cart", "Cart at curb · garage clear"],
};

export const failureHouse: Record<string, { fixture: string; focus: string; text: string }> = {
  AC1: { fixture: "misleading", focus: "garage", text: "Two bags on the garage floor" },
  AC2: { fixture: "failingAc2", focus: "cart", text: "Cart at curb, still empty" },
  AC3: { fixture: "collectedBefore", focus: "return", text: "Collected cart still at curb" },
  AC4: { fixture: "delayedBefore", focus: "human", text: "No owner signal after delay" },
};
