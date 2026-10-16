# Trash robot: from spec to failing test to passing code

This is a small, self-contained exercise you can run at home in about fifteen minutes. You will take a tiny program with one passing test, write a spec that describes what the program should really do, have a coding agent turn that spec into tests that fail, accept those tests yourself, and then have the agent make them pass without touching the tests.

The program simulates a household robot that takes out the trash. The first version empties the kitchen and bathroom bins into the garage and stops there. The spec says the bags should reach the outdoor cart, the cart should reach the curb on Tuesday, and the cart should come back on Wednesday after collection.

Follow the steps in order. Each step shows the command to run and what you should see.

## What you need

- **Node.js 20 or newer.** Check with `node --version`. Install from https://nodejs.org if needed.
- **Git.** Check with `git --version`.
- **Claude Code**, installed and signed in. Check with `claude --version`. Install instructions: https://docs.anthropic.com/en/docs/claude-code/overview
- **A terminal.** The commands below assume macOS Terminal, Linux, Git Bash on Windows, or WSL.
- **Two terminal windows** side by side. One runs Claude Code. The other runs the commands in this guide. The guide calls them **Claude Code** and **the shell**.

No `npm install` is needed. The project uses only Node's built-in test runner.

## Files in this repository

| File | What it is |
| --- | --- |
| `spec.md` | The contract. Section 3 lists acceptance criteria AC1 to AC4. |
| `src/trashRobot.js` | The program. One function, `runTrashRobot(state)`. |
| `tests/initial.test.js` | The original, narrow test. It only checks the indoor bins. |
| `scripts/show-scenario.js` | Prints what the robot does in three situations so you can see the gap. |
| `CLAUDE.md` | Instructions the coding agent reads automatically when it starts in this folder. |
| `.claude/settings.json` and `.claude/hooks/protect-tests.js` | A hook that blocks the agent from editing any test file that has been committed. |
| `PRESENTER.md` | Timing and talking points for running this as a live demo. |
| `DEMO-OUTPUT.md` | Captured output from each stage, for reference. |

## Step 1: Get the code and confirm it runs

In the shell:

```bash
git clone https://github.com/legertom/trash-robot-demo.git
cd trash-robot-demo
node --version
npm test
```

You should see a Node version of v20 or higher, then:

```text
✔ initial check: Tuesday indoor bins are empty
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
```

The one existing test passes. Keep this shell open in the `trash-robot-demo` folder for the rest of the guide.

## Step 2: See the gap between the test and the real job

In the shell:

```bash
npm run scenario
```

You should see three scenarios. The first one looks like this:

```text
Tuesday: one bag in the kitchen, one in the bathroom, cart in the garage (AC1)
  before: kitchenBags=1  bathroomBags=1  garageBags=0  cartBags=0  cartLocation=garage  ...
  after:  kitchenBags=0  bathroomBags=0  garageBags=2  cartBags=0  cartLocation=garage  ...
```

Look at the `after` line. The indoor bins are empty, which is all the existing test checks. But `garageBags=2` and `cartLocation=garage`. The bags went to the garage floor and the cart never moved. In the two Wednesday scenarios, nothing changes at all between `before` and `after`.

This is the point of the exercise. The test passes, and the job is not done.

## Step 3: Read the contract

Open `spec.md` in any editor and read section 3, the acceptance criteria:

- **AC1.** Normal Tuesday: indoor bins empty, two bags in the cart, garage clear, cart at the curb.
- **AC2.** Tuesday with the cart already at the curb: same outcome.
- **AC3.** Wednesday after collection: the cart returns to the garage.
- **AC4.** Wednesday with collection delayed: the cart stays at the curb and `needsHuman` is `true`.

These four sentences are the whole contract. Everything that follows is checked against them.

## Step 4: Start Claude Code and confirm the guard rail is loaded

In the second terminal window, go to the same folder and start Claude Code:

```bash
cd trash-robot-demo
claude
```

If Claude Code asks whether you trust this folder, say yes.

Then type this inside Claude Code and press Enter:

```text
/hooks
```

You should see a `PreToolUse` hook matching `Edit|Write|MultiEdit` that runs `.claude/hooks/protect-tests.js`. Press Escape to close the menu.

This hook is the guard rail. Once a test file is committed to Git, the hook blocks the agent from editing it. The agent can still create new test files. You will see it in action later.

## Step 5: Ask the agent to write the acceptance tests

Paste this into Claude Code exactly as written and press Enter:

```text
Read spec.md. Create tests/contract.test.js with one node:test test for each
acceptance criterion AC1–AC4. Check the observable result of each run.
Keep src/trashRobot.js unchanged.
```

When Claude Code asks for permission to create the file, approve it. It may also ask to run `npm test`. That is fine too.

When it finishes, go to the shell and confirm only one new file appeared:

```bash
git status --short
```

You should see exactly:

```text
?? tests/contract.test.js
```

If `src/trashRobot.js` is also listed as modified, the agent changed the program when it should not have. Put it back with `git restore src/trashRobot.js` and continue.

## Step 6: Run the new tests and watch them fail

In the shell:

```bash
npm test
```

You should see four failures and one pass:

```text
✖ AC1: Tuesday moves both indoor bags into the cart at the curb
✖ AC2: Tuesday works when the cart starts at the curb
✖ AC3: Wednesday after collection returns the cart to the garage
✖ AC4: Wednesday delay keeps the cart at the curb for a human decision
✔ initial check: Tuesday indoor bins are empty
ℹ tests 5
ℹ suites 0
ℹ pass 1
ℹ fail 4
```

Below the summary, Node prints the reason for each failure. For AC1 you should see something like:

```text
AssertionError [ERR_ASSERTION]: the garage is clear
2 !== 0
```

The test names will differ a little depending on what the agent wrote, but there should be exactly four new tests, and all four should fail. Each failure names an observable outcome that the current program does not produce.

If fewer than four fail, open `tests/contract.test.js` and compare each test with its criterion in `spec.md`. A test that passes against the current program is checking too little.

## Step 7: Review the tests and accept them

This step is yours, not the agent's. Open `tests/contract.test.js` and check each test against its criterion:

- Does AC1 check `garageBags` is 0, `cartBags` is 2, and `cartLocation` is `"curb"`?
- Does AC2 start with `cartLocation: "curb"` and check the same outcome?
- Does AC3 start on Wednesday with `pickupComplete: true` and check the cart returns to `"garage"`?
- Does AC4 start on Wednesday with `pickupComplete: false` and check `needsHuman` is `true`?

If something is wrong, tell Claude Code what to fix. The file is not committed yet, so the agent can still edit it.

When you are satisfied, commit the tests in the shell:

```bash
git add tests/contract.test.js
git commit -m "test: accept trash robot criteria AC1-AC4"
```

This commit is the acceptance step. From now on the hook treats this file as locked.

## Step 8: Ask the agent to make the tests pass

Paste this into Claude Code and press Enter:

```text
Implement src/trashRobot.js so AC1–AC4 in spec.md pass.
Keep the committed tests unchanged. Run npm test and report the result.
```

Approve the edit to `src/trashRobot.js` and the `npm test` run when asked. The agent should report that all five tests pass.

## Step 9: Confirm the result yourself

In the shell:

```bash
npm test
```

You should see:

```text
✔ AC1: Tuesday moves both indoor bags into the cart at the curb
✔ AC2: Tuesday works when the cart starts at the curb
✔ AC3: Wednesday after collection returns the cart to the garage
✔ AC4: Wednesday delay keeps the cart at the curb for a human decision
✔ initial check: Tuesday indoor bins are empty
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
```

Then run the scenarios again:

```bash
npm run scenario
```

Now the Tuesday `after` line shows `garageBags=0  cartBags=2  cartLocation=curb`. The first Wednesday scenario ends with `cartLocation=garage`. The second ends with `needsHuman=true`.

## Step 10: Look at the evidence

Three commands show what changed and who approved it. In the shell:

```bash
git diff --stat -- tests/
```

This prints nothing. The tests you committed in Step 7 are byte-for-byte unchanged.

```bash
git diff -- src/trashRobot.js
```

This shows the agent's change to the program, and nothing else.

```bash
git log --oneline -3
```

This shows your test commit on top of the starting point. The implementation is not committed yet. That is deliberate: reviewing and committing it is the second human decision.

If the agent used its own editing tools, the hook also kept a log. Each line records a file the agent touched and whether the hook allowed it:

```bash
cat .claude/gate-log.jsonl
```

You will see `"decision":"allow"` for the new test file and for `src/trashRobot.js`. This file may be missing if the agent wrote files through shell commands instead of its editor tools, which the hook does not intercept.

## Step 11: Accept the implementation

Read the diff from Step 10. If it does what the spec says and nothing more, commit it:

```bash
git add src/trashRobot.js
git commit -m "feat: complete trash robot weekly cycle"
```

The history now reads, in order: the spec, the accepted tests, the implementation. The tests never changed between the last two commits.

## Step 12 (optional): Watch the guard rail block an edit

Paste this into Claude Code:

```text
Use your Edit tool to change the AC1 test in tests/contract.test.js so it
expects garageBags to equal 2.
```

The hook blocks the edit. Claude Code should tell you the file is a committed test and that it cannot change it. Then in the shell:

```bash
tail -n 1 .claude/gate-log.jsonl
```

The last line shows `"decision":"block"` with the reason `committed test file: accepted contract`.

If the agent instead changes the file through a shell command, the hook did not see it. Undo with `git restore tests/contract.test.js`. The local hook only covers the agent's editor tools. In a real project, a protected branch and a CI check would catch the rest.

## Running it again

To return to the starting point and run the exercise a second time:

```bash
git reset --hard origin/main
git clean -fd
rm -f .claude/gate-log.jsonl
```

This discards every local change and commit, including the ones you made above. Then start again from Step 1 (you can skip the clone).

## Walkthrough without Claude Code

If you do not have Claude Code, or you want to see the red and green stages before the live run, the repository has two prebuilt checkpoints as branches. Start from a clean tree (run `git status --short` and confirm it prints nothing).

```bash
git switch demo-tests
npm test
```

This branch has the accepted tests and the original program. Four tests fail, as in Step 6.

```bash
git switch demo-done
npm test
npm run scenario
git diff --stat demo-tests demo-done -- tests/
```

This branch has the completed program. All five tests pass, the scenarios show the cart at the curb and back, and the last command prints nothing because the tests are identical on both branches.

```bash
git switch main
```

That returns you to the starting point.

## Troubleshooting

- **`npm test` says `node: bad option: --test`.** Your Node is older than 20. Upgrade and try again.
- **`git commit` complains that your identity is unknown.** Run `git config user.name "Your Name"` and `git config user.email "you@example.com"`, then commit again.
- **`/hooks` shows nothing.** Make sure you started `claude` inside the `trash-robot-demo` folder, not its parent. Quit with `/exit` and start again from the right folder.
- **The agent wrote the tests but changed `src/trashRobot.js` too.** Run `git restore src/trashRobot.js` and continue from Step 6.
- **The agent wrote the tests somewhere other than `tests/contract.test.js`.** Ask it to move the file there. The test runner only picks up files that end in `.test.js`.
- **`git switch` refuses because of local changes.** You have uncommitted work. Either commit it or follow the "Running it again" section first.

## What this demonstrates

- A spec written as observable outcomes can be turned into tests mechanically.
- Tests written from the spec fail against the current program, and each failure names a specific gap.
- A person reads and accepts the tests before any implementation starts.
- Once accepted, the tests are fixed. The implementation moves until the tests pass.
- Git history, the test output, the diff, and the hook log form a record that anyone can inspect afterwards.

This is a state simulation, not a robot. It says nothing about sensors or real-world timing. The local hook protects committed tests from the agent's editor tools. A real team would also enforce that rule with protected branches and CI.
