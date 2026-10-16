import { sceneSeconds } from "./timing";

export type SceneKind =
  | "pass" | "predict" | "gap" | "criterion" | "prompt" | "writing"
  | "red" | "review" | "commit" | "diff" | "route" | "wednesday"
  | "green" | "scenarios" | "evidence" | "finish" | "guard";

export type Scene = {
  id: string;
  kind: SceneKind;
  chapter: string;
  eyebrow: string;
  title: string;
  lead: string;
  detail?: string;
  fixture?: string;
  frames?: string[];
  criterion?: string;
  transcript?: string;
  transcriptRevealSteps?: number[];
  focus?: string;
  gate?: "predict" | "delay" | "review" | "final";
  estimatedSeconds: number;
};

const scene = (data: Omit<Scene, "estimatedSeconds">): Scene => ({
  ...data,
  estimatedSeconds: sceneSeconds[data.id] ?? 0,
});

export const scenes: Scene[] = [
  scene({ id: "pass", kind: "pass", chapter: "01 / THE FALSE PASS", eyebrow: "THE INITIAL CHECK", title: "One test. One pass.", lead: "Watch the robot empty both indoor bins. Then the test turns green.", detail: "What did that test actually prove?", frames: ["before", "pickupKitchen", "kitchenPicked", "pickupBathroom", "bathroomPicked", "carrying"], transcript: "initial", transcriptRevealSteps: [1, 5, 6] }),
  scene({ id: "predict", kind: "predict", chapter: "01 / THE FALSE PASS", eyebrow: "PAUSE FOR THE ROOM", title: "Is the job done?", lead: "The test passed. Predict where the two bags and the cart ended up.", detail: "Ask for a show of hands before revealing the house.", fixture: "carrying", gate: "predict" }),
  scene({ id: "gap", kind: "gap", chapter: "01 / THE FALSE PASS", eyebrow: "THE REAL OUTCOME", title: "Green test. Unfinished job.", lead: "The bags are on the garage floor. The cart never reached the curb.", detail: "The initial test only checked kitchenBags and bathroomBags.", fixture: "misleading" }),
  scene({ id: "ac1", kind: "criterion", chapter: "02 / THE CONTRACT", eyebrow: "AC1 · NORMAL TUESDAY", title: "The bags belong in the cart.", lead: "Empty indoor bins. Two bags in the cart. Clear garage. Cart at the curb.", frames: ["before", "ac1"], criterion: "AC1" }),
  scene({ id: "ac2", kind: "criterion", chapter: "02 / THE CONTRACT", eyebrow: "AC2 · CART ALREADY OUT", title: "Starting position cannot change the goal.", lead: "Even when the cart begins at the curb, both bags still go inside it.", frames: ["curbBefore", "ac2"], criterion: "AC2" }),
  scene({ id: "ac3", kind: "criterion", chapter: "02 / THE CONTRACT", eyebrow: "AC3 · COLLECTION CONFIRMED", title: "Wednesday closes the loop.", lead: "Once collection is confirmed, the cart returns to the garage.", frames: ["collectedBefore", "ac3"], criterion: "AC3" }),
  scene({ id: "ac4", kind: "criterion", chapter: "02 / THE CONTRACT", eyebrow: "AC4 · PICKUP DELAYED", title: "A delay needs a person.", lead: "The cart stays at the curb. needsHuman becomes true.", detail: "The owner decides the follow-up; the robot does not assume pickup happened.", frames: ["delayedBefore", "ac4"], criterion: "AC4", gate: "delay" }),
  scene({ id: "prompt", kind: "prompt", chapter: "03 / TEST THE CONTRACT", eyebrow: "SIMULATED AGENT PROMPT", title: "Turn rules into checks.", lead: "One acceptance test per criterion. Observable results. No code change yet.", transcript: "prompt" }),
  scene({ id: "writing", kind: "writing", chapter: "03 / TEST THE CONTRACT", eyebrow: "SIMULATED AGENT ACTIVITY", title: "Four tests take shape.", lead: "The agent reads the spec and writes contract.test.js.", detail: "The implementation remains the original incomplete version.", transcript: "writing" }),
  scene({ id: "red", kind: "red", chapter: "03 / TEST THE CONTRACT", eyebrow: "RED · EXPECTED FAILURE", title: "The gap becomes measurable.", lead: "The original check still passes. All four acceptance tests fail.", detail: "Select a failure to locate it in the house.", fixture: "misleading", transcript: "red" }),
  scene({ id: "review", kind: "review", chapter: "04 / HUMAN GATE", eyebrow: "THE OWNER REVIEWS", title: "Are these the right tests?", lead: "Compare each test with its acceptance criterion before accepting the contract.", detail: "Review all four checks, then accept them.", gate: "review" }),
  scene({ id: "commit", kind: "commit", chapter: "04 / HUMAN GATE", eyebrow: "SIMULATED GIT COMMIT", title: "The contract is fixed.", lead: "The accepted tests are committed before implementation starts.", detail: "From here, the code must move to meet the tests.", transcript: "commitTests" }),
  scene({ id: "diff", kind: "diff", chapter: "05 / CHANGE THE CODE", eyebrow: "IMPLEMENTATION DIFF", title: "Change the route, not the rules.", lead: "The Tuesday branch now moves bags into the cart and puts it at the curb.", detail: "Wednesday returns the cart after collection or asks the owner when delayed." }),
  scene({ id: "route", kind: "route", chapter: "05 / CHANGE THE CODE", eyebrow: "TUESDAY · CORRECTED ROUTE", title: "Indoor bins → cart → curb.", lead: "The garage floor stays clear throughout the trip.", frames: ["before", "pickupKitchen", "kitchenPicked", "pickupBathroom", "bathroomPicked", "loaded", "ac1"] }),
  scene({ id: "wednesday", kind: "wednesday", chapter: "05 / CHANGE THE CODE", eyebrow: "WEDNESDAY · TWO BRANCHES", title: "Collection decides the route.", lead: "Collected: return the cart. Delayed: leave it out and ask the owner.", frames: ["ac3", "ac4"] }),
  scene({ id: "green", kind: "green", chapter: "06 / THE PROOF", eyebrow: "GREEN · SAME TESTS", title: "Five tests. Five passes.", lead: "The four accepted tests did not change. The implementation did.", transcript: "green" }),
  scene({ id: "scenarios", kind: "scenarios", chapter: "06 / THE PROOF", eyebrow: "SCENARIO CHECK", title: "Four outcomes match the spec.", lead: "Tuesday and Wednesday now agree with AC1–AC4.", detail: "The initial green test meant less than this evidence does." }),
  scene({ id: "evidence", kind: "evidence", chapter: "06 / THE PROOF", eyebrow: "HUMAN GATE · FINAL REVIEW", title: "Inspect what changed.", lead: "No test diff. A code diff. Git shows the test acceptance before the fix.", transcript: "evidence", gate: "final" }),
  scene({ id: "finish", kind: "finish", chapter: "07 / TAKEAWAY", eyebrow: "THE FULL CHAIN", title: "A pass is only as strong as its contract.", lead: "The first green check covered two empty bins. The final green checks cover the whole job.", transcript: "finalCommit" }),
];

export const guardScene = scene({
  id: "guard", kind: "guard", chapter: "BONUS / GUARD RAIL", eyebrow: "OPTIONAL BEAT",
  title: "The accepted test resists edits.",
  lead: "A simulated agent edit to a committed test is blocked by the exercise hook.",
  detail: "This local hook is a teaching guard rail, not a substitute for team review.",
  transcript: "guard",
});
