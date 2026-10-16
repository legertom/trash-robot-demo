# Trash robot: from spec to failing test

This is a small software simulation for the live demo on slide 3 of the selected six-slide deck (the original deck's slide 4). It uses the same red-to-green pattern as the SSN-masking demo, with the trash robot story carried through the lecture.

The first program empties the kitchen and bathroom bins into the garage. Its original test passes because that test checks only the indoor bins. The revised `spec.md` describes the complete Tuesday and Wednesday cycle. New acceptance tests expose the gap, and the coding agent implements the revised behavior while the tests stay fixed.

**Requirements:** Node.js 20+ and Git. The project has no external packages.

## Two-minute rehearsal without an agent

Start on `main`:

```bash
npm test
npm run scenario
```

The original test passes, and the scenario shows `garageBags: 2`.

Move to the prebuilt acceptance-test checkpoint:

```bash
git switch demo-tests
npm test
```

The four new tests fail on the current behavior. Then show the implemented checkpoint:

```bash
git switch demo-done
npm test
git diff --stat demo-tests demo-done -- tests/
```

All tests pass. The final command has no output because the acceptance tests stayed fixed during implementation. To return to the start from a clean checkpoint, run `git switch main`.

## Live run with a coding agent

Use two panes: Claude Code in one, a regular terminal in the other. Begin on a clean `main` checkpoint.

1. Run `npm test` and `npm run scenario`. Show that the initial check passes while the result places both bags in the garage.
2. Show `spec.md`, especially AC1–AC4. Paste this into Claude Code:

   ```text
   Read spec.md. Create tests/contract.test.js with one node:test test for each
   acceptance criterion AC1–AC4. Check the observable result of each run.
   Keep src/trashRobot.js unchanged.
   ```

3. Run `npm test`. The new tests should fail on the garage destination and Wednesday behavior. Review the generated tests, then accept them yourself:

   ```bash
   git add tests/contract.test.js
   git commit -m "test: accept trash robot criteria AC1-AC4"
   ```

4. Paste this into Claude Code:

   ```text
   Implement src/trashRobot.js so AC1–AC4 in spec.md pass.
   Keep the committed tests unchanged. Run npm test and report the result.
   ```

5. Run `npm test`, `git diff --stat -- tests/`, and `git diff -- src/trashRobot.js`. The presenter reviews and commits the implementation.

## Backup

`demo-tests` contains accepted tests with the starting implementation. `demo-done` contains the completed implementation. `DEMO-OUTPUT.md` contains captured red and green results. These checkpoints let you show the teaching moment if live agent output takes longer than expected.

The checkout commands above assume a clean working tree. Check `git status --short` before switching. Keep live work in a separate rehearsal copy when you want to preserve it.

## What this demonstrates

- The spec defines the desired state for a complete weekly cycle.
- Tests are written from the spec and show the current gap through assertions.
- A person accepts the tests before the agent implements the change.
- The accepted tests, test output, code diff, and Git history form a reviewable record.

This is a state simulation. It makes no claim about physical robot sensors or real-world pickup timing. The local Claude Code hook protects committed tests through its direct edit tools; an enterprise implementation would also enforce that rule in code review and CI.
