# Presenter notes: trash robot demo

**Aim:** about five minutes live. Show the move from a narrow check to acceptance tests that cover the full job, with a human accepting the tests before the agent implements.

**Rule for the live run:** follow `README.md` step by step, exactly as a student would at home. The notes below only add timing and spoken lines to those steps. If something in the README does not work for you, fix the README, not your memory.

## Before the session

- Clone a fresh copy and run README Steps 1 and 2 to confirm the toolchain works on this machine.
- Run the "Walkthrough without Claude Code" section once so the checkpoint branches are fetched and you have seen the red and green output.
- Run README Steps 4 through 11 once end to end with Claude Code, then run the "Running it again" section to reset.
- Open `spec.md` in your editor and make the text large enough to read on a video call.
- Arrange two terminal windows side by side: Claude Code on one side, the shell on the other.
- Keep `DEMO-OUTPUT.md` open in a tab in case the agent is slow.

## Timing against the README steps

| README step | Time | What to say |
| --- | --- | --- |
| 1 and 2 | 45 s | "In my house, I am the household robot. The first instruction was to empty the kitchen and bathroom bins. The test passes. Look at the scenario: the bags are on the garage floor and the cart never moved. The test checked the wrong thing." |
| 3 | 30 s | "Here is the revised contract. Four criteria. Tuesday: bags to the cart, cart to the curb, even if the cart is already out. Wednesday: bring it back after pickup, or ask me if pickup is late." |
| 4 | 15 s | "One guard rail: once I commit a test, the agent cannot edit it." Show `/hooks`. |
| 5 and 6 | 90 s | Paste the first prompt. While the agent works: "The agent reads the spec and writes one test per criterion. It does not touch the program." Run `npm test`. "Four failures, and each one names an outcome we do not produce yet." |
| 7 | 30 s | Skim the test file. "This is the human step. I read these and decide they are the contract." Commit. |
| 8 and 9 | 60 s | Paste the second prompt. Run `npm test`. "Same tests, now passing. The program moved. The contract did not." |
| 10 | 30 s | `git diff --stat -- tests/` prints nothing. `git diff -- src/trashRobot.js`. `git log --oneline -3`. "We can see what changed, what did not, and who accepted each stage." |

Skip Steps 11 and 12 unless there is time. Step 12 is a good closer if the audience asks what stops the agent from changing a test.

## If the agent is slow

Switch to `DEMO-OUTPUT.md` and talk through the captured red and green output. If you have a clean rehearsal copy, `git switch demo-tests` shows the failing tests live and `git switch demo-done` shows them passing.

## If the panel presses on realism

"This is a small state simulation so the result is easy to read on screen. The same structure applies to any code change: accepted requirements, tests tied to those requirements, a human decision, and a stored record. A real robot would need sensors and handling for physical failures. For a company, protected branches and CI would reinforce the local edit hook."

## Maintaining the checkpoint branches

`demo-tests` and `demo-done` are plain branches, one commit each, built on top of `main`. When `main` changes (for example, after editing this guide or the scenario script), rebuild them so every branch carries the same README:

```bash
git switch main
git pull
git branch -D demo-tests demo-done 2>/dev/null

git switch -c demo-tests
git checkout origin/demo-done -- tests/contract.test.js
git commit -m "test: accept trash robot criteria AC1-AC4"

git switch -c demo-done
git checkout origin/demo-done -- src/trashRobot.js
git commit -m "feat: complete trash robot weekly cycle"
npm test

git switch main
git push --force origin demo-tests demo-done
```

The two `git checkout origin/demo-done -- <file>` lines copy the accepted test file and the finished implementation from the previous `demo-done`. Run `npm test` on `demo-done` before pushing to confirm all five tests still pass.
