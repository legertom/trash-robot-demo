"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import HouseScene from "./HouseScene";
import Terminal from "./Terminal";
import { criteria } from "../story/fixtures";
import { guardScene, scenes, type Scene } from "../story/scenes";
import { canAdvance, initialState, storyReducer } from "../story/machine";
import { revealIntervalMs } from "../story/timing";
import { transcripts } from "../story/transcripts";

const failureHouse: Record<string, { fixture: string; focus: string; text: string }> = {
  AC1: { fixture: "misleading", focus: "garage", text: "Two bags on the garage floor" },
  AC2: { fixture: "failingAc2", focus: "cart", text: "Cart at curb, still empty" },
  AC3: { fixture: "collectedBefore", focus: "return", text: "Collected cart still at curb" },
  AC4: { fixture: "delayedBefore", focus: "human", text: "No owner signal after delay" },
};

function maxStep(scene: Scene) {
  return Math.max(scene.transcript ? transcripts[scene.transcript]?.length ?? 1 : 1, scene.frames?.length ?? 1);
}

function timeLabel(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function DiffPanel() {
  return (
    <div className="diff-panel" aria-label="Simulated before and after implementation diff">
      <div className="diff-header"><span>src/trashRobot.js</span><span>SIMULATED DIFF</span></div>
      <div className="diff-section">
        <div className="diff-tag">TUESDAY</div>
        <div className="diff-line removed"><b>−</b> garageBags: garageBags + indoorBags</div>
        <div className="diff-line added"><b>+</b> cartBags: cartBags + indoorBags</div>
        <div className="diff-line added"><b>+</b> cartLocation: "curb"</div>
      </div>
      <div className="diff-section">
        <div className="diff-tag">WEDNESDAY</div>
        <div className="diff-line added"><b>+</b> if (pickupComplete) return cart to garage</div>
        <div className="diff-line added"><b>+</b> else keep cart out; needsHuman = true</div>
      </div>
      <div className="diff-note">Accepted test file: unchanged</div>
    </div>
  );
}

function ScenarioGrid() {
  return (
    <div className="scenario-grid">
      {criteria.map((item, index) => (
        <div className="scenario-card" key={item.id}>
          <div className="scenario-card-top"><span className="criterion-pill">{item.id}</span><span className="status-pass">✓ MATCH</span></div>
          <h3>{item.title}</h3>
          <p>{item.short}</p>
          <div className="scenario-track">
            <span className={index < 2 ? "track-active" : ""}>TUE</span>
            <i />
            <span className={index >= 2 ? "track-active" : ""}>WED</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Chain() {
  const nodes = [
    ["01", "Written spec", "AC1–AC4"],
    ["02", "Tests fail", "The gap is visible"],
    ["03", "Human accepts", "Contract fixed"],
    ["04", "Code changes", "Whole route"],
    ["05", "Same tests pass", "5 / 5"],
    ["06", "Human accepts", "Review the fix"],
  ];
  return (
    <div className="chain" aria-label="Spec, tests, human acceptance, code, passing tests, human acceptance">
      {nodes.map(([number, title, subtitle], i) => (
        <div className="chain-node" key={number}>
          <span className="chain-number">{number}</span>
          <div><strong>{title}</strong><small>{subtitle}</small></div>
          {i < nodes.length - 1 && <span className="chain-arrow">→</span>}
        </div>
      ))}
    </div>
  );
}

export default function Presentation() {
  const [state, dispatch] = useReducer(storyReducer, initialState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const jumpCloseRef = useRef<HTMLButtonElement>(null);
  const jumpDialogRef = useRef<HTMLDivElement>(null);
  const scene = state.guardOpen ? guardScene : scenes[state.index];
  const max = maxStep(scene);
  const totalSeconds = useMemo(() => scenes.reduce((sum, item) => sum + item.estimatedSeconds, 0), []);
  const elapsed = useMemo(() => scenes.slice(0, state.index).reduce((sum, item) => sum + item.estimatedSeconds, 0), [state.index]);
  const canNext = canAdvance(state);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) dispatch({ type: "REVEAL_ALL", max });
  }, [reducedMotion, scene.id, max]);

  useEffect(() => {
    if (!state.playing || state.step >= max || reducedMotion) return;
    const timer = window.setTimeout(() => dispatch({ type: "TICK", max }), revealIntervalMs);
    return () => window.clearTimeout(timer);
  }, [state.playing, state.step, max, reducedMotion, scene.id]);

  useEffect(() => {
    if (state.jumpOpen) jumpCloseRef.current?.focus();
  }, [state.jumpOpen]);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const editing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (editing) return;
      if (event.key === "Escape" && state.jumpOpen) { dispatch({ type: "TOGGLE_JUMP" }); return; }
      if (state.jumpOpen) return;
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "n") { event.preventDefault(); dispatch({ type: "NEXT" }); }
      else if (event.key === "ArrowLeft" || event.key.toLowerCase() === "b") { event.preventDefault(); dispatch({ type: "BACK" }); }
      else if (event.key === " " && target.tagName !== "BUTTON") { event.preventDefault(); dispatch({ type: "TOGGLE_PLAY", max }); }
      else if (event.key.toLowerCase() === "r" && target.tagName !== "BUTTON") { dispatch({ type: "RESTART" }); }
      else if (event.key.toLowerCase() === "j" && target.tagName !== "BUTTON") { dispatch({ type: "TOGGLE_JUMP" }); }
      else if (event.key.toLowerCase() === "g" && target.tagName !== "BUTTON") { dispatch({ type: "SHOW_GUARD" }); }
      else if (event.key.toLowerCase() === "f" && target.tagName !== "BUTTON") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [max, state.jumpOpen]);

  const currentFixture = scene.frames
    ? scene.frames[Math.min(scene.frames.length - 1, state.step - 1)]
    : scene.fixture ?? "before";
  const transcriptVisible = scene.transcriptRevealSteps
    ? scene.transcriptRevealSteps.filter(step => state.step >= step).length
    : state.step;
  const pickupCaption = ["The house before the run", "Robot reaches the kitchen bin", "Kitchen bag in hand", "Robot reaches the bathroom bin", "Both bins empty · two bags in hand", "Test passes · destination still unknown"];
  const routeCaption = ["Route begins", "Robot reaches the kitchen bin", "Kitchen bag in hand", "Robot reaches the bathroom bin", "Both bags in hand", "Bags loaded in cart", "Cart at curb · garage clear"];
  const criterion = criteria.find(item => item.id === scene.criterion);
  const isHouseScene = ["pass", "predict", "gap", "criterion", "route", "wednesday"].includes(scene.kind);
  const showTerminalAtLeft = scene.kind === "pass" || scene.kind === "red" || scene.kind === "evidence";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark" aria-hidden="true">▣</span><span>TRASH / ROBOT</span><em>LIVE TEACHING DEMO</em></div>
        <div className="top-center"><span className="simulation-dot" /> SCRIPTED SIMULATION <span className="top-separator">/</span> NO COMMANDS RUN</div>
        <div className="top-actions"><span className="time-estimate">~{timeLabel(totalSeconds)} RUN</span><button type="button" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()} aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}>{isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"} <kbd>F</kbd></button></div>
      </header>

      <div className="progress-track" role="progressbar" aria-label="Presentation progress" aria-valuenow={state.index + 1} aria-valuemin={1} aria-valuemax={scenes.length}>
        {scenes.map((item, index) => <span key={item.id} className={`progress-segment ${index < state.index ? "complete" : ""} ${index === state.index && !state.guardOpen ? "current" : ""}`} />)}
      </div>

      <section className={`presentation-stage kind-${scene.kind}`} aria-labelledby="scene-title">
        <div className="narrative-column">
          <div className="narrative-top">
            <div className="eyebrow"><span className="eyebrow-rule" />{scene.eyebrow}</div>
            <h1 id="scene-title" key={scene.id}>{scene.title}</h1>
            <p className="scene-lead">{scene.lead}</p>
            {scene.detail && <p className="scene-detail">{scene.detail}</p>}
          </div>

          {showTerminalAtLeft && scene.transcript && <Terminal id={scene.transcript} visible={transcriptVisible} />}

          {scene.kind === "predict" && (
            <div className="gate-card prediction-gate">
              <div className="gate-icon">?</div>
              <div><strong>Ask the room</strong><span>Where did the bags end up?</span></div>
              <button type="button" className="action-button" onClick={() => dispatch({ type: "PREDICTION_READY" })}>{state.predictionReady ? "READY TO REVEAL ✓" : "REVEAL THE OUTCOME"}</button>
            </div>
          )}

          {scene.kind === "criterion" && criterion && (
            <div className="criterion-strip"><span>{criterion.id}</span><strong>{criterion.evidence}</strong></div>
          )}

          {scene.kind === "criterion" && scene.gate === "delay" && state.step > 1 && (
            <div className="delay-decision">
              <span className="gate-overline">OWNER DECISION · PICKUP DELAYED</span>
              <strong>What should happen next?</strong>
              <div className="choice-row">
                <button type="button" aria-pressed={state.delayChoice === "check"} className={state.delayChoice === "check" ? "selected" : ""} onClick={() => dispatch({ type: "DELAY_CHOICE", choice: "check" })}>Leave cart; check later</button>
                <button type="button" aria-pressed={state.delayChoice === "contact"} className={state.delayChoice === "contact" ? "selected" : ""} onClick={() => dispatch({ type: "DELAY_CHOICE", choice: "contact" })}>Contact hauler; leave cart</button>
              </div>
              {state.delayChoice && <small>Owner choice recorded. The cart remains at the curb and needsHuman remains true until pickup is resolved.</small>}
            </div>
          )}

          {scene.kind === "review" && (
            <div className="review-accept">
              <span className="gate-overline">HUMAN GATE 01 / 02</span>
              <p>{state.reviewed.length} of 4 criteria reviewed</p>
              <button type="button" className="action-button" disabled={state.reviewed.length !== 4 || state.testsAccepted} onClick={() => dispatch({ type: "ACCEPT_TESTS" })}>{state.testsAccepted ? "TESTS ACCEPTED ✓" : "ACCEPT FOUR TESTS"}</button>
              {state.testsAccepted && <small>The accepted tests are fixed before the code changes.</small>}
            </div>
          )}

          {scene.kind === "evidence" && (
            <div className="final-accept">
              <span className="gate-overline">HUMAN GATE 02 / 02</span>
              <button type="button" className="action-button" disabled={state.finalAccepted || state.step < max} onClick={() => dispatch({ type: "ACCEPT_FINAL" })}>{state.finalAccepted ? "IMPLEMENTATION ACCEPTED ✓" : state.step < max ? "REVIEW EVIDENCE FIRST" : "ACCEPT IMPLEMENTATION"}</button>
              {state.finalAccepted && <small>Proceed to the simulated final commit and takeaway.</small>}
            </div>
          )}

          {scene.kind === "finish" && (
            <div className="revisit-card">
              <div><span>FIRST PASS</span><strong>Empty bins</strong><small>1 narrow check</small></div>
              <span className="revisit-arrow">→</span>
              <div><span>FINAL PASS</span><strong>Whole weekly cycle</strong><small>5 checks · 4 scenarios</small></div>
            </div>
          )}

          {scene.kind === "guard" && <button type="button" className="return-button" onClick={() => dispatch({ type: "HIDE_GUARD" })}>← Return to main presentation</button>}
        </div>

        <div className="visual-column">
          <div className="visual-header"><span>{scene.chapter}</span><span>{state.guardOpen ? "BONUS" : `${String(state.index + 1).padStart(2, "0")} / ${scenes.length}`}</span></div>

          {isHouseScene && (
            <div className="house-stage">
              <HouseScene fixture={currentFixture} focus={scene.kind === "gap" ? "garage" : scene.kind === "criterion" && scene.criterion === "AC4" ? "human" : undefined} route={scene.kind === "route" && state.step >= 6} />
              <div className="house-caption">
                <span>{scene.kind === "gap" ? "OBSERVED RESULT" : scene.kind === "pass" ? state.step === 1 ? "BEFORE THE RUN" : state.step === max ? "TEST RESULT" : "ROBOT AT WORK" : scene.kind === "predict" ? "PREDICTION PAUSE" : scene.id === "ac2" ? state.step === 1 ? "ONE WEEK LATER · BEFORE" : "AC2 RESULT" : scene.kind === "criterion" && state.step === 1 ? "BEFORE THE RUN" : "SPEC EXPECTATION"}</span>
                <strong>{scene.kind === "gap" ? "Bins empty ≠ task complete" : scene.kind === "pass" ? pickupCaption[state.step - 1] : scene.kind === "predict" ? "Empty bins · destination unknown" : scene.id === "ac2" ? state.step === 1 ? "Fresh indoor bags · empty cart already at curb" : "Both bags in curbside cart · garage clear" : scene.kind === "wednesday" ? state.step > 1 ? "Delay → owner needed" : "Collected → cart home" : scene.kind === "route" ? routeCaption[state.step - 1] : scene.kind === "criterion" && state.step === 1 ? "Starting state" : criterion?.short ?? "The house tells the story"}</strong>
              </div>
            </div>
          )}

          {["prompt", "writing", "commit", "green", "guard"].includes(scene.kind) && scene.transcript && (
            <div className="terminal-stage">
              <Terminal id={scene.transcript} visible={state.step} />
              {scene.kind === "green" && <div className="test-score"><strong>5 / 5</strong><span>PASSING · SAME ACCEPTED TESTS</span></div>}
              {scene.kind === "commit" && <div className="commit-seal"><span>✓</span><strong>TESTS ACCEPTED</strong><small>Implementation may begin</small></div>}
            </div>
          )}

          {scene.kind === "red" && (
            <div className="red-stage">
              <div className="failure-list" role="group" aria-label="Select failing acceptance test">
                {criteria.map(item => (
                  <button type="button" key={item.id} aria-pressed={state.selectedFailure === item.id} className={state.selectedFailure === item.id ? "active" : ""} onClick={() => dispatch({ type: "SELECT_FAILURE", id: item.id })}><span>× {item.id}</span><small>{failureHouse[item.id].text}</small></button>
                ))}
              </div>
              <HouseScene fixture={failureHouse[state.selectedFailure].fixture} focus={failureHouse[state.selectedFailure].focus} compact />
            </div>
          )}

          {scene.kind === "review" && (
            <div className="review-list" role="group" aria-label="Review acceptance criteria">
              {criteria.map(item => (
                <button type="button" className={state.reviewed.includes(item.id) ? "reviewed" : ""} aria-pressed={state.reviewed.includes(item.id)} key={item.id} onClick={() => dispatch({ type: "TOGGLE_REVIEW", id: item.id })}>
                  <span className="review-box">{state.reviewed.includes(item.id) ? "✓" : ""}</span>
                  <span className="review-text"><b>{item.id} · {item.title}</b><small>{item.short}</small><small className="review-assertion">{item.test}</small></span>
                  <span className="review-status">{state.reviewed.includes(item.id) ? "REVIEWED" : "CHECK"}</span>
                </button>
              ))}
              <div className="review-foot">Each check must match the written criterion. The agent does not decide acceptance.</div>
            </div>
          )}

          {scene.kind === "diff" && <div className="diff-stage"><DiffPanel /><div className="diff-route"><span>BEFORE</span><strong>Bins → garage floor</strong><span className="diff-route-arrow">↓</span><span>AFTER</span><strong>Bins → cart → curb</strong></div></div>}
          {scene.kind === "scenarios" && <ScenarioGrid />}
          {scene.kind === "evidence" && (
            <div className="evidence-grid">
              <div className="evidence-card"><span>01 / TEST DIFF</span><strong>Empty</strong><small>Accepted tests stayed fixed.</small></div>
              <div className="evidence-card"><span>02 / CODE DIFF</span><strong>Visible</strong><small>Only implementation behavior moved.</small></div>
              <div className="evidence-card"><span>03 / HISTORY</span><strong>In order</strong><small>Spec → test acceptance → code review.</small></div>
            </div>
          )}
          {scene.kind === "finish" && (
            <div className="finish-stage">
              <Chain />
              <Terminal id="finalCommit" visible={state.step} title="SIMULATED FINAL GIT HISTORY" />
              <button type="button" className="bonus-link" onClick={() => dispatch({ type: "SHOW_GUARD" })}>Optional: show the guard rail ↗</button>
            </div>
          )}
        </div>
      </section>

      <footer className="control-deck">
        <div className="deck-meta"><span className="deck-chapter">{scene.chapter}</span><span className="deck-time">{timeLabel(elapsed)} / ~{timeLabel(totalSeconds)}</span></div>
        <div className="deck-controls">
          <button type="button" onClick={() => dispatch({ type: "BACK" })} disabled={state.index === 0 && !state.guardOpen} aria-label="Previous scene"><span>←</span> BACK <kbd>←</kbd></button>
          <button type="button" onClick={() => dispatch({ type: "TOGGLE_PLAY", max })} aria-label={state.playing && state.step < max ? "Pause animation" : "Play or replay animation"}><span>{state.playing && state.step < max ? "Ⅱ" : "▶"}</span> {state.playing && state.step < max ? "PAUSE" : state.step >= max ? "REPLAY" : "PLAY"} <kbd>SPACE</kbd></button>
          <button type="button" className="next-control" onClick={() => dispatch({ type: "NEXT" })} disabled={!canNext || (state.index === scenes.length - 1 && !state.guardOpen)}>{!canNext ? "DECISION REQUIRED" : state.index === scenes.length - 1 && !state.guardOpen ? "END" : "NEXT"} <span>→</span> <kbd>→</kbd></button>
        </div>
        <div className="deck-utility">
          <button type="button" onClick={() => dispatch({ type: "TOGGLE_JUMP" })}>SCENES <kbd>J</kbd></button>
          <button type="button" onClick={() => dispatch({ type: "RESTART" })}>RESTART <kbd>R</kbd></button>
        </div>
      </footer>

      {state.jumpOpen && (
        <div className="jump-scrim" onMouseDown={event => { if (event.target === event.currentTarget) dispatch({ type: "TOGGLE_JUMP" }); }}>
          <div className="jump-dialog" ref={jumpDialogRef} role="dialog" aria-modal="true" aria-label="Jump to a scene" onKeyDown={event => {
            if (event.key !== "Tab") return;
            const buttons = jumpDialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
            if (!buttons?.length) return;
            const first = buttons[0], last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }}>
            <div className="jump-heading"><div><span>SCENE MAP</span><h2>Jump to a beat</h2></div><button type="button" ref={jumpCloseRef} onClick={() => dispatch({ type: "TOGGLE_JUMP" })} aria-label="Close scene map">×</button></div>
            <div className="jump-list">
              {scenes.map((item, index) => <button type="button" key={item.id} className={index === state.index ? "current" : ""} onClick={() => dispatch({ type: "JUMP", index })}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.chapter}</small></button>)}
            </div>
            <button type="button" className="jump-bonus" onClick={() => dispatch({ type: "SHOW_GUARD" })}>BONUS · Guard rail demonstration</button>
          </div>
        </div>
      )}
    </main>
  );
}
