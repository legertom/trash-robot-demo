/**
 * Simulate one scheduled run of the household trash robot.
 * Contract: spec.md (AC1–AC4).
 *
 * This first version reflects the initial, incomplete check: it empties the
 * indoor bins into the garage. The expanded acceptance tests will expose the
 * missing destination and Wednesday return behavior.
 */
export function runTrashRobot(state) {
  if (state.day === "Tuesday") {
    return {
      ...state,
      kitchenBags: 0,
      bathroomBags: 0,
      garageBags: state.garageBags + state.kitchenBags + state.bathroomBags,
    };
  }

  return { ...state };
}
