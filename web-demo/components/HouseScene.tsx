import { fixtures, type HouseState } from "../story/fixtures";

type Props = { fixture: string; focus?: string; route?: boolean; compact?: boolean };

function Bag({ x, y, small = false }: { x: number; y: number; small?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${small ? 0.72 : 1})`} className="bag-drawing">
      <path d="M8 8 L20 8 L25 18 L26 39 Q25 44 20 44 L8 44 Q3 44 2 39 L3 18 Z" fill="#E9BFA0" stroke="#17252B" strokeWidth="2.5" />
      <path d="M8 8 L12 2 L17 7 L21 2 L24 8" fill="none" stroke="#17252B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 21 Q15 16 22 22" fill="none" stroke="#C78A70" strokeWidth="2" />
    </g>
  );
}

function Bin({ x, label, count }: { x: number; label: string; count: number }) {
  return (
    <g>
      <text x={x} y="240" textAnchor="middle" className="house-sub-label">{label}</text>
      <rect x={x - 34} y="258" width="68" height="63" rx="8" fill="#2D5960" stroke="#10232B" strokeWidth="3" />
      <rect x={x - 40} y="252" width="80" height="11" rx="5" fill="#A9C7BE" stroke="#10232B" strokeWidth="3" />
      {count > 0 && <Bag x={x - 13} y={266} small />}
    </g>
  );
}

function Cart({ state }: { state: HouseState }) {
  const atCurb = state.cartLocation === "curb";
  return (
    <g className="cart-motion" style={{ transform: `translate(${atCurb ? 770 : 555}px, ${atCurb ? 369 : 371}px)` }}>
      <path d="M16 9 H116 L105 93 H31 Z" fill="#7BAFAC" stroke="#10232B" strokeWidth="5" strokeLinejoin="round" />
      <path d="M21 10 H117" stroke="#B9D6C7" strokeWidth="9" strokeLinecap="round" />
      <path d="M18 6 H120" stroke="#10232B" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 24 H101" stroke="#4E8586" strokeWidth="3" />
      <path d="M34 38 H99" stroke="#4E8586" strokeWidth="3" />
      <path d="M32 52 H97" stroke="#4E8586" strokeWidth="3" />
      {state.cartBags > 0 && <Bag x={52} y={20} small />}
      {state.cartBags > 1 && <Bag x={73} y={20} small />}
      <circle cx="42" cy="100" r="12" fill="#14242B" />
      <circle cx="96" cy="100" r="12" fill="#14242B" />
      <circle cx="42" cy="100" r="4" fill="#AAC6BE" />
      <circle cx="96" cy="100" r="4" fill="#AAC6BE" />
      <text x="68" y="-14" textAnchor="middle" className="cart-label">CART · {state.cartBags}</text>
    </g>
  );
}

function Robot({ state }: { state: HouseState }) {
  const x = state.cartLocation === "curb" && state.day === "Tuesday" && state.kitchenBags === 0 ? 710 : 470;
  return (
    <g className="robot-motion" style={{ transform: `translate(${x}px, 395px)` }}>
      <path d="M32 -12 V-24" stroke="#10232B" strokeWidth="4" />
      <circle cx="32" cy="-27" r="5" fill="#E8B56E" stroke="#10232B" strokeWidth="2" />
      <rect x="0" y="0" width="66" height="63" rx="15" fill="#E9EFE2" stroke="#10232B" strokeWidth="4" />
      <rect x="9" y="14" width="48" height="27" rx="8" fill="#204249" />
      <circle cx="24" cy="27" r="4" fill="#AEE5D7" />
      <circle cx="43" cy="27" r="4" fill="#AEE5D7" />
      <path d="M25 48 Q33 55 42 48" fill="none" stroke="#2D5960" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 63 V72 M59 63 V72" stroke="#10232B" strokeWidth="5" strokeLinecap="round" />
      <path d="M0 41 L-11 51 M66 41 L77 51" stroke="#10232B" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

export default function HouseScene({ fixture, focus, route = false, compact = false }: Props) {
  const state = fixtures[fixture] ?? fixtures.before;
  const isBad = state.garageBags > 0;
  return (
    <div className={`house-wrap ${compact ? "house-compact" : ""}`}>
      <svg className="house-svg" viewBox="0 0 960 570" role="img" aria-label={`${state.day}: kitchen ${state.kitchenBags} bags, bathroom ${state.bathroomBags} bags, garage floor ${state.garageBags} bags, cart ${state.cartBags} bags at ${state.cartLocation}, pickup ${state.pickupComplete ? "complete" : "pending"}, needsHuman ${state.needsHuman}`}>
        <defs>
          <pattern id="floorLines" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M0 22 L22 0" stroke="#D3DFD3" strokeWidth="1" opacity=".28" />
          </pattern>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
          <marker id="routeArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M1 1 L7 4 L1 7" fill="none" stroke="#E8B56E" strokeWidth="2" />
          </marker>
        </defs>
        <rect width="960" height="570" fill="#DDE7DC" rx="24" />
        <path d="M0 475 H960" stroke="#A7B8AB" strokeWidth="2" />
        <rect x="0" y="476" width="960" height="94" fill="#C8D5CB" />
        <path d="M0 525 H960" stroke="#F3F5E8" strokeWidth="4" strokeDasharray="22 18" opacity=".8" />
        <path d="M38 472 H918" stroke="#8FA599" strokeWidth="3" />
        <rect x="750" y="472" width="187" height="16" rx="5" fill="#687E75" />
        <text x="843" y="504" textAnchor="middle" className="house-zone-label">CURB</text>
        <path d="M50 153 L375 30 L700 153" fill="#1A333B" stroke="#10232B" strokeWidth="5" strokeLinejoin="round" />
        <path d="M84 145 L375 43 L666 145" fill="none" stroke="#A8C7B7" strokeWidth="5" opacity=".55" />
        <rect x="61" y="151" width="638" height="321" rx="3" fill="#F5F2E9" stroke="#10232B" strokeWidth="5" />
        <rect x="65" y="155" width="630" height="313" fill="url(#floorLines)" />
        <path d="M380 153 V338 M62 337 H699" stroke="#10232B" strokeWidth="5" />
        <rect x="88" y="174" width="95" height="70" rx="8" fill="#C5DCD3" stroke="#76988C" strokeWidth="3" />
        <path d="M136 175 V244 M89 209 H183" stroke="#76988C" strokeWidth="3" />
        <rect x="449" y="174" width="95" height="70" rx="8" fill="#C5DCD3" stroke="#76988C" strokeWidth="3" />
        <path d="M496 175 V244 M449 209 H544" stroke="#76988C" strokeWidth="3" />
        <text x="227" y="195" textAnchor="middle" className="house-zone-label">KITCHEN</text>
        <text x="540" y="195" textAnchor="middle" className="house-zone-label">BATHROOM</text>
        <text x="190" y="385" textAnchor="middle" className="house-zone-label">GARAGE</text>
        <text x="190" y="421" textAnchor="middle" className="house-floor-label">FLOOR</text>
        <text x="190" y="450" textAnchor="middle" className={`house-floor-count ${isBad ? "danger" : ""}`}>{state.garageBags} {state.garageBags === 1 ? "BAG" : "BAGS"}</text>
        {focus === "garage" && <rect x="73" y="352" width="286" height="108" rx="16" className="focus-halo danger-halo" />}
        {focus === "cart" && <rect x={state.cartLocation === "curb" ? "755" : "540"} y="355" width="150" height="120" rx="18" className="focus-halo" />}
        {focus === "return" && <path d="M815 344 Q733 246 620 344" className="focus-path" markerEnd="url(#routeArrow)" />}
        {route && <path d="M255 303 Q400 355 570 326 Q660 292 800 342" className="route-path" markerEnd="url(#routeArrow)" />}
        <Bin x={272} label="INDOOR BIN" count={state.kitchenBags} />
        <Bin x={589} label="INDOOR BIN" count={state.bathroomBags} />
        {Array.from({ length: state.garageBags }).map((_, i) => <Bag key={i} x={290 + i * 38} y={410} />)}
        <Cart state={state} />
        <Robot state={state} />
        {state.needsHuman && (
          <g className="human-signal">
            <rect x="720" y="225" width="205" height="72" rx="15" fill="#F6D6A5" stroke="#845C30" strokeWidth="3" />
            <path d="M795 297 L807 314 L817 297" fill="#F6D6A5" stroke="#845C30" strokeWidth="3" />
            <text x="822" y="254" textAnchor="middle" className="human-title">OWNER DECISION</text>
            <text x="822" y="281" textAnchor="middle" className="human-detail">needsHuman = true</text>
          </g>
        )}
      </svg>
      <div className="house-readout" aria-hidden="true">
        <span><b>{state.day.toUpperCase()}</b></span>
        <span>GARAGE FLOOR <b className={isBad ? "bad-value" : ""}>{state.garageBags}</b></span>
        <span>CART <b>{state.cartLocation.toUpperCase()} · {state.cartBags} BAGS</b></span>
        <span>OWNER <b className={state.needsHuman ? "attention-value" : ""}>{state.needsHuman ? "NEEDED" : "CLEAR"}</b></span>
      </div>
    </div>
  );
}
