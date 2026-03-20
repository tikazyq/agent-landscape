import { useState, useEffect, useRef, createContext, useContext } from "react";

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

// Minimal QR code generator (numeric mode, version auto-selected)
function generateQR(text) {
  // Use a simple QR encoding via the QR code API rendered as an image URL
  // For a self-contained solution, we generate a QR code using Google Charts API
  return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(text)}&bgcolor=0d1117&color=e1e7ef&format=png`;
}

export function ShareButton({ lang, mobile }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const label = { en: "Share", zh: "分享" };
  const copiedLabel = { en: "Copied!", zh: "已复制!" };

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [showMenu]);

  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => { setCopied(false); setShowMenu(false); }, 1500);
    } catch {}
  };

  const handleNativeShare = async () => {
    const title = document.title || "AI Agent Landscape";
    try { await navigator.share({ title, url }); } catch {}
    setShowMenu(false);
  };

  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <button ref={btnRef} onClick={() => setShowMenu(v => !v)} style={{
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

      {showMenu && (
        <div ref={menuRef} style={{
          position:"absolute", top:"calc(100% + 8px)", right:0, zIndex:1000,
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
          padding:16, minWidth:240, boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {/* WeChat QR section */}
          <div style={{ textAlign:"center", marginBottom:12 }}>
            <div style={{
              fontFamily:mono, fontSize:11, color:C.textSub, marginBottom:8,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              <span style={{fontSize:16}}>💬</span>
              {t({ en:"Scan to share on WeChat", zh:"微信扫码分享" }, lang)}
            </div>
            <div style={{
              background:"#fff", borderRadius:8, padding:8,
              display:"inline-block",
            }}>
              <img
                src={generateQR(url)}
                alt="QR Code"
                width={160} height={160}
                style={{ display:"block", borderRadius:4 }}
              />
            </div>
          </div>

          <div style={{ height:1, background:C.border, margin:"12px 0" }}/>

          {/* Copy link */}
          <button onClick={handleCopy} style={{
            display:"flex", alignItems:"center", gap:8, width:"100%",
            background:"transparent", border:"none", padding:"8px 4px",
            cursor:"pointer", color:C.text, fontFamily:mono, fontSize:12,
            borderRadius:6, transition:"background 0.15s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.border}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{fontSize:14}}>📋</span>
            {t({ en:"Copy link", zh:"复制链接" }, lang)}
          </button>

          {/* Native share (mobile) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <button onClick={handleNativeShare} style={{
              display:"flex", alignItems:"center", gap:8, width:"100%",
              background:"transparent", border:"none", padding:"8px 4px",
              cursor:"pointer", color:C.text, fontFamily:mono, fontSize:12,
              borderRadius:6, transition:"background 0.15s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.background = C.border}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{fontSize:14}}>↗️</span>
              {t({ en:"More options…", zh:"更多分享…" }, lang)}
            </button>
          )}
        </div>
      )}
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
