import { useState, useMemo, useEffect } from "react";
import data from "./data/bares.json";
import logoImg from "./data/logo.png";
import "./App.css"; // Importa os estilos CSS

// ─── BRAND PALETTE (extraída da logo: azul marinho, vermelho, dourado, creme) ───
const BRAND = {
  navy:    "#1C2D6E",   // azul marinho do banner
  navyDk:  "#131f50",   // azul mais escuro
  red:     "#C0392B",   // vermelho do fundo circular
  gold:    "#E8A820",   // dourado do anel
  goldLt:  "#F4D03F",   // dourado claro (destaques)
  cream:   "#F5EFE0",   // creme do anel externo
  white:   "#FFFFFF",
};

// ─── FUNÇÃO PARA NORMALIZAR TEXTOS (remover acentos e caracteres especiais) ───
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s]/g, "") // Remove caracteres especiais (exceto letras, números e espaços)
    .replace(/\s+/g, " "); // Normaliza espaços
};

// ─── TOKENS DE TEMA (modo claro / escuro) ──────────────────────────────────
const THEMES = {
  light: {
    bg:           "#F5EFE0",
    surface:      "#FFFFFF",
    surfaceAlt:   "#FAF7F0",
    border:       "#E2D8C0",
    borderStrong: "#C8B890",
    text:         "#1C1A14",
    textMuted:    "#6B5F48",
    textFaint:    "#9E9280",
    headerBg:     `linear-gradient(155deg, ${BRAND.navyDk} 0%, ${BRAND.navy} 60%, #1a2860 100%)`,
    filterBg:     "#FFFFFF",
    filterBorder: "#E2D8C0",
    cardBg:       "#FFFFFF",
    cardBorder:   "#E2D8C0",
    chipBg:       "#F0EBE0",
    statBg:       "rgba(255,255,255,0.13)",
    bannerBg:     `linear-gradient(90deg, ${BRAND.navyDk}, ${BRAND.navy})`,
    mapFooterBg:  "#FAF7F0",
    footerBg:     BRAND.navyDk,
    scrollThumb:  "#C8B890",
    inputBg:      "#FAF7F0",
    glassBg:      "rgba(255,255,255,0.75)",
    glassBorder:  "rgba(255,255,255,0.4)",
  },
  dark: {
    bg:           "#0F1117",
    surface:      "#1A1D26",
    surfaceAlt:   "#21242F",
    border:       "#2E3245",
    borderStrong: "#404666",
    text:         "#EDE8DC",
    textMuted:    "#9A94A8",
    textFaint:    "#605A6E",
    headerBg:     `linear-gradient(155deg, #090C18 0%, #101428 60%, #0D1122 100%)`,
    filterBg:     "#1A1D26",
    filterBorder: "#2E3245",
    cardBg:       "#1A1D26",
    cardBorder:   "#2E3245",
    chipBg:       "#21242F",
    statBg:       "rgba(255,255,255,0.07)",
    bannerBg:     `linear-gradient(90deg, #090C18, #101428)`,
    mapFooterBg:  "#21242F",
    footerBg:     "#090C18",
    scrollThumb:  "#404666",
    inputBg:      "#21242F",
    glassBg:      "rgba(26,29,38,0.85)",
    glassBorder:  "rgba(255,255,255,0.08)",
  },
};

const REGION_COLOR = data.regions;
const BARS = data.bars;
const REGIONS = ["Todas", ...Object.keys(REGION_COLOR)];

// ─── COMPONENTE LOGO (usando imagem externa com tamanho ampliado) ─────────
function Logo({ size = 80 }) {
  return (
    <img 
      src={logoImg} 
      alt="Participantes di Buteco Logo" 
      width={size} 
      height={size}
      className="logo-img"
      style={{ 
        width: size,
        height: size,
        boxShadow: `0 0 0 4px ${BRAND.gold}55, 0 0 0 8px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.2)`
      }}
    />
  );
}

// ─── ÍCONES ──────────────────────────────────────────────────────────────────
function HeartIcon({ f }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={f ? "#C0392B" : "none"} stroke={f ? "#C0392B" : "#999"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CheckCircle({ d }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={d ? "#27ae60" : "none"} stroke={d ? "#27ae60" : "#999"} strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function IgIcon({ color = "currentColor" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

// ─── HELPERS DE TEMPERATURA ──────────────────────────────────────────────────
const getTempColor = (t) => {
  if (t === null) return "#95a5a6";
  if (t < -3) return "#2980B9";
  if (t <= 1)  return "#27AE60";
  if (t <= 3)  return "#F39C12";
  if (t <= 6)  return "#E67E22";
  return "#C0392B";
};

const getTempBg = (t) => {
  if (t === null) return "rgba(0,0,0,0.05)";
  if (t < -3) return "rgba(52,152,219,0.15)";
  if (t <= 1)  return "rgba(46,204,113,0.15)";
  if (t <= 3)  return "rgba(243,156,18,0.15)";
  if (t <= 6)  return "rgba(230,126,34,0.15)";
  return "rgba(231,76,60,0.15)";
};

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  // Estado tema
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("cdb26theme") === "dark"; } catch { return false; }
  });
  const T = dark ? THEMES.dark : THEMES.light;

  // Aplica classe dark no body para estilos CSS
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  // Estados dados
  const [visited, setVisited] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26v") || "[]")); } catch { return new Set(); }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26f") || "[]")); } catch { return new Set(); }
  });
  const [fv, setFv] = useState(false);
  const [ff, setFf] = useState(false);
  const [fr, setFr] = useState("Todas");
  const [q, setQ] = useState("");
  const [exp, setExp] = useState(null);
  const [tab, setTab] = useState("bares");
  const [imgErr, setImgErr] = useState(new Set());
  const [onlyTeam, setOnlyTeam] = useState(false);
  const [sortBy, setSortBy] = useState("none");

  // PRÉ-CALCULA OS TEXTOS NORMALIZADOS PARA BUSCA MAIS RÁPIDA
  const barsWithNormalized = useMemo(() => {
    return BARS.map(bar => ({
      ...bar,
      normalizedName: normalizeText(bar.name),
      normalizedDish: normalizeText(bar.dish),
      normalizedNeighborhood: normalizeText(bar.neighborhood),
    }));
  }, []);

  useEffect(() => {
    try { localStorage.setItem("cdb26v", JSON.stringify([...visited])); } catch {}
  }, [visited]);
  useEffect(() => {
    try { localStorage.setItem("cdb26f", JSON.stringify([...favorites])); } catch {}
  }, [favorites]);
  useEffect(() => {
    try { localStorage.setItem("cdb26theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  const tv = (id) => setVisited(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const tf = (id) => setFavorites(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filteredAndSorted = useMemo(() => {
    let res = barsWithNormalized.filter(b => {
      if (fv && !visited.has(b.id)) return false;
      if (ff && !favorites.has(b.id)) return false;
      if (fr !== "Todas" && b.region !== fr) return false;
      if (onlyTeam && !b.visited) return false;
      if (q) {
        const normalizedQuery = normalizeText(q);
        if (!b.normalizedName.includes(normalizedQuery) && 
            !b.normalizedDish.includes(normalizedQuery) && 
            !b.normalizedNeighborhood.includes(normalizedQuery)) return false;
      }
      return true;
    });
    if (sortBy === "rating") res = [...res].sort((a, b2) => (b2.rating ?? -1) - (a.rating ?? -1));
    if (sortBy === "beerTemp") res = [...res].sort((a, b2) => (a.beerTemp ?? 999) - (b2.beerTemp ?? 999));
    return res;
  }, [fv, ff, fr, q, visited, favorites, onlyTeam, sortBy, barsWithNormalized]);

  const grouped = useMemo(() => {
    const g = {};
    filteredAndSorted.forEach(b => { (g[b.region] = g[b.region] || []).push(b); });
    return g;
  }, [filteredAndSorted]);
  const regionKeys = Object.keys(grouped).sort();

  const hasActiveFilters = fv || ff || fr !== "Todas" || q || onlyTeam || sortBy !== "none";
  const clearFilters = () => { setFv(false); setFf(false); setFr("Todas"); setQ(""); setOnlyTeam(false); setSortBy("none"); };

  return (
    <div style={{ fontFamily: "Georgia, serif", background: T.bg, minHeight: "100vh", transition: "background .25s, color .25s" }}>
      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header style={{ background: T.headerBg }}>

        {/* Barra Instagram */}
        <div style={{ background: "rgba(0,0,0,0.35)", padding: "0.45rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", fontSize: "0.76rem", fontFamily: "sans-serif", flexWrap: "wrap", textAlign: "center" }}>
          <IgIcon color={BRAND.goldLt} />
          <span style={{ color: "#ccc" }}>Curadoria realizada pelo perfil do Instagram</span>
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer"
            style={{ color: BRAND.goldLt, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
            @ParticipantesdiButeco
          </a>
          <span style={{ color: "#777" }}>— siga para dicas e novidades!</span>
        </div>

        {/* Conteúdo principal do header */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>

            {/* LOGO + TÍTULO */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1, minWidth: "300px" }}>
              <div className="logo-container">
                <Logo size={85} />
              </div>
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: BRAND.goldLt, marginBottom: "0.35rem", opacity: 0.95 }}>
                  Belo Horizonte · 10 Abr – 10 Mai 2026
                </div>
                <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 700, margin: "0 0 0.2rem", lineHeight: 1.05, color: "#fff", letterSpacing: "-0.01em" }}>
                  Participantes di Buteco
                </h1>
                <div style={{ fontSize: "0.88rem", fontStyle: "italic", color: "#9BBFCE", fontWeight: 300, lineHeight: 1.45, maxWidth: "500px" }}>
                  Guia da 26ª Edição do Comida di Buteco · <span style={{ color: BRAND.goldLt, fontWeight: 500 }}>"Somos Todos Verduras"</span>
                </div>
              </div>
            </div>

            {/* Stats + Toggle modo escuro */}
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexShrink: 0 }}>
              {[{ v: BARS.length, l: "Bares" }, { v: visited.size, l: "Eu visitei" }, { v: favorites.size, l: "Favoritos" }].map(s => (
                <div key={s.l} className="stat-card" style={{ background: T.statBg }}>
                  <div className="stat-value">{s.v}</div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}

              <button
                className="dm-toggle"
                onClick={() => setDark(d => !d)}
                title={dark ? "Modo claro" : "Modo escuro"}
                style={{
                  background: dark ? "rgba(232,168,32,0.2)" : "rgba(255,255,255,0.12)",
                  border: `2px solid ${dark ? BRAND.gold : "rgba(255,255,255,0.3)"}`,
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: dark ? BRAND.goldLt : "#fff",
                  backdropFilter: "blur(8px)",
                  flexShrink: 0,
                }}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>

          {/* Abas */}
          <div style={{ display: "flex", marginTop: "1.8rem", borderBottom: `1px solid rgba(255,255,255,0.12)` }}>
            {[{ k: "bares", l: "🍺  Bares & Pratos" }, { k: "mapa", l: "🗺️  Mapa Interativo" }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                background: "none", border: "none",
                borderBottom: `3px solid ${tab === t.k ? BRAND.goldLt : "transparent"}`,
                color: tab === t.k ? "#fff" : "rgba(255,255,255,0.45)",
                padding: "0.85rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: tab === t.k ? 700 : 400,
                fontFamily: "sans-serif",
                transition: "all .15s",
                letterSpacing: "0.01em",
                marginBottom: "-1px",
                cursor: "pointer",
              }}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ══ ABA MAPA ════════════════════════════════════════════════════════ */}
      {tab === "mapa" && (
        <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
          <div style={{ background: T.surface, borderRadius: "16px", overflow: "hidden", boxShadow: `0 4px 28px rgba(0,0,0,${dark ? "0.5" : "0.1"})`, border: `1px solid ${T.border}` }}>
            <div style={{ background: T.bannerBg, padding: "1.2rem 1.8rem", display: "flex", alignItems: "center", gap: "15px" }}>
              <Logo size={45} />
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontFamily: "sans-serif", fontSize: "1rem" }}>Mapa Personalizado — Comida di Buteco 2026 BH</div>
                <div style={{ color: BRAND.goldLt, fontSize: "0.74rem", fontFamily: "sans-serif", opacity: 0.85 }}>Todos os bares participantes marcados · Curadoria @ParticipantesdiButeco</div>
              </div>
            </div>
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: dark ? "#111" : "#f0ebe0" }}>
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=1NKgMtDTJSU2KAuiadQub73yXZ4nEJLU&ehbc=2E312F&noprof=1"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                title="Mapa Comida di Buteco 2026 BH"
                allowFullScreen
              />
            </div>
            <div style={{ padding: "0.9rem 1.8rem", background: T.mapFooterBg, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
              <IgIcon color={BRAND.navy} />
              <span style={{ fontSize: "0.78rem", color: T.textMuted, fontFamily: "sans-serif" }}>
                Mapa criado por{" "}
                <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer"
                  style={{ color: BRAND.navy, fontWeight: 700, textDecoration: "none" }}>
                  @ParticipantesdiButeco
                </a>{" "}· Siga para atualizações e dicas do concurso
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══ ABA BARES ═══════════════════════════════════════════════════════ */}
      {tab === "bares" && (
        <>
          {/* Filtros sticky */}
          <div style={{ background: T.filterBg, borderBottom: `1px solid ${T.filterBorder}`, position: "sticky", top: 0, zIndex: 20, boxShadow: `0 2px 12px rgba(0,0,0,${dark ? "0.4" : "0.07"})`, transition: "background .25s" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.8rem 1.5rem", display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
              
              {/* Busca */}
              <div style={{ flex: "2 1 220px", position: "relative" }}>
                <span className="search-icon" style={{ color: T.textFaint }}>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar (ex: coracao encontra coração)..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  className="search-input"
                  style={{ border: `1.5px solid ${T.border}`, background: T.inputBg, color: T.text }}
                />
              </div>

              {/* Selects */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <select
                  value={fr}
                  onChange={e => setFr(e.target.value)}
                  className="select-input"
                  style={{ 
                    border: `1.5px solid ${fr !== "Todas" ? BRAND.navy : T.border}`,
                    background: fr !== "Todas" ? (dark ? "#1a2040" : "#e8ecf8") : T.inputBg,
                    color: fr !== "Todas" ? BRAND.navy : T.textMuted,
                    fontWeight: fr !== "Todas" ? 700 : 400
                  }}
                >
                  {REGIONS.map(r => <option key={r}>{r === "Todas" ? "📌 Regiões" : r}</option>)}
                </select>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="select-input"
                  style={{ 
                    border: `1.5px solid ${sortBy !== "none" ? BRAND.navy : T.border}`,
                    background: sortBy !== "none" ? (dark ? "#1a2040" : "#e8ecf8") : T.inputBg,
                    color: sortBy !== "none" ? BRAND.navy : T.textMuted,
                    fontWeight: sortBy !== "none" ? 700 : 400
                  }}
                >
                  <option value="none">📋 Ordenar</option>
                  <option value="rating">⭐ Maior nota</option>
                  <option value="beerTemp">🌡️ Mais gelada</option>
                </select>
              </div>

              {/* Botões filtro */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {[
                  { active: onlyTeam, toggle: () => setOnlyTeam(v => !v), icon: <CheckCircle d={onlyTeam}/>, label: "Time visitou", ac: "#27ae60", acBg: dark ? "#0d2c1a" : "#eafaf1", acText: "#1a5c30" },
                  { active: fv, toggle: () => setFv(v => !v), icon: <CheckCircle d={fv}/>, label: "Eu visitei", ac: "#27ae60", acBg: dark ? "#0d2c1a" : "#eafaf1", acText: "#1a5c30" },
                  { active: ff, toggle: () => setFf(v => !v), icon: <HeartIcon f={ff}/>, label: "Favoritos", ac: BRAND.red, acBg: dark ? "#2c0d0d" : "#fdf0ed", acText: "#c0392b" },
                ].map(btn => (
                  <button
                    key={btn.label}
                    onClick={btn.toggle}
                    className="filter-pill"
                    style={{
                      border: `2px solid ${btn.active ? btn.ac : T.border}`,
                      background: btn.active ? btn.acBg : T.surface,
                      color: btn.active ? btn.acText : T.textMuted,
                    }}
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="filter-pill"
                  style={{ border: `1px solid ${T.border}`, background: T.surface, color: T.textMuted, fontSize: "0.78rem" }}
                >
                  ✕ Limpar
                </button>
              )}

              <div style={{ marginLeft: "auto", fontSize: "0.75rem", color: T.textFaint, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                {filteredAndSorted.length} / {BARS.length}
              </div>
            </div>
          </div>

          {/* Banner mapa CTA */}
          <div style={{ maxWidth: "1200px", margin: "1.8rem auto 0", padding: "0 1.5rem" }}>
            <div
              onClick={() => setTab("mapa")}
              className="map-cta"
              style={{ background: T.bannerBg, boxShadow: `0 2px 14px rgba(28,45,110,${dark ? "0.5" : "0.2"})`, border: `1px solid ${BRAND.navy}55` }}
            >
              <Logo size={38} />
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontFamily: "sans-serif", fontSize: "0.95rem" }}>Ver Mapa Interativo dos Bares</div>
                <div style={{ color: BRAND.goldLt, fontSize: "0.73rem", fontFamily: "sans-serif", opacity: 0.85 }}>
                  Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco
                </div>
              </div>
              <span style={{ marginLeft: "auto", color: BRAND.goldLt, fontSize: "1.3rem" }}>→</span>
            </div>
          </div>

          {/* Grid */}
          <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.8rem 1.5rem 3.5rem" }}>
            {filteredAndSorted.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p style={{ fontFamily: "sans-serif", color: T.textMuted }}>Nenhum bar encontrado com esses filtros.</p>
                <button
                  onClick={clearFilters}
                  className="empty-button"
                  style={{ background: BRAND.navy, color: "#fff" }}
                >
                  Limpar filtros
                </button>
              </div>
            ) : sortBy !== "none" ? (
              <div className="bars-grid">
                {filteredAndSorted.map(b => <Card key={b.id} b={b} visited={visited} favorites={favorites} tv={tv} tf={tf} exp={exp} setExp={setExp} imgErr={imgErr} setImgErr={setImgErr} T={T} dark={dark} />)}
              </div>
            ) : (
              regionKeys.map(region => (
                <section key={region} style={{ marginBottom: "2.8rem" }}>
                  <div className="region-header" style={{ borderBottom: `2px solid ${REGION_COLOR[region]}30` }}>
                    <div className="region-color-bar" style={{ background: REGION_COLOR[region] }} />
                    <h2 className="region-title" style={{ color: REGION_COLOR[region] }}>{region}</h2>
                    <span className="region-count" style={{ background: REGION_COLOR[region] + "22", color: REGION_COLOR[region] }}>
                      {grouped[region].length} bares
                    </span>
                  </div>
                  <div className="bars-grid">
                    {grouped[region].map(b => <Card key={b.id} b={b} visited={visited} favorites={favorites} tv={tv} tf={tf} exp={exp} setExp={setExp} imgErr={imgErr} setImgErr={setImgErr} T={T} dark={dark} />)}
                  </div>
                </section>
              ))
            )}
          </main>
        </>
      )}

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: T.footerBg, padding: "2.5rem 1.5rem", textAlign: "center" }}>
        <div className="footer-logo">
          <Logo size={50} />
        </div>
        <div className="footer-credit">
          <IgIcon color={BRAND.goldLt} />
          <span style={{ fontFamily: "sans-serif", fontSize: "0.85rem", color: "#aaa" }}>
            Curadoria:{" "}
            <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer"
              style={{ color: BRAND.goldLt, fontWeight: 700, textDecoration: "none" }}>
              @ParticipantesdiButeco
            </a>
          </span>
        </div>
        <p className="footer-text">
          Comida di Buteco 2026 · 26ª Edição · Belo Horizonte · 10 abr – 10 mai · Petiscos a R$ 40
        </p>
        <button
          onClick={() => setDark(d => !d)}
          className="footer-theme-toggle"
          style={{ color: dark ? BRAND.goldLt : "#ccc" }}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
          {dark ? "Modo Claro" : "Modo Escuro"}
        </button>
      </footer>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ b, visited, favorites, tv, tf, exp, setExp, imgErr, setImgErr, T, dark }) {
  const isV = visited.has(b.id), isF = favorites.has(b.id), isE = exp === b.id;
  const rc = REGION_COLOR[b.region] || "#555";
  const hasErr = imgErr.has(b.id);
  const hasRating = b.rating !== null && b.rating !== undefined;
  const hasBeerTemp = b.beerTemp !== null && b.beerTemp !== undefined;
  const teamVisited = b.visited === true;

  const borderColor = isF ? BRAND.red : isV ? "#27ae60" : T.cardBorder;

  return (
    <article
      className="bc"
      style={{
        background: T.cardBg,
        borderRadius: "14px",
        border: `2px solid ${borderColor}`,
        overflow: "hidden",
        boxShadow: `0 2px 10px rgba(0,0,0,${dark ? "0.3" : "0.07"})`,
        position: "relative",
        transition: "background .25s, border .25s",
      }}
    >
      <div style={{ height: "4px", background: rc }} />

      <div
        style={{ overflow: "hidden", height: "185px", position: "relative", background: rc + "18", cursor: "pointer" }}
        onClick={() => setExp(isE ? null : b.id)}
      >
        {!hasErr && b.photo ? (
          <img
            className="bi"
            src={b.photo}
            alt={b.dish}
            style={{ width: "100%", height: "185px", objectFit: "cover", display: "block" }}
            onError={() => setImgErr(s => new Set([...s, b.id]))}
          />
        ) : (
          <div style={{ height: "185px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", background: `linear-gradient(135deg,${rc}22,${rc}44)` }}>
            🍽️
          </div>
        )}

        {b.champion && <div className="champion-badge">🏆 Ex-campeão</div>}
        {isV && <div className="visited-badge">✓ Visitado</div>}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(transparent,rgba(0,0,0,0.35))", pointerEvents: "none" }} />
      </div>

      {b.photoCredit && (
        <div className="photo-credit" style={{ background: dark ? T.surfaceAlt : "#f5f0e8", color: T.textFaint, borderBottomColor: T.border }}>
          📷 {b.photoCredit}
        </div>
      )}

      <div style={{ padding: "0.85rem 1rem 0.8rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: "0 0 2px", fontSize: "0.92rem", fontWeight: 700, color: T.text, fontFamily: "sans-serif", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {b.name}
            </h3>
            <div style={{ fontSize: "0.67rem", color: T.textFaint, fontFamily: "sans-serif" }}>
              {b.neighborhood} · <span style={{ color: rc, fontWeight: 600 }}>{b.region}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2px", flexShrink: 0, marginLeft: "6px" }}>
            <button onClick={() => tf(b.id)} title={isF ? "Remover favorito" : "Favoritar"} style={{ background: "none", border: "none", padding: "4px", display: "flex", cursor: "pointer" }}>
              <HeartIcon f={isF} />
            </button>
            <button onClick={() => tv(b.id)} title={isV ? "Desmarcar visitado" : "Marcar visitado"} style={{ background: "none", border: "none", padding: "4px", display: "flex", cursor: "pointer" }}>
              <CheckCircle d={isV} />
            </button>
          </div>
        </div>

        <div className="info-bar" style={{ background: T.glassBg, border: `1px solid ${T.glassBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            {teamVisited ? (
              <>
                <CheckCircle d={true} />
                <span style={{ fontSize: "0.68rem", fontFamily: "sans-serif", color: "#16A085", fontWeight: 600, whiteSpace: "nowrap" }}>Time visitou</span>
              </>
            ) : (
              <span style={{ fontSize: "0.68rem", fontFamily: "sans-serif", color: T.textFaint, whiteSpace: "nowrap" }}>⏳ Aguardando</span>
            )}
          </div>

          {hasRating && (
            <div className="rating-badge">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{b.rating.toFixed(1)}</span>
            </div>
          )}

          {hasBeerTemp && (
            <div className="temp-badge" style={{ background: getTempBg(b.beerTemp), border: `1px solid ${getTempColor(b.beerTemp)}30` }}>
              <span className="temp-icon" style={{ color: getTempColor(b.beerTemp) }}>🌡️</span>
              <span className="temp-value" style={{ color: getTempColor(b.beerTemp) }}>{b.beerTemp}°C</span>
              {b.beerTemp < -5 && <span style={{ fontSize: "0.58rem", marginLeft: "1px" }}>❄️</span>}
            </div>
          )}
        </div>

        <div className="petisco-container" style={{ background: rc + "14", border: `1px solid ${rc}25` }}>
          <div className="petisco-label" style={{ color: T.textFaint }}>Petisco</div>
          <div className="petisco-name" style={{ color: rc }}>{b.dish}</div>
        </div>

        <p className="description-text" style={{ color: T.textMuted }}>
          {isE ? b.desc : b.desc.slice(0, 88) + (b.desc.length > 88 ? "…" : "")}
        </p>

        {isE && (
          <div className="address-text" style={{ color: T.textFaint }}>
            <span>📍</span>
            <span>{b.address} – {b.neighborhood}, BH</span>
          </div>
        )}

        <button
          onClick={() => setExp(isE ? null : b.id)}
          className="expand-btn"
          style={{ color: rc }}
        >
          {isE ? "Menos ↑" : "Mais ↓"}
        </button>
      </div>
    </article>
  );
}
