// Poses belong to the authored animation, while fixtures hold the house state.
export type RobotCue = {
  x: number;
  y: number;
  carrying: number;
  oneBagSide?: "left" | "right";
  pickupAt?: "kitchen" | "bathroom";
};

export const robotCues: Record<string, RobotCue> = {
  pickupKitchen: { x: 315, y: 260, carrying: 0 },
  kitchenPicked: { x: 315, y: 260, carrying: 1, oneBagSide: "right", pickupAt: "kitchen" },
  pickupBathroom: { x: 470, y: 260, carrying: 1 },
  bathroomPicked: { x: 440, y: 260, carrying: 2, pickupAt: "bathroom" },
  carrying: { x: 470, y: 395, carrying: 2 },
};
