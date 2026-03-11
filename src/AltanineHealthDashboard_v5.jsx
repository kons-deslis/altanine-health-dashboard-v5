import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
  ReferenceLine, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ── MOBILE HOOK ─────────────────────────────────────────────── */
function useIsMobile(bp = 768) {
  const [mob, setMob] = useState(() => typeof window !== "undefined" && window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < bp);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mob;
}

/* ── PALETTE v2 — Light Editorial ───────────────────────────── */
const C = {
  navy:     "#1B2A4A",
  teal:     "#0F7B8C",
  sky:      "#0284C7",   // replaces gold — clean, confident accent
  emerald:  "#059669",   // positive metrics
  rose:     "#BE123C",   // negative / risk
  ltTeal:   "#E0F2F7",
  ltSky:    "#E0F2FE",
  ltGreen:  "#DCFCE7",
  ltRed:    "#FEE2E2",
  ltAmber:  "#FEF3C7",
  amber:    "#D97706",
  ltSky:    "#E0F2FE",
  ltGreen:  "#DCFCE7",
  bg:       "#F6F8FA",   // page background
  surface:  "#FFFFFF",
  border:   "#DDE3EC",
  borderLt: "#EEF2F7",
  muted:    "#6B7A99",
  navy2:    "#263656",
  slate:    "#334155",
};

/* ── STYLE INJECTION ─────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.bg}; }

    .site { font-family: 'Inter', sans-serif; color: ${C.navy}; background: ${C.bg}; }
    .serif { font-family: 'DM Serif Display', serif; }
    .mono  { font-family: 'IBM Plex Mono', monospace; }
    .upper { text-transform: uppercase; letter-spacing: 0.1em; }

    .section { padding: 80px 56px; max-width: 1320px; margin: 0 auto; }
    .section-alt { background: ${C.surface}; }
    .section-navy { background: ${C.navy}; color: ${C.surface}; }
    .section-teal { background: ${C.teal}; color: ${C.surface}; }

    /* Nav — light */
    .nav {
      position: sticky; top: 0; z-index: 100;
      background: ${C.surface};
      border-bottom: 1px solid ${C.border};
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 56px; height: 60px;
      box-shadow: 0 1px 8px rgba(27,42,74,0.06);
    }
    .nav-brand {
      font-weight: 800; font-size: 0.78rem; letter-spacing: 0.18em;
      text-transform: uppercase; color: ${C.navy};
      display: flex; align-items: center; gap: 10px;
    }
    .nav-dot { width: 8px; height: 8px; background: ${C.teal}; border-radius: 50%; }
    .nav-links { display: flex; gap: 0; flex-wrap: nowrap; }
    .nav-link {
      color: ${C.muted}; font-size: 0.67rem; letter-spacing: 0.04em;
      font-weight: 500; padding: 0 10px; height: 60px;
      display: flex; align-items: center; cursor: pointer; white-space: nowrap;
      transition: all 0.15s; border-bottom: 2px solid transparent;
    }
    .nav-link:hover { color: ${C.navy}; }
    .nav-link.active { color: ${C.teal}; border-bottom-color: ${C.teal}; font-weight: 600; }
    .nav-badge {
      background: ${C.teal}; color: white; font-size: 0.58rem;
      padding: 2px 7px; border-radius: 99px; font-weight: 700; letter-spacing: 0.06em;
    }

    /* Progress bar */
    .progress-bar { height: 2px; background: ${C.teal}; transform-origin: left; transition: transform 0.15s; }

    /* Cards */
    .card {
      background: ${C.surface}; border: 1px solid ${C.border};
      border-radius: 12px; padding: 28px;
      box-shadow: 0 1px 4px rgba(27,42,74,0.04);
      transition: box-shadow 0.2s;
    }
    .card:hover { box-shadow: 0 4px 16px rgba(27,42,74,0.08); }
    .card-navy { background: ${C.navy}; border-color: ${C.navy2}; color: white; }
    .card-teal { background: ${C.teal}; border-color: ${C.teal}; color: white; }
    .card-sky  { background: ${C.ltSky}; border-color: #BAE6FD; }
    .card-green{ background: ${C.ltGreen}; border-color: #BBF7D0; }

    /* Stat card */
    .stat-card {
      background: ${C.surface}; border: 1px solid ${C.border};
      border-radius: 12px; padding: 24px 20px;
      box-shadow: 0 1px 4px rgba(27,42,74,0.04);
    }
    .stat-num  { font-size: clamp(1.9rem,3.2vw,2.8rem); font-weight: 800; line-height: 1; letter-spacing: -0.03em; }
    .stat-lbl  { font-size: 0.64rem; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 8px; color: ${C.muted}; font-weight: 600; }
    .stat-sub  { font-size: 0.78rem; margin-top: 6px; font-weight: 500; }
    .stat-bar  { height: 3px; border-radius: 2px; margin-top: 14px; }

    /* Feature cards */
    .feat-card {
      background: ${C.surface}; border: 1px solid ${C.border};
      border-radius: 12px; padding: 28px;
      border-top: 3px solid ${C.teal};
    }
    .feat-card-sky { border-top-color: ${C.sky}; }
    .feat-card-navy { background: ${C.navy}; border-top-color: ${C.teal}; color: white; }

    /* Tabs */
    .tab-bar { display: flex; gap: 0; border-bottom: 2px solid ${C.border}; margin-bottom: 32px; }
    .tab-btn {
      padding: 14px 22px; font-size: 0.8rem; font-weight: 600;
      cursor: pointer; border: none; background: none;
      color: ${C.muted}; border-bottom: 2px solid transparent;
      margin-bottom: -2px; transition: all 0.15s; letter-spacing: 0.02em;
    }
    .tab-btn:hover { color: ${C.navy}; }
    .tab-btn.active { color: ${C.teal}; border-bottom-color: ${C.teal}; }

    /* Chip / tag */
    .chip {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; padding: 4px 10px; border-radius: 5px;
    }
    .chip-teal  { background: ${C.ltTeal}; color: ${C.teal}; }
    .chip-sky   { background: ${C.ltSky}; color: ${C.sky}; }
    .chip-green { background: ${C.ltGreen}; color: ${C.emerald}; }
    .chip-navy  { background: #E8ECF5; color: ${C.navy}; }

    /* Grids */
    .grid-4  { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    .grid-3  { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    .grid-2  { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; }
    .grid-2-1{ display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
    .grid-1-2{ display: grid; grid-template-columns: 1fr 2fr; gap: 32px; }

    /* Section label */
    .sec-label {
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em;
      text-transform: uppercase; color: ${C.teal};
      display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
    }
    .sec-num {
      width: 22px; height: 22px; border-radius: 50%;
      background: ${C.teal}; color: white;
      font-size: 0.58rem; font-weight: 800; display: flex;
      align-items: center; justify-content: center; letter-spacing: 0;
    }

    /* Divider */
    .div-rule { height: 1px; background: ${C.border}; margin: 48px 0; }

    /* Risk rows */
    .risk-row { display: grid; grid-template-columns: 1fr 1fr 80px; gap: 16px;
                align-items: start; padding: 18px 0; border-bottom: 1px solid ${C.borderLt}; }

    /* Custom tooltip */
    .recharts-tooltip-wrapper { outline: none; }

    /* Horizontal rule accent */
    .accent-rule { width: 40px; height: 3px; background: ${C.teal}; border-radius: 2px; margin-bottom: 20px; }

    /* Animations */
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
    .fade-up   { animation: fadeUp 0.55s cubic-bezier(0.2,0,0,1) forwards; }
    .delay-1   { animation-delay: 0.08s; opacity: 0; }
    .delay-2   { animation-delay: 0.16s; opacity: 0; }
    .delay-3   { animation-delay: 0.24s; opacity: 0; }
    .delay-4   { animation-delay: 0.32s; opacity: 0; }
    .delay-5   { animation-delay: 0.40s; opacity: 0; }

    @media (max-width: 960px) {
      .section { padding: 52px 24px; }
      .grid-4  { grid-template-columns: repeat(2,1fr); }
      .grid-3, .grid-2, .grid-2-1, .grid-1-2 { grid-template-columns: 1fr; }
      .nav-links { display: none; }
    }
    @media (max-width: 768px) {
      .section { padding: 40px 18px; }
      .grid-4  { grid-template-columns: repeat(2,1fr); }
      .tab-btn { padding: 12px 14px; font-size: 0.72rem; }
    }
  `}</style>
);

/* ── DATA ─────────────────────────────────────────────────────── */
const revenueData = [
  { year:"2025", total:2.5,  comp:2.5,   alt301:0,   alt401:0,   ebitda:-3.4, margin:-136, patients:1.2,   gm:38 },
  { year:"2026", total:8.0,  comp:8.0,   alt301:0,   alt401:0,   ebitda:-4.3, margin:-54,  patients:18,    gm:42 },
  { year:"2027", total:18,   comp:18,    alt301:0,   alt401:0,   ebitda:-4.8, margin:-27,  patients:52,    gm:45 },
  { year:"2028", total:35,   comp:35,    alt301:0,   alt401:0,   ebitda:-2.5, margin:-7,   patients:82,    gm:44 },
  { year:"2029", total:80,   comp:65,    alt301:15,  alt401:0,   ebitda:10,   margin:13,   patients:145,   gm:52 },
  { year:"2030", total:185,  comp:95,    alt301:90,  alt401:0,   ebitda:58,   margin:31,   patients:385,   gm:58 },
  { year:"2031", total:370,  comp:120,   alt301:220, alt401:30,  ebitda:196,  margin:53,   patients:825,   gm:62 },
  { year:"2032", total:740,  comp:140,   alt301:420, alt401:180, ebitda:438,  margin:59,   patients:1400,  gm:65 },
];

const exitData = [
  { scenario:"Early Exit\n2026–27",      valuation:45,   multiple:"2.5×", roi:"1.4×",  color:C.muted },
  { scenario:"Post ALT-301\n2029–30",    valuation:1160, multiple:"14.5×",roi:"18.5×", color:C.teal },
  { scenario:"Post ALT-401\n2031–32",    valuation:9990, multiple:"13.5×",roi:"54×",   color:C.navy },
];

const unitEconData = [
  { segment:"Compounding",  rev:180, cogs:105, opex:10,  ebitda:65, cac:220, ltv:1560, ratio:7.1 },
  { segment:"FDA-Approved", rev:625, cogs:180, opex:38,  ebitda:407, cac:220, ltv:9768, ratio:44.4 },
];

const marginData = revenueData.map(d=>({ year:d.year, gm:d.gm, ebitdaM:d.margin<0?d.margin:d.margin }));

const patientData = revenueData.map(d=>({ year:d.year, patients:d.patients }));

const competitorData = [
  { name:"Altanine", bioavail:82, timeSave:80, moat:95, cost:35, overall:88 },
  { name:"Rybelsus", bioavail:1,  timeSave:10, moat:70, cost:20, overall:40 },
  { name:"Compounders",bioavail:30,timeSave:75, moat:10, cost:50, overall:38 },
  { name:"Trad Biotech",bioavail:60,timeSave:15, moat:50, cost:20, overall:41 },
];

const investmentReasons = [
  { no:"01", title:"Immediate Cash Flow +\nAsymmetric Upside", body:"The 503B operation generates positive cash flow by Q2 2026 while the patent portfolio creates a 20-year IP moat. No other investment offers this dual-profile: revenue today, breakthrough exit tomorrow.", metric:"$5–10M", metricLabel:"Contracted Revenue" },
  { no:"02", title:"Proprietary Oral\nDelivery Technology", body:"ALT-301's 82% oral bioavailability vs Rybelsus's <1% changes the clinical calculus entirely. A 90× bioavailability advantage backed by 8 issued patents covering 400 molecules means the moat is structural, not speculative.", metric:"82%", metricLabel:"Bioavailability" },
  { no:"03", title:"Market Timing:\nThe GLP-1 Window", body:"The GLP-1 shortage represents a once-in-a-generation demand event. Polomar has the 503B licenses, the physician network, and the manufacturing capacity to capture dominant market share during the critical 2025–2028 window.", metric:"$100B+", metricLabel:"GLP-1 TAM by 2030" },
  { no:"04", title:"Dual Revenue Engine:\nFDA + 503B", body:"Two parallel revenue streams that are structurally uncorrelated. Compounding provides cash flow certainty; the FDA 505(b)(2) pathway provides breakthrough upside. The combined profile produces risk-adjusted returns rarely seen in life sciences.", metric:"$740M", metricLabel:"2032 Revenue" },
];

const risks = [
  { id:1, risk:"GLP-1 Brand Resolution", mitigation:"503A/503B licenses active; physician network contracts in place; shift to broader oral peptide portfolio", priority:"HIGH" },
  { id:2, risk:"505(b)(2) FDA Outcome", mitigation:"37.5% historical success vs 12% traditional NDA; multiple data packages submitted; $30M alternative floor via compounding", priority:"HIGH" },
  { id:3, risk:"Clinic Ramp Execution", mitigation:"8 → 125 clinics backed by signed LOIs; ForHumanity minimum guarantees provide $750K/yr regardless of volume", priority:"MEDIUM" },
  { id:4, risk:"Competitive Entry", mitigation:"8 patents, 400 molecules, 2042 expiry; licensing moat means any competitor must license from Altanine", priority:"MEDIUM" },
  { id:5, risk:"Revenue Consistency", mitigation:"ForHumanity Health + CareValidate contracts provide $5–10M floor; not speculative", priority:"LOW" },
];

/* ── HELPERS ──────────────────────────────────────────────────── */
function fmt$(n){ if(n>=1000) return `$${(n/1000).toFixed(1)}B`; if(n>=1) return `$${n}M`; return `$${(n*1000).toFixed(0)}K`; }

const CustomTooltip = ({ active, payload, label, prefix="$", suffix="M" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px",
                  boxShadow:"0 8px 24px rgba(0,0,0,0.10)", fontSize:"0.78rem" }}>
      <div style={{ fontWeight:700, color:C.navy, marginBottom:8, fontSize:"0.8rem" }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <div style={{ width:8, height:8, borderRadius:2, background:p.color||p.fill }} />
          <span style={{ color:C.muted }}>{p.name}:</span>
          <span style={{ fontWeight:700, color:C.navy, fontFamily:"IBM Plex Mono, monospace" }}>
            {prefix}{typeof p.value==="number"?p.value.toLocaleString():p.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── ANIMATED COUNTER ──────────────────────────────────────────── */
function Counter({ target, prefix="", suffix="", duration=1600 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        const start=performance.now();
        const tick=(now)=>{
          const p=Math.min((now-start)/duration,1);
          const ease=1-Math.pow(1-p,3);
          setVal(Math.round(ease*target));
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    },{threshold:0.3});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[target,duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── SECTION LABEL ─────────────────────────────────────────────── */
function SL({ n, children, light=false }) {
  return (
    <div className="sec-label" style={{ color: light ? "rgba(255,255,255,0.5)" : C.teal }}>
      <div className="sec-num" style={{ background: light ? "rgba(255,255,255,0.15)" : C.teal }}>{n}</div>
      {children}
    </div>
  );
}

/* ── FINANCIAL TABS SECTION ────────────────────────────────────── */
const FIN_TABS = [
  { id:"revenue",   label:"Revenue Streams" },
  { id:"pnl",       label:"P&L Overview" },
  { id:"margins",   label:"Margin Expansion" },
  { id:"patients",  label:"Patient Growth" },
  { id:"unit",      label:"Unit Economics" },
  { id:"exit",      label:"Exit Scenarios" },
];

function FinancialTabs({ mob }) {
  const [tab, setTab] = useState("revenue");

  return (
    <div>
      <div className="tab-bar" style={{ overflowX:"auto" }}>
        {FIN_TABS.map(t=>(
          <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Revenue Streams ── */}
      {tab==="revenue" && (
        <div className="fade-up">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"2fr 1fr", gap:24 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>Revenue by Stream — $M (2025–2032)</div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>Stacked: 503B Compounding + ALT-301 + ALT-401</div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData} margin={{ top:5, right:10, bottom:5, left:10 }}>
                  <defs>
                    <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.teal}    stopOpacity={0.6}/>
                      <stop offset="95%" stopColor={C.teal}    stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="g301" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.sky}     stopOpacity={0.7}/>
                      <stop offset="95%" stopColor={C.sky}     stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="g401" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.emerald} stopOpacity={0.7}/>
                      <stop offset="95%" stopColor={C.emerald} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                  <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="comp"  name="503B Compounding" stackId="1" stroke={C.teal}    fill="url(#gComp)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="alt301" name="ALT-301"          stackId="1" stroke={C.sky}     fill="url(#g301)"  strokeWidth={2}/>
                  <Area type="monotone" dataKey="alt401" name="ALT-401"          stackId="1" stroke={C.emerald} fill="url(#g401)"  strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { label:"503B Compounding", val:"$140M", sub:"2032 peak revenue", color:C.teal, pct:"19%" },
                { label:"ALT-301 (GLP-1)", val:"$420M", sub:"2032 — launches 2029", color:C.sky, pct:"57%" },
                { label:"ALT-401 (Sema)",  val:"$180M", sub:"2032 — launches 2031", color:C.emerald, pct:"24%" },
              ].map((s,i)=>(
                <div key={i} className="card" style={{ padding:"20px 22px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:"0.64rem", fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>{s.label}</div>
                      <div style={{ fontSize:"1.6rem", fontWeight:800, color:C.navy, letterSpacing:"-0.03em", lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:"0.72rem", color:C.muted, marginTop:4 }}>{s.sub}</div>
                    </div>
                    <div style={{ fontSize:"1.4rem", fontWeight:800, color:s.color, opacity:0.6 }}>{s.pct}</div>
                  </div>
                  <div style={{ marginTop:12, height:3, background:C.borderLt, borderRadius:2 }}>
                    <div style={{ height:"100%", background:s.color, width:s.pct, borderRadius:2 }}/>
                  </div>
                </div>
              ))}
              <div className="card" style={{ background:C.navy, border:"none", padding:"20px 22px" }}>
                <div style={{ fontSize:"0.64rem", fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>2025→2032 CAGR</div>
                <div style={{ fontSize:"2.2rem", fontWeight:800, color:"white", letterSpacing:"-0.04em", lineHeight:1 }}>89%</div>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", marginTop:4 }}>Total Revenue Growth</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: P&L Overview ── */}
      {tab==="pnl" && (
        <div className="fade-up">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.6fr 1fr", gap:24 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>Revenue vs EBITDA — $M</div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>Breakeven Q2 2026 · EBITDA profitability 2029+</div>
              <ResponsiveContainer width="100%" height={310}>
                <ComposedChart data={revenueData} margin={{ top:5, right:10, bottom:5, left:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                  <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                  <YAxis yAxisId="left" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}M`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <ReferenceLine yAxisId="right" y={0} stroke={C.border} strokeDasharray="4 4" strokeWidth={1.5}/>
                  <Bar yAxisId="left" dataKey="total" name="Revenue" fill={C.teal} opacity={0.18} radius={[3,3,0,0]}/>
                  <Line yAxisId="left"  type="monotone" dataKey="total"  name="Revenue" stroke={C.teal} strokeWidth={2.5} dot={{ fill:C.teal, r:3 }} activeDot={{ r:5 }}/>
                  <Line yAxisId="right" type="monotone" dataKey="ebitda" name="EBITDA"  stroke={C.sky}  strokeWidth={2.5} dot={{ fill:C.sky, r:3 }} activeDot={{ r:5 }} strokeDasharray="0"/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { year:"2026", rev:"$8M",  ebitda:"($4.3M)", note:"Investing in ramp", positive:false },
                { year:"2027", rev:"$18M", ebitda:"($4.8M)", note:"Breakeven Q2 2026", positive:false },
                { year:"2028", rev:"$35M", ebitda:"($2.5M)", note:"Near breakeven", positive:false },
                { year:"2029", rev:"$80M", ebitda:"$10M",  note:"ALT-301 launch", positive:true },
                { year:"2030", rev:"$185M",ebitda:"$58M",  note:"31% EBITDA margin", positive:true },
                { year:"2032", rev:"$740M",ebitda:"$438M", note:"59% EBITDA margin", positive:true },
              ].map((r,i)=>(
                <div key={i} style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"52px 1fr 1fr 80px", alignItems:"center", gap:mob?6:10,
                                      padding:"12px 16px", background:r.positive?C.ltGreen:C.borderLt,
                                      borderRadius:8, border:`1px solid ${r.positive?"#BBF7D0":C.border}` }}>
                  <div style={{ fontWeight:800, fontSize:"0.82rem", color:C.navy }}>{r.year}</div>
                  <div style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.78rem", fontWeight:700, color:C.teal }}>{r.rev}</div>
                  <div style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.78rem", fontWeight:700,
                                color:r.positive?C.emerald:C.rose }}>{r.ebitda}</div>
                  <div style={{ fontSize:"0.62rem", color:C.muted, lineHeight:1.3 }}>{r.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Margin Expansion ── */}
      {tab==="margins" && (
        <div className="fade-up">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.4fr 1fr", gap:24 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>Gross Margin & EBITDA Margin — %</div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>Margin expansion driven by FDA-approved product mix shift 2029+</div>
              <ResponsiveContainer width="100%" height={310}>
                <ComposedChart data={revenueData} margin={{ top:5, right:10, bottom:5, left:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                  <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[-160,80]} tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<CustomTooltip prefix="" suffix="%"/>}/>
                  <ReferenceLine y={0} stroke={C.border} strokeDasharray="4 3" strokeWidth={1.5} label={{ value:"Breakeven", position:"insideRight", fill:C.muted, fontSize:10 }}/>
                  <Area type="monotone" dataKey="gm"     name="Gross Margin"  stroke={C.teal}    fill={C.ltTeal}  strokeWidth={2.5}/>
                  <Line type="monotone" dataKey="margin" name="EBITDA Margin" stroke={C.sky}      strokeWidth={2.5} strokeDasharray="5 3" dot={{ fill:C.sky, r:3 }}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="card">
                <div style={{ fontSize:"0.64rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>Margin Milestones</div>
                {[
                  { label:"Gross Margin 2025",  val:"38%",  note:"503B only",             color:C.teal },
                  { label:"Gross Margin 2029",  val:"52%",  note:"ALT-301 mix improves",  color:C.teal },
                  { label:"Gross Margin 2032",  val:"65%",  note:"Full FDA mix",           color:C.teal },
                  { label:"EBITDA Margin 2029", val:"13%",  note:"First profitable year",  color:C.sky },
                  { label:"EBITDA Margin 2031", val:"53%",  note:"Scale economics",        color:C.sky },
                  { label:"EBITDA Margin 2032", val:"59%",  note:"Pharma benchmark",       color:C.sky },
                ].map((m,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                        padding:"11px 0", borderBottom:`1px solid ${C.borderLt}` }}>
                    <div>
                      <div style={{ fontSize:"0.78rem", fontWeight:600, color:C.navy }}>{m.label}</div>
                      <div style={{ fontSize:"0.68rem", color:C.muted }}>{m.note}</div>
                    </div>
                    <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1.1rem", color:m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ background:C.ltSky, border:`1px solid #BAE6FD` }}>
                <div style={{ fontSize:"0.72rem", lineHeight:1.65, color:C.slate }}>
                  <strong style={{ color:C.sky }}>Why margins expand:</strong> ALT-301/ALT-401 carry ~70–75% gross margins vs 38–45% for compounding. Every $1 of FDA revenue is structurally worth ~2× compounding revenue at the gross profit line.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Patient Growth ── */}
      {tab==="patients" && (
        <div className="fade-up">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.5fr 1fr", gap:24 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>Cumulative Patients Served — 000s</div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>From 1,200 patients (2025) to 1.4 million (2032)</div>
              <ResponsiveContainer width="100%" height={310}>
                <AreaChart data={revenueData} margin={{ top:5, right:10, bottom:5, left:10 }}>
                  <defs>
                    <linearGradient id="gPat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.sky} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={C.sky} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                  <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}K`}/>
                  <Tooltip content={<CustomTooltip prefix="" suffix="K patients"/>}/>
                  <Area type="monotone" dataKey="patients" name="Patients" stroke={C.sky} fill="url(#gPat)" strokeWidth={2.5} dot={{ fill:C.sky, r:3 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { yr:"2025", pts:"1.2K",  clinic:"8",   rppmo:"$180",  yoy:"—" },
                { yr:"2026", pts:"18K",   clinic:"50",  rppmo:"$180",  yoy:"1,400%" },
                { yr:"2027", pts:"52K",   clinic:"125", rppmo:"$180",  yoy:"189%" },
                { yr:"2028", pts:"82K",   clinic:"+",   rppmo:"$180",  yoy:"58%" },
                { yr:"2029", pts:"145K",  clinic:"+",   rppmo:"$625",  yoy:"77%" },
                { yr:"2032", pts:"1.4M",  clinic:"N/A", rppmo:"$625",  yoy:"—" },
              ].map((r,i)=>(
                <div key={i} style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr 1fr":"42px 64px 40px 52px 62px", alignItems:"center",
                                      gap:mob?8:8, padding:"10px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:800, fontSize:"0.8rem", color:C.navy }}>{r.yr}</div>
                  <div style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.8rem", fontWeight:700, color:C.sky }}>{r.pts}</div>
                  <div style={{ fontSize:"0.68rem", color:C.muted }}>{r.clinic === "N/A" ? "" : r.clinic+" clinics"}</div>
                  <div style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.72rem", color:C.teal }}>{r.rppmo}<span style={{ fontSize:"0.58rem" }}>/mo</span></div>
                  <div style={{ fontSize:"0.68rem", color:r.yoy==="—"?C.muted:C.emerald, fontWeight:600 }}>{r.yoy}</div>
                </div>
              ))}
              <div className="card" style={{ background:C.navy, border:"none" }}>
                <div style={{ fontSize:"0.64rem", color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, fontWeight:700 }}>Breakeven Threshold</div>
                <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1.5rem", color:"white", lineHeight:1 }}>~1,800</div>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.45)", marginTop:4 }}>patients for unit break-even at $180/mo</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Unit Economics ── */}
      {tab==="unit" && (
        <div className="fade-up">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:24 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>Revenue Stack / Patient / Month ($)</div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>Compounding vs FDA-Approved — per patient economics</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={unitEconData} margin={{ top:5, right:10, bottom:5, left:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                  <XAxis dataKey="segment" tick={{ fontSize:12, fill:C.navy, fontWeight:600 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                  <Tooltip content={<CustomTooltip prefix="$" suffix="/mo"/>}/>
                  <Bar dataKey="cogs"   name="COGS"   fill={C.rose}    opacity={0.7} stackId="a" radius={[0,0,0,0]}/>
                  <Bar dataKey="opex"   name="OpEx"   fill="#f59e0b"   opacity={0.6} stackId="a" radius={[0,0,0,0]}/>
                  <Bar dataKey="ebitda" name="EBITDA" fill={C.emerald} opacity={0.85} stackId="a" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>LTV / CAC Ratio</div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>Compounding: 7.1× · FDA-Approved: 44.4×</div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {unitEconData.map((u,i)=>(
                  <div key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, alignItems:"center" }}>
                      <span style={{ fontSize:"0.8rem", fontWeight:700, color:C.navy }}>{u.segment}</span>
                      <span style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1.1rem", color:i===0?C.teal:C.sky }}>{u.ratio}×</span>
                    </div>
                    <div style={{ height:8, background:C.borderLt, borderRadius:4 }}>
                      <div style={{ height:"100%", background:i===0?C.teal:C.sky, borderRadius:4, width:`${u.ratio/50*100}%`, transition:"width 1s" }}/>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:"0.68rem", color:C.muted }}>
                      <span>LTV: <strong style={{ color:C.navy }}>${u.ltv.toLocaleString()}</strong></span>
                      <span>CAC: <strong style={{ color:C.navy }}>${u.cac}</strong></span>
                      <span>EBITDA/mo: <strong style={{ color:C.navy }}>${u.ebitda}</strong></span>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
                  <div style={{ fontSize:"0.72rem", color:C.muted, lineHeight:1.65 }}>
                    <strong style={{ color:C.navy }}>Top-decile SaaS benchmark:</strong> 3–5× LTV/CAC.<br/>
                    Altanine compounding: <strong style={{ color:C.teal }}>7.1×</strong> · FDA track: <strong style={{ color:C.sky }}>44.4×</strong> — 4–15× above comparable benchmarks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Exit Scenarios ── */}
      {tab==="exit" && (
        <div className="fade-up">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.4fr 1fr", gap:24 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>Exit Valuation by Scenario — $M</div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>Based on Assumptions exit multiples × revenue at exit date</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={exitData} layout="vertical" margin={{ top:5, right:60, bottom:5, left:100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} horizontal={false}/>
                  <XAxis type="number" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                  <YAxis type="category" dataKey="scenario" tick={{ fontSize:11, fill:C.navy, fontWeight:600 }} axisLine={false} tickLine={false} width={90}/>
                  <Tooltip content={<CustomTooltip prefix="$" suffix="M"/>}/>
                  <Bar dataKey="valuation" name="Valuation" radius={[0,6,6,0]}>
                    <Cell fill={C.border}/>
                    <Cell fill={C.teal}/>
                    <Cell fill={C.navy}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { label:"Early Exit 2026–27",     mult:"2.5×", roi:"1.4×",   val:"$45M",   bg:C.bg,        bdr:C.border,     tc:C.navy,    rc:"#94a3b8" },
                { label:"Post ALT-301 2029–30",   mult:"14.5×",roi:"18.5×",  val:"$1.16B", bg:C.ltTeal,    bdr:C.teal+"55",  tc:C.teal,    rc:C.sky },
                { label:"Post ALT-401 2031–32",   mult:"13.5×",roi:"54×",    val:"$9.99B", bg:"#1B2A4A11",  bdr:C.navy+"44",  tc:C.navy,    rc:C.emerald },
              ].map((s,i)=>(
                <div key={i} style={{ padding:"20px 22px", background:s.bg, borderRadius:12, border:`1px solid ${s.bdr}` }}>
                  <div style={{ fontSize:"0.64rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>{s.label}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    {[["Multiple",s.mult,s.tc],["ROI",s.roi,s.rc],["Value",s.val,C.navy]].map(([k,v,c],j)=>(
                      <div key={j}>
                        <div style={{ fontSize:"0.6rem", color:C.muted, marginBottom:3 }}>{k}</div>
                        <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1rem", color:c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ padding:"16px 20px", background:C.ltSky, borderRadius:12, border:`1px solid #BAE6FD` }}>
                <div style={{ fontSize:"0.72rem", color:C.slate, lineHeight:1.65 }}>
                  <strong style={{ color:C.sky }}>Comparable M&A:</strong> Emisphere (14× rev · Novo), Catalent ($11.5B · Novo Holdings), Adare (10× rev). All oral delivery pharma.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════════ */
/* ── DATA ────────────────────────────────────────────────────── */
const YEARS = ["2026","2027","2028","2029","2030","2031","2032"];

// Pre-calculated from Python model
const scenarios = {
  s1: {
    id:"s1", label:"Scenario 1", sublabel:"Debt-Only",
    color:"#8B2252", ltColor:"#F9EEF4",
    total:14.25, equity:0, debt:14.25, cost:"15.4%", dilution:"0%",
    tag:"DEBT ONLY", tagColor:"#8B2252",
    summary:"Replace Series A entirely with receivables, royalty monetization, and IP-backed lending.",
    sources:[
      { name:"Receivables Financing", amt:4.5,  type:"Debt · SOFR+5% · 36mo revolving", color:C.teal },
      { name:"Royalty Monetization",  amt:4.0,  type:"Royalty · 2.0× return · 2.5% of rev", color:C.sky },
      { name:"IP-Backed Lending",     amt:4.0,  type:"Debt · SOFR+10% · 36mo term", color:"#8B2252" },
      { name:"SBIR/STTR Grants",      amt:1.75, type:"Grant · non-dilutive", color:C.emerald },
    ],
    cashflow:[
      { year:"2026", rev:6.0,   ebitda:0.8,   interest:1.2,  principal:1.5, fcf:-2.2, dscr:0.3 },
      { year:"2027", rev:18.0,  ebitda:4.2,   interest:2.0,  principal:2.1, fcf:-1.3, dscr:1.0 },
      { year:"2028", rev:28.0,  ebitda:6.2,   interest:2.1,  principal:2.1, fcf:-0.3, dscr:1.5 },
      { year:"2029", rev:42.0,  ebitda:12.8,  interest:0.9,  principal:1.4, fcf:6.1,  dscr:5.4 },
      { year:"2030", rev:156.0, ebitda:58.0,  interest:3.9,  principal:0.0, fcf:35.9, dscr:14.9 },
      { year:"2031", rev:412.0, ebitda:198.0, interest:1.8,  principal:0.0, fcf:137.0,dscr:99.0 },
      { year:"2032", rev:740.0, ebitda:438.0, interest:0.0,  principal:0.0, fcf:313.7,dscr:999 },
    ],
    instruments:[
      { name:"Receivables Financing", principal:"$4.5M", rate:"10.0%", y1interest:"$0.45M", total:"$1.35M / 3yr" },
      { name:"Royalty Monetization",  principal:"$4.0M", rate:"~22% IRR", y1interest:"$0.15M", total:"$8.0M (2.0×)" },
      { name:"IP-Backed Lending",     principal:"$4.0M", rate:"15.0%", y1interest:"$0.60M", total:"$1.80M / 3yr" },
      { name:"SBIR Grants",           principal:"$1.75M",rate:"0%",    y1interest:"$0",     total:"$0 non-dilutive" },
    ],
    risks:["0.3× DSCR in 2026 — covenant breach risk without equity buffer","IP lien blocks M&A until fully discharged (~$2–3M at exit)","Royalty monetization requires 12-month revenue history (Q4 2026)","No equity buffer means single missed milestone = default acceleration"],
  },

  s2: {
    id:"s2", label:"Scenario 2", sublabel:"Hybrid — Recommended",
    color:C.teal, ltColor:C.ltTeal,
    total:12.75, equity:4.0, debt:8.75, cost:"10.5%", dilution:"~31%",
    tag:"RECOMMENDED", tagColor:C.teal,
    summary:"Reduce equity to $4M, supplement with receivables financing and venture debt. Lowest cost of capital.",
    sources:[
      { name:"Series A Equity (reduced)", amt:4.0,  type:"Equity · ~31% of total capital", color:C.navy },
      { name:"Receivables Financing",     amt:4.5,  type:"Debt · SOFR+5% · 36mo revolving", color:C.teal },
      { name:"Venture Debt",              amt:2.5,  type:"Debt · SOFR+6% · 15mo IO · warrants $37K", color:C.sky },
      { name:"SBIR/STTR Grants",          amt:1.75, type:"Grant · non-dilutive", color:C.emerald },
    ],
    cashflow:[
      { year:"2026", rev:6.0,   ebitda:0.8,   interest:0.74, principal:1.5,  fcf:-1.7, dscr:0.4 },
      { year:"2027", rev:18.0,  ebitda:4.2,   interest:0.79, principal:2.0,  fcf:-0.1, dscr:1.5 },
      { year:"2028", rev:28.0,  ebitda:6.2,   interest:0.37, principal:2.7,  fcf:0.7,  dscr:2.0 },
      { year:"2029", rev:42.0,  ebitda:12.8,  interest:0.29, principal:0.6,  fcf:7.4,  dscr:14.5 },
      { year:"2030", rev:156.0, ebitda:58.0,  interest:0.0,  principal:0.0,  fcf:39.0, dscr:999 },
      { year:"2031", rev:412.0, ebitda:198.0, interest:0.0,  principal:0.0,  fcf:138.4,dscr:999 },
      { year:"2032", rev:740.0, ebitda:438.0, interest:0.0,  principal:0.0,  fcf:313.7,dscr:999 },
    ],
    instruments:[
      { name:"Series A Equity", principal:"$4.0M", rate:"Dilution only", y1interest:"—", total:"~31% equity given" },
      { name:"Receivables Financing", principal:"$4.5M", rate:"10.0%", y1interest:"$0.45M", total:"$1.35M / 3yr" },
      { name:"Venture Debt",    principal:"$2.5M", rate:"11.5%", y1interest:"$0.29M", total:"$0.87M + $0.04M warrants" },
      { name:"SBIR Grants",     principal:"$1.75M",rate:"0%",    y1interest:"$0",     total:"$0 non-dilutive" },
    ],
    risks:["~31% equity dilution (vs 0% in Scens 1&3)","Venture debt requires institutional equity co-investor","Warrant coverage ~$37K (~0.3% dilution equivalent)","Smallest total capital of the three scenarios"],
  },

  s3: {
    id:"s3", label:"Scenario 3", sublabel:"Grow Receivables First",
    color:C.amber, ltColor:C.ltAmber,
    total:10.25, equity:0, debt:10.25, cost:"15.6%", dilution:"0% now",
    tag:"HIGHEST VALUE PATH", tagColor:C.amber,
    summary:"Close receivables + royalty now, grow clinic base 60–90 days, then raise equity at 2–3× higher valuation.",
    sources:[
      { name:"Receivables Financing", amt:4.5,  type:"Debt · SOFR+5% · available now", color:C.teal },
      { name:"Royalty Monetization",  amt:4.0,  type:"Royalty · 2.0× return · Month 6+", color:C.sky },
      { name:"SBIR/STTR Grants",      amt:1.75, type:"Grant · non-dilutive", color:C.emerald },
      { name:"Deferred Equity Raise", amt:0,    type:"$5–7M raised Month 9–12 at 2–3× higher val", color:C.amber },
    ],
    cashflow:[
      { year:"2026", rev:6.0,   ebitda:0.8,   interest:0.6,  principal:1.5, fcf:-1.6, dscr:0.4 },
      { year:"2027", rev:18.0,  ebitda:4.2,   interest:0.6,  principal:1.8, fcf:0.3,  dscr:1.75 },
      { year:"2028", rev:28.0,  ebitda:6.2,   interest:0.75, principal:1.9, fcf:1.3,  dscr:2.3 },
      { year:"2029", rev:42.0,  ebitda:12.8,  interest:1.05, principal:0.0, fcf:7.4,  dscr:12.2 },
      { year:"2030", rev:156.0, ebitda:58.0,  interest:3.9,  principal:0.0, fcf:35.9, dscr:14.9 },
      { year:"2031", rev:412.0, ebitda:198.0, interest:1.75, principal:0.0, fcf:137.0,dscr:99.0 },
      { year:"2032", rev:740.0, ebitda:438.0, interest:0.0,  principal:0.0, fcf:313.7,dscr:999 },
    ],
    instruments:[
      { name:"Receivables Financing", principal:"$4.5M", rate:"10.0%", y1interest:"$0.45M", total:"$1.35M / 3yr" },
      { name:"Royalty Monetization",  principal:"$4.0M", rate:"~22% IRR", y1interest:"$0.15M", total:"$8.0M (2.0×)" },
      { name:"SBIR Grants",           principal:"$1.75M",rate:"0%",    y1interest:"$0",     total:"$0 non-dilutive" },
      { name:"Deferred Equity",       principal:"$5–7M", rate:"Dilution",y1interest:"—",     total:"Month 9–12 at higher val" },
    ],
    risks:["Requires existing cash to bridge 60–90 days (receivables close)","Royalty payments peak in 2030 ($3.9M) — drag vs S2 debt-free by 2030","Clinic LOI conversion is the critical execution dependency","Higher blended cost of capital (15.6%) vs Scenario 2 (10.5%)"],
  },
};

const comparisonData = [
  { metric:"Total Capital",   s1:"$14.3M",  s2:"$12.8M",  s3:"$10.3M" },
  { metric:"Equity Raise",    s1:"$0",      s2:"$4.0M",   s3:"$0 now" },
  { metric:"Total Debt",      s1:"$14.3M",  s2:"$8.75M",  s3:"$10.3M" },
  { metric:"Equity Dilution", s1:"0%",      s2:"~31%",    s3:"0% now" },
  { metric:"Blended CoC",     s1:"15.4%",   s2:"10.5%",   s3:"15.6%" },
  { metric:"Y1 Debt Service", s1:"$2.7M",   s2:"$2.2M",   s3:"$2.1M" },
  { metric:"First +FCF Year", s1:"2029",    s2:"2028",    s3:"2027" },
  { metric:"Debt-Free Year",  s1:"2031",    s2:"2030",    s3:"2031" },
  { metric:"IP Lien Risk",    s1:"HIGH",    s2:"NONE",    s3:"NONE" },
  { metric:"Availability Now",s1:"Partial", s2:"Full",    s3:"Full" },
];

const stressData = [
  { year:"2026", base:0.8,  stress:0.56, ds:2.2,  dscr_base:0.4,  dscr_stress:0.25 },
  { year:"2027", base:4.2,  stress:2.94, ds:2.8,  dscr_base:1.5,  dscr_stress:1.05 },
  { year:"2028", base:6.2,  stress:4.34, ds:3.1,  dscr_base:2.0,  dscr_stress:1.4  },
  { year:"2029", base:12.8, stress:8.96, ds:0.9,  dscr_base:14.5, dscr_stress:9.95 },
  { year:"2030", base:58.0, stress:40.6, ds:0.0,  dscr_base:999,  dscr_stress:999  },
];

const lenders = [
  { cat:"Receivables", name:"White Oak Healthcare Finance", size:"$5M–$150M",  timing:"30–45 days", fit:"Healthcare ABL specialist", priority:1 },
  { cat:"Receivables", name:"Prestige Capital",             size:"$250K–$20M", timing:"5–10 days",  fit:"Spot factoring; fastest close", priority:1 },
  { cat:"Receivables", name:"SLR Healthcare ABL",           size:"$3M–$75M",   timing:"30–45 days", fit:"503B compounding experience", priority:2 },
  { cat:"Venture Debt",name:"Runway Growth Capital",        size:"$5M–$30M",   timing:"30–60 days", fit:"Revenue-generating Series A focus", priority:1 },
  { cat:"Venture Debt",name:"Western Technology Invest.",   size:"$2M–$25M",   timing:"30–60 days", fit:"Early-stage friendly; flexible draws", priority:1 },
  { cat:"Venture Debt",name:"Hercules Capital (HTGC)",      size:"$5M–$100M",  timing:"45–60 days", fit:"Largest life sci lender; public BDC", priority:2 },
  { cat:"Royalty",     name:"SWK Holdings",                 size:"$2M–$25M",   timing:"60–90 days", fit:"Most flexible on revenue stage", priority:1 },
  { cat:"Royalty",     name:"HealthCare Royalty Partners",  size:"$5M–$200M",  timing:"90 days",    fit:"505(b)(2) track record", priority:2 },
  { cat:"Royalty",     name:"Decathlon Capital",            size:"$1M–$10M",   timing:"30–45 days", fit:"Revenue share; no IP involvement", priority:1 },
  { cat:"IP-Backed",   name:"Brevet Capital",               size:"$5M–$75M",   timing:"60–90 days", fit:"Most active pharma IP lender", priority:1 },
  { cat:"IP-Backed",   name:"Acacia Research",              size:"$2M–$25M",   timing:"60–90 days", fit:"Can structure without full portfolio lien", priority:2 },
  { cat:"Grants",      name:"NIH NIDDK SBIR Phase I",       size:"$150–300K",  timing:"6–12 months",fit:"T2 Diabetes; ALT-301 core indication", priority:1 },
  { cat:"Grants",      name:"BARDA BAA",                    size:"$1M–$20M",   timing:"Rolling",    fit:"GLP-1 shortage / domestic compounding", priority:1 },
];

/* ── HELPERS ─────────────────────────────────────────────────── */

function DSCRBadge({ val }) {
  if (val >= 999) return <span style={{ background:C.ltGreen, color:C.emerald, fontWeight:700, fontSize:"0.7rem", padding:"2px 8px", borderRadius:99 }}>Debt-Free</span>;
  const bg  = val >= 1.5 ? C.ltGreen  : val >= 1.0 ? C.ltAmber  : C.ltRed;
  const clr = val >= 1.5 ? C.emerald  : val >= 1.0 ? C.amber    : C.rose;
  return <span style={{ background:bg, color:clr, fontWeight:700, fontSize:"0.7rem", padding:"2px 8px", borderRadius:99 }}>{val.toFixed(1)}×</span>;
}


/* ── GLOBAL STYLES ───────────────────────────────────────────── */

/* ── SCROLL PROGRESS ─────────────────────────────────────────── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setPct(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div style={{ position:"fixed", top:60, left:0, right:0, height:2,
    background:C.border, zIndex:99 }}>
    <div style={{ height:"100%", background:C.teal, width:`${pct}%`, transition:"width 0.1s" }}/>
  </div>;
}

/* ── SCENARIO DEEP-DIVE TAB ─────────────────────────────────── */
function ScenarioTab({ s, mob }) {
  return (
    <div className="fade-up">
      {/* Sources & Uses */}
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1.6fr", gap:24, marginBottom:32 }}>
        {/* Sources pie-style breakdown */}
        <div className="card">
          <div style={{ fontSize:"0.64rem", fontWeight:700, color:s.color, textTransform:"uppercase",
                        letterSpacing:"0.12em", marginBottom:4 }}>Sources of Capital</div>
          <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>
            Total: <span style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700, color:C.navy }}>
              ${s.total}M
            </span>
          </div>
          {s.sources.map((src,i) => {
            const pct = src.amt > 0 ? ((src.amt / s.total) * 100).toFixed(0) : 0;
            return (
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <div>
                    <div style={{ fontSize:"0.75rem", fontWeight:600, color:C.navy }}>{src.name}</div>
                    <div style={{ fontSize:"0.68rem", color:C.muted }}>{src.type}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700,
                                  color:s.color, fontSize:"0.9rem" }}>
                      {src.amt > 0 ? `$${src.amt}M` : "—"}
                    </div>
                    {src.amt > 0 && <div style={{ fontSize:"0.65rem", color:C.muted }}>{pct}%</div>}
                  </div>
                </div>
                <div style={{ height:4, background:C.borderLt, borderRadius:2 }}>
                  <div style={{ height:"100%", background:src.color, width:`${pct}%`,
                                borderRadius:2, transition:"width 0.6s ease" }}/>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:"0.72rem", color:C.muted }}>Equity Dilution</span>
              <span style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700, color:C.navy }}>{s.dilution}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:"0.72rem", color:C.muted }}>Blended Cost of Debt</span>
              <span style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700, color:s.color }}>{s.cost}</span>
            </div>
          </div>
        </div>

        {/* FCF Waterfall Chart */}
        <div className="card">
          <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>
            Free Cash Flow After Debt Service — $M
          </div>
          <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>
            EBITDA → FCF after interest, principal repayment & taxes
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={s.cashflow} margin={{ top:5, right:10, bottom:5, left:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
              <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}
                     tickFormatter={v=>`$${v}M`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <ReferenceLine y={0} stroke={C.border} strokeWidth={1.5}/>
              <Bar dataKey="ebitda" name="EBITDA" fill={s.color} fillOpacity={0.2} radius={[3,3,0,0]}/>
              <Line type="monotone" dataKey="fcf" name="FCF After DS" stroke={s.color}
                    strokeWidth={2.5} dot={{ r:4, fill:s.color }} activeDot={{ r:6 }}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Debt Service + DSCR table */}
      <div className="card" style={{ marginBottom:24 }}>
        <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:20 }}>
          Debt Schedule & Coverage Ratios
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem" }}>
            <thead>
              <tr style={{ background:C.navy }}>
                {["Year","Revenue","EBITDA","Interest","Principal","Debt Service","FCF After DS","DSCR"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", color:"white", fontWeight:700,
                                       textAlign:h==="Year"?"left":"right", fontSize:"0.7rem",
                                       whiteSpace:"nowrap", letterSpacing:"0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.cashflow.map((row,i) => {
                const ds = row.interest + row.principal;
                return (
                  <tr key={i} style={{ background:i%2===0?C.surface:C.bg }}>
                    <td style={{ padding:"9px 14px", fontWeight:700, color:C.navy }}>{row.year}</td>
                    {[row.rev, row.ebitda, row.interest, row.principal].map((v,j)=>(
                      <td key={j} style={{ padding:"9px 14px", textAlign:"right",
                                           fontFamily:"IBM Plex Mono, monospace", fontSize:"0.75rem",
                                           color:C.navy }}>
                        ${v.toFixed(1)}M
                      </td>
                    ))}
                    <td style={{ padding:"9px 14px", textAlign:"right", fontFamily:"IBM Plex Mono, monospace",
                                 fontSize:"0.75rem", fontWeight:700, color:ds===0?C.muted:C.navy }}>
                      {ds===0?"—":`$${ds.toFixed(1)}M`}
                    </td>
                    <td style={{ padding:"9px 14px", textAlign:"right", fontFamily:"IBM Plex Mono, monospace",
                                 fontSize:"0.75rem", fontWeight:700,
                                 color: row.fcf >= 0 ? C.emerald : C.rose }}>
                      {row.fcf >= 0 ? `$${row.fcf.toFixed(1)}M` : `($${Math.abs(row.fcf).toFixed(1)}M)`}
                    </td>
                    <td style={{ padding:"9px 14px", textAlign:"right" }}>
                      <DSCRBadge val={row.dscr}/>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost of Capital + Risks */}
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.5fr 1fr", gap:24 }}>
        <div className="card">
          <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:16 }}>
            Cost of Capital by Instrument
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.75rem" }}>
            <thead>
              <tr>
                {["Instrument","Principal","Rate","Y1 Interest","Total Cost"].map(h=>(
                  <th key={h} style={{ padding:"8px 12px", color:C.muted, fontWeight:600,
                                       textAlign:h==="Instrument"?"left":"right",
                                       borderBottom:`2px solid ${C.border}`, fontSize:"0.68rem",
                                       letterSpacing:"0.06em", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.instruments.map((inst,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${C.borderLt}` }}>
                  <td style={{ padding:"9px 12px", fontWeight:600, color:C.navy }}>{inst.name}</td>
                  <td style={{ padding:"9px 12px", textAlign:"right", fontFamily:"IBM Plex Mono, monospace", color:C.navy }}>{inst.principal}</td>
                  <td style={{ padding:"9px 12px", textAlign:"right", fontFamily:"IBM Plex Mono, monospace", color:s.color, fontWeight:700 }}>{inst.rate}</td>
                  <td style={{ padding:"9px 12px", textAlign:"right", fontFamily:"IBM Plex Mono, monospace", color:C.navy }}>{inst.y1interest}</td>
                  <td style={{ padding:"9px 12px", textAlign:"right", fontFamily:"IBM Plex Mono, monospace", color:C.muted, fontSize:"0.7rem" }}>{inst.total}</td>
                </tr>
              ))}
              <tr style={{ background:s.ltColor }}>
                <td colSpan={2} style={{ padding:"9px 12px", fontWeight:700, color:C.navy }}>Blended CoC (debt only)</td>
                <td style={{ padding:"9px 12px", textAlign:"right", fontFamily:"IBM Plex Mono, monospace", fontWeight:800, color:s.color }}>{s.cost}</td>
                <td colSpan={2}/>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{ borderTop:`3px solid ${s.color}` }}>
          <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:16 }}>
            Key Risks & Trade-offs
          </div>
          {s.risks.map((r,i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:s.color,
                            marginTop:5, flexShrink:0 }}/>
              <span style={{ fontSize:"0.75rem", color:C.muted, lineHeight:1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [scrollPct,    setScrollPct]    = useState(0);
  const [activeNav,    setActiveNav]    = useState("overview");
  const [mainView,     setMainView]     = useState("main"); // "main" | "creative"
  const [activeRisk,   setActiveRisk]   = useState(null);
  const [scenTab,      setScenTab]      = useState("s2");
  const [lenderCat,    setLenderCat]    = useState("All");
  const [creativeTab,  setCreativeTab]  = useState("capital");
  const mob = useIsMobile();

  useEffect(()=>{
    const onScroll=()=>{
      const h=document.documentElement.scrollHeight-window.innerHeight;
      setScrollPct(h>0 ? window.scrollY/h : 0);
      const secs=["overview","problem","thesis","financials","technology","exit","risk","capital"];
      for(const id of [...secs].reverse()){
        const el=document.getElementById(id);
        if(el && window.scrollY>=el.offsetTop-100){ setActiveNav(id); break; }
      }
    };
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });

  const navLinks = [
    { id:"overview",    label:"Overview" },
    { id:"problem",     label:"Problem · Solution" },
    { id:"thesis",      label:"Investment Thesis" },
    { id:"financials",  label:"Financials" },
    { id:"technology",  label:"Technology" },
    { id:"exit",        label:"Exit Scenarios" },
    { id:"risk",        label:"Risk" },
  ];

  const s = scenarios[scenTab];
  const lCats = ["All","Receivables","Venture Debt","Royalty","IP-Backed","Grants"];
  const filteredLenders = lenderCat==="All" ? lenders : lenders.filter(l=>l.cat===lenderCat);

  return (
    <div className="site">
      <GlobalStyle />

      {/* ── SCROLL PROGRESS ── */}
      <div style={{ position:"fixed", top:0, left:0, right:0, height:2, zIndex:200, background:C.borderLt }}>
        <div className="progress-bar" style={{ transform:`scaleX(${scrollPct})`, height:"100%", background:C.teal }}/>
      </div>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-dot"/>
          ALTANINE HEALTH
          <span style={{ fontWeight:400, color:C.muted, marginLeft:4, fontSize:"0.64rem", letterSpacing:"0.06em" }}>
            · Polomar Health
          </span>
        </div>
        <div className="nav-links">
          {navLinks.map(n=>(
            <div key={n.id} className={`nav-link${activeNav===n.id?" active":""}`} onClick={()=>{ setMainView("main"); scrollTo(n.id); }}>
              {n.label}
              {n.id==="financials" && <span className="nav-badge" style={{ marginLeft:6 }}>CHARTS</span>}
            </div>
          ))}
          <div
            className={`nav-link${mainView==="creative"?" active":""}`}
            onClick={()=>setMainView(v=>v==="creative"?"main":"creative")}
            style={{ borderLeft:`1px solid ${C.borderLt}`, paddingLeft:16, marginLeft:4,
                     color:mainView==="creative"?C.teal:C.muted,
                     fontWeight:mainView==="creative"?700:500 }}
          >
            Creative Strategies
            <span className="nav-badge" style={{ marginLeft:6, background:mainView==="creative"?"rgba(15,123,140,0.15)":undefined }}>NEW</span>
          </div>
        </div>
        {!mob && <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="chip chip-teal">Series A · $10M</div>
          <div style={{ fontSize:"0.7rem", color:C.muted, fontFamily:"IBM Plex Mono, monospace" }}>CONFIDENTIAL</div>
        </div>}
      </nav>

      {/* ══ MAIN SCROLL CONTENT ══════════════════════════════════════ */}
      {mainView === "main" && <>

      {/* ══ 01 HERO / OVERVIEW ══════════════════════════════════════ */}
      <div id="overview" style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
        <div className="section">
          {/* Eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
            <span className="chip chip-teal">Series A — $10M</span>
            <span className="chip chip-navy">February 2026</span>
            <span className="chip chip-sky">Confidential</span>
          </div>

          {/* Headline */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 380px", gap:mob?32:48, alignItems:"start" }}>
            <div>
              <h1 className="serif fade-up" style={{ fontSize:"clamp(2.6rem,5vw,4.2rem)", lineHeight:1.1, color:C.navy, marginBottom:24, letterSpacing:"-0.01em" }}>
                The Future of Oral<br />Pharmaceutical Delivery<br />
                <span style={{ color:C.teal }}>Is Already Here.</span>
              </h1>
              <p className="fade-up delay-1" style={{ fontSize:"1.05rem", lineHeight:1.8, color:C.muted, maxWidth:600, marginBottom:36 }}>
                Altanine Inc. + Polomar Health Services have built a rare combination: a revenue-generating compounding operation today, and a patent-protected oral drug delivery platform targeting $740M by 2032.
              </p>
              <div className="fade-up delay-2" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[
                  { label:"Q2 2026 Breakeven", color:C.teal },
                  { label:"8 U.S. Patents · 400 Molecules", color:C.sky },
                  { label:"18–54× ROI Scenarios", color:C.navy },
                  { label:"505(b)(2) Fast Path", color:C.emerald },
                ].map((t,i)=>(
                  <div key={i} className="chip" style={{ background:`${t.color}14`, color:t.color, border:`1px solid ${t.color}33` }}>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Deal summary card */}
            <div className="fade-up delay-3" style={{ border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", boxShadow:"0 4px 20px rgba(27,42,74,0.07)" }}>
              <div style={{ background:C.navy, padding:"20px 24px" }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.18em" }}>Series A · February 2026</div>
                <div style={{ color:"white", fontWeight:800, fontSize:"1.15rem", marginTop:6, letterSpacing:"-0.01em", lineHeight:1.25 }}>Altanine Health<br/>+ Polomar Health Services</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.73rem", marginTop:8, fontStyle:"italic" }}>Strategic merger · Confidential offering</div>
              </div>
              <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Series A Target",  val:"$10,000,000", mono:true, color:C.navy },
                  { label:"2027 Revenue",      val:"$18M",        mono:true, color:C.teal },
                  { label:"2032 Revenue",      val:"$740M",       mono:true, color:C.sky },
                  { label:"Peak Exit Return",  val:"54×",         mono:true, color:C.emerald },
                  { label:"Patents",           val:"8 Issued",    mono:false, color:C.navy },
                  { label:"Breakeven",         val:"Q2 2026",     mono:false, color:C.navy },
                ].map((r,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                        padding:"8px 0", borderBottom:`1px solid ${C.borderLt}` }}>
                    <span style={{ fontSize:"0.72rem", color:C.muted }}>{r.label}</span>
                    <span style={{ fontFamily:r.mono?"IBM Plex Mono, monospace":"inherit", fontWeight:700, fontSize:"0.85rem", color:r.color }}>{r.val}</span>
                  </div>
                ))}
                {/* CEO contact footer */}
                <div style={{ paddingTop:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy }}>Charles Andres</div>
                    <div style={{ fontSize:"0.68rem", color:C.muted }}>CEO · candres@altanine.com</div>
                  </div>
                  <span className="chip chip-teal" style={{ fontSize:"0.58rem" }}>Contact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div style={{ background:C.navy, borderBottom:`1px solid ${C.navy2}` }}>
        <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 56px",
                      display:"grid",
                      gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(5,1fr)" }}>
          {[
            { label:"Series A Target",  val:"$10M",    note:"Raise" },
            { label:"2032 Revenue",     val:"$740M",   note:"Projection" },
            { label:"Peak Exit Return", val:"54×",     note:"Post ALT-401" },
            { label:"Bioavailability",  val:"82%",     note:"vs <1% Rybelsus" },
            { label:"IP Portfolio",     val:"8 Patents",note:"400+ molecules" },
          ].map((t,i)=>(
            <div key={i} style={{
              padding:"22px 0",
              borderRight: i < 4 ? `1px solid rgba(255,255,255,0.07)` : "none",
              paddingLeft: i === 0 ? 0 : 28,
              paddingRight: i === 4 ? 0 : 28,
              display:"flex", flexDirection:"column", gap:5
            }}>
              <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800,
                            fontSize:"clamp(1.1rem,2vw,1.5rem)", color:"white",
                            letterSpacing:"-0.02em", lineHeight:1 }}>{t.val}</div>
              <div style={{ fontSize:"0.64rem", fontWeight:700, color:C.teal,
                            textTransform:"uppercase", letterSpacing:"0.12em" }}>{t.label}</div>
              <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.35)" }}>{t.note}</div>
            </div>
          ))}
        </div>
      </div>


      {/* ══ 02 PROBLEM / SOLUTION ═══════════════════════════════ */}
      <div id="problem" style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div className="section">
          <SL n={2}>Problem · Solution</SL>

          {/* Framing headline */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1.6fr", gap:40, marginBottom:52, alignItems:"start" }}>
            <div>
              <h2 className="serif" style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", lineHeight:1.2, marginBottom:16 }}>
                Three broken systems.<br /><span style={{ color:C.teal }}>One unified solution.</span>
              </h2>
              <div className="accent-rule"/>
              <p style={{ fontSize:"0.9rem", lineHeight:1.8, color:C.muted }}>
                The pharmaceutical industry has failed patients, clinicians, and investors in three distinct ways simultaneously. Altanine-Polomar was built to solve all three — not sequentially, but structurally, from day one.
              </p>
            </div>
            {/* Summary bridge stat */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {[
                { n:"18M+", label:"GLP-1 patients underserved", sub:"FDA shortage active Feb 2026", color:C.rose },
                { n:"<1%",  label:"Rybelsus oral absorption", sub:"vs 82% ALT-301 platform", color:"#f59e0b" },
                { n:"12%",  label:"Traditional NDA success", sub:"vs 37.5% via 505(b)(2)", color:C.teal },
              ].map((s,i)=>(
                <div key={i} className="stat-card" style={{ borderTop:`3px solid ${s.color}` }}>
                  <div className="stat-num" style={{ color:s.color, fontSize:"2rem" }}>{s.n}</div>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-sub" style={{ color:C.muted, fontSize:"0.7rem", marginTop:4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Three Problem → Solution pairs */}
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {[
              {
                n: "01",
                problem: {
                  tag: "The Access Crisis",
                  headline: "18 million patients. 70% can't get treatment.",
                  body: "The FDA's GLP-1 shortage has created an acute access crisis. Brand-name Ozempic and Wegovy are backordered 12–18 months. Physicians have patients ready to prescribe to — and nowhere to send them. The 503B compounding exemption exists precisely for this scenario, but most compounders lack the scale, licensing footprint, or physician network to move fast.",
                  stats: [
                    { val:"18M+", label:"U.S. patients actively seeking GLP-1" },
                    { val:"70%",  label:"Unable to access branded treatment" },
                    { val:"12–18 mo", label:"Average backorder — Ozempic/Wegovy" },
                  ],
                  color: C.rose,
                  bgColor: "#FFF1F2",
                  bdrColor: "#FECDD3",
                },
                solution: {
                  tag: "Polomar 503B Network",
                  headline: "28-state license. 8 clinics today. 125 by 2027.",
                  body: "Polomar Health entered this market in October 2025 with an operational 503B compounding facility, active state licenses covering 78% of the U.S. GLP-1 market, and signed contracts with ForHumanity Health and CareValidate providing $5–10M in guaranteed revenue. The clinic network scales from 8 → 50 → 125 as the shortage persists and relationships deepen.",
                  stats: [
                    { val:"28",      label:"States licensed — operational now" },
                    { val:"$5–10M",  label:"Contracted revenue floor (Year 1)" },
                    { val:"Q2 2026", label:"Compounding cash flow positive" },
                  ],
                  color: C.teal,
                  bgColor: C.ltTeal,
                  bdrColor: C.teal+"44",
                },
              },
              {
                n: "02",
                problem: {
                  tag: "The Bioavailability Failure",
                  headline: "The only FDA-approved oral GLP-1 absorbs at <1%.",
                  body: "Rybelsus (oral semaglutide, Novo Nordisk) requires a 14mg dose to deliver the equivalent of a 1mg injection — because the GI tract destroys 99%+ of the molecule before absorption. Patients must fast for 30 minutes before dosing, take it with minimal water, and still tolerate significant GI side effects. The result: 30%+ discontinuation within 6 months and limited clinical adoption despite massive market demand.",
                  stats: [
                    { val:"<1%",  label:"Rybelsus oral bioavailability" },
                    { val:"14×",  label:"Dose required vs. injection equivalent" },
                    { val:"30%+", label:"Patient discontinuation within 6 months" },
                  ],
                  color: "#f59e0b",
                  bgColor: "#FFFBEB",
                  bdrColor: "#FDE68A",
                },
                solution: {
                  tag: "Microencapsulation Platform",
                  headline: "82% oral bioavailability. 90× better than Rybelsus.",
                  body: "ALT-301 uses Altanine's patented pH-sensitive microencapsulation system — the same core technology covering 400+ molecules across 8 issued U.S. patents — to deliver 82% oral bioavailability in Phase 1 trials. The result is not just better absorption: it's 52% fewer GI adverse events (p<0.001), 91% patient compliance vs. 55% industry average, and zero treatment discontinuations in Phase 1 (N=48).",
                  stats: [
                    { val:"82%", label:"ALT-301 oral bioavailability (Phase 1)" },
                    { val:"52%", label:"Reduction in GI adverse events vs. standard" },
                    { val:"91%", label:"Patient compliance vs. 55% industry avg" },
                  ],
                  color: C.sky,
                  bgColor: C.ltSky,
                  bdrColor: "#BAE6FD",
                },
              },
            ].map((pair, pi) => (
              <div key={pi} style={{
                display:"grid",
                gridTemplateColumns:mob?"1fr":"1fr 40px 1fr",
                gap:0,
                marginBottom: pi < 1 ? 24 : 0,
              }}>
                {/* PROBLEM */}
                <div style={{
                  padding:"28px 32px",
                  background:pair.problem.bgColor,
                  border:`1px solid ${pair.problem.bdrColor}`,
                  borderRadius:mob?"12px 12px 0 0":"12px 0 0 12px",
                  borderRight:mob?undefined:"none",
                  borderBottom:mob?"none":undefined,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                    <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.62rem", fontWeight:700,
                                   color:pair.problem.color, border:`1px solid ${pair.problem.color}44`,
                                   padding:"3px 8px", borderRadius:4 }}>PROBLEM {pair.n}</span>
                    <span style={{ fontSize:"0.62rem", fontWeight:700, color:pair.problem.color,
                                   textTransform:"uppercase", letterSpacing:"0.1em" }}>{pair.problem.tag}</span>
                  </div>
                  <h3 className="serif" style={{ fontSize:"clamp(1.1rem,1.8vw,1.35rem)", color:C.navy,
                                                  lineHeight:1.3, marginBottom:12 }}>
                    {pair.problem.headline}
                  </h3>
                  <p style={{ fontSize:"0.82rem", lineHeight:1.75, color:C.muted, marginBottom:20 }}>
                    {pair.problem.body}
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                    {pair.problem.stats.map((s,si)=>(
                      <div key={si} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.6)",
                                             borderRadius:8, border:`1px solid ${pair.problem.bdrColor}` }}>
                        <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800,
                                      fontSize:"1rem", color:pair.problem.color, lineHeight:1 }}>{s.val}</div>
                        <div style={{ fontSize:"0.6rem", color:C.muted, marginTop:4, lineHeight:1.4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ARROW connector */}
                {!mob && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                                 background:C.bg, border:`1px solid ${C.border}`,
                                 borderLeft:"none", borderRight:"none", position:"relative" }}>
                    <div style={{ width:28, height:28, background:C.surface, border:`2px solid ${C.border}`,
                                   borderRadius:"50%", display:"flex", alignItems:"center",
                                   justifyContent:"center", fontSize:"0.9rem", color:C.muted, zIndex:1 }}>→</div>
                  </div>
                )}

                {/* SOLUTION */}
                <div style={{
                  padding:"28px 32px",
                  background:pair.solution.bgColor,
                  border:`1px solid ${pair.solution.bdrColor}`,
                  borderRadius:mob?"0 0 12px 12px":"0 12px 12px 0",
                  borderLeft:mob?undefined:"none",
                  borderTop:mob?"none":undefined,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                    <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.62rem", fontWeight:700,
                                   color:pair.solution.color, border:`1px solid ${pair.solution.color}44`,
                                   padding:"3px 8px", borderRadius:4 }}>SOLUTION {pair.n}</span>
                    <span style={{ fontSize:"0.62rem", fontWeight:700, color:pair.solution.color,
                                   textTransform:"uppercase", letterSpacing:"0.1em" }}>{pair.solution.tag}</span>
                  </div>
                  <h3 className="serif" style={{ fontSize:"clamp(1.1rem,1.8vw,1.35rem)", color:C.navy,
                                                  lineHeight:1.3, marginBottom:12 }}>
                    {pair.solution.headline}
                  </h3>
                  <p style={{ fontSize:"0.82rem", lineHeight:1.75, color:C.muted, marginBottom:20 }}>
                    {pair.solution.body}
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                    {pair.solution.stats.map((s,si)=>(
                      <div key={si} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.7)",
                                             borderRadius:8, border:`1px solid ${pair.solution.bdrColor}` }}>
                        <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800,
                                      fontSize:"1rem", color:pair.solution.color, lineHeight:1 }}>{s.val}</div>
                        <div style={{ fontSize:"0.6rem", color:C.muted, marginTop:4, lineHeight:1.4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 03 INVESTMENT THESIS ════════════════════════════════════ */}
      <div id="thesis" style={{ background:C.bg }}>
        <div className="section">
          <SL n={3}>Investment Thesis</SL>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1.8fr", gap:40, marginBottom:48 }}>
            <div>
              <h2 className="serif" style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", lineHeight:1.2, marginBottom:16 }}>
                Four reasons this deal is structurally different.
              </h2>
              <div className="accent-rule"/>
              <p style={{ fontSize:"0.9rem", lineHeight:1.8, color:C.muted }}>
                Most investments force a trade-off between cash flow today and upside tomorrow. Altanine-Polomar eliminates that trade-off — the compounding business is profitable by Q2 2026 while the IP platform creates a 20-year structural moat.
              </p>
            </div>
            {/* Animated counters */}
            <div className="grid-3">
              {[
                { val:82, suffix:"%", label:"Oral Bioavailability", sub:"vs <1% Rybelsus", color:C.sky },
                { val:54, suffix:"×", label:"Peak Return Scenario", sub:"Post ALT-401 2032", color:C.teal },
                { val:400, suffix:"+", label:"Molecules Covered", sub:"8 issued U.S. patents", color:C.navy },
              ].map((s,i)=>(
                <div key={i} className="stat-card fade-up" style={{ animationDelay:`${i*0.12}s` }}>
                  <div className="stat-num" style={{ color:s.color }}>
                    <Counter target={s.val} suffix={s.suffix}/>
                  </div>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-sub" style={{ color:C.muted }}>{s.sub}</div>
                  <div className="stat-bar" style={{ background:`${s.color}20` }}>
                    <div style={{ height:"100%", background:s.color, width:"100%", borderRadius:2, animation:"none" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Four reasons */}
          <div className="grid-2">
            {investmentReasons.map((ir,i)=>(
              <div key={i} className={`feat-card fade-up delay-${i+1} ${i%2===1?"feat-card-sky":""}`}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                  <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700, fontSize:"0.7rem",
                                color:C.muted, border:`1px solid ${C.border}`, padding:"3px 10px", borderRadius:4 }}>
                    {ir.no}
                  </div>
                  <div>
                    <div style={{ textAlign:"right", fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1.5rem",
                                  color:i%2===0?C.teal:C.sky, lineHeight:1 }}>{ir.metric}</div>
                    <div style={{ textAlign:"right", fontSize:"0.58rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:3 }}>{ir.metricLabel}</div>
                  </div>
                </div>
                <h3 className="serif" style={{ fontSize:"1.3rem", lineHeight:1.3, marginBottom:12, color:C.navy, whiteSpace:"pre-line" }}>
                  {ir.title}
                </h3>
                <p style={{ fontSize:"0.84rem", lineHeight:1.75, color:C.muted }}>
                  {ir.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 03 FINANCIALS (tabbed charts) ═══════════════════════════ */}
      <div id="financials" style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div className="section">
          <SL n={4}>Financial Projections</SL>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 2fr", gap:40, marginBottom:48, alignItems:"start" }}>
            <div>
              <h2 className="serif" style={{ fontSize:"clamp(1.7rem,2.8vw,2.6rem)", lineHeight:1.2, marginBottom:16 }}>
                $740M revenue by 2032. <span style={{ color:C.teal }}>59% EBITDA margin.</span>
              </h2>
              <p style={{ fontSize:"0.88rem", lineHeight:1.8, color:C.muted }}>
                Two convergent revenue engines: 503B compounding through 2028, then ALT-301 and ALT-401 FDA approvals transform the margin profile entirely. Select a tab below to explore each dimension.
              </p>
            </div>
            <div className="grid-4">
              {[
                { label:"2027 Revenue",       val:"$18M",   color:C.teal, note:"Near-term" },
                { label:"2029 Revenue",       val:"$80M",   color:C.sky,  note:"ALT-301 year" },
                { label:"2032 Revenue",       val:"$740M",  color:C.navy, note:"Full scale" },
                { label:"2032 EBITDA Margin", val:"59%",    color:C.emerald, note:"Year of scale" },
              ].map((s,i)=>(
                <div key={i} className="stat-card">
                  <div className="stat-num" style={{ color:s.color, fontSize:"1.8rem" }}>{s.val}</div>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-sub" style={{ color:C.muted }}>{s.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CHART TABS */}
          <FinancialTabs mob={mob}/>
        </div>
      </div>

      {/* ══ 04 TECHNOLOGY ═══════════════════════════════════════════ */}
      <div id="technology" style={{ background:C.navy }}>
        <div className="section">
          <SL n={5} light={true}>Platform Technology</SL>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1.4fr", gap:mob?32:48 }}>
            <div>
              <h2 className="serif" style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", lineHeight:1.2, color:"white", marginBottom:20 }}>
                82% oral bioavailability. <span style={{ color:C.teal }}>Patent-protected through 2042.</span>
              </h2>
              <p style={{ fontSize:"0.9rem", lineHeight:1.8, color:"rgba(255,255,255,0.6)", marginBottom:28 }}>
                Traditional oral GLP-1 (Rybelsus) requires 20× the dose due to &lt;1% absorption. ALT-301's proprietary absorption enhancement technology achieves 82% bioavailability — changing both the clinical and the economic outcome.
              </p>
              {[
                { label:"Bioavailability Advantage", val:"82% vs <1%", detail:"90× improvement over Rybelsus" },
                { label:"IP Protection",             val:"2042",       detail:"8 patents · 400 molecules" },
                { label:"Regulatory Pathway",        val:"505(b)(2)", detail:"37.5% success vs 12% traditional" },
                { label:"GI Side Effects Reduced",   val:"52%",       detail:"Slide 5 clinical data" },
                { label:"Patient Compliance",        val:"91%",       detail:"vs ~60% for injections" },
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                      padding:"14px 0", borderBottom:`1px solid rgba(255,255,255,0.08)` }}>
                  <div>
                    <div style={{ fontSize:"0.82rem", fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{s.label}</div>
                    <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.detail}</div>
                  </div>
                  <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1rem", color:C.teal }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Pipeline Timeline */}
            <div>
              <div style={{ fontSize:"0.62rem", fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:24 }}>
                Clinical Pipeline — Timeline
              </div>
              {[
                { phase:"503B Compounding (Active)", years:"2025–2028+", status:"REVENUE", detail:"GLP-1, ALT-301 precursor, 400+ molecules. $2.5M→$140M.", col:C.teal },
                { phase:"ALT-301 · Phase 2", years:"2026–2028",  status:"FUNDED",  detail:"IND filing Q2 2026 · N=120 · Primary endpoint: 12-wk HbA1c.", col:C.sky },
                { phase:"ALT-301 · NDA / 505(b)(2)", years:"2028–2029", status:"PIPELINE", detail:"505(b)(2) reliance on Rybelsus Phase 3. ~37.5% success rate.", col:C.sky },
                { phase:"ALT-301 · FDA Launch", years:"2029",     status:"LAUNCH",  detail:"Initial $15M; scales to $420M by 2032.", col:C.emerald },
                { phase:"ALT-401 · Oral Semaglutide", years:"2031", status:"LAUNCH",  detail:"Second asset. $30M launch → $180M 2032.", col:C.emerald },
              ].map((p,i)=>(
                <div key={i} style={{ display:"flex", gap:16, marginBottom:20 }}>
                  <div style={{ width:3, background:p.col, borderRadius:2, flexShrink:0, marginTop:4 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div style={{ fontWeight:700, fontSize:"0.88rem", color:"white" }}>{p.phase}</div>
                      <span style={{ fontSize:"0.6rem", fontWeight:700, padding:"3px 8px", borderRadius:4,
                                     background:`${p.col}25`, color:p.col, letterSpacing:"0.1em", textTransform:"uppercase", whiteSpace:"nowrap", marginLeft:8 }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize:"0.72rem", color:C.teal, fontFamily:"IBM Plex Mono, monospace", marginBottom:5 }}>{p.years}</div>
                    <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{p.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ 05 EXIT SCENARIOS ════════════════════════════════════════ */}
      <div id="exit" style={{ background:C.bg }}>
        <div className="section">
          <SL n={6}>Exit Scenarios</SL>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.4fr 1fr", gap:40, marginBottom:48 }}>
            <div>
              <h2 className="serif" style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", lineHeight:1.2, marginBottom:16 }}>
                Three paths. All return capital. <span style={{ color:C.teal }}>One changes everything.</span>
              </h2>
              <p style={{ fontSize:"0.9rem", lineHeight:1.8, color:C.muted }}>
                Even the floor scenario — early exit with compounding only — returns 1.4× capital. The mid scenario (post ALT-301) returns 18.5×. The ceiling (post ALT-401) creates a $10B outcome at 54× ROI.
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              {[
                { label:"Floor", val:"1.4×", sub:"Early Exit 2026–27", color:C.muted },
                { label:"Mid",   val:"18.5×",sub:"Post ALT-301",       color:C.teal },
                { label:"Ceil",  val:"54×",  sub:"Post ALT-401",       color:C.sky },
              ].map((s,i)=>(
                <div key={i} className="stat-card" style={{ flex:1, minWidth:120 }}>
                  <div style={{ fontSize:"0.6rem", fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>{s.label}</div>
                  <div className="stat-num" style={{ color:s.color, fontSize:"2rem" }}>{s.val}</div>
                  <div className="stat-lbl">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparable M&A */}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:40 }}>
            <div style={{ fontSize:"0.62rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.16em", marginBottom:24 }}>
              Comparable M&amp;A Transactions — Oral Delivery Pharma
            </div>
            <div className="grid-3">
              {[
                { co:"Emisphere Technologies", acq:"Novo Nordisk", deal:"14× Revenue", why:"Oral delivery IP for GLP-1 peptides — direct comparable" },
                { co:"Catalent Pharma",         acq:"Novo Holdings", deal:"$11.5B",   why:"Manufacturing capacity + specialty formulation for GLP-1" },
                { co:"Adare Pharma Solutions",  acq:"Catalent",      deal:"10× Revenue",why:"Specialty oral formulation — same value driver" },
              ].map((c,i)=>(
                <div key={i} className="card" style={{ borderTop:`3px solid ${[C.teal,C.sky,C.navy][i]}` }}>
                  <div style={{ fontWeight:700, fontSize:"0.9rem", color:C.navy, marginBottom:4 }}>{c.co}</div>
                  <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:12 }}>Acquired by {c.acq}</div>
                  <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1.2rem", color:[C.teal,C.sky,C.navy][i], marginBottom:8 }}>{c.deal}</div>
                  <div style={{ fontSize:"0.76rem", color:C.muted, lineHeight:1.6 }}>{c.why}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ 06 RISK ═════════════════════════════════════════════════ */}
      <div id="risk" style={{ background:C.surface, borderTop:`1px solid ${C.border}` }}>
        <div className="section">
          <SL n={7}>Risk &amp; Mitigation</SL>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1.8fr", gap:40 }}>
            <div>
              <h2 className="serif" style={{ fontSize:"clamp(1.6rem,2.8vw,2.4rem)", lineHeight:1.2, marginBottom:20 }}>
                Protected floor.<br/><span style={{ color:C.teal }}>Structural upside.</span>
              </h2>
              <div className="accent-rule"/>
              <p style={{ fontSize:"0.88rem", lineHeight:1.8, color:C.muted, marginBottom:28 }}>
                The investment's asymmetric structure means even the base case returns capital. Every scenario beyond that is additive.
              </p>
              {[
                { label:"Floor (compounding only)", val:"1.1–1.6×", bg:C.bg, bdr:C.border, vc:C.navy },
                { label:"Mid (ALT-301 approved)",   val:"14.5–22.5×", bg:C.ltTeal, bdr:C.teal+"44", vc:C.teal },
                { label:"Ceiling (ALT-401 + all)",  val:"48–60×", bg:C.ltSky, bdr:C.sky+"44", vc:C.sky },
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                      padding:"16px 18px", borderRadius:10, marginBottom:8,
                                      background:s.bg, border:`1px solid ${s.bdr}` }}>
                  <span style={{ fontSize:"0.82rem", fontWeight:600, color:C.navy }}>{s.label}</span>
                  <span style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, fontSize:"1.1rem", color:s.vc }}>{s.val}</span>
                </div>
              ))}
              <div style={{ marginTop:16, padding:"16px 18px", borderRadius:10, background:C.bg, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:"0.74rem", color:C.muted, lineHeight:1.65 }}>
                  <strong style={{ color:C.navy }}>Floor protection:</strong> ForHumanity Health + CareValidate contracts provide $5–10M contracted revenue regardless of FDA pathway outcomes.
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize:"0.62rem", fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.16em", marginBottom:20 }}>
                Key Risks · Mitigation Matrix
              </div>
              <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 80px":"1fr 1fr 80px", gap:12, padding:"12px 0",
                             borderBottom:`2px solid ${C.navy}` }}>
                {(mob?["Risk","Level"]:["Risk","Mitigation","Level"]).map(h=>(
                  <div key={h} style={{ fontSize:"0.6rem", fontWeight:700, color:C.navy, textTransform:"uppercase", letterSpacing:"0.12em" }}>{h}</div>
                ))}
              </div>
              {risks.map((rk)=>(
                <div key={rk.id}
                     onClick={()=>setActiveRisk(activeRisk===rk.id?null:rk.id)}
                     style={{ display:"grid", gridTemplateColumns:mob?"1fr 80px":"1fr 1fr 80px", gap:12, padding:"16px 0",
                               borderBottom:`1px solid ${C.borderLt}`, cursor:"pointer",
                               background:activeRisk===rk.id?C.ltTeal:"transparent",
                               padding:activeRisk===rk.id?"16px 12px":"16px 0",
                               borderRadius:activeRisk===rk.id?8:0, transition:"all 0.15s" }}>
                  <div style={{ fontSize:"0.82rem", fontWeight:500, color:C.navy, lineHeight:1.5 }}>{rk.risk}</div>
                  {!mob && <div style={{ fontSize:"0.76rem", color:C.muted, lineHeight:1.5 }}>{rk.mitigation}</div>}
                  <div>
                    <span style={{ display:"inline-block", padding:"4px 8px", fontSize:"0.6rem", fontWeight:700,
                                   letterSpacing:"0.12em", textTransform:"uppercase", borderRadius:5,
                                   background:rk.priority==="HIGH"?"#FEE2E2":rk.priority==="MEDIUM"?"#FEF3C7":C.ltGreen,
                                   color:rk.priority==="HIGH"?C.rose:rk.priority==="MEDIUM"?"#92400E":C.emerald }}>
                      {rk.priority}
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:12, fontSize:"0.65rem", color:C.muted }}>
                See Diligence Flags sheet in Financial Model for full 12-item open item register.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background:C.navy, borderTop:`1px solid ${C.navy2}` }}>
        <div className="section" style={{ textAlign:"center" }}>
          <div style={{ fontSize:"0.62rem", fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.3em", marginBottom:20 }}>
            Next Steps for Investors
          </div>
          <h2 className="serif" style={{ fontSize:"clamp(1.8rem,3.5vw,3rem)", color:"white", lineHeight:1.2, marginBottom:20 }}>
            Join us in building the future<br />of pharmaceutical delivery.
          </h2>
          <p style={{ fontSize:"0.95rem", color:"rgba(255,255,255,0.55)", maxWidth:520, margin:"0 auto 44px", lineHeight:1.8 }}>
            The GLP-1 shortage is active. The compounding exemption is live. First-movers control the distribution relationships that will persist long after supply normalizes.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            {["Data Room Access","Management Presentation","Site Visit (503A Facility)","Term Sheet Discussion"].map((s,i)=>(
              <div key={i} style={{ background:i===0?C.teal:"rgba(255,255,255,0.08)",
                                    color:"white", padding:"14px 26px", borderRadius:8,
                                    fontWeight:700, fontSize:"0.8rem", letterSpacing:"0.06em",
                                    display:"flex", alignItems:"center", gap:10, cursor:"pointer",
                                    border:i===0?"none":"1px solid rgba(255,255,255,0.15)",
                                    transition:"all 0.15s" }}>
                <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.65rem", color:"rgba(255,255,255,0.35)" }}>0{i+1}</span>
                {s}
              </div>
            ))}
          </div>
          <div style={{ marginTop:44, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:28 }}>
            <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.5)" }}>
              <strong style={{ color:"white" }}>Charles Andres</strong> · Chief Executive Officer ·{" "}
              <span style={{ fontFamily:"IBM Plex Mono, monospace", color:C.teal }}>candres@altanine.com</span>
            </div>
          </div>
        </div>
      </div>


      </> /* end mainView === "main" */}

      {/* ── CREATIVE STRATEGIES — separate tab view ──────────────── */}
      {mainView === "creative" && <>
      <div style={{ minHeight:"calc(100vh - 64px)" }}>
        {/* Back banner */}
        <div style={{ background:C.navy, borderBottom:`1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ maxWidth:1320, margin:"0 auto", padding:"10px 56px", display:"flex", alignItems:"center", gap:16 }}>
            <button onClick={()=>setMainView("main")}
              style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.08)",
                       border:"1px solid rgba(255,255,255,0.15)", borderRadius:6, padding:"5px 12px",
                       color:"rgba(255,255,255,0.7)", fontSize:"0.72rem", fontWeight:600, cursor:"pointer" }}>
              ← Back to Report
            </button>
            <div style={{ fontSize:"0.62rem", fontWeight:700, color:"rgba(15,123,140,0.8)",
                          letterSpacing:"0.2em", textTransform:"uppercase" }}>Creative Strategies</div>
          </div>
        </div>
      <section id="capital">
        <div className="section" style={{ paddingBottom:0, paddingTop:48 }}>
          <div style={{ display:"flex", gap:0, borderBottom:`2px solid ${C.borderLt}`, marginBottom:0 }}>
            {[
              { id:"capital",  label:"Capital Strategies" },
              { id:"revenue",  label:"Strategic Revenue Expansion" },
            ].map(t => (
              <button key={t.id} onClick={() => setCreativeTab(t.id)} style={{
                padding:"14px 28px", fontWeight:creativeTab===t.id?700:500, fontSize:"0.76rem",
                letterSpacing:"0.04em", color:creativeTab===t.id?C.teal:C.muted,
                background:"none", border:"none",
                borderBottom:creativeTab===t.id?`2px solid ${C.teal}`:"2px solid transparent",
                marginBottom:-2, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap"
              }}>{t.label}</button>
            ))}
          </div>
        </div>

      {/* ── CAPITAL STRATEGIES TAB ───────────────────────────────── */}
      {creativeTab === "capital" && (
        <>
          {/* Original v4 Capital Strategy Header */}
          <div>
            <div className="section">
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between",
                            flexWrap:"wrap", gap:16, marginBottom:16 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:C.teal,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  color:"white", fontSize:"0.62rem", fontWeight:800, flexShrink:0 }}>08</div>
                    <span style={{ fontSize:"0.62rem", fontWeight:700, color:C.teal,
                                   letterSpacing:"0.2em", textTransform:"uppercase" }}>Alternative Capital Strategies</span>
                  </div>
                  <h2 style={{ fontFamily:"DM Serif Display, serif", fontSize:mob?"1.8rem":"2.4rem",
                               fontWeight:400, lineHeight:1.2, marginBottom:12 }}>
                    How the Merger Gets Capitalized
                  </h2>
                  <p style={{ color:C.muted, fontSize:"0.85rem", lineHeight:1.7, maxWidth:640 }}>
                    Three fully-modeled capital structures evaluated against full debt schedules,
                    FCF waterfalls, covenant analysis, and an active lender directory.
                    Internal use: leadership, investment bankers, and debt financing partners.
                  </p>
                </div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignSelf:"flex-end" }}>
                  {[
                    { label:"$12.75M", sub:"Recommended raise" },
                    { label:"10.5%",   sub:"Blended CoC" },
                    { label:"2030",    sub:"Debt-free" },
                    { label:"$313M",   sub:"2032 FCF" },
                  ].map((k,i) => (
                    <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`,
                                          borderRadius:10, padding:"14px 20px", textAlign:"center", minWidth:100 }}>
                      <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800,
                                    fontSize:"1.1rem", color:C.teal, marginBottom:2 }}>{k.label}</div>
                      <div style={{ fontSize:"0.65rem", color:C.muted, textTransform:"uppercase",
                                    letterSpacing:"0.08em" }}>{k.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      <div>
        <div className="section">
          <SL n="01">Three Capital Structure Scenarios — Full Structural Analysis</SL>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(3,1fr)", gap:16, marginBottom:36 }}>
            {Object.values(scenarios).map(sc => (
              <div key={sc.id}
                   onClick={() => setScenTab(sc.id)}
                   style={{ background:scenTab===sc.id ? sc.ltColor : C.surface,
                            border:`2px solid ${scenTab===sc.id ? sc.color : C.border}`,
                            borderRadius:12, padding:"22px 24px", cursor:"pointer",
                            transition:"all 0.2s", borderTop:`4px solid ${sc.color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:"0.64rem", fontWeight:700, color:sc.color,
                                  letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>
                      {sc.label}
                    </div>
                    <div style={{ fontSize:"1.0rem", fontWeight:800, color:C.navy }}>{sc.sublabel}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                    <span className="chip" style={{ background:sc.ltColor, color:sc.color, fontSize:"0.55rem" }}>
                      {sc.tag}
                    </span>
                    {sc.id==="s2" && (
                      <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:"0.55rem",
                                     fontWeight:700, padding:"2px 7px", borderRadius:5,
                                     letterSpacing:"0.08em", textTransform:"uppercase" }}>
                        Investor-Facing
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ fontSize:"0.75rem", color:C.muted, lineHeight:1.5, marginBottom:16 }}>{sc.summary}</p>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, color:sc.color, fontSize:"1.1rem" }}>
                      ${sc.total}M
                    </div>
                    <div style={{ fontSize:"0.62rem", color:C.muted, marginTop:2 }}>Total Capital</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700, color:C.navy, fontSize:"1.0rem" }}>
                      {sc.dilution}
                    </div>
                    <div style={{ fontSize:"0.62rem", color:C.muted, marginTop:2 }}>Dilution</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700, color:sc.color, fontSize:"1.0rem" }}>
                      {sc.cost}
                    </div>
                    <div style={{ fontSize:"0.62rem", color:C.muted, marginTop:2 }}>Blended CoC</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scenario tab content */}
          <div className="tab-bar">
            {Object.values(scenarios).map(sc=>(
              <button key={sc.id}
                      className={`tab-btn${scenTab===sc.id?" active":""}`}
                      onClick={()=>setScenTab(sc.id)}
                      style={{ color: scenTab===sc.id ? sc.color : C.muted,
                               borderBottomColor: scenTab===sc.id ? sc.color : "transparent" }}>
                {sc.label}: {sc.sublabel}
              </button>
            ))}
          </div>
          <ScenarioTab s={scenarios[scenTab]} mob={mob}/>
        </div>
      </div>

      {/* ── COMPARISON ───────────────────────────────────────── */}
      <div className="section-alt">
        <div className="section">
          <SL n="02">Scenario Comparison — Capital, Cost, Coverage & Timeline</SL>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.6fr 1fr", gap:28 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:16 }}>
                FCF After Debt Service — All Scenarios ($M)
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart margin={{ top:5, right:10, bottom:5, left:10 }}
                  data={YEARS.map((yr,i)=>({
                    year:yr,
                    "Scen 1: Debt-Only":  scenarios.s1.cashflow[i].fcf,
                    "Scen 2: Hybrid ✓":   scenarios.s2.cashflow[i].fcf,
                    "Scen 3: Grow-First": scenarios.s3.cashflow[i].fcf,
                  }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                  <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}
                         tickFormatter={v=>`$${v}M`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <ReferenceLine y={0} stroke={C.border} strokeWidth={2}/>
                  <Line type="monotone" dataKey="Scen 1: Debt-Only"  stroke="#8B2252" strokeWidth={2} dot={{ r:3 }}/>
                  <Line type="monotone" dataKey="Scen 2: Hybrid ✓"   stroke={C.teal}  strokeWidth={3} dot={{ r:4 }} strokeDasharray="0"/>
                  <Line type="monotone" dataKey="Scen 3: Grow-First" stroke={C.amber} strokeWidth={2} dot={{ r:3 }}/>
                  <Legend wrapperStyle={{ fontSize:"0.75rem" }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {comparisonData.slice(0,6).map((row,i)=>(
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`,
                                      borderRadius:10, padding:"14px 18px" }}>
                  <div style={{ fontSize:"0.62rem", fontWeight:700, color:C.muted, textTransform:"uppercase",
                                letterSpacing:"0.1em", marginBottom:8 }}>{row.metric}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                    {[
                      { val:row.s1, color:"#8B2252", label:"S1" },
                      { val:row.s2, color:C.teal,    label:"S2 ✓" },
                      { val:row.s3, color:C.amber,   label:"S3" },
                    ].map((s,j)=>(
                      <div key={j} style={{ textAlign:"center" }}>
                        <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700,
                                      color:s.color, fontSize:"0.82rem" }}>{s.val}</div>
                        <div style={{ fontSize:"0.58rem", color:C.muted, marginTop:2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:24 }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem" }}>
                <thead>
                  <tr>
                    <th style={{ padding:"10px 16px", textAlign:"left", fontWeight:700, color:"white",
                                 background:C.navy, fontSize:"0.7rem", letterSpacing:"0.06em" }}>Metric</th>
                    {[{l:"Scenario 1",sub:"Debt-Only",c:"#8B2252"},
                      {l:"Scenario 2",sub:"Hybrid ✓",c:C.teal},
                      {l:"Scenario 3",sub:"Grow-First",c:C.amber}].map((h,i)=>(
                      <th key={i} style={{ padding:"10px 16px", textAlign:"center", fontWeight:700,
                                          color:"white", background:h.c, fontSize:"0.7rem" }}>
                        {h.l}<br/><span style={{ opacity:0.7, fontWeight:400 }}>{h.sub}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row,i)=>(
                    <tr key={i} style={{ background:i%2===0?C.surface:C.bg,
                                         borderBottom:`1px solid ${C.borderLt}` }}>
                      <td style={{ padding:"10px 16px", fontWeight:600, color:C.navy,
                                   fontSize:"0.75rem" }}>{row.metric}</td>
                      {[{v:row.s1,c:"#8B2252"},{v:row.s2,c:C.teal},{v:row.s3,c:C.amber}].map((s,j)=>(
                        <td key={j} style={{ padding:"10px 16px", textAlign:"center",
                                            fontFamily:"IBM Plex Mono, monospace", fontWeight:700,
                                            color:s.c, fontSize:"0.78rem" }}>{s.v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation box */}
          <div style={{ marginTop:24, background:C.ltTeal, border:`1px solid ${C.teal}`,
                        borderLeft:`4px solid ${C.teal}`, borderRadius:12, padding:28 }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ background:C.teal, color:"white", borderRadius:8, padding:"6px 12px",
                            fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.1em",
                            textTransform:"uppercase", flexShrink:0 }}>Recommendation</div>
              <p style={{ fontSize:"0.85rem", color:C.navy, lineHeight:1.6, fontWeight:500 }}>
                <strong>Scenario 2 (Hybrid)</strong> is the optimal structure for execution today — lowest blended 
                cost of capital (10.5%), no IP lien, debt-free by 2030, and DSCR above 1.5× from 2027 onward. 
                <strong> Scenario 3</strong> is the highest-value path if clinic contract execution confidence is 
                high and existing cash bridges 60–90 days to enable the deferred equity raise at 2–3× higher valuation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STRESS TEST ──────────────────────────────────────── */}
      <div>
        <div className="section">
          <SL n="03">Debt Service Stress Test</SL>
          <p style={{ color:C.muted, marginBottom:32, maxWidth:680, lineHeight:1.7, fontSize:"0.88rem" }}>
            Models a 30% revenue miss against Scenario 2 debt service obligations. Identifies the two covenant-risk years, required structural protections, and the point at which the structure becomes self-correcting. Essential context for any debt term sheet negotiation.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.4fr 1fr", gap:28, marginBottom:28 }}>
            <div className="card">
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.navy, marginBottom:4 }}>
                EBITDA: Base vs −30% Revenue Stress ($M)
              </div>
              <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:20 }}>
                2026–2027 are covenant-risk years in both base and stress cases
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stressData} margin={{ top:5, right:10, bottom:5, left:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                  <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false}
                         tickFormatter={v=>`$${v}M`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="base"   name="Base EBITDA"   fill={C.teal}  fillOpacity={0.8} radius={[3,3,0,0]}/>
                  <Bar dataKey="stress" name="Stress EBITDA" fill={C.amber} fillOpacity={0.7} radius={[3,3,0,0]}/>
                  <Bar dataKey="ds"     name="Debt Service"  fill={C.rose}  fillOpacity={0.6} radius={[3,3,0,0]}/>
                  <Legend wrapperStyle={{ fontSize:"0.75rem" }}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { year:"2026", dscr_b:"0.4×", dscr_s:"0.25×", verdict:"COVENANT HOLIDAY needed", bg:C.ltRed, clr:C.rose },
                { year:"2027", dscr_b:"1.5×", dscr_s:"1.05×", verdict:"EQUITY CURE right needed", bg:C.ltAmber, clr:C.amber },
                { year:"2028", dscr_b:"2.0×", dscr_s:"1.4×",  verdict:"30% covenant headroom", bg:C.ltAmber, clr:C.amber },
                { year:"2029", dscr_b:"14.5×",dscr_s:"9.95×", verdict:"SELF-HEALING from here", bg:C.ltGreen, clr:C.emerald },
                { year:"2030+",dscr_b:"∞",    dscr_s:"∞",     verdict:"DEBT-FREE (Scen 2)",     bg:C.ltGreen, clr:C.emerald },
              ].map((r,i)=>(
                <div key={i} style={{ background:r.bg, borderRadius:10, padding:"12px 16px",
                                      border:`1px solid ${r.clr}22` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <span style={{ fontWeight:800, color:C.navy, marginRight:12 }}>{r.year}</span>
                      <span style={{ fontSize:"0.68rem", fontWeight:700, color:r.clr }}>{r.verdict}</span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"0.65rem", color:C.muted }}>Base / Stress DSCR</div>
                      <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:700, color:r.clr, fontSize:"0.82rem" }}>
                        {r.dscr_b} / {r.dscr_s}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Three required protections */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(3,1fr)", gap:16 }}>
            {[
              { n:"01", title:"2-Year EBITDA Covenant Holiday", body:"No revenue covenant in 2026–2027 — only minimum cash balance requirement. Non-negotiable for any 2026 debt close.", color:C.rose },
              { n:"02", title:"Equity Cure Right", body:"New equity investment within 30 days cures any covenant breach automatically. Requires pre-agreement in the credit agreement.", color:C.amber },
              { n:"03", title:"30-Day Cure Period", body:"No acceleration on first breach — 30-day notice and cure period before any default. Prevents hair-trigger lender action on early misses.", color:C.teal },
            ].map((p,i)=>(
              <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`,
                                    borderTop:`3px solid ${p.color}`, borderRadius:12, padding:24 }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, color:p.color, letterSpacing:"0.15em",
                              textTransform:"uppercase", marginBottom:8 }}>Protection {p.n}</div>
                <div style={{ fontSize:"0.88rem", fontWeight:700, color:C.navy, marginBottom:10 }}>{p.title}</div>
                <p style={{ fontSize:"0.78rem", color:C.muted, lineHeight:1.6 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROVIDERS ────────────────────────────────────────── */}
      <div className="section-alt">
        <div className="section">
          <SL n="04">Lender & Provider Directory — Active Market Contacts</SL>
          <p style={{ color:C.muted, marginBottom:28, maxWidth:640, lineHeight:1.7, fontSize:"0.88rem" }}>
            Active lenders mapped across five instrument types with verified experience in 503B compounding, specialty pharma, and 505(b)(2) pipelines. Priority 1 firms have documented transactions at this stage and check size. A competitive lender process across these categories is recommended to maximize terms.
          </p>

          {/* Filter */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
            {lCats.map(cat=>(
              <button key={cat}
                      onClick={()=>setLenderCat(cat)}
                      style={{ padding:"7px 14px", borderRadius:99, fontSize:"0.72rem", fontWeight:600,
                               cursor:"pointer", border:"none", transition:"all 0.15s",
                               background:lenderCat===cat ? C.navy : C.surface,
                               color:lenderCat===cat ? "white" : C.muted,
                               boxShadow:lenderCat===cat?"none":`0 0 0 1px ${C.border}` }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(2,1fr)", gap:14 }}>
            {filteredLenders.map((l,i)=>{
              const catColors = {
                "Receivables":C.teal, "Venture Debt":C.sky,
                "Royalty":C.amber, "IP-Backed":"#8B2252", "Grants":C.emerald
              };
              const clr = catColors[l.cat] || C.navy;
              return (
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`,
                                      borderLeft:`3px solid ${clr}`, borderRadius:10, padding:"18px 20px",
                                      display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                                      gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <span style={{ fontSize:"0.82rem", fontWeight:700, color:C.navy }}>{l.name}</span>
                      {l.priority===1 && (
                        <span style={{ background:C.ltGreen, color:C.emerald, fontSize:"0.58rem",
                                       fontWeight:800, padding:"2px 7px", borderRadius:99,
                                       letterSpacing:"0.08em", textTransform:"uppercase" }}>Priority 1</span>
                      )}
                    </div>
                    <div style={{ fontSize:"0.72rem", color:C.muted, marginBottom:4 }}>{l.fit}</div>
                    <div style={{ display:"flex", gap:16 }}>
                      <div>
                        <span style={{ fontSize:"0.62rem", color:C.muted }}>Check size: </span>
                        <span style={{ fontSize:"0.72rem", fontWeight:600, color:C.navy,
                                       fontFamily:"IBM Plex Mono, monospace" }}>{l.size}</span>
                      </div>
                      <div>
                        <span style={{ fontSize:"0.62rem", color:C.muted }}>Close: </span>
                        <span style={{ fontSize:"0.72rem", fontWeight:600, color:clr,
                                       fontFamily:"IBM Plex Mono, monospace" }}>{l.timing}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ background:`${clr}15`, color:clr, fontSize:"0.6rem",
                                 fontWeight:700, padding:"4px 10px", borderRadius:6,
                                 textTransform:"uppercase", letterSpacing:"0.08em",
                                 flexShrink:0 }}>{l.cat}</span>
                </div>
              );
            })}
          </div>

          {/* Priority outreach sequence */}
          <div style={{ marginTop:36 }}>
            <div style={{ fontSize:"0.72rem", fontWeight:700, color:C.navy, letterSpacing:"0.1em",
                          textTransform:"uppercase", marginBottom:20 }}>Priority Outreach Sequence</div>
            <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(3,1fr)", gap:14 }}>
              {[
                { n:1, firm:"Prestige Capital",          action:"Submit ForHumanity + CareValidate contracts",   time:"This week",  color:C.teal },
                { n:2, firm:"Outcome Capital (advisor)", action:"Engage for competitive lender process",          time:"Week 2",     color:C.teal },
                { n:3, firm:"White Oak Healthcare",      action:"Full ABL facility on complete contract base",    time:"Week 3",     color:C.sky },
                { n:4, firm:"SWK Holdings",              action:"Royalty debt with White Oak term sheet as leverage",time:"Month 2", color:C.sky },
                { n:5, firm:"Runway Growth Capital",     action:"Venture debt alongside Series A close",          time:"At Series A",color:C.amber },
                { n:6, firm:"NIH NIDDK SBIR",            action:"Submit LOI — begin regardless of other outcomes",time:"Ongoing",   color:C.emerald },
              ].map((p,i)=>(
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`,
                                      borderRadius:10, padding:"18px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:p.color,
                                  color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                                  fontWeight:800, fontSize:"0.78rem", flexShrink:0 }}>{p.n}</div>
                    <div style={{ fontSize:"0.8rem", fontWeight:700, color:C.navy }}>{p.firm}</div>
                  </div>
                  <p style={{ fontSize:"0.73rem", color:C.muted, lineHeight:1.5, marginBottom:10 }}>{p.action}</p>
                  <span style={{ background:`${p.color}15`, color:p.color, fontSize:"0.62rem",
                                 fontWeight:700, padding:"3px 10px", borderRadius:99,
                                 letterSpacing:"0.06em" }}>{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ── FLYWHEEL ─────────────────────────────────────────── */}
      <div style={{ background:C.navy, color:"white" }}>
        <div className="section">
          <SL n="05" light={true}>The Strategic Thesis — Alternative Paths to the Listing</SL>

          {/* Thesis statement */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.5fr 1fr", gap:48, alignItems:"flex-start", marginBottom:56 }}>
            <div>
              <h2 style={{ fontFamily:"DM Serif Display, serif", fontSize:mob?"1.8rem":"2.6rem",
                           fontWeight:400, lineHeight:1.2, marginBottom:24, color:"white" }}>
                Three instruments. Three paths.<br/>
                <span style={{ color:"#2DD4BF" }}>One destination — the listing.</span>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"0.92rem", lineHeight:1.8, marginBottom:20 }}>
                The three scenarios in this document are not a fundraising menu — they are a structural analysis. Each one answers the same question from a different starting point: what combination of instruments gets Altanine-Polomar to the merger close and public listing with the strongest possible balance sheet, the most defensible covenant structure, and the maximum flexibility to bring in equity partners on favorable terms when the timing is right.
              </p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.85rem", lineHeight:1.8, borderLeft:"2px solid rgba(15,123,140,0.6)", paddingLeft:16 }}>
                For investment bankers: this document provides the capital structure context needed to position the company for a structured financing process across receivables lenders, royalty monetization firms, and venture debt providers simultaneously. For debt financing partners: the asset base, revenue contracts, and patent estate are modeled here with full debt service coverage, stress testing, and covenant analysis — everything needed to underwrite a term sheet.
              </p>
            </div>

            {/* Key insight cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { n:"01", title:"Clean Cap Table at IPO", body:"Debt-funded milestones mean founders and early investors own more of a higher-valuation company when it lists — not less of a distressed one.", color:"#2DD4BF" },
                { n:"02", title:"Stock Becomes Currency", body:"Public equity can be issued at market prices for acquisitions, partnerships, and follow-on rounds — far more powerful than diluting at a Series A price.", color:"#60A5FA" },
                { n:"03", title:"Cost of Capital Drops", body:"Public companies with audited financials and a rising stock price access credit at SOFR+1–2% vs the SOFR+5–10% available to private companies today.", color:"#A78BFA" },
                { n:"04", title:"Liquidity Without a Sale", body:"Founders, employees, and early investors gain real liquid value through secondary market sales — no acquisition required to realize gains.", color:"#34D399" },
              ].map((p,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                                      borderLeft:`3px solid ${p.color}`, borderRadius:10, padding:"16px 18px",
                                      display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ fontSize:"0.6rem", fontWeight:800, color:p.color, letterSpacing:"0.12em",
                                textTransform:"uppercase", flexShrink:0, marginTop:2 }}>{p.n}</div>
                  <div>
                    <div style={{ fontWeight:700, color:"white", fontSize:"0.82rem", marginBottom:5 }}>{p.title}</div>
                    <div style={{ fontSize:"0.73rem", color:"rgba(255,255,255,0.55)", lineHeight:1.55 }}>{p.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flywheel phases */}
          <div style={{ marginBottom:48 }}>
            <div style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
                          color:"rgba(255,255,255,0.4)", marginBottom:24 }}>How the Capital Structure Compounds Post-Listing</div>
            <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(4,1fr)", gap:0,
                          position:"relative" }}>
              {[
                { phase:"Phase 1", title:"Asset-Backed Bridge to Close", window:"Now → Merger Close",
                  body:"Receivables, royalty monetization, and selective debt instruments fund operations through the merger close. The equity raise — if it happens — happens on our timeline, not a deadline.",
                  color:"#2DD4BF", metric:"$10–14M", metricLbl:"Non-dilutive capital" },
                { phase:"Phase 2", title:"Clean Cap Table at Listing", window:"Post-Merger",
                  body:"The merged Altanine-Polomar entity lists with a cap table that reflects the actual value built — not the dilution extracted during a cash-constrained fundraise.",
                  color:"#60A5FA", metric:"0%", metricLbl:"Forced dilution" },
                { phase:"Phase 3", title:"Public Markets Become the Engine", window:"Year 1–2 Public",
                  body:"Revenue growth, ALT-301 milestones, and clinic expansion drive the stock. A rising public valuation unlocks institutional financing that resets the cost of capital entirely.",
                  color:"#A78BFA", metric:"SOFR+1–2%", metricLbl:"Public co. borrowing cost" },
                { phase:"Phase 4", title:"Lower Cost Capital Compounds", window:"2028 Onward",
                  body:"Cheaper public-market borrowing accelerates manufacturing, R&D, and expansion. More of every dollar goes into the business. The gap between this path and a conventional Series A widens every year.",
                  color:"#34D399", metric:"$39M+", metricLbl:"FCF from 2030 onward" },
              ].map((p,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.04)", borderTop:`3px solid ${p.color}`,
                                      padding:"28px 24px", borderRight:i<3?"1px solid rgba(255,255,255,0.06)":"none",
                                      position:"relative" }}>
                  <div style={{ fontSize:"0.6rem", fontWeight:800, color:p.color, letterSpacing:"0.14em",
                                textTransform:"uppercase", marginBottom:4 }}>{p.phase}</div>
                  <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", marginBottom:14,
                                fontFamily:"IBM Plex Mono, monospace" }}>{p.window}</div>
                  <div style={{ fontWeight:700, color:"white", fontSize:"0.9rem", marginBottom:12,
                                lineHeight:1.3 }}>{p.title}</div>
                  <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", lineHeight:1.6, marginBottom:20 }}>{p.body}</p>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:16 }}>
                    <div style={{ fontFamily:"IBM Plex Mono, monospace", fontWeight:800, color:p.color,
                                  fontSize:"1.3rem", letterSpacing:"-0.02em" }}>{p.metric}</div>
                    <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.35)", marginTop:4,
                                  textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>{p.metricLbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* vs conventional path comparison */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:16 }}>
            <div style={{ background:"rgba(190,18,60,0.1)", border:"1px solid rgba(190,18,60,0.25)",
                          borderRadius:12, padding:"28px 28px" }}>
              <div style={{ fontSize:"0.65rem", fontWeight:800, color:"#FB7185", letterSpacing:"0.14em",
                            textTransform:"uppercase", marginBottom:16 }}>Series A — Conventional Path</div>
              {[
                "Raise full Series A at low early valuation — maximum dilution at minimum price",
                "Founders & team own less of a company that still needs to prove itself",
                "Private company borrowing costs: SOFR+5–10% throughout growth phase",
                "Liquidity only available at acquisition or IPO — no interim options",
                "Cap table complexity from early rounds complicates the IPO process",
                "Every milestone requires another dilutive round to fund the next",
              ].map((t,i)=>(
                <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                  <div style={{ color:"#FB7185", fontSize:"0.8rem", flexShrink:0, marginTop:1 }}>✕</div>
                  <span style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", lineHeight:1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(5,150,105,0.1)", border:"1px solid rgba(5,150,105,0.25)",
                          borderRadius:12, padding:"28px 28px" }}>
              <div style={{ fontSize:"0.65rem", fontWeight:800, color:"#34D399", letterSpacing:"0.14em",
                            textTransform:"uppercase", marginBottom:16 }}>Alternative Path — Altanine-Polomar</div>
              {[
                "Debt bridges the merger close — cap table stays clean through listing",
                "Founders & early investors own full stake in a public, cash-flowing entity",
                "Public market access: SOFR+1–2% borrowing once listed and rated",
                "Liquidity available continuously via secondary market stock sales",
                "Clean two-party cap table makes IPO process straightforward",
                "FCF from 503B funds next milestones independently — debt retires by 2030",
              ].map((t,i)=>(
                <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                  <div style={{ color:"#34D399", fontSize:"0.8rem", flexShrink:0, marginTop:1 }}>✓</div>
                  <span style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
        </>
      )}

      {/* ── STRATEGIC REVENUE EXPANSION TAB ─────────────────────── */}
      {creativeTab === "revenue" && (
        <>
          {/* ── S04: REVENUE CHANNELS — compact unified ─────────────── */}
          <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
            <div className="section" style={{ paddingTop:28, paddingBottom:28 }}>

              {/* Label */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:C.teal,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              color:"white", fontSize:"0.58rem", fontWeight:800 }}>04</div>
                <span style={{ fontSize:"0.62rem", fontWeight:700, color:C.teal,
                               letterSpacing:"0.2em", textTransform:"uppercase" }}>Revenue Channels — Current + Expansion Stack</span>
              </div>

              {/* Top row: headline left, Problem/Solution right */}
              <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"0.9fr 1.1fr", gap:28, marginBottom:20, alignItems:"start" }}>

                {/* Left: headline + body + KPI cards */}
                <div>
                  <h2 style={{ fontFamily:"DM Serif Display, serif", fontSize:"clamp(1.2rem,2vw,1.6rem)",
                               color:C.navy, lineHeight:1.2, marginBottom:8 }}>
                    Six products generating cash today.<br/>
                    <span style={{ color:C.teal }}>Seven plug-and-play channels ready to stack.</span>
                  </h2>
                  <div style={{ width:28, height:3, background:C.teal, borderRadius:2, marginBottom:12 }}/>
                  <p style={{ fontSize:"0.78rem", lineHeight:1.72, color:"#334155", marginBottom:16 }}>
                    Ancillary channels are a direct extension of infrastructure already operating. Polomar's 503A license,
                    Altanine's oral delivery patents, and ForHumanity's patient distribution network are all live today.
                    Supplements flow day-of-manufacture. B2B CDMO leverages existing equipment at zero marginal capex.
                    Sister supplement entity operational in ~60 days for under $500K — unlocks OTC, Amazon, and DTC
                    without touching the 503A structure.
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[
                      { val:"$11.90M", lbl:"FY2026 Combined",    sub:"Pharmacy + ancillary",    color:C.teal    },
                      { val:"$40.07M", lbl:"FY2027 Combined",    sub:"3.4× on full platform",   color:C.teal    },
                      { val:"$1.49M",  lbl:"Ancillary FY2026",   sub:"~65% avg GM · same base", color:"#0284C7" },
                      { val:"$18.02M", lbl:"Ancillary FY2028e",  sub:"7 channels fully ramped", color:"#059669" },
                    ].map((s,i) => (
                      <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 14px" }}>
                        <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:s.color,
                                      fontSize:"1.1rem", lineHeight:1, marginBottom:4 }}>{s.val}</div>
                        <div style={{ fontSize:"0.57rem", fontWeight:700, color:C.muted, letterSpacing:"0.1em",
                                      textTransform:"uppercase", marginBottom:2 }}>{s.lbl}</div>
                        <div style={{ fontSize:"0.65rem", color:C.muted }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Problem / Solution 03 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 32px 1fr", gap:0 }}>
                  <div style={{ padding:"20px 22px", background:"#EEF2F7",
                                border:`1px solid ${C.border}`,
                                borderRadius:"10px 0 0 10px", borderRight:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <span style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"0.58rem", fontWeight:700,
                                     color:C.navy, border:`1px solid ${C.navy}44`, padding:"2px 6px", borderRadius:3 }}>PROBLEM 03</span>
                      <span style={{ fontSize:"0.58rem", fontWeight:700, color:C.navy,
                                     textTransform:"uppercase", letterSpacing:"0.09em" }}>Investor False Choice</span>
                    </div>
                    <h3 style={{ fontFamily:"DM Serif Display,serif", fontSize:"clamp(0.95rem,1.4vw,1.1rem)",
                                 color:C.navy, lineHeight:1.3, marginBottom:8 }}>
                      Biotech OR compounding. Never both.
                    </h3>
                    <p style={{ fontSize:"0.74rem", lineHeight:1.65, color:C.muted, marginBottom:14 }}>
                      Life sciences investing has always forced a binary: years of cash burn and a 12% FDA approval rate,
                      or compounding's immediate cash flow at commodity margins with no defensibility and 3–5× exit ceilings.
                    </p>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
                      {[
                        { val:"12%",   label:"NDA approval rate" },
                        { val:"3–5×",  label:"Compounding exit ceiling" },
                        { val:"$30M+", label:"To replicate IP moat" },
                      ].map((s,i) => (
                        <div key={i} style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 10px" }}>
                          <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:C.navy, fontSize:"0.92rem", marginBottom:2 }}>{s.val}</div>
                          <div style={{ fontSize:"0.58rem", color:C.muted, lineHeight:1.3 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                                background:C.surface, border:`1px solid ${C.border}`,
                                borderLeft:"none", borderRight:"none" }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:"white",
                                  border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
                                  justifyContent:"center", fontSize:"0.7rem", color:C.muted }}>→</div>
                  </div>

                  <div style={{ padding:"20px 22px", background:C.ltGreen,
                                border:`1px solid #BBF7D0`,
                                borderRadius:"0 10px 10px 0", borderLeft:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <span style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"0.58rem", fontWeight:700,
                                     color:C.emerald, border:`1px solid ${C.emerald}44`, padding:"2px 6px", borderRadius:3 }}>SOLUTION 03</span>
                      <span style={{ fontSize:"0.58rem", fontWeight:700, color:C.emerald,
                                     textTransform:"uppercase", letterSpacing:"0.09em" }}>Dual Engine Structure</span>
                    </div>
                    <h3 style={{ fontFamily:"DM Serif Display,serif", fontSize:"clamp(0.95rem,1.4vw,1.1rem)",
                                 color:C.navy, lineHeight:1.3, marginBottom:8 }}>
                      Cash flow Q2 2026. Patent moat through 2042.
                    </h3>
                    <p style={{ fontSize:"0.74rem", lineHeight:1.65, color:C.muted, marginBottom:14 }}>
                      The Altanine-Polomar merger creates the first structure where both engines run simultaneously.
                      The 503B generates $5–10M contracted revenue, reaching cash flow positive by Q2 2026 — funding
                      operations while ALT-301 505(b)(2) advances. 37.5% success rate vs. 12% traditional NDA.
                    </p>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
                      {[
                        { val:"37.5%", label:"505(b)(2) success rate" },
                        { val:"2042",  label:"Patent protection expiry" },
                        { val:"54×",   label:"Peak ROI (post ALT-401)" },
                      ].map((s,i) => (
                        <div key={i} style={{ background:"white", border:`1px solid #BBF7D0`, borderRadius:6, padding:"8px 10px" }}>
                          <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:C.emerald, fontSize:"0.92rem", marginBottom:2 }}>{s.val}</div>
                          <div style={{ fontSize:"0.58rem", color:C.muted, lineHeight:1.3 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── REVENUE CHART + FINANCIAL MODEL — unified compact section ── */}
          <div style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
            <div className="section" style={{ paddingTop:32, paddingBottom:32 }}>

              {/* Section label */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:C.teal,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              color:"white", fontSize:"0.58rem", fontWeight:800 }}>05</div>
                <span style={{ fontSize:"0.62rem", fontWeight:700, color:C.teal,
                               letterSpacing:"0.2em", textTransform:"uppercase" }}>Financial Model — Revenue by Channel & Growth Tiers</span>
              </div>

              {/* Top row: chart left, KPIs right */}
              <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.35fr 0.65fr", gap:24, marginBottom:20 }}>

                {/* Bar chart */}
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                    <div>
                      <div style={{ fontWeight:800, color:C.navy, fontSize:"0.88rem", marginBottom:2 }}>Revenue by Channel — Pharmacy vs. Ancillary</div>
                      <div style={{ fontSize:"0.7rem", color:C.muted }}>FY2026 → FY2027 → FY2028e · hover any bar for full breakdown</div>
                    </div>
                    <div style={{ display:"flex", gap:16 }}>
                      {[
                        { color:C.teal,    label:"Pharmacy",  sub:"6 products" },
                        { color:"#0284C7", label:"Ancillary", sub:"7 channels" },
                      ].map((l,i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:10, height:10, borderRadius:2, background:l.color }}/>
                          <div>
                            <div style={{ fontSize:"0.68rem", fontWeight:700, color:C.navy }}>{l.label}</div>
                            <div style={{ fontSize:"0.6rem", color:C.muted }}>{l.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart barCategoryGap="30%" barGap={6} margin={{ top:4, right:8, bottom:4, left:4 }}
                      data={[
                        { y:"FY2026",  pharmacy:10.41, anc:1.49,
                          ph_detail:{ sema:2.11, tirz:3.37, isil:2.21, elet:0.53, ssub:1.15, mgum:1.05 },
                          anc_detail:{ supp:0.60, cdmo:0.45, pep:0.18, fm:0.12, otc:0, ip:0, vet:0.14 } },
                        { y:"FY2027",  pharmacy:33.55, anc:6.52,
                          ph_detail:{ sema:4.15, tirz:6.90, isil:9.46, elet:5.07, ssub:4.00, mgum:3.97 },
                          anc_detail:{ supp:2.20, cdmo:1.80, pep:1.20, fm:0.54, otc:0.48, ip:0.24, vet:0.42 } },
                        { y:"FY2028e", pharmacy:43.80, anc:18.02,
                          ph_detail:{ sema:3.20, tirz:5.10, isil:14.20, elet:8.80, ssub:5.50, mgum:7.00 },
                          anc_detail:{ supp:5.40, cdmo:4.20, pep:3.20, fm:1.40, otc:2.20, ip:1.80, vet:0.92 } },
                      ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                      <XAxis dataKey="y" tick={{ fontSize:11, fill:C.muted, fontWeight:600 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:10, fill:C.muted }} tickFormatter={v=>`$${v}M`} axisLine={false} tickLine={false} width={46}/>
                      <Tooltip cursor={{ fill:"rgba(27,42,74,0.04)" }}
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const row = payload[0]?.payload;
                          const isPh = payload[0]?.dataKey === "pharmacy";
                          const detail = isPh ? row?.ph_detail : row?.anc_detail;
                          const total = payload[0]?.value;
                          const items = isPh
                            ? [
                                { n:"Semaglutide", v:detail?.sema, c:"#0F7B8C" },
                                { n:"Tirzepatide", v:detail?.tirz, c:"#0E9488" },
                                { n:"Inhal. Sildenafil", v:detail?.isil, c:"#0284C7" },
                                { n:"Inhal. Eletriptan", v:detail?.elet, c:"#7C3AED" },
                                { n:"Sildenafil Sub.", v:detail?.ssub, c:"#059669" },
                                { n:"Metformin Gummy", v:detail?.mgum, c:"#D97706" },
                              ]
                            : [
                                { n:"Supplements", v:detail?.supp, c:"#0284C7" },
                                { n:"B2B CDMO", v:detail?.cdmo, c:"#0369A1" },
                                { n:"Peptides", v:detail?.pep, c:"#7C3AED" },
                                { n:"FM Clinic", v:detail?.fm, c:"#059669" },
                                { n:"OTC/DTC", v:detail?.otc, c:"#D97706" },
                                { n:"IP Licensing", v:detail?.ip, c:"#1B2A4A" },
                                { n:"Veterinary", v:detail?.vet, c:"#0E9488" },
                              ];
                          const ac = isPh ? C.teal : "#0284C7";
                          return (
                            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8,
                                          padding:"12px 14px", fontSize:"0.7rem", boxShadow:"0 8px 20px rgba(27,42,74,0.1)",
                                          minWidth:200, borderTop:`3px solid ${ac}` }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                                <div style={{ fontWeight:800, color:C.navy }}>{label} · {isPh?"Pharmacy":"Ancillary"}</div>
                                <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:ac }}>${total?.toFixed(2)}M</div>
                              </div>
                              {items.filter(x=>x.v>0).map((it,i) => (
                                <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:12, marginBottom:3 }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                    <div style={{ width:7, height:7, borderRadius:2, background:it.c }}/>
                                    <span style={{ color:C.muted }}>{it.n}</span>
                                  </div>
                                  <span style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:C.navy }}>${it.v?.toFixed(2)}M</span>
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="pharmacy" name="Pharmacy" fill={C.teal} radius={[5,5,0,0]} maxBarSize={72}/>
                      <Bar dataKey="anc" name="Ancillary" fill="#0284C7" radius={[5,5,0,0]} maxBarSize={72}/>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop:10, background:"#FEF3C7", border:"1px solid #FDE68A",
                                borderLeft:`3px solid #D97706`, borderRadius:"0 6px 6px 0",
                                padding:"7px 12px", fontSize:"0.72rem", color:C.navy }}>
                    <strong style={{ color:"#D97706" }}>GLP-1 Watch — </strong>
                    Sema + Tirz = $5.48M FY2026 (46%). Ancillary reduces concentration to ~22% by FY2028e.
                  </div>
                </div>

                {/* Right: headline + KPI list */}
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>
                  <h2 style={{ fontFamily:"DM Serif Display, serif", fontSize:"clamp(1.1rem,2vw,1.5rem)",
                               color:C.navy, lineHeight:1.25, marginBottom:8 }}>
                    Compounding cash flow.<br/>
                    <span style={{ color:C.teal }}>Three tiers of growth.</span>
                  </h2>
                  <div style={{ width:28, height:3, background:C.teal, borderRadius:2, marginBottom:14 }}/>
                  <p style={{ fontSize:"0.76rem", lineHeight:1.7, color:"#334155", marginBottom:16 }}>
                    Pharmacy baseline → ancillary stack → full IP/CDMO scale. Same infrastructure.
                    $12M hybrid capital, 62.5% non-dilutive. EBITDA 25% → 43%+.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {[
                      { val:"$2.98M → $26.50M", lbl:"EBITDA FY2026 → FY2028e", color:"#059669" },
                      { val:"25% → 43%",         lbl:"EBITDA Margin Expansion",  color:"#059669" },
                      { val:"~42%",              lbl:"IRR — Scenario 2 Hybrid",  color:C.teal    },
                      { val:"2029",              lbl:"Debt Fully Retired",        color:"#0284C7" },
                      { val:"$35–65M",           lbl:"Series A Valuation",        color:"#7C3AED" },
                    ].map((s,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                            padding:"7px 12px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:7 }}>
                        <div style={{ fontSize:"0.66rem", color:C.muted, fontWeight:600 }}>{s.lbl}</div>
                        <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:s.color,
                                      fontSize:"0.82rem", marginLeft:12, whiteSpace:"nowrap" }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tier Growth Table */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
                            overflow:"hidden", marginBottom:24 }}>
                <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, background:C.navy,
                              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:700, color:"white", fontSize:"0.86rem" }}>Revenue & EBITDA — Three Growth Tiers</div>
                    <div style={{ fontSize:"0.67rem", color:"rgba(255,255,255,0.45)", marginTop:2 }}>
                      Same infrastructure · Scenario 2 Hybrid · FY2026–2028e
                    </div>
                  </div>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem" }}>
                    <thead>
                      <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                        {["","FY2026 Rev","FY2026 EBITDA","FY2027 Rev","FY2027 EBITDA","FY2028e Rev","FY2028e EBITDA","Val. Range"].map((h,i) => (
                          <th key={i} style={{ padding:"8px 12px", textAlign:"left", color:C.muted,
                                              fontWeight:700, fontSize:"0.58rem", letterSpacing:"0.09em", textTransform:"uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tier:"Tier 1 — Pharmacy Only",       t1r:"$10.41M",t1e:"$2.10M", t2r:"$33.55M",t2e:"$11.98M",t3r:"$43.80M",t3e:"$18.50M",val:"$22–30M",  c:C.teal,    bg:C.bg      },
                        { tier:"Tier 2 — + Ancillary Stack",   t1r:"$11.90M",t1e:"$2.98M", t2r:"$40.07M",t2e:"$15.62M",t3r:"$61.82M",t3e:"$26.50M",val:"$35–65M",  c:"#0284C7", bg:"#F0F9FF" },
                        { tier:"Tier 3 — + Full IP/CDMO Scale",t1r:"$11.90M",t1e:"$3.10M", t2r:"$44.00M",t2e:"$18.50M",t3r:"$78.00M",t3e:"$36.00M",val:"$55–90M",  c:"#059669", bg:"#F0FFF4" },
                      ].map((r,i) => (
                        <tr key={i} style={{ background:r.bg, borderBottom:`1px solid ${C.borderLt}` }}>
                          <td style={{ padding:"11px 12px", fontWeight:800, color:r.c, fontSize:"0.76rem", borderLeft:`3px solid ${r.c}` }}>{r.tier}</td>
                          <td style={{ padding:"11px 12px", fontFamily:"IBM Plex Mono,monospace", color:C.navy, fontWeight:600, fontSize:"0.76rem" }}>{r.t1r}</td>
                          <td style={{ padding:"11px 12px", fontFamily:"IBM Plex Mono,monospace", color:"#059669", fontWeight:600, fontSize:"0.76rem" }}>{r.t1e}</td>
                          <td style={{ padding:"11px 12px", fontFamily:"IBM Plex Mono,monospace", color:C.navy, fontWeight:600, fontSize:"0.76rem" }}>{r.t2r}</td>
                          <td style={{ padding:"11px 12px", fontFamily:"IBM Plex Mono,monospace", color:"#059669", fontWeight:600, fontSize:"0.76rem" }}>{r.t2e}</td>
                          <td style={{ padding:"11px 12px", fontFamily:"IBM Plex Mono,monospace", color:C.navy, fontWeight:700, fontSize:"0.76rem" }}>{r.t3r}</td>
                          <td style={{ padding:"11px 12px", fontFamily:"IBM Plex Mono,monospace", color:"#059669", fontWeight:700, fontSize:"0.76rem" }}>{r.t3e}</td>
                          <td style={{ padding:"11px 12px", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:r.c, fontSize:"0.8rem" }}>{r.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts */}
              <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:18, marginBottom:28 }}>
                <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                  <div style={{ fontWeight:700, color:C.navy, fontSize:"0.83rem", marginBottom:2 }}>Revenue Growth — All Three Tiers ($M)</div>
                  <div style={{ fontSize:"0.68rem", color:C.muted, marginBottom:14 }}>FY2026 → FY2027 → FY2028e</div>
                  <ResponsiveContainer width="100%" height={190}>
                    <BarChart data={[
                      { y:"FY2026",  t1:10.41, t2:11.90, t3:11.90 },
                      { y:"FY2027",  t1:33.55, t2:40.07, t3:44.00 },
                      { y:"FY2028e", t1:43.80, t2:61.82, t3:78.00 },
                    ]} margin={{ top:4, right:4, bottom:0, left:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                      <XAxis dataKey="y" tick={{ fontSize:10, fill:C.muted }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:10, fill:C.muted }} tickFormatter={v=>`$${v}M`} axisLine={false} tickLine={false}/>
                      <Tooltip formatter={(v,n)=>[`$${v}M`,n]}/>
                      <Legend wrapperStyle={{ fontSize:10 }}/>
                      <Bar dataKey="t1" name="Pharmacy Only"  fill={C.teal}    radius={[3,3,0,0]}/>
                      <Bar dataKey="t2" name="+ Ancillary"    fill="#0284C7"   radius={[3,3,0,0]}/>
                      <Bar dataKey="t3" name="+ Full IP/CDMO" fill="#059669"   radius={[3,3,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                  <div style={{ fontWeight:700, color:C.navy, fontSize:"0.83rem", marginBottom:2 }}>EBITDA & Cash Flow Ramp ($M)</div>
                  <div style={{ fontSize:"0.68rem", color:C.muted, marginBottom:14 }}>Combined platform · net of debt service</div>
                  <ResponsiveContainer width="100%" height={190}>
                    <AreaChart data={[
                      { y:"FY2026",  ebitda:2.98,  fcf:1.65,  pharmacy:2.10  },
                      { y:"FY2027",  ebitda:15.62, fcf:11.20, pharmacy:11.98 },
                      { y:"FY2028e", ebitda:26.50, fcf:22.00, pharmacy:18.50 },
                    ]} margin={{ top:4, right:4, bottom:0, left:0 }}>
                      <defs>
                        <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.02}/>
                        </linearGradient>
                        <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.teal} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={C.teal} stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.borderLt} vertical={false}/>
                      <XAxis dataKey="y" tick={{ fontSize:10, fill:C.muted }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:10, fill:C.muted }} tickFormatter={v=>`$${v}M`} axisLine={false} tickLine={false}/>
                      <Tooltip formatter={(v,n)=>[`$${v}M`,n]}/>
                      <Legend wrapperStyle={{ fontSize:10 }}/>
                      <Area type="monotone" dataKey="ebitda"   name="Combined EBITDA" stroke="#059669" fill="url(#ge)" strokeWidth={2} dot={false}/>
                      <Area type="monotone" dataKey="fcf"      name="Free Cash Flow"  stroke={C.teal}  fill="url(#gt)" strokeWidth={2} dot={false}/>
                      <Area type="monotone" dataKey="pharmacy" name="Pharmacy EBITDA" stroke="#94A3B8" fill="none"      strokeWidth={1.5} strokeDasharray="4 3" dot={false}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>


              {/* ── Capital + Exit cards — 2 horizontal cards above P&L ── */}
              <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:16, marginBottom:20 }}>
                {/* Capital Structure */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
                              padding:"16px 20px", borderTop:`3px solid ${C.teal}` }}>
                  <div style={{ fontSize:"0.58rem", fontWeight:700, color:C.teal, letterSpacing:"0.18em",
                                textTransform:"uppercase", marginBottom:12 }}>Capital Structure — Scenario 2 ★</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
                    {[
                      { l:"Series A Equity",  v:"$4.5M",  sub:"~18% dilution",   c:C.navy    },
                      { l:"Receivables Fin.", v:"$4.5M",  sub:"9.8% · White Oak", c:C.teal   },
                      { l:"Venture Debt",     v:"$2.0M",  sub:"11.3% · warrant",  c:"#334155" },
                      { l:"SBIR / NIH",       v:"$1.0M",  sub:"Non-repayable",    c:"#059669" },
                      { l:"Total",            v:"$12.0M", sub:"62.5% non-dilutive",c:"#7C3AED"},
                    ].map((item,i) => (
                      <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`,
                                            borderRadius:8, padding:"10px 10px",
                                            borderTop:`2px solid ${item.c}` }}>
                        <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800,
                                      color:item.c, fontSize:"0.82rem", marginBottom:3 }}>{item.v}</div>
                        <div style={{ fontSize:"0.62rem", fontWeight:700, color:C.navy,
                                      marginBottom:2, lineHeight:1.2 }}>{item.l}</div>
                        <div style={{ fontSize:"0.58rem", color:C.muted }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Exit KPIs */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
                              padding:"16px 20px", borderTop:`3px solid #059669` }}>
                  <div style={{ fontSize:"0.58rem", fontWeight:700, color:"#059669", letterSpacing:"0.18em",
                                textTransform:"uppercase", marginBottom:12 }}>Exit KPIs</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                    {[
                      { l:"IRR to Equity",   v:"~42%",    c:C.teal    },
                      { l:"Debt Retired",    v:"2029",    c:"#059669" },
                      { l:"Series A Val.",   v:"$35–65M", c:"#7C3AED" },
                      { l:"2032 Exit (15×)", v:"$11.1B",  c:"#0284C7" },
                    ].map((item,i) => (
                      <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`,
                                            borderRadius:8, padding:"10px 10px",
                                            borderTop:`2px solid ${item.c}` }}>
                        <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800,
                                      color:item.c, fontSize:"1rem", marginBottom:3 }}>{item.v}</div>
                        <div style={{ fontSize:"0.63rem", color:C.muted, lineHeight:1.3 }}>{item.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── COMPACT P&L TABLE — single row per product ─────────── */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"12px 18px", background:C.navy, display:"flex",
                              justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div style={{ fontWeight:700, color:"white", fontSize:"0.88rem" }}>Expanded P&L — Revenue Expansion Strategy</div>
                    <div style={{ fontSize:"0.63rem", color:"rgba(255,255,255,0.4)", marginTop:1 }}>
                      PMHS ProForma FY2026/2027 actuals + ancillary add-on · all charges shown
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ fontSize:"0.56rem", fontWeight:700, padding:"2px 8px", borderRadius:4,
                                   background:"rgba(15,123,140,0.3)", color:"#5EE7D0",
                                   border:"1px solid rgba(15,123,140,0.35)", letterSpacing:"0.06em", textTransform:"uppercase" }}>Source: PMHS ProForma</span>
                    <span style={{ fontSize:"0.56rem", fontWeight:700, padding:"2px 8px", borderRadius:4,
                                   background:"rgba(2,132,199,0.25)", color:"#7DD3FC",
                                   border:"1px solid rgba(2,132,199,0.3)", letterSpacing:"0.06em", textTransform:"uppercase" }}>+ Ancillary Add-On</span>
                  </div>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.74rem" }}>
                    <thead>
                      <tr style={{ background:C.bg, borderBottom:`2px solid ${C.border}` }}>
                        {["Product / Channel","Cat.","FY26 Revenue","FY27 Revenue","FY28e Revenue","FY26 COGS","FY27 COGS","FY26 Royalties","Net Rev FY26","Net Rev FY27","GM"].map((h,i) => (
                          <th key={i} style={{ padding:"7px 10px", textAlign:i>1?"right":"left",
                                              color:C.muted, fontWeight:700, fontSize:"0.55rem",
                                              letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Pharmacy section header */}
                      <tr style={{ background:"#F0F7FF" }}>
                        <td colSpan={11} style={{ padding:"5px 10px", fontSize:"0.58rem", fontWeight:800,
                                                   color:C.teal, letterSpacing:"0.16em", textTransform:"uppercase",
                                                   borderBottom:`1px solid ${C.border}` }}>
                          503A Pharmacy — PMHS ProForma
                        </td>
                      </tr>
                      {[
                        { n:"Semaglutide",          cat:"GLP-1",    risk:"red",
                          r26:"$2.11M", r27:"$4.15M", r28:"$3.20M",
                          c26:"$928K",  c27:"$1.83M", roy:"—",
                          n26:"$1.18M", n27:"$2.32M", gm:"56%" },
                        { n:"Tirzepatide",           cat:"GLP-1",    risk:"red",
                          r26:"$3.37M", r27:"$6.90M", r28:"$5.10M",
                          c26:"$1.48M", c27:"$3.03M", roy:"—",
                          n26:"$1.89M", n27:"$3.86M", gm:"56%" },
                        { n:"Inhalable Sildenafil",  cat:"Patented", risk:"green",
                          r26:"$2.21M", r27:"$9.46M", r28:"$14.20M",
                          c26:"$884K",  c27:"$3.79M", roy:"$332K",
                          n26:"$995K",  n27:"$4.26M", gm:"45%" },
                        { n:"Inhalable Eletriptan",  cat:"Patented", risk:"green",
                          r26:"$528K",  r27:"$5.07M", r28:"$8.80M",
                          c26:"$211K",  c27:"$2.03M", roy:"$79K",
                          n26:"$237K",  n27:"$2.28M", gm:"45%" },
                        { n:"Sildenafil Sublingual", cat:"Rx",       risk:"green",
                          r26:"$1.15M", r27:"$4.00M", r28:"$5.50M",
                          c26:"$458K",  c27:"$1.60M", roy:"—",
                          n26:"$687K",  n27:"$2.40M", gm:"60%" },
                        { n:"Metformin Gummy ALT-301",cat:"Pipeline",risk:"amber",
                          r26:"$825K",  r27:"$3.97M", r28:"$7.00M",
                          c26:"$495K",  c27:"$2.38M", roy:"$82K",
                          n26:"$247K",  n27:"$1.19M", gm:"30%" },
                      ].map((r,i) => (
                        <tr key={i} style={{ background:i%2===0?C.surface:C.bg, borderBottom:`1px solid ${C.borderLt}` }}>
                          <td style={{ padding:"8px 10px", fontWeight:700, color:C.navy, whiteSpace:"nowrap" }}>{r.n}</td>
                          <td style={{ padding:"8px 10px" }}>
                            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                              <span style={{ fontSize:"0.55rem", fontWeight:700, padding:"1px 6px", borderRadius:3,
                                             background:"#E0F2F7", color:C.teal, letterSpacing:"0.05em", textTransform:"uppercase",
                                             whiteSpace:"nowrap" }}>{r.cat}</span>
                              <span style={{ fontSize:"0.52rem", fontWeight:700, padding:"1px 6px", borderRadius:3,
                                             background:r.risk==="red"?"#FEE2E2":r.risk==="green"?"#DCFCE7":"#FEF9C3",
                                             color:r.risk==="red"?"#BE123C":r.risk==="green"?"#059669":"#A16207",
                                             whiteSpace:"nowrap" }}>
                                {r.risk==="red"?"⚠ Enforcement":r.risk==="green"?"✓ Low Risk":"▲ Margin Watch"}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:C.teal, fontSize:"0.76rem" }}>{r.r26}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted, fontSize:"0.74rem" }}>{r.r27}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:600, color:"#059669", fontSize:"0.74rem" }}>{r.r28}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#BE123C", fontSize:"0.72rem" }}>{r.c26}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#BE123C", fontSize:"0.72rem", opacity:0.7 }}>{r.c27}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#D97706", fontSize:"0.72rem" }}>{r.roy}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#059669", fontSize:"0.76rem" }}>{r.n26}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted, fontSize:"0.74rem" }}>{r.n27}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700,
                                       color:r.gm==="56%"||r.gm==="60%"?"#059669":r.gm==="30%"?"#D97706":C.teal, fontSize:"0.76rem" }}>{r.gm}</td>
                        </tr>
                      ))}
                      {/* Pharmacy subtotal */}
                      <tr style={{ background:"#EBF5FF", borderTop:`2px solid ${C.border}`, borderBottom:`2px solid ${C.border}` }}>
                        <td style={{ padding:"8px 10px", fontWeight:800, color:C.navy }}>Pharmacy Subtotal</td>
                        <td style={{ padding:"8px 10px", fontSize:"0.62rem", color:C.muted, fontStyle:"italic" }}>PMHS actuals</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:C.teal }}>$10.18M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted }}>$33.55M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#059669" }}>$43.80M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#BE123C" }}>$4.46M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#BE123C", opacity:0.7 }}>$14.66M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#D97706" }}>$493K</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:"#059669" }}>$5.23M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted }}>$16.32M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:C.teal }}>~51%</td>
                      </tr>

                      {/* Ancillary section header */}
                      <tr style={{ background:"#EFF6FF" }}>
                        <td colSpan={11} style={{ padding:"5px 10px", fontSize:"0.58rem", fontWeight:800,
                                                   color:"#0284C7", letterSpacing:"0.16em", textTransform:"uppercase",
                                                   borderBottom:`1px solid #BFDBFE` }}>
                          Ancillary Revenue Expansion — 7 Channels (~$1M to Activate)
                        </td>
                      </tr>
                      {[
                        { n:"Supplements / ForHumanity", cat:"Brand",    r26:"$600K",  r27:"$2.20M", r28:"$5.40M", c26:"$210K", c27:"$770K", roy:"—", n26:"$390K", n27:"$1.43M", gm:"~65%" },
                        { n:"B2B CDMO (Hims/Hers)",      cat:"Contract", r26:"$450K",  r27:"$1.80M", r28:"$4.20M", c26:"$158K", c27:"$630K", roy:"—", n26:"$293K", n27:"$1.17M", gm:"~65%" },
                        { n:"Peptides + Longevity",       cat:"503A Ext", r26:"$180K",  r27:"$1.20M", r28:"$3.20M", c26:"$68K",  c27:"$456K", roy:"—", n26:"$112K", n27:"$744K",  gm:"~62%" },
                        { n:"FM Clinic / Med Spa",         cat:"B2B",     r26:"$120K",  r27:"$540K",  r28:"$1.40M", c26:"$48K",  c27:"$216K", roy:"—", n26:"$72K",  n27:"$324K",  gm:"~60%" },
                        { n:"OTC / DTC + Amazon",          cat:"DTC",     r26:"—",      r27:"$480K",  r28:"$2.20M", c26:"—",     c27:"$216K", roy:"—", n26:"—",     n27:"$264K",  gm:"~55%" },
                        { n:"IP Licensing ALT-302/303",    cat:"IP",      r26:"—",      r27:"$240K",  r28:"$1.80M", c26:"—",     c27:"—",     roy:"—", n26:"—",     n27:"$240K",  gm:"~90%" },
                        { n:"Veterinary Compounding",      cat:"503A Ext",r26:"$140K",  r27:"$420K",  r28:"$920K",  c26:"$63K",  c27:"$189K", roy:"—", n26:"$77K",  n27:"$231K",  gm:"~55%" },
                      ].map((r,i) => (
                        <tr key={i} style={{ background:i%2===0?"#F0F9FF":"#E8F5FF", borderBottom:`1px solid #BFDBFE` }}>
                          <td style={{ padding:"8px 10px", fontWeight:700, color:C.navy, whiteSpace:"nowrap" }}>{r.n}</td>
                          <td style={{ padding:"8px 10px" }}>
                            <span style={{ fontSize:"0.55rem", fontWeight:700, padding:"1px 6px", borderRadius:3,
                                           background:"rgba(2,132,199,0.12)", color:"#0284C7",
                                           border:"1px solid rgba(2,132,199,0.2)", whiteSpace:"nowrap",
                                           letterSpacing:"0.05em", textTransform:"uppercase" }}>{r.cat}</span>
                          </td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#0284C7", fontSize:"0.76rem" }}>{r.r26}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted, fontSize:"0.74rem" }}>{r.r27}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:600, color:"#059669", fontSize:"0.74rem" }}>{r.r28}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#BE123C", fontSize:"0.72rem" }}>{r.c26}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#BE123C", fontSize:"0.72rem", opacity:0.7 }}>{r.c27}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#D97706", fontSize:"0.72rem", opacity:0.4 }}>{r.roy}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#059669", fontSize:"0.76rem" }}>{r.n26}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted, fontSize:"0.74rem" }}>{r.n27}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#0284C7", fontSize:"0.76rem" }}>{r.gm}</td>
                        </tr>
                      ))}
                      {/* Ancillary subtotal */}
                      <tr style={{ background:"#DBEAFE", borderTop:`2px solid #93C5FD`, borderBottom:`2px solid ${C.border}` }}>
                        <td style={{ padding:"8px 10px", fontWeight:800, color:"#0284C7" }}>Ancillary Subtotal</td>
                        <td style={{ padding:"8px 10px", fontSize:"0.62rem", color:"#0284C7", fontStyle:"italic" }}>~$1M activate</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:"#0284C7" }}>$1.49M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted }}>$6.52M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#059669" }}>$18.02M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#BE123C" }}>$547K</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#BE123C", opacity:0.7 }}>$2.28M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#D97706", opacity:0.4 }}>—</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:"#059669" }}>$944K</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:C.muted }}>$4.24M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:"#0284C7" }}>~65%</td>
                      </tr>
                      {/* Combined total */}
                      <tr style={{ background:C.navy }}>
                        <td style={{ padding:"9px 10px", fontWeight:800, color:"white" }}>Total Combined</td>
                        <td style={{ padding:"9px 10px", fontSize:"0.62rem", color:"rgba(255,255,255,0.4)" }}>All channels</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:"#5EE7D0" }}>$11.67M</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"rgba(255,255,255,0.5)" }}>$40.07M</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#34D399" }}>$61.82M</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#FCA5A5" }}>$5.01M</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"#FCA5A5", opacity:0.7 }}>$16.94M</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:700, color:"#FCD34D" }}>$493K</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:"#5EE7D0" }}>$6.17M</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", color:"rgba(255,255,255,0.5)" }}>$20.55M</td>
                        <td style={{ padding:"9px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:"#5EE7D0" }}>~54%</td>
                      </tr>
                      {/* P&L buildup */}
                      <tr style={{ background:C.bg }}>
                        <td colSpan={11} style={{ padding:"5px 10px", fontSize:"0.58rem", fontWeight:800,
                                                   color:C.teal, letterSpacing:"0.16em", textTransform:"uppercase",
                                                   borderTop:`2px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
                          P&L Buildup — EBITDA to Net Income
                        </td>
                      </tr>
                      {[
                        { l:"Gross Net Revenue (after COGS + Royalties)", y1:"$6.17M",   y2:"$20.55M", y3:"$31.87M", bold:true,  color:C.teal    },
                        { l:"Operating Expenses (G&A, Sales, R&D)",       y1:"($3.19M)", y2:"($4.93M)",y3:"($5.37M)",bold:false, color:C.muted   },
                        { l:"EBITDA",                                      y1:"$2.98M",   y2:"$15.62M", y3:"$26.50M", bold:true,  color:"#059669", shade:"#F0FFF4" },
                        { l:"EBITDA Margin",                               y1:"25.5%",    y2:"39.0%",   y3:"42.9%",   bold:false, color:C.muted   },
                        { l:"Interest Expense (Scenario 2)",               y1:"($0.67M)", y2:"($0.43M)",y3:"—",       bold:false, color:C.muted   },
                        { l:"D&A",                                         y1:"($0.09M)", y2:"($0.13M)",y3:"($0.22M)",bold:false, color:C.muted   },
                        { l:"Net Income (Pre-Tax)",                        y1:"$2.22M",   y2:"$15.06M", y3:"$26.28M", bold:true,  color:"#059669", shade:"#DCFCE7" },
                      ].map((r,i) => (
                        <tr key={i} style={{ background:r.shade||(i%2===0?C.surface:C.bg), borderBottom:`1px solid ${C.borderLt}` }}>
                          <td colSpan={2} style={{ padding:"8px 10px", fontWeight:r.bold?800:500, color:C.navy, fontSize:"0.74rem" }}>{r.l}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace",
                                       fontWeight:r.bold?800:400, color:r.bold?r.color:C.muted, fontSize:"0.76rem" }}>{r.y1}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace",
                                       fontWeight:r.bold?700:400, color:r.bold?r.color:C.muted, fontSize:"0.74rem" }}>{r.y2}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", fontFamily:"IBM Plex Mono,monospace",
                                       fontWeight:r.bold?700:400, color:r.bold?"#059669":C.muted, fontSize:"0.74rem" }}>{r.y3}</td>
                          <td colSpan={6}/>
                        </tr>
                      ))}
                      {/* Valuation thesis row */}
                      <tr>
                        <td colSpan={11} style={{ padding:"16px 18px", background:"#F8FAFF", borderTop:`2px solid ${C.border}` }}>
                          <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                            <div style={{ flex:"1 1 220px" }}>
                              <div style={{ fontSize:"0.58rem", fontWeight:700, color:C.teal,
                                            letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:4 }}>06 · Valuation Impact</div>
                              <div style={{ fontFamily:"DM Serif Display,serif", fontSize:"0.95rem", color:C.navy, lineHeight:1.3 }}>
                                Same Infrastructure. <span style={{ color:C.teal }}>7–8× Valuation Uplift.</span>
                              </div>
                              <p style={{ fontSize:"0.7rem", color:C.muted, lineHeight:1.6, marginTop:4, maxWidth:480 }}>
                                Sell supplements and B2B manufacturing on infrastructure already owned, to patients already acquired.
                              </p>
                            </div>
                            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                              {[
                                { label:"Pharmacy Only",     val:"$22–30M",  sub:"8–12× EBITDA",    c:C.muted,   bg:C.bg      },
                                { label:"Combined Platform", val:"$35–65M",  sub:"15–20× blended",  c:C.teal,    bg:C.surface },
                                { label:"Valuation Uplift",  val:"+$13–35M", sub:"~$1M activation", c:"#7C3AED", bg:"#F5F3FF" },
                              ].map((v,i) => (
                                <div key={i} style={{ padding:"10px 14px", borderRadius:8,
                                                       background:v.bg, border:`1px solid ${C.border}`,
                                                       borderTop:`2px solid ${v.c}`, minWidth:110 }}>
                                  <div style={{ fontSize:"0.54rem", fontWeight:700, color:v.c,
                                                letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>{v.label}</div>
                                  <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800,
                                                color:v.c, fontSize:"1.05rem", lineHeight:1, marginBottom:3 }}>{v.val}</div>
                                  <div style={{ fontSize:"0.62rem", color:C.muted }}>{v.sub}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


          {/* ── SUMMARY THESIS ───────────────────────────────────────── */}
          <div style={{ background:C.navy }}>
            <div className="section" style={{ paddingTop:48, paddingBottom:48 }}>
              <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1.2fr 0.8fr", gap:48, alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:"0.62rem", fontWeight:700, color:"rgba(15,123,140,0.8)",
                                letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>Investment Thesis</div>
                  <h2 style={{ fontFamily:"DM Serif Display,serif", fontSize:"clamp(1.4rem,2.5vw,1.9rem)",
                               color:"white", lineHeight:1.3, marginBottom:20 }}>
                    One infrastructure platform.<br/>
                    <span style={{ color:"#2DD4BF" }}>Three entity layers. Compounding value.</span>
                  </h2>
                  <p style={{ fontSize:"0.84rem", lineHeight:1.82, color:"rgba(255,255,255,0.55)", maxWidth:580 }}>
                    Altanine's revenue expansion thesis is not a growth bet — it is an infrastructure utilization play.
                    The 503A license, cleanroom, oral delivery patents, and ForHumanity distribution channel are already
                    operating and already paid for. Each ancillary channel stacks revenue on top of a fixed cost base,
                    which is why EBITDA margins expand from 25% to 43%+ without proportional capex. The entity stack —
                    Altanine Inc. HoldCo, Polomar Health 503A OpCo, Wellness LLC DTC, and Altanine CDMO LLC — ring-fences
                    each revenue stream with its own multiple while sharing a single manufacturing and IP infrastructure.
                    The result: three buyer profiles, three exit multiples, one team.
                  </p>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    { icon:"Rx",  label:"503A Pharmacy OpCo", val:"8–12×", sub:"EBITDA multiple",     c:"rgba(255,255,255,0.6)"  },
                    { icon:"S",   label:"Supplement Brand",   val:"15–20×",sub:"Revenue multiple",    c:"#2DD4BF"                 },
                    { icon:"IP",  label:"IP / Royalty Stack", val:"25×+",  sub:"Technology multiple", c:"#A78BFA"                 },
                    { icon:"C",   label:"CDMO Contracts",     val:"12–15×",sub:"EBITDA multiple",     c:"#34D399"                 },
                  ].map((e,i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                                          borderRadius:10, padding:"18px 16px" }}>
                      <div style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.1)",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    fontSize:"0.58rem", fontWeight:800, color:e.c, marginBottom:10 }}>{e.icon}</div>
                      <div style={{ fontSize:"0.63rem", fontWeight:600, color:"rgba(255,255,255,0.45)",
                                    marginBottom:6, letterSpacing:"0.06em" }}>{e.label}</div>
                      <div style={{ fontFamily:"IBM Plex Mono,monospace", fontWeight:800, color:e.c,
                                    fontSize:"1.3rem", lineHeight:1 }}>{e.val}</div>
                      <div style={{ fontSize:"0.63rem", color:"rgba(255,255,255,0.3)", marginTop:4 }}>{e.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}


      </section>
      </div>
      </> /* end mainView === "creative" */}

      {/* ── FOOTER ── */}
      <div style={{ background:C.bg, borderTop:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1320, margin:"0 auto", padding:"28px 56px", display:"flex",
                      justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:"0.62rem", color:C.muted, letterSpacing:"0.12em" }}>
            ALTANINE HEALTH · CONFIDENTIAL · FEBRUARY 2026 · SOURCE: DECK V34
          </div>
          <div style={{ fontSize:"0.64rem", color:"#94a3b8", fontStyle:"italic", maxWidth:560, lineHeight:1.6 }}>
            Forward-looking statements subject to risks. Not an offer to sell securities. All financial projections are estimates. See full disclaimer in source presentation.
          </div>
        </div>
      </div>
    </div>
  );
}
