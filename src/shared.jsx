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

export function ShareButton({ lang, mobile }) {
  const [copied, setCopied] = useState(false);
  const label = { en: "Share", zh: "分享" };
  const copiedLabel = { en: "Copied!", zh: "已复制!" };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title || "AI Agent Landscape";
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <button onClick={handleShare} style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background: copied ? C.green+"22" : C.surface,
      color: copied ? C.green : C.textDim,
      border:`1px solid ${copied ? C.green+"55" : C.border}`,
      borderRadius:20, padding: mobile ? "5px 12px" : "6px 14px",
      cursor:"pointer", fontFamily:mono, fontSize: mobile ? 10 : 11,
      fontWeight:500, transition:"all 0.15s ease",
    }}>
      <span style={{fontSize: mobile ? 11 : 13}}>{copied ? "✓" : "↗"}</span>
      {t(copied ? copiedLabel : label, lang)}
    </button>
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
