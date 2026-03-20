import { useState, useEffect, useRef, createContext, useContext, lazy, Suspense } from "react";

const SharePoster = lazy(() => import("./SharePoster"));

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

export function ShareButton({ lang, mobile, title, subtitle }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

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
  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => { setCopied(false); setShowMenu(false); }, 1500);
    } catch {}
  };

  const handleNativeShare = async () => {
    try { await navigator.share({ title: title || "AI Agent Landscape", url }); } catch {}
    setShowMenu(false);
  };

  const handlePoster = () => {
    setShowMenu(false);
    setShowPoster(true);
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(title || "AI Agent Landscape");
    window.open(`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank");
    setShowMenu(false);
  };

  const menuBtnStyle = {
    display:"flex", alignItems:"center", gap:10, width:"100%",
    background:"transparent", border:"none", padding:"9px 8px",
    cursor:"pointer", color:C.text, fontFamily:mono, fontSize:12,
    borderRadius:8, transition:"background 0.15s ease",
    textAlign:"left",
  };

  const menuItems = [
    { icon:"🖼️", label:{ en:"Share as Image", zh:"生成分享图片" }, desc:{ en:"Poster with QR code", zh:"含二维码的海报" }, action:handlePoster },
    { icon:"📋", label:{ en: copied ? "Copied!" : "Copy Link", zh: copied ? "已复制!" : "复制链接" }, desc:{ en:"Paste anywhere", zh:"粘贴到任意位置" }, action:handleCopy, highlight: copied },
    ...(hasNativeShare ? [{ icon:"📤", label:{ en:"Share via…", zh:"分享到…" }, desc:{ en:"System share sheet", zh:"系统分享面板" }, action:handleNativeShare }] : []),
    { icon:"𝕏", label:{ en:"Share on X", zh:"分享到 X (Twitter)" }, desc:{ en:"Post with link", zh:"发布推文" }, action:handleTwitter },
  ];

  return (
    <>
      <div style={{ position:"relative", display:"inline-block" }}>
        <button ref={btnRef} onClick={() => setShowMenu(v => !v)} style={{
          display:"inline-flex", alignItems:"center", gap:5,
          background: C.surface,
          color: C.textDim,
          border:`1px solid ${C.border}`,
          borderRadius:20, padding: mobile ? "5px 12px" : "6px 14px",
          cursor:"pointer", fontFamily:mono, fontSize: mobile ? 10 : 11,
          fontWeight:500, transition:"all 0.15s ease",
        }}>
          <span style={{fontSize: mobile ? 11 : 13}}>↗</span>
          {t({ en: "Share", zh: "分享" }, lang)}
        </button>

        {showMenu && (
          <div ref={menuRef} style={{
            position:"absolute", top:"calc(100% + 8px)", right:0, zIndex:1000,
            background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
            padding:6, minWidth:220, boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
          }}>
            {menuItems.map((item, i) => (
              <button key={i} onClick={item.action} style={{
                ...menuBtnStyle,
                color: item.highlight ? C.green : C.text,
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize:18, width:28, textAlign:"center", flexShrink:0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:12 }}>{t(item.label, lang)}</div>
                  <div style={{ fontSize:10, color:C.textDim, marginTop:1 }}>{t(item.desc, lang)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {showPoster && (
        <Suspense fallback={null}>
          <SharePoster
            lang={lang}
            mobile={mobile}
            title={title || "AI Agent Landscape"}
            subtitle={subtitle || ""}
            onClose={() => setShowPoster(false)}
          />
        </Suspense>
      )}
    </>
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
