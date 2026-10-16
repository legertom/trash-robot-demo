# Presenter notes

**Rule:** run the demo by following `README.md` step by step, the same way a student would. These notes only add timing and what to say.

## Before class

- `npm run reset`, then do README steps 1 through 8 once with Claude Code to make sure it all works on this machine.
- `npm run reset` again so you start clean.
- Open `spec.md` in your editor with big text.
- Two terminal windows side by side: Claude Code on one side, commands on the other.

## Timing and what to say (about five minutes)

| README step | Time | Say |
| --- | --- | --- |
| 1 and 2 | 45 s | "I am the household robot. First instruction: empty the bins. Test passes. Now look at the house: bags on the garage floor, cart never moved. The test checked the wrong thing." |
| 3 | 30 s | "Four rules. Tuesday: bags in the cart, cart to the curb. Wednesday: bring it back, or ask me if the truck is late." |
| 4 | 15 s | "One guard rail: once I commit a test, the agent cannot edit it." |
| 5 | 90 s | Paste the prompt. While it works: "The agent writes one test per rule. It does not touch the code." Run `npm test`. "Four failures. Each one names something the robot does not do yet." |
| 6 | 30 s | Skim the file. "This is the human step. I read these and decide they are the contract." Commit. |
| 7 | 60 s | Paste the prompt. Run `npm test`. "Same tests, now passing. The code moved. The contract did not." |
| 8 | 30 s | Three git commands. "We can see what changed, what did not, and who accepted each stage." |

The bonus step is a good closer if someone asks what stops the agent from changing a test.

## If the agent is slow

Switch to the "No Claude Code?" section of the README. `npm run answer:tests` and `npm run answer:code` show the same red and green stages in a few seconds.

## If someone asks "is this realistic?"

"This is a tiny simulation so the result fits on a screen. The structure is the same for any code change: accepted requirements, tests tied to them, a human decision, and a record. A real robot needs sensors. A real team would add protected branches and CI on top of the local hook."
