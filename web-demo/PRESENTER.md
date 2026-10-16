# Trash Robot presentation guide

This is a scripted simulation for teaching. The app never runs the exercise, a shell, Git, tests, or an agent. All terminal text, Git output, and house outcomes are authored scene data. Keep the word **simulation** visible when screen sharing.

## Run

From `web-demo/`, install dependencies with `npm install`, then use `npm run dev` for rehearsal. Use `npm run build` and `npm run start` for a production run. The original Node exercise stays in the repository root.

## Controls

| Action | Control | Key |
| --- | --- | --- |
| Next scene | Next | Right arrow or N |
| Previous scene | Back | Left arrow or B |
| Pause or replay the paced reveal inside a scene | Pause / Play / Replay | Space |
| Restart from the beginning | Restart | R |
| Open scene map | Scenes | J |
| Full screen | Fullscreen | F |
| Optional guard rail beat | Scene map or final slide | G |

Scenes never advance on a timer. Only transcript lines and the house's before/after frames reveal automatically. The presenter controls each scene transition. The prediction, delayed pickup, test acceptance, and final implementation acceptance beats require an explicit action before Next works. The scene map is available for rehearsal and recovery.

## Five minute path

The editable timing estimates are in `story/timing.ts`; their current sum is about 5:08, including room discussion.

| Beat | Approx. time | Suggested narration |
| --- | ---: | --- |
| 1–3 · False pass | 0:54 | “Watch the robot collect each indoor bag. The test passes when both bins are empty. Predict where the bags go next. Here is the garage floor.” |
| 4–7 · Contract | 1:01 | “The written spec defines the whole weekly cycle. AC2 jumps to the next Tuesday: fresh indoor bags, an empty cart still at the curb. On a delayed Wednesday, the owner decides the follow-up.” |
| 8–10 · Agent writes tests | 0:46 | “The agent translates each rule into an observable check. Four failures are useful evidence.” |
| 11–12 · Accept tests | 0:34 | “I review these tests against the spec. Committing them fixes the contract before implementation.” |
| 13–15 · Change code | 0:49 | “Watch the destination change from garage floor to cart, then curb. Wednesday has two branches.” |
| 16–19 · Proof and acceptance | 1:04 | “Same five tests pass. No test diff; the code diff is visible. I review and accept the implementation.” |

Pause as long as the room needs at the prediction and human gates. The optional guard rail beat is outside the main path.

## Source alignment

- `../spec.md` is the source of truth for AC1–AC4 and the human gates.
- `../tests/initial.test.js` checks only that the indoor bins are empty.
- `../src/trashRobot.js` places the two bags on the garage floor.
- `../solution/answer-tests.js` and `../solution/answer-code.js` informed the authored acceptance checks and corrected outcomes.
- `story/fixtures.ts`, `story/transcripts.ts`, `story/scenes.ts`, and `story/timing.ts` hold the deterministic narrative data.

The displayed commit hashes, durations, agent activity, and terminal lines are illustrative. The owner's delayed-pickup choice records a follow-up only; it does not pretend collection has happened. The final simulated commit occurs after the owner's second acceptance; the original README leaves that commit optional for its live exercise.

The “week 2” label in AC2 is a story cue. AC2 still checks the spec's Tuesday starting state: fresh indoor bags and a cart already at the curb. The narration assumes the prior pickup emptied the cart and it was left outside; the acceptance test does not assert why it is there.
