import { transcripts } from "../story/transcripts";

export default function Terminal({ id, visible, title }: { id: string; visible: number; title?: string }) {
  const lines = transcripts[id] ?? [];
  return (
    <div className="terminal" aria-label={title ?? "Simulated terminal transcript"}>
      <div className="terminal-top">
        <span className="terminal-dots"><i /><i /><i /></span>
        <span>{title ?? "TRASH ROBOT / SIMULATED TERMINAL"}</span>
        <span className="terminal-live">SCRIPTED OUTPUT</span>
      </div>
      <div className="terminal-body" aria-live="polite">
        {lines.slice(0, Math.max(1, visible)).map((line, i) => (
          <div className={`terminal-line terminal-${line.tone ?? "normal"}`} key={i}>
            <span className="line-number">{String(i + 1).padStart(2, "0")}</span>
            <span>{line.text}</span>
          </div>
        ))}
        {visible < lines.length && <div className="terminal-cursor" aria-hidden="true">▍</div>}
      </div>
    </div>
  );
}
