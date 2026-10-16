# Trash Robot

A fifteen-minute exercise. You will watch a coding agent turn a written spec into failing tests, accept those tests yourself, and then watch the agent make them pass.

```
   [o_o]   "I am the household robot."
   /|_|\   "My job: take out the trash."
    | |
```

The robot's first version empties the indoor bins and dumps the bags on the garage floor. The one existing test says that is fine. The spec says the bags should go in the cart, the cart should go to the curb, and the cart should come back the next day.

```
  WHAT THE TEST CHECKS         WHAT THE SPEC WANTS

  kitchen bin  --+             kitchen bin  --+
                 +--> garage                  +--> cart --> curb --> (next day) back home
  bathroom bin --+             bathroom bin --+
```

## Contents

1. [Get the code](#1-get-the-code)
2. [See the problem](#2-see-the-problem)
3. [Read the rules](#3-read-the-rules)
4. [Start Claude Code](#4-start-claude-code)
5. [Ask Claude to write the tests](#5-ask-claude-to-write-the-tests)
6. [Accept the tests](#6-accept-the-tests)
7. [Ask Claude to fix the code](#7-ask-claude-to-fix-the-code)
8. [Check the proof](#8-check-the-proof)

- [Start over](#start-over)
- [No Claude Code?](#no-claude-code)
- [Bonus: watch the guard rail](#bonus-watch-the-guard-rail)
- [Help](#help)

**You need:** Node.js 20 or newer, Git, and [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview). Open **two terminal windows** side by side. One is for Claude Code. The other is for typing the commands below. No `npm install` is needed.

---

## 1. Get the code

In your terminal:

```bash
git clone https://github.com/legertom/trash-robot-demo.git
cd trash-robot-demo
npm test
```

You should see:

```
✔ initial check: Tuesday indoor bins are empty (0.3ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 46
```

One test. It passes. The timing numbers will be different on your machine. The lines to look at are always **pass** and **fail**.

[Back to top](#contents)

---

## 2. See the problem

```bash
npm run scenario
```

This draws the house before and after the robot runs. The first picture is Tuesday:

```
BEFORE the robot runs                    AFTER the robot runs
.-----------------------.                .-----------------------.
|  KITCHEN  | BATHROOM  |                |  KITCHEN  | BATHROOM  |
|  bags: 1  |  bags: 1  |                |  bags: 0  |  bags: 0  |
|-----------+-----------|                |-----------+-----------|
|        GARAGE         |          ===>  |        GARAGE         |
|  floor bags: 0        |                |  floor bags: 2        |
|  [cart: 0 bags]       |                |  [cart: 0 bags]       |
'-----------------------'                '-----------------------'
  CURB: _______________                    CURB: _______________
```

The bins are empty, so the test passes. But look at the garage: two bags on the floor, cart never moved. In the two Wednesday pictures, nothing changes at all.

**The test passes. The job is not done.** That is the whole problem.

[Back to top](#contents)

---

## 3. Read the rules

Open [spec.md](spec.md). Section 3 has four rules. In plain words:

| Rule | Day | What should happen |
| --- | --- | --- |
| AC1 | Tuesday | Bags go in the cart. Cart goes to the curb. Garage floor stays clear. |
| AC2 | Tuesday | Same thing, even if the cart is already at the curb. |
| AC3 | Wednesday, trash collected | Cart comes back to the garage. |
| AC4 | Wednesday, truck has not come | Cart stays out. Robot sets `needsHuman` to `true` and asks a person. |

These four rules are the contract. Everything from here on is checked against them.

[Back to top](#contents)

---

## 4. Start Claude Code

In your **second** terminal window:

```bash
cd trash-robot-demo
claude
```

If it asks whether you trust this folder, say yes.

Now type this inside Claude Code and press Enter:

```
/hooks
```

You should see a hook called `protect-tests.js`. Press Escape to close.

```
   [o_o]  <-- the agent
    | |
  ======  <-- the guard rail: once you commit a test, the agent cannot edit it
```

[Back to top](#contents)

---

## 5. Ask Claude to write the tests

Copy this, paste it into Claude Code, and press Enter:

```
Read spec.md. Create tests/contract.test.js with one node:test test for each
acceptance criterion AC1–AC4. Check the observable result of each run.
Keep src/trashRobot.js unchanged.
```

Say yes when it asks to create the file. When it is done, go to your first terminal:

```bash
npm test
```

You should see **four failures** and one pass:

```
✖ AC1: ...
✖ AC2: ...
✖ AC3: ...
✖ AC4: ...
✔ initial check: Tuesday indoor bins are empty
ℹ tests 5
ℹ suites 0
ℹ pass 1
ℹ fail 4
```

Below that, Node prints the reason for each failure, for example `2 !== 0` with the message `the garage is clear`. The test names will depend on what Claude wrote.

```
   RED
  .----.
  | ✖✖ |   Four tests. Four failures.
  | ✖✖ |   Each one names something the robot does not do yet.
  '----'
```

This is good. The tests describe the goal. The code has not caught up.

[Back to top](#contents)

---

## 6. Accept the tests

**This step is yours, not the agent's.** Open `tests/contract.test.js` and read it. Does each test check what its rule in the table above says? If something looks wrong, tell Claude Code to fix it. The file is not locked yet.

When you are happy, lock it in:

```bash
git add tests/contract.test.js
git commit -m "test: accept trash robot criteria AC1-AC4"
```

```
  ======  <-- the guard rail is now up for this file
```

[Back to top](#contents)

---

## 7. Ask Claude to fix the code

Paste this into Claude Code:

```
Implement src/trashRobot.js so AC1–AC4 in spec.md pass.
Keep the committed tests unchanged. Run npm test and report the result.
```

Say yes when it asks to edit the file and run the tests. Then check for yourself:

```bash
npm test
npm run scenario
```

```
✔ AC1: ...
✔ AC2: ...
✔ AC3: ...
✔ AC4: ...
✔ initial check: Tuesday indoor bins are empty
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
```

```
   GREEN
  .----.
  | ✔✔ |   Same tests. All passing.
  | ✔✔ |   The code moved. The contract did not.
  '----'
```

The Tuesday picture now ends with the cart at the curb and a clear garage floor:

```
|        GARAGE         |          ===>  |        GARAGE         |
|  floor bags: 0        |                |  floor bags: 0        |
|  [cart: 0 bags]       |                |  (cart is out)        |
'-----------------------'                '-----------------------'
  CURB: _______________                    CURB: [cart: 2 bags]
```

[Back to top](#contents)

---

## 8. Check the proof

Three commands show what changed and who approved it:

```bash
git diff --stat -- tests/
```
Prints **nothing**. The tests you accepted in step 6 did not change.

```bash
git diff -- src/trashRobot.js
```
Shows the agent's change to the code, and only the code.

```bash
git log --oneline -3
```
Shows your test commit on top of the starting point. The code fix is not committed yet. That is on purpose: reviewing it and committing it is your second decision.

```
  spec  -->  tests (red)  -->  YOU accept  -->  code  -->  tests (green)  -->  YOU accept
```

If you want to keep the fix:

```bash
git add src/trashRobot.js
git commit -m "feat: complete trash robot weekly cycle"
```

[Back to top](#contents)

---

## Start over

One command puts everything back to the beginning:

```bash
npm run reset
```

This throws away every change and commit you made locally, so only run it when you are done. Then go back to [step 1](#1-get-the-code) (skip the clone).

[Back to top](#contents)

---

## No Claude Code?

You can still see the red and green stages. The finished answers are in the `solution/` folder.

```bash
npm run answer:tests
npm test
```
Four failures, like [step 5](#5-ask-claude-to-write-the-tests).

```bash
npm run answer:code
npm test
npm run scenario
```
All five pass, like [step 7](#7-ask-claude-to-fix-the-code).

Then `npm run reset` to clean up.

[Back to top](#contents)

---

## Bonus: watch the guard rail

After step 6, paste this into Claude Code:

```
Use your Edit tool to change the AC1 test in tests/contract.test.js so it
expects garageBags to equal 2.
```

The hook blocks it. Claude should tell you the file is a committed test and it cannot change it. To see the log:

```bash
cat .claude/gate-log.jsonl
```

The last line says `"decision":"block"`.

[Back to top](#contents)

---

## Help

- **`npm test` fails with `bad option: --test`.** Your Node is too old. Run `node --version`. You need 20 or newer.
- **`git commit` asks who you are.** Run `git config user.name "Your Name"` and `git config user.email "you@example.com"`, then try again.
- **`/hooks` shows nothing.** You started `claude` in the wrong folder. Type `/exit`, `cd trash-robot-demo`, and run `claude` again.
- **The agent changed `src/trashRobot.js` in step 5.** It should not have. Run `git restore src/trashRobot.js` and keep going.
- **Fewer than four tests fail in step 5.** A test is checking too little. Compare it with the table in [step 3](#3-read-the-rules) and ask Claude to fix it.
- **Something else is wrong.** Run `npm run reset` and start again.

[Back to top](#contents)
