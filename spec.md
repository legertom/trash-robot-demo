# Trash robot: weekly collection cycle

This is a software simulation of the robot's decision logic. The person running the demo plays the household owner and accepts the criteria before implementation.

## 1. Intent

Each Tuesday, move household trash from the kitchen and bathroom into the outdoor cart and put the cart at the curb. After collection on Wednesday, return the cart to the garage so the cycle is ready for the next week.

## 2. Constraints

- Implement one pure function, `runTrashRobot(state)`, in `src/trashRobot.js`. It returns a new state and leaves the input unchanged.
- The simulation tracks bag counts in the kitchen, bathroom, garage, and outdoor cart; the cart's location; whether collection has occurred; and whether a human decision is needed.
- The cart may begin Tuesday in the garage or at the curb. A delayed Wednesday collection goes to the household owner for a decision.
- Use Node's built-in test runner. No network calls, hardware integration, or added packages.

## 3. Acceptance criteria

- **AC1 — Normal Tuesday:** With one bag in each indoor bin and the outdoor cart in the garage, the result has empty indoor bins, two bags in the cart, a clear garage, and the cart at the curb.
- **AC2 — Cart already at the curb:** With the cart already at the curb on Tuesday, the result still has empty indoor bins, all bags in the cart, and a clear garage.
- **AC3 — Wednesday after collection:** Once collection is confirmed, the cart returns from the curb to the garage.
- **AC4 — Wednesday delay:** While collection is pending, the cart stays at the curb and `needsHuman` is `true`.

## 4. Verification

Run `npm test`. The tests check the observable state described in AC1–AC4 and return a failing exit code when a criterion is unmet.

## 5. Human gates

- The household owner reviews and commits tests generated from AC1–AC4 before implementation begins (README Step 7).
- The household owner decides the next step when collection is delayed.
- The household owner reviews the final code change and test results before accepting it (README Step 11).

## 6. Evidence

- Git history records the accepted spec, the accepted tests, and the implementation in order.
- `npm test` records the result of each acceptance check.
- The test diff between the test and implementation commits shows that the accepted tests stayed fixed during implementation.
- The Claude Code edit hook logs its allow and block decisions in `.claude/gate-log.jsonl` during a live run.
