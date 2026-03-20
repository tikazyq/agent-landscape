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
  }, []);​​​​​​​​​​​​​​​​
