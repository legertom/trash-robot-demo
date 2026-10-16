# Presenter notes: trash robot demo

**Aim:** about five minutes. Show the move from a narrow check to acceptance tests that cover the full task. Keep the Wednesday return as the second beat of the same story.

## Before the interview

- Open this repository on the `main` checkpoint and run `npm test`.
- Open `spec.md` in your editor and make the text large enough to read on a video call.
- Open Claude Code in this folder and confirm the edit hook is loaded with `/hooks`.
- Keep a regular terminal beside it for `npm test` and Git commands.
- Rehearse `demo-tests`, `demo-done`, and `DEMO-OUTPUT.md` as backups.

## Spoken flow

### 1. Start with the household story (45 seconds)

“In my house, I am the household robot. The first instruction was to empty the kitchen and bathroom bins. Here is a tiny simulation of that routine. The original check passes. When we inspect the full result, both bags are in the garage. That tells us exactly what to add to our contract.”

Run `npm test`, then `npm run scenario`. Point to `garageBags: 2`.

### 2. Show the revised contract (45 seconds)

Open `spec.md` and point to AC1–AC4. “On Tuesday, the bags reach the outdoor cart and the cart reaches the curb. The robot also works when the cart starts at the curb. On Wednesday, it returns the cart after pickup, or asks a person to decide when collection is delayed.”

### 3. Let the agent write the tests (90 seconds)

Use the test-generation prompt in `README.md`, then run `npm test`. “These failures are useful: the assertions show which observable outcomes the current program has yet to meet.” Review the generated tests. Commit them yourself as the human acceptance step.

### 4. Let the agent implement (90 seconds)

Use the implementation prompt in `README.md`, then run `npm test`. “The same accepted tests now pass. The implementation changed; the contract stayed fixed.”

### 5. Show the evidence (45 seconds)

Run `git diff --stat -- tests/`, `git diff -- src/trashRobot.js`, and `git log --oneline -3`. “We can inspect the criteria, the test result, the code change, and who accepted each stage.”

## If the agent takes time

Use `DEMO-OUTPUT.md` immediately. In a clean rehearsal copy, `git switch demo-tests` shows the failing acceptance tests and `git switch demo-done` shows the passing version.

## If the panel presses on realism

“This is a small state simulation so the test result is easy to read on screen. In a real workflow, the same structure applies to a code change: accepted requirements, tests tied to those requirements, a human decision, and a stored record. A real robot would need sensors and handling for physical failures. For a company, protected branches and CI would reinforce the local edit hook.”
