# Demo agent instructions

Read `spec.md` before writing tests or implementation. The person running the demo reviews and commits the acceptance tests before implementation. The steps they follow are in `README.md`.

- Create `tests/contract.test.js` when asked to generate tests from AC1–AC4. Do not change `src/trashRobot.js` during that step.
- Treat committed files under `tests/` as accepted tests. If a committed test needs correction, explain the issue so a human can revise the spec and test. Do not work around the edit hook with shell commands.
- Implement the behavior in `src/trashRobot.js` without adding packages or changing the accepted tests.
- Run `npm test` after implementation and report the results.
- Leave commits to the person running the demo.
