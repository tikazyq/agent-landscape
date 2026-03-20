import { useState, useEffect, createContext, useContext } from "react";

export const C = {
  bg:"#06080d", surface:"#0d1117", surfaceAlt:"#131a24",
  border:"#1b2433", text:"#e1e7ef", textSub:"#8b95a5", textDim:"#525e70",
  blue:"#4d8eff", blueGlow:"rgba(77,142,255,0.12)",
  green:"#34d399", greenGlow:"rgba(52,211,153,0.10)",
  amber:"#fbbf24", amberGlow:"rgba(251,191,36,0.10)",
  rose:"#fb7185",
  purple:"#a78bfa", purpleGlow:"rgba(167,139,250,0.10)",
  cyan:"#22d3ee", cyanGlow:"rgba(34,211,238,0.10)",
};

export const mono = "'JetBrains Mono','SF Mono','Fira Code',monospace";
export const sans = "'Inter',-apple-system,'Segoe UI',sans-serif";

export function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 960);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

const LangCtx = createContext("zh");
export const useLang = () => useContext(LangCtx);
export const LangProvider = LangCtx.Provider;
export const t = (s, lang) => (typeof s === "object" ? s[lang] : s);

export function LangToggle({ lang, setLang }) {
  return (
    <div style={{ display:"inline-flex", background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden" }}>
      {["en","zh"].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          background: lang===l ? C.blue+"22" : "transparent",
          color: lang===l ? C.blue : C.textDim,
          border:"none", padding:"5px 14px", cursor:"pointer",
          fontFamily:mono, fontSize:11, fontWeight: lang===l ? 700 : 400,
          transition:"all 0.15s ease",
        }}>{l==="en"?"EN":"中文"}</button>
      ))}
    </div>
  );
}

export function Tag({ children, color, mobile }) {
  return (
    <span style={{
      fontSize: mobile?8:9, color, background:color+"18", padding:"2px 6px",
      borderRadius:3, fontFamily:mono, fontWeight:600, border:`1px solid ${color}22`, whiteSpace:"nowrap",
    }}>{children}</span>
  );
}
