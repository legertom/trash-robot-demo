// Presenter estimates are editable and never auto-advance a scene.
export const revealIntervalMs = 1150;

export const sceneSeconds: Record<string, number> = {
  pass: 19, predict: 17, gap: 18, ac1: 15, ac2: 13, ac3: 13,
  ac4: 20, prompt: 12, writing: 12, red: 22, review: 24,
  commit: 10, diff: 17, route: 16, wednesday: 16, green: 15,
  scenarios: 12, evidence: 20, finish: 17,
};
