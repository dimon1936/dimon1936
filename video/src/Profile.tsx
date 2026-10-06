import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

const C = {
  bg: "#0d1117",
  panel: "#161b22",
  line: "#30363d",
  text: "#e6edf3",
  muted: "#8b949e",
  accent: "#2f81f7",
  green: "#3fb950",
  amber: "#d29922",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const SCENES = [
  { id: "intro", len: 150 },
  { id: "domains", len: 210 },
  { id: "backend", len: 300 },
  { id: "mobile", len: 270 },
  { id: "web", len: 210 },
  { id: "ship", len: 180 },
  { id: "outro", len: 180 },
] as const;
export const TOTAL = SCENES.reduce((s, x) => s + x.len, 0);

/* ---------- helpers ---------- */

const appear = (f: number, start: number, dur = 18) => interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: ease });

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12, len - 12, len], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const p = appear(f, at);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)`, ...style }}>{children}</div>;
};

const Typed: React.FC<{ text: string; at: number; cps?: number; style?: React.CSSProperties; cursor?: boolean }> = ({ text, at, cps = 2, style, cursor }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {cursor && <span style={{ opacity: blink ? 1 : 0, color: C.accent }}>▍</span>}
    </span>
  );
};

const Caption: React.FC<{ index: string; title: string; sub: string; points: string[]; note?: string }> = ({ index, title, sub, points, note }) => (
  <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 470, display: "flex", flexDirection: "column", justifyContent: "center" }}>
    <Rise at={4}>
      <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, letterSpacing: 1 }}>{index}</div>
    </Rise>
    <Rise at={8}>
      <div style={{ fontFamily: sans, fontSize: 56, fontWeight: 700, color: C.text, marginTop: 10, letterSpacing: -1 }}>{title}</div>
    </Rise>
    <Rise at={14}>
      <div style={{ fontFamily: sans, fontSize: 24, color: C.muted, marginTop: 6 }}>{sub}</div>
    </Rise>
    <div style={{ marginTop: 34 }}>
      {points.map((p, i) => (
        <Rise key={p} at={26 + i * 10}>
          <div style={{ fontFamily: mono, fontSize: 20, color: C.text, marginBottom: 14, display: "flex", gap: 14 }}>
            <span style={{ color: C.accent }}>—</span>
            {p}
          </div>
        </Rise>
      ))}
    </div>
    {note && (
      <Rise at={26 + points.length * 10 + 30}>
        <div style={{ fontFamily: sans, fontSize: 19, color: C.muted, marginTop: 18, borderLeft: `3px solid ${C.line}`, paddingLeft: 14, fontStyle: "italic" }}>{note}</div>
      </Rise>
    )}
  </div>
);

const Node: React.FC<{ label: string; on: number; x: number; y: number; w?: number; icon?: string }> = ({ label, on, x, y, w = 200, icon }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 64,
      borderRadius: 12,
      background: C.panel,
      border: `2px solid ${on > 0.5 ? C.accent : C.line}`,
      boxShadow: on > 0.5 ? `0 0 ${24 * on}px rgba(47,129,247,${0.35 * on})` : "none",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 18px",
      fontFamily: sans,
      fontSize: 21,
      fontWeight: 500,
      color: on > 0.5 ? C.text : C.muted,
      boxSizing: "border-box",
    }}
  >
    {icon && <span style={{ fontFamily: mono, color: on > 0.5 ? C.accent : C.line, fontSize: 18 }}>{icon}</span>}
    {label}
  </div>
);

/* ---------- scenes ---------- */

const Intro = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 120 }}>
      <Typed text="$ whoami" at={6} cps={0.6} style={{ fontFamily: mono, fontSize: 24, color: C.muted }} />
      <Rise at={24}>
        <div style={{ fontFamily: sans, fontSize: 84, fontWeight: 700, color: C.text, letterSpacing: -2, marginTop: 14 }}>Dmytrii Popovych</div>
      </Rise>
      <Rise at={40}>
        <div style={{ fontFamily: sans, fontSize: 30, color: C.text, marginTop: 14 }}>Full-stack engineer. Mostly backend, also web and mobile.</div>
      </Rise>
      <Rise at={56}>
        <div style={{ fontFamily: sans, fontSize: 24, color: C.muted, marginTop: 12 }}>
          3 years of commercial experience: APIs, web and mobile apps.
        </div>
      </Rise>
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 120,
          height: 3,
          width: interpolate(f, [70, 130], [0, 340], { ...clamp, easing: ease }),
          background: C.accent,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};

const Domains = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = [
    "B2B SaaS",
    "B2C products",
    "KYC / AML",
    "Payments & billing",
    "Health-tech",
    "Enterprise & manufacturing",
    "Construction & workforce",
    "Retail & loyalty",
    "CRM / ERP integrations",
    "Computer vision, ML & LLMs",
  ];
  const stats = [
    ["UA + EU", "clients"],
    ["2023", "commercial since"],
    ["≤ 2022", "C# / .NET trainee, Lua"],
  ];
  return (
    <AbsoluteFill style={{ paddingLeft: 120, paddingTop: 110 }}>
      <Rise at={4}>
        <div style={{ fontFamily: mono, fontSize: 18, color: C.muted }}>project types</div>
      </Rise>
      <Rise at={8}>
        <div style={{ fontFamily: sans, fontSize: 52, fontWeight: 700, color: C.text, marginTop: 10, letterSpacing: -1 }}>Where I have worked</div>
      </Rise>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, width: 1040, marginTop: 34 }}>
        {chips.map((c, i) => {
          const p = spring({ frame: f - (24 + i * 6), fps, config: { damping: 14 } });
          return (
            <div
              key={c}
              style={{
                fontFamily: sans,
                fontSize: 23,
                fontWeight: 500,
                color: C.text,
                border: `1px solid ${i === 2 ? C.accent : C.line}`,
                background: C.panel,
                borderRadius: 999,
                padding: "12px 22px",
                opacity: p,
                transform: `scale(${0.9 + 0.1 * p})`,
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 70, marginTop: 56 }}>
        {stats.map(([big, small], i) => (
          <Rise key={big} at={100 + i * 10}>
            <div style={{ fontFamily: sans, fontSize: 40, fontWeight: 700, color: C.accent }}>{big}</div>
            <div style={{ fontFamily: mono, fontSize: 17, color: C.muted, marginTop: 4 }}>{small}</div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Backend = () => {
  const f = useCurrentFrame();
  const steps = [
    { label: "Request", icon: "01" },
    { label: "Auth + validation", icon: "02" },
    { label: "Queue job", icon: "03" },
    { label: "Webhook out", icon: "04" },
  ];
  const X = 700, Y0 = 130, GAP = 104;
  const start = 70, per = 34;
  const json = '{ "event": "job.completed" }';
  return (
    <AbsoluteFill>
      <Caption
        index="01 / 04"
        title="Backend"
        sub="APIs, queues, integrations"
        points={["NestJS, Node.js, FastAPI", "REST, GraphQL, webhooks", "PostgreSQL, Redis, BullMQ"]}
        note="Business logic lives on the server. Clients only show what it decides."
      />
      {steps.map((s, i) => {
        const t = start + i * per;
        const on = appear(f, t, 10);
        const nextOn = i < steps.length - 1 ? interpolate(f, [t + 8, t + per], [0, 1], clamp) : 0;
        return (
          <React.Fragment key={s.label}>
            {i < steps.length - 1 && (
              <>
                <div style={{ position: "absolute", left: X + 40, top: Y0 + i * GAP + 64, width: 2, height: GAP - 64, background: C.line }} />
                <div
                  style={{
                    position: "absolute",
                    left: X + 36,
                    top: Y0 + i * GAP + 60 + nextOn * (GAP - 56),
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: C.accent,
                    opacity: nextOn > 0 && nextOn < 1 ? 1 : 0,
                  }}
                />
              </>
            )}
            <Node label={s.label} icon={s.icon} on={on} x={X} y={Y0 + i * GAP} w={280} />
            <div style={{ position: "absolute", left: X + 300, top: Y0 + i * GAP + 20, fontFamily: mono, fontSize: 17, color: C.green, opacity: appear(f, t + 14, 8) }}>
              ✓ {["200", "ok", "queued", "sent"][i]}
            </div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: X,
          top: Y0 + 4 * GAP + 14,
          width: 470,
          padding: "16px 20px",
          borderRadius: 10,
          background: "#010409",
          border: `1px solid ${C.line}`,
          opacity: appear(f, start + 4 * per - 4, 10),
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 15, color: C.muted, marginBottom: 8 }}>POST /webhooks/events · signed</div>
        <Typed text={json} at={start + 4 * per + 6} cps={1.4} cursor style={{ fontFamily: mono, fontSize: 20, color: C.text }} />
      </div>
    </AbsoluteFill>
  );
};

const StatusBar: React.FC = () => (
  <div style={{ position: "absolute", top: 18, left: 32, right: 20, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: sans, fontWeight: 600, fontSize: 16, color: C.text }}>
    <span>9:41</span>
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <svg width={18} height={12} viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 5} y={9 - i * 3} width={3.4} height={3 + i * 3} rx={1} fill={C.text} />
        ))}
      </svg>
      <svg width={16} height={12} viewBox="0 0 16 12">
        <path d="M8 11.5 L5.6 8.9 A3.4 3.4 0 0 1 10.4 8.9 Z" fill={C.text} />
        <path d="M2.8 6.1 A7.4 7.4 0 0 1 13.2 6.1" stroke={C.text} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <path d="M0.6 3.6 A10.8 10.8 0 0 1 15.4 3.6" stroke={C.text} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </svg>
      <div style={{ width: 26, height: 12, borderRadius: 4, border: `1.5px solid rgba(230,237,243,0.5)`, padding: 1.5, boxSizing: "border-box", position: "relative" }}>
        <div style={{ width: "78%", height: "100%", borderRadius: 2, background: C.text }} />
        <div style={{ position: "absolute", right: -4, top: 3, width: 2, height: 4, borderRadius: 1, background: "rgba(230,237,243,0.5)" }} />
      </div>
    </div>
  </div>
);

const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 292, H = 612, BEZEL = 9;
  const online = f >= 80;
  const rows = ["Note saved", "Photo attached", "Form submitted"];
  const synced = (i: number) => f >= 110 + i * 22;
  const all = f >= 110 + rows.length * 22 + 6;
  const pop = spring({ frame: f - (110 + rows.length * 22 + 6), fps, config: { damping: 12 } });
  const enter = spring({ frame: f - 4, fps, config: { damping: 18, mass: 0.8 } });
  const btn = (side: "left" | "right", top: number, h: number) => (
    <div
      style={{
        position: "absolute",
        [side]: -3,
        top,
        width: 4,
        height: h,
        borderRadius: 2,
        background: "linear-gradient(90deg, #5b616b, #8d939c, #4a4f57)",
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 790,
        top: 54,
        width: W,
        height: H,
        transform: `translateY(${(1 - enter) * 40}px) rotate(${(1 - enter) * -3}deg)`,
        opacity: enter,
      }}
    >
      {btn("left", 118, 30)}
      {btn("left", 170, 52)}
      {btn("left", 234, 52)}
      {btn("right", 188, 84)}
      {btn("right", 330, 46)}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 58,
          padding: 2.5,
          background: "linear-gradient(145deg, #9aa0a8 0%, #3d424a 22%, #20242a 50%, #4b5058 78%, #a5abb3 100%)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 56, background: "#000", padding: BEZEL, boxSizing: "border-box" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 47,
              overflow: "hidden",
              background: "radial-gradient(120% 60% at 50% 0%, #142033 0%, #05070b 60%)",
            }}
          >
            <StatusBar />
            <div style={{ position: "absolute", top: 11, left: "50%", width: 80, height: 26, marginLeft: -40, borderRadius: 20, background: "#000" }}>
              <div style={{ position: "absolute", right: 10, top: 8, width: 10, height: 10, borderRadius: 5, background: "radial-gradient(circle at 35% 35%, #2b3a55, #0a0d14 70%)" }} />
            </div>
            <div style={{ position: "absolute", top: 62, left: 20, right: 20 }}>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 28, color: C.text, marginBottom: 14 }}>Today</div>
              <div
                style={{
                  padding: "9px 14px",
                  borderRadius: 12,
                  fontFamily: mono,
                  fontSize: 14,
                  color: online ? C.green : C.amber,
                  background: online ? "rgba(63,185,80,0.12)" : "rgba(210,153,34,0.12)",
                }}
              >
                {online ? "● online" : `○ offline · ${rows.length} pending`}
              </div>
              <div style={{ marginTop: 16 }}>
                {rows.map((r, i) => (
                  <div
                    key={r}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px 14px",
                      marginBottom: 10,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.06)",
                      opacity: appear(f, 14 + i * 14, 12),
                    }}
                  >
                    <span style={{ fontFamily: sans, fontSize: 17, color: C.text }}>{r}</span>
                    <span style={{ fontFamily: mono, fontSize: 13, color: synced(i) ? C.green : C.amber }}>{synced(i) ? "synced" : "local"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: 20,
                right: 20,
                bottom: 34,
                height: 54,
                borderRadius: 27,
                background: all ? C.green : "rgba(255,255,255,0.1)",
                transform: `scale(${all ? 0.95 + 0.05 * pop : 1})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: sans,
                fontWeight: 600,
                fontSize: 18,
                color: "#fff",
              }}
            >
              {all ? "All changes saved" : online ? "Syncing…" : "Waiting for network"}
            </div>
            <div style={{ position: "absolute", bottom: 9, left: "50%", width: 110, marginLeft: -55, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.55)" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Mobile = () => (
  <AbsoluteFill>
    <Caption
      index="02 / 04"
      title="Mobile"
      sub="Apps that work without a stable network"
      points={["Expo / React Native", "Offline-first, background sync", "Push, biometrics, secure storage"]}
      note="Changes are saved on the device first and sent when the network is back."
    />
    <Phone />
  </AbsoluteFill>
);

const Web = () => {
  const f = useCurrentFrame();
  const tree: [string, string][] = [
    ["repo/", ""],
    ["├── apps/", ""],
    ["│   ├── api", "NestJS"],
    ["│   ├── web", "Next.js"],
    ["│   └── mobile", "Expo"],
    ["└── packages/", ""],
    ["    ├── ui", "design system"],
    ["    ├── sdk", "npm package"],
    ["    └── types", "shared contracts"],
  ];
  return (
    <AbsoluteFill>
      <Caption
        index="03 / 04"
        title="Web"
        sub="Several apps in one monorepo"
        points={["Next.js, React, Vite", "Turborepo, Nx, Yarn / pnpm", "GraphQL codegen, shared types"]}
      />
      <div style={{ position: "absolute", left: 650, top: 140, width: 520, padding: "28px 32px", borderRadius: 14, background: "#010409", border: `1px solid ${C.line}`, boxSizing: "border-box" }}>
        {tree.map(([l, tag], i) => {
          const p = appear(f, 20 + i * 12, 10);
          return (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 21, lineHeight: "44px", opacity: p, transform: `translateX(${(1 - p) * 12}px)` }}>
              <span style={{ color: tag ? C.text : C.muted, whiteSpace: "pre" }}>{l}</span>
              <span style={{ color: C.accent, fontSize: 17 }}>{tag}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Ship = () => {
  const f = useCurrentFrame();
  const nodes = [
    { id: "a", label: "git push", x: 640, y: 140 },
    { id: "b", label: "CI checks", x: 900, y: 240 },
    { id: "c", label: "Docker image", x: 640, y: 360 },
    { id: "d", label: "Deploy", x: 900, y: 470 },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
  ];
  return (
    <AbsoluteFill>
      <Caption
        index="04 / 04"
        title="Shipping"
        sub="From commit to production, securely"
        points={["Docker, GitHub Actions, Nginx", "AWS, Hetzner, Railway", "KMS encryption, OAuth2, 2FA"]}
      />
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        {edges.map(([a, b], i) => {
          const A = nodes[a], B = nodes[b];
          const x1 = A.x + 100, y1 = A.y + 64, x2 = B.x + 100, y2 = B.y;
          const d = `M ${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`;
          const p = interpolate(f, [30 + i * 28, 56 + i * 28], [0, 1], { ...clamp, easing: ease });
          return <path key={i} d={d} fill="none" stroke={C.accent} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
        })}
      </svg>
      {nodes.map((n, i) => (
        <Rise key={n.id} at={10 + i * 28}>
          <Node label={n.label} on={appear(f, 20 + i * 28, 8)} x={n.x} y={n.y} />
        </Rise>
      ))}
      <div style={{ position: "absolute", left: 1120, top: 490, fontFamily: mono, fontSize: 16, color: C.green, opacity: appear(f, 120, 10) }}>✓ live</div>
    </AbsoluteFill>
  );
};

const Outro = () => {
  const stack = ["TypeScript", "Node.js", "NestJS", "Python / FastAPI", "Next.js", "React", "React Native", "PostgreSQL", "Redis", "GraphQL", "Docker", "AWS"];
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 120 }}>
      <Rise at={4}>
        <div style={{ fontFamily: mono, fontSize: 18, color: C.muted }}>day to day</div>
      </Rise>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: 1000, marginTop: 22 }}>
        {stack.map((s, i) => (
          <Rise key={s} at={10 + i * 4}>
            <div style={{ fontFamily: mono, fontSize: 22, color: C.text, border: `1px solid ${C.line}`, background: C.panel, borderRadius: 8, padding: "10px 16px" }}>{s}</div>
          </Rise>
        ))}
      </div>
      <Rise at={70}>
        <div style={{ fontFamily: mono, fontSize: 22, color: C.accent, marginTop: 56 }}>t.me/dimon1936 · linkedin.com/in/dimon1936</div>
      </Rise>
    </AbsoluteFill>
  );
};

const VIEWS: Record<(typeof SCENES)[number]["id"], React.FC> = { intro: Intro, domains: Domains, backend: Backend, mobile: Mobile, web: Web, ship: Ship, outro: Outro };

export const Profile: React.FC = () => {
  const f = useCurrentFrame();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SCENES.map((s) => {
        const View = VIEWS[s.id];
        const el = (
          <Sequence key={s.id} from={from} durationInFrames={s.len}>
            <Fade len={s.len}>
              <View />
            </Fade>
          </Sequence>
        );
        from += s.len;
        return el;
      })}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: `${(f / TOTAL) * 100}%`, background: C.accent, opacity: 0.6 }} />
    </AbsoluteFill>
  );
};
