/**
 * Simulate one scheduled run of the household trash robot.
 * Contract: spec.md (AC1–AC4).
 *
 * The Tuesday run moves indoor bags into the outdoor cart and places the cart
 * at the curb. The Wednesday run returns the cart after collection or asks the
 * household owner to decide what to do when collection is delayed.
 */
export function runTrashRobot(state) {
  if (state.day === "Tuesday") {
    if (state.cartLocation !== "garage" && state.cartLocation !== "curb") {
      return { ...state, needsHuman: true };
    }

    return {
      ...state,
      kitchenBags: 0,
      bathroomBags: 0,
      cartBags: state.cartBags + state.kitchenBags + state.bathroomBags,
      cartLocation: "curb",
      needsHuman: false,
    };
  }

  if (state.day === "Wednesday") {
    if (state.pickupComplete && state.cartLocation === "curb") {
      return { ...state, cartLocation: "garage", needsHuman: false };
    }
    return { ...state, needsHuman: true };
  }

  return { ...state };
}
