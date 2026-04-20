import { useState, useMemo, useEffect } from "react";
import data from "./data/bares.json";
import logoImg from "./data/logo.png";
import "./App.css";

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const BRAND = {
  navy: "#1C2D6E",
  navyDk: "#131f50",
  red: "#C0392B",
  gold: "#E8A820",
  goldLt: "#F4D03F",
};

const THEMES = {
  light: {
    bg: "#F5EFE0",
    surface: "#FFFFFF",
    text: "#1C1A14",
    textMuted: "#6B5F48",
    textFaint: "#9E9280",
    headerBg: `linear-gradient(155deg, #131f50 0%, #1C2D6E 60%, #1a2860 100%)`,
    filterBg: "#FFFFFF",
    filterBorder: "#E2D8C0",
    cardBg: "#FFFFFF",
    cardBorder: "#E2D8C0",
    statBg: "rgba(255,255,255,0.13)",
    bannerBg: `linear-gradient(90deg, #131f50, #1C2D6E)`,
    mapFooterBg: "#FAF7F0",
    footerBg: "#131f50",
    inputBg: "#FAF7F0",
    glassBg: "rgba(255,255,255,0.75)",
    glassBorder: "rgba(255,255,255,0.4)",
  },
  dark: {
    bg: "#0F1117",
    surface: "#1A1D26",
    text: "#EDE8DC",
    textMuted: "#9A94A8",
    textFaint: "#605A6E",
    headerBg: `linear-gradient(155deg, #090C18 0%, #101428 60%, #0D1122 100%)`,
    filterBg: "#1A1D26",
    filterBorder: "#2E3245",
    cardBg: "#1A1D26",
    cardBorder: "#2E3245",
    statBg: "rgba(255,255,255,0.07)",
    bannerBg: `linear-gradient(90deg, #090C18, #101428)`,
    mapFooterBg: "#21242F",
    footerBg: "#090C18",
    inputBg: "#21242F",
    glassBg: "rgba(26,29,38,0.85)",
    glassBorder: "rgba(255,255,255,0.08)",
  },
};

const REGION_COLOR = data.regions;
const BARS = data.bars;
const REGIONS = ["Todas", ...Object.keys(REGION_COLOR)];

// ─── UTILITÁRIOS ─────────────────────────────────────────────────────────────
const normalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getTempColor = (t) => {
  if (t === null) return "#95a5a6";
  if (t < -3) return "#2980B9";
  if (t <= 1) return "#27AE60";
  if (t <= 3) return "#F39C12";
  if (t <= 6) return "#E67E22";
  return "#C0392B";
};

const getTempBg = (t) => {
  if (t === null) return "rgba(0,0,0,0.05)";
  if (t < -3) return "rgba(52,152,219,0.15)";
  if (t <= 1) return "rgba(46,204,113,0.15)";
  if (t <= 3) return "rgba(243,156,18,0.15)";
  if (t <= 6) return "rgba(230,126,34,0.15)";
  return "rgba(231,76,60,0.15)";
};

// ─── ÍCONES ─────────────────────────────────────────────────────────────────
const HeartIcon = ({ f }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill={f ? "#C0392B" : "none"} stroke={f ? "#C0392B" : "#999"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CheckCircle = ({ d }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill={d ? "#27ae60" : "none"} stroke={d ? "#27ae60" : "#999"} strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const SunIcon = () => (
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

const IgIcon = ({ color = "currentColor" }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// ─── COMPONENTE LOGO ─────────────────────────────────────────────────────────
const Logo = ({ size = 80 }) => (
  <img 
    src={logoImg} 
    alt="Logo" 
    width={size} 
    height={size}
    className="logo-img"
    style={{ 
      boxShadow: `0 0 0 4px ${BRAND.gold}55, 0 0 0 8px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.2)`
    }}
  />
);

// ─── COMPONENTE CARD ─────────────────────────────────────────────────────────
const Card = ({ b, visited, favorites, setVisited, setFavorites, expandedId, setExpandedId, imgErr, setImgErr, T, dark }) => {
  const isVisited = visited.has(b.id);
  const isFavorite = favorites.has(b.id);
  const isExpanded = expandedId === b.id;
  const regionColor = REGION_COLOR[b.region] || "#555";
  const hasImageError = imgErr.has(b.id);
  const teamVisited = b.visited === true;
  const borderColor = isFavorite ? BRAND.red : isVisited ? "#27ae60" : T.cardBorder;

  const toggleVisit = () => {
    const newSet = new Set(visited);
    newSet.has(b.id) ? newSet.delete(b.id) : newSet.add(b.id);
    setVisited(newSet);
  };

  const toggleFavorite = () => {
    const newSet = new Set(favorites);
    newSet.has(b.id) ? newSet.delete(b.id) : newSet.add(b.id);
    setFavorites(newSet);
  };

  return (
    <article className="card" style={{ background: T.cardBg, border: `2px solid ${borderColor}` }}>
      <div style={{ height: "4px", background: regionColor }} />

      <div className="card-image" style={{ background: regionColor + "18" }} onClick={() => setExpandedId(isExpanded ? null : b.id)}>
        {!hasImageError && b.photo ? (
          <img className="bi card-img" src={b.photo} alt={b.dish} onError={() => setImgErr(prev => new Set([...prev, b.id]))} loading="lazy" />
        ) : (
          <div className="card-img-fallback" style={{ background: `linear-gradient(135deg,${regionColor}22,${regionColor}44)` }}>🍽️</div>
        )}
        {b.champion && <div className="champion-badge">🏆 Ex-campeão</div>}
        {isVisited && <div className="visited-badge">✓ Visitado</div>}
        <div className="image-gradient" />
      </div>

      {b.photoCredit && (
        <div className="photo-credit" style={{ background: dark ? T.surfaceAlt : "#f5f0e8", color: T.textFaint }}>
          📷 {b.photoCredit}
        </div>
      )}

      <div className="card-content">
        <div className="card-header">
          <div style={{ flex: 1 }}>
            <h3 className="card-title" style={{ color: T.text }}>{b.name}</h3>
            <div className="card-subtitle" style={{ color: T.textFaint }}>
              {b.neighborhood} · <span style={{ color: regionColor }}>{b.region}</span>
            </div>
          </div>
          <div className="card-actions">
            <button onClick={toggleFavorite} className="action-button">
              <HeartIcon f={isFavorite} />
            </button>
            <button onClick={toggleVisit} className="action-button">
              <CheckCircle d={isVisited} />
            </button>
          </div>
        </div>

        <div className="info-bar" style={{ background: T.glassBg, border: `1px solid ${T.glassBorder}` }}>
          <div className="team-visit-status">
            {teamVisited ? (
              <>
                <CheckCircle d={true} />
                <span className="team-visit-text" style={{ color: "#16A085" }}>Time visitou</span>
              </>
            ) : (
              <span className="team-waiting-text" style={{ color: T.textFaint }}>⏳ Aguardando</span>
            )}
          </div>

          {b.rating && (
            <div className="rating-badge" style={{ background: BRAND.navy }}>
              <span className="rating-star" style={{ color: BRAND.goldLt }}>⭐</span>
              <span className="rating-value" style={{ color: "#fff" }}>{b.rating.toFixed(1)}</span>
            </div>
          )}

          {b.beerTemp !== null && (
            <div className="temp-badge" style={{ background: getTempBg(b.beerTemp) }}>
              <span className="temp-icon" style={{ color: getTempColor(b.beerTemp) }}>🌡️</span>
              <span className="temp-value" style={{ color: getTempColor(b.beerTemp) }}>{b.beerTemp}°C</span>
              {b.beerTemp < -5 && <span style={{ fontSize: "0.58rem" }}>❄️</span>}
            </div>
          )}
        </div>

        <div className="petisco-container" style={{ background: regionColor + "14", border: `1px solid ${regionColor}25` }}>
          <div className="petisco-label" style={{ color: T.textFaint }}>Petisco</div>
          <div className="petisco-name" style={{ color: regionColor }}>{b.dish}</div>
        </div>

        <p className="description-text" style={{ color: T.textMuted }}>
          {isExpanded ? b.desc : b.desc.slice(0, 88) + (b.desc.length > 88 ? "…" : "")}
        </p>

        {isExpanded && (
          <div className="address-text" style={{ color: T.textFaint }}>
            📍 {b.address} – {b.neighborhood}, BH
          </div>
        )}

        <button onClick={() => setExpandedId(isExpanded ? null : b.id)} className="expand-btn" style={{ color: regionColor }}>
          {isExpanded ? "Menos ↑" : "Mais ↓"}
        </button>
      </div>
    </article>
  );
};

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function App() {
  // Tema
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("cdb26theme") === "dark"; } catch { return false; }
  });
  const T = dark ? THEMES.dark : THEMES.light;

  // Dados do usuário
  const [visited, setVisited] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26v") || "[]")); } catch { return new Set(); }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26f") || "[]")); } catch { return new Set(); }
  });

  // Filtros e UI
  const [filters, setFilters] = useState({ onlyVisited: false, onlyFavorites: false, region: "Todas", search: "", onlyTeam: false });
  const [sortBy, setSortBy] = useState("none");
  const [expandedId, setExpandedId] = useState(null);
  const [tab, setTab] = useState("bares");
  const [imgErr, setImgErr] = useState(new Set());

  // Persistência
  useEffect(() => {
    localStorage.setItem("cdb26theme", dark ? "dark" : "light");
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => { localStorage.setItem("cdb26v", JSON.stringify([...visited])); }, [visited]);
  useEffect(() => { localStorage.setItem("cdb26f", JSON.stringify([...favorites])); }, [favorites]);

  // Pré-processamento dos dados para busca
  const barsWithNormalized = useMemo(() => {
    return BARS.map(bar => ({
      ...bar,
      normalizedName: normalizeText(bar.name),
      normalizedDish: normalizeText(bar.dish),
      normalizedNeighborhood: normalizeText(bar.neighborhood),
    }));
  }, []);

  // Filtragem e ordenação
  const filteredAndSorted = useMemo(() => {
    let result = barsWithNormalized.filter(b => {
      if (filters.onlyVisited && !visited.has(b.id)) return false;
      if (filters.onlyFavorites && !favorites.has(b.id)) return false;
      if (filters.region !== "Todas" && b.region !== filters.region) return false;
      if (filters.onlyTeam && !b.visited) return false;
      if (filters.search) {
        const query = normalizeText(filters.search);
        if (!b.normalizedName.includes(query) && !b.normalizedDish.includes(query) && !b.normalizedNeighborhood.includes(query)) return false;
      }
      return true;
    });
    
    if (sortBy === "rating") result.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    if (sortBy === "beerTemp") result.sort((a, b) => (a.beerTemp ?? 999) - (b.beerTemp ?? 999));
    
    return result;
  }, [barsWithNormalized, filters, visited, favorites, sortBy]);

  // Agrupamento por região
  const grouped = useMemo(() => {
    const g = {};
    filteredAndSorted.forEach(b => { (g[b.region] = g[b.region] || []).push(b); });
    return g;
  }, [filteredAndSorted]);

  const clearFilters = () => {
    setFilters({ onlyVisited: false, onlyFavorites: false, region: "Todas", search: "", onlyTeam: false });
    setSortBy("none");
  };

  const hasActiveFilters = filters.onlyVisited || filters.onlyFavorites || filters.region !== "Todas" || filters.search || filters.onlyTeam || sortBy !== "none";

  return (
    <div className="app-container" style={{ background: T.bg }}>
      {/* HEADER */}
      <header style={{ background: T.headerBg }}>
        <div className="instagram-bar">
          <IgIcon color={BRAND.goldLt} />
          <span style={{ color: "#ccc" }}>Curadoria realizada pelo perfil do Instagram</span>
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.goldLt, fontWeight: 700 }}>
            @ParticipantesdiButeco
          </a>
          <span style={{ color: "#777" }}>— siga para dicas e novidades!</span>
        </div>

        <div className="header-content">
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div className="header-logo-title">
              <div className="logo-container" style={{ border: `3px solid ${BRAND.gold}66`, boxShadow: `0 0 32px ${BRAND.gold}44, 0 8px 20px rgba(0,0,0,0.3)` }}>
                <Logo size={85} />
              </div>
              <div>
                <div className="header-title" style={{ color: BRAND.goldLt }}>Belo Horizonte · 10 Abr – 10 Mai 2026</div>
                <h1 className="main-title" style={{ color: "#fff" }}>Participantes di Buteco</h1>
                <div className="main-subtitle" style={{ color: "#9BBFCE" }}>Guia da 26ª Edição do Comida di Buteco · <span style={{ color: BRAND.goldLt }}>"Somos Todos Verduras"</span></div>
              </div>
            </div>

            <div className="header-stats">
              <div className="stat-card" style={{ background: T.statBg }}><div className="stat-value">{BARS.length}</div><div className="stat-label">Bares</div></div>
              <div className="stat-card" style={{ background: T.statBg }}><div className="stat-value">{visited.size}</div><div className="stat-label">Eu visitei</div></div>
              <div className="stat-card" style={{ background: T.statBg }}><div className="stat-value">{favorites.size}</div><div className="stat-label">Favoritos</div></div>
              <button className="dm-toggle" onClick={() => setDark(!dark)} style={{ background: dark ? "rgba(232,168,32,0.2)" : "rgba(255,255,255,0.12)", border: `2px solid ${dark ? BRAND.gold : "rgba(255,255,255,0.3)"}`, borderRadius: "50%", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", color: dark ? BRAND.goldLt : "#fff", backdropFilter: "blur(8px)" }}>
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>

          <div className="tabs-container">
            <button className="tab-button" onClick={() => setTab("bares")} style={{ borderBottom: `3px solid ${tab === "bares" ? BRAND.goldLt : "transparent"}`, color: tab === "bares" ? "#fff" : "rgba(255,255,255,0.45)" }}>🍺 Bares & Pratos</button>
            <button className="tab-button" onClick={() => setTab("mapa")} style={{ borderBottom: `3px solid ${tab === "mapa" ? BRAND.goldLt : "transparent"}`, color: tab === "mapa" ? "#fff" : "rgba(255,255,255,0.45)" }}>🗺️ Mapa Interativo</button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      {tab === "mapa" ? (
        <div className="max-width-1200 px-15 mt-2">
          <div style={{ background: T.surface, borderRadius: "16px", overflow: "hidden", boxShadow: `0 4px 28px rgba(0,0,0,${dark ? "0.5" : "0.1"})`, border: `1px solid ${T.border}` }}>
            <div style={{ background: T.bannerBg, padding: "1.2rem 1.8rem", display: "flex", alignItems: "center", gap: "15px" }}>
              <Logo size={45} />
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontFamily: "sans-serif", fontSize: "1rem" }}>Mapa Personalizado — Comida di Buteco 2026 BH</div>
                <div style={{ color: BRAND.goldLt, fontSize: "0.74rem", fontFamily: "sans-serif", opacity: 0.85 }}>Todos os bares participantes marcados · Curadoria @ParticipantesdiButeco</div>
              </div>
            </div>
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: dark ? "#111" : "#f0ebe0" }}>
              <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1NKgMtDTJSU2KAuiadQub73yXZ4nEJLU&ehbc=2E312F&noprof=1" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} title="Mapa" allowFullScreen loading="lazy" />
            </div>
            <div style={{ padding: "0.9rem 1.8rem", background: T.mapFooterBg, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
              <IgIcon color={BRAND.navy} />
              <span style={{ fontSize: "0.78rem", color: T.textMuted, fontFamily: "sans-serif" }}>Mapa criado por <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.navy, fontWeight: 700 }}>@ParticipantesdiButeco</a> · Siga para atualizações e dicas do concurso</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* FILTROS - ESTILO ORIGINAL RESTAURADO */}
          <div className="sticky-filters" style={{ background: T.filterBg, borderBottom: `1px solid ${T.filterBorder}`, boxShadow: `0 2px 12px rgba(0,0,0,${dark ? "0.4" : "0.07"})` }}>
            <div className="sticky-filters-inner">
              {/* Busca */}
              <div className="search-wrapper">
                <span className="search-icon" style={{ color: T.textFaint }}>🔍</span>
                <input
                  type="text"
                  placeholder="Bar, prato ou bairro..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="search-input"
                  style={{ border: `1.5px solid ${T.border}`, background: T.inputBg, color: T.text }}
                />
              </div>

              {/* Selects lado a lado */}
              <div className="filters-group">
                <select
                  value={filters.region}
                  onChange={e => setFilters(prev => ({ ...prev, region: e.target.value }))}
                  className="select-input"
                  style={{ 
                    border: `1.5px solid ${filters.region !== "Todas" ? BRAND.navy : T.border}`,
                    background: filters.region !== "Todas" ? (dark ? "#1a2040" : "#e8ecf8") : T.inputBg,
                    color: filters.region !== "Todas" ? BRAND.navy : T.textMuted,
                    fontWeight: filters.region !== "Todas" ? 700 : 400
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

              {/* Botões de filtro lado a lado */}
              <div className="filters-group">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, onlyTeam: !prev.onlyTeam }))}
                  className="filter-pill"
                  style={{
                    border: `2px solid ${filters.onlyTeam ? "#27ae60" : T.border}`,
                    background: filters.onlyTeam ? (dark ? "#0d2c1a" : "#eafaf1") : T.surface,
                    color: filters.onlyTeam ? "#1a5c30" : T.textMuted,
                  }}
                >
                  <CheckCircle d={filters.onlyTeam} /> Time visitou
                </button>
                
                <button
                  onClick={() => setFilters(prev => ({ ...prev, onlyVisited: !prev.onlyVisited }))}
                  className="filter-pill"
                  style={{
                    border: `2px solid ${filters.onlyVisited ? "#27ae60" : T.border}`,
                    background: filters.onlyVisited ? (dark ? "#0d2c1a" : "#eafaf1") : T.surface,
                    color: filters.onlyVisited ? "#1a5c30" : T.textMuted,
                  }}
                >
                  <CheckCircle d={filters.onlyVisited} /> Visitados
                </button>
                
                <button
                  onClick={() => setFilters(prev => ({ ...prev, onlyFavorites: !prev.onlyFavorites }))}
                  className="filter-pill"
                  style={{
                    border: `2px solid ${filters.onlyFavorites ? BRAND.red : T.border}`,
                    background: filters.onlyFavorites ? (dark ? "#2c0d0d" : "#fdf0ed") : T.surface,
                    color: filters.onlyFavorites ? "#c0392b" : T.textMuted,
                  }}
                >
                  <HeartIcon f={filters.onlyFavorites} /> Favoritos
                </button>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="filter-pill" style={{ border: `1px solid ${T.border}`, background: T.surface, color: T.textMuted, fontSize: "0.78rem" }}>
                  ✕ Limpar
                </button>
              )}

              <div className="filter-counter" style={{ color: T.textFaint }}>
                {filteredAndSorted.length} / {BARS.length}
              </div>
            </div>
          </div>

          {/* BANNER MAPA */}
          <div className="max-width-1200 px-15 mt-2">
            <div onClick={() => setTab("mapa")} className="map-cta" style={{ background: T.bannerBg, boxShadow: `0 2px 14px rgba(28,45,110,${dark ? "0.5" : "0.2"})`, border: `1px solid ${BRAND.navy}55` }}>
              <Logo size={38} />
              <div>
                <div className="cta-title" style={{ color: "#fff" }}>Ver Mapa Interativo dos Bares</div>
                <div className="cta-subtitle" style={{ color: BRAND.goldLt }}>Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco</div>
              </div>
              <span className="cta-arrow" style={{ color: BRAND.goldLt }}>→</span>
            </div>
          </div>

          {/* GRID DE CARDS */}
          <main className="max-width-1200 px-15" style={{ padding: "1.5rem" }}>
            {filteredAndSorted.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>Nenhum bar encontrado com esses filtros.</p>
                <button onClick={clearFilters} className="empty-button" style={{ background: BRAND.navy, color: "#fff" }}>Limpar filtros</button>
              </div>
            ) : sortBy !== "none" ? (
              <div className="bars-grid">
                {filteredAndSorted.map(b => <Card key={b.id} b={b} visited={visited} favorites={favorites} setVisited={setVisited} setFavorites={setFavorites} expandedId={expandedId} setExpandedId={setExpandedId} imgErr={imgErr} setImgErr={setImgErr} T={T} dark={dark} />)}
              </div>
            ) : (
              Object.keys(grouped).sort().map(region => (
                <section key={region} className="section-margin">
                  <div className="region-header" style={{ borderBottom: `2px solid ${REGION_COLOR[region]}30` }}>
                    <div className="region-color-bar" style={{ background: REGION_COLOR[region] }} />
                    <h2 style={{ color: REGION_COLOR[region] }}>{region}</h2>
                    <span className="region-count" style={{ background: REGION_COLOR[region] + "22", color: REGION_COLOR[region] }}>{grouped[region].length} bares</span>
                  </div>
                  <div className="bars-grid">
                    {grouped[region].map(b => <Card key={b.id} b={b} visited={visited} favorites={favorites} setVisited={setVisited} setFavorites={setFavorites} expandedId={expandedId} setExpandedId={setExpandedId} imgErr={imgErr} setImgErr={setImgErr} T={T} dark={dark} />)}
                  </div>
                </section>
              ))
            )}
          </main>
        </>
      )}

      {/* FOOTER - LOGO CENTRALIZADA */}
      <footer style={{ background: T.footerBg, padding: "2.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <Logo size={50} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "0.5rem" }}>
          <IgIcon color={BRAND.goldLt} />
          <span style={{ fontFamily: "sans-serif", fontSize: "0.85rem", color: "#aaa" }}>
            Curadoria:{" "}
            <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.goldLt, fontWeight: 700 }}>
              @ParticipantesdiButeco
            </a>
          </span>
        </div>
        <p className="footer-text">Comida di Buteco 2026 · 26ª Edição · Belo Horizonte · 10 abr – 10 mai · Petiscos a R$ 40</p>
        <button onClick={() => setDark(!dark)} className="footer-theme-toggle" style={{ color: dark ? BRAND.goldLt : "#ccc" }}>
          {dark ? <SunIcon /> : <MoonIcon />}
          {dark ? "Modo Claro" : "Modo Escuro"}
        </button>
      </footer>
    </div>
  );
}
