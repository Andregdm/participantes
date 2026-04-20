import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import data from "./data/bares.json";
import logoImg from "./data/logo.png";
import "./App.css";

// ─── OTIMIZAÇÃO 1: Extrair constantes que não mudam ─────────────────────────
const BRAND = {
  navy:    "#1C2D6E",
  navyDk:  "#131f50",
  red:     "#C0392B",
  gold:    "#E8A820",
  goldLt:  "#F4D03F",
  cream:   "#F5EFE0",
  white:   "#FFFFFF",
};

// ─── OTIMIZAÇÃO 2: Pré-calcular temas como constantes ───────────────────────
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
    inputBg:      "#21242F",
    glassBg:      "rgba(26,29,38,0.85)",
    glassBorder:  "rgba(255,255,255,0.08)",
  },
};

const REGION_COLOR = data.regions;
const BARS = data.bars;
const REGIONS = ["Todas", ...Object.keys(REGION_COLOR)];

// ─── OTIMIZAÇÃO 3: Mapeamento de cores de temperatura pré-calculado ──────────
const TEMP_COLORS = {
  veryCold: "#2980B9",
  cold: "#27AE60",
  cool: "#F39C12",
  warm: "#E67E22",
  hot: "#C0392B",
  default: "#95a5a6"
};

const getTempColor = (t) => {
  if (t === null) return TEMP_COLORS.default;
  if (t < -3) return TEMP_COLORS.veryCold;
  if (t <= 1) return TEMP_COLORS.cold;
  if (t <= 3) return TEMP_COLORS.cool;
  if (t <= 6) return TEMP_COLORS.warm;
  return TEMP_COLORS.hot;
};

const getTempBg = (t) => {
  if (t === null) return "rgba(0,0,0,0.05)";
  if (t < -3) return "rgba(52,152,219,0.15)";
  if (t <= 1)  return "rgba(46,204,113,0.15)";
  if (t <= 3)  return "rgba(243,156,18,0.15)";
  if (t <= 6)  return "rgba(230,126,34,0.15)";
  return "rgba(231,76,60,0.15)";
};

// ─── OTIMIZAÇÃO 4: Função de normalização memoizada ──────────────────────────
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
};

// ─── OTIMIZAÇÃO 5: Componentes de ícone memoizados ───────────────────────────
const HeartIcon = React.memo(({ f }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill={f ? "#C0392B" : "none"} stroke={f ? "#C0392B" : "#999"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
));

const CheckCircle = React.memo(({ d }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill={d ? "#27ae60" : "none"} stroke={d ? "#27ae60" : "#999"} strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
));

const MoonIcon = React.memo(() => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
));

const SunIcon = React.memo(() => (
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
));

const IgIcon = React.memo(({ color = "currentColor" }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
));

// ─── OTIMIZAÇÃO 6: Componente Logo memoizado ─────────────────────────────────
const Logo = React.memo(({ size = 80 }) => (
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
));

// ─── OTIMIZAÇÃO 7: Lazy loading do componente Mapa ───────────────────────────
const MapComponent = lazy(() => import("./components/MapComponent"));

// ─── OTIMIZAÇÃO 8: Componente Card memoizado com comparação customizada ──────
const Card = React.memo(({ b, visited, favorites, onToggleVisit, onToggleFavorite, expandedId, onToggleExpand, imgErr, onImgError, T, dark }) => {
  const isV = visited.has(b.id);
  const isF = favorites.has(b.id);
  const isE = expandedId === b.id;
  const rc = REGION_COLOR[b.region] || "#555";
  const hasErr = imgErr.has(b.id);
  const hasRating = b.rating !== null && b.rating !== undefined;
  const hasBeerTemp = b.beerTemp !== null && b.beerTemp !== undefined;
  const teamVisited = b.visited === true;
  const borderColor = isF ? BRAND.red : isV ? "#27ae60" : T.cardBorder;

  // ─── OTIMIZAÇÃO 9: Handlers memoizados localmente ─────────────────────────
  const handleImageError = useCallback(() => onImgError(b.id), [b.id, onImgError]);
  const handleToggleVisit = useCallback(() => onToggleVisit(b.id), [b.id, onToggleVisit]);
  const handleToggleFavorite = useCallback(() => onToggleFavorite(b.id), [b.id, onToggleFavorite]);
  const handleToggleExpand = useCallback(() => onToggleExpand(b.id), [b.id, onToggleExpand]);

  return (
    <article className="card" style={{ background: T.cardBg, border: `2px solid ${borderColor}`, boxShadow: `0 2px 10px rgba(0,0,0,${dark ? "0.3" : "0.07"})` }}>
      <div className="region-color-bar-top" style={{ background: rc }} />

      <div className="card-image" style={{ background: rc + "18" }} onClick={handleToggleExpand}>
        {!hasErr && b.photo ? (
          <img className="bi card-img" src={b.photo} alt={b.dish} onError={handleImageError} loading="lazy" />
        ) : (
          <div className="card-img-fallback" style={{ background: `linear-gradient(135deg,${rc}22,${rc}44)` }}>🍽️</div>
        )}
        {b.champion && <div className="champion-badge">🏆 Ex-campeão</div>}
        {isV && <div className="visited-badge">✓ Visitado</div>}
        <div className="image-gradient" />
      </div>

      {b.photoCredit && (
        <div className="photo-credit" style={{ background: dark ? T.surfaceAlt : "#f5f0e8", color: T.textFaint, borderBottomColor: T.border }}>
          📷 {b.photoCredit}
        </div>
      )}

      <div className="card-content">
        <div className="card-header">
          <div className="flex-grow-1" style={{ flex: 1, minWidth: 0 }}>
            <h3 className="card-title" style={{ color: T.text }}>{b.name}</h3>
            <div className="card-subtitle" style={{ color: T.textFaint }}>
              {b.neighborhood} · <span style={{ color: rc, fontWeight: 600 }}>{b.region}</span>
            </div>
          </div>
          <div className="card-actions">
            <button onClick={handleToggleFavorite} className="action-button" title={isF ? "Remover favorito" : "Favoritar"}>
              <HeartIcon f={isF} />
            </button>
            <button onClick={handleToggleVisit} className="action-button" title={isV ? "Desmarcar visitado" : "Marcar visitado"}>
              <CheckCircle d={isV} />
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

          {hasRating && (
            <div className="rating-badge" style={{ background: BRAND.navy }}>
              <span className="rating-star" style={{ color: BRAND.goldLt }}>⭐</span>
              <span className="rating-value" style={{ color: "#fff" }}>{b.rating.toFixed(1)}</span>
            </div>
          )}

          {hasBeerTemp && (
            <div className="temp-badge" style={{ background: getTempBg(b.beerTemp), border: `1px solid ${getTempColor(b.beerTemp)}30` }}>
              <span className="temp-icon" style={{ color: getTempColor(b.beerTemp) }}>🌡️</span>
              <span className="temp-value" style={{ color: getTempColor(b.beerTemp) }}>{b.beerTemp}°C</span>
              {b.beerTemp < -5 && <span className="snow-icon" style={{ fontSize: "0.58rem", marginLeft: "1px" }}>❄️</span>}
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

        <button onClick={handleToggleExpand} className="expand-btn" style={{ color: rc }}>
          {isE ? "Menos ↑" : "Mais ↓"}
        </button>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  // ─── OTIMIZAÇÃO 10: Comparação customizada para evitar re-renders ─────────
  return (
    prevProps.b.id === nextProps.b.id &&
    prevProps.visited === nextProps.visited &&
    prevProps.favorites === nextProps.favorites &&
    prevProps.expandedId === nextProps.expandedId &&
    prevProps.imgErr === nextProps.imgErr &&
    prevProps.T === nextProps.T &&
    prevProps.dark === nextProps.dark
  );
});

// ─── OTIMIZAÇÃO 11: Hook customizado para localStorage ───────────────────────
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
};

// ─── OTIMIZAÇÃO 12: Hook customizado para filtros e ordenação ────────────────
const useFilteredBars = (bars, filters, sortBy) => {
  return useMemo(() => {
    let result = bars.filter(b => {
      if (filters.onlyVisited && !filters.visited.has(b.id)) return false;
      if (filters.onlyFavorites && !filters.favorites.has(b.id)) return false;
      if (filters.region !== "Todas" && b.region !== filters.region) return false;
      if (filters.onlyTeam && !b.visited) return false;
      if (filters.search) {
        const normalizedQuery = normalizeText(filters.search);
        if (!b.normalizedName.includes(normalizedQuery) && 
            !b.normalizedDish.includes(normalizedQuery) && 
            !b.normalizedNeighborhood.includes(normalizedQuery)) return false;
      }
      return true;
    });
    
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    } else if (sortBy === "beerTemp") {
      result = [...result].sort((a, b) => (a.beerTemp ?? 999) - (b.beerTemp ?? 999));
    }
    
    return result;
  }, [bars, filters, sortBy]);
};

// ─── OTIMIZAÇÃO 13: Componente principal otimizado ───────────────────────────
export default function App() {
  // ─── OTIMIZAÇÃO 14: Estado unificado com useReducer? Não, mas agrupado ────
  const [dark, setDark] = useLocalStorage("cdb26theme", false);
  const [visited, setVisited] = useLocalStorage("cdb26v", new Set());
  const [favorites, setFavorites] = useLocalStorage("cdb26f", new Set());
  
  // ─── OTIMIZAÇÃO 15: Estado dos filtros agrupado ───────────────────────────
  const [filters, setFilters] = useState({
    onlyVisited: false,
    onlyFavorites: false,
    region: "Todas",
    search: "",
    onlyTeam: false
  });
  
  const [sortBy, setSortBy] = useState("none");
  const [expandedId, setExpandedId] = useState(null);
  const [tab, setTab] = useState("bares");
  const [imgErr, setImgErr] = useState(new Set());

  const T = dark ? THEMES.dark : THEMES.light;

  // ─── OTIMIZAÇÃO 16: Pré-processamento dos dados uma única vez ──────────────
  const barsWithNormalized = useMemo(() => {
    return BARS.map(bar => ({
      ...bar,
      normalizedName: normalizeText(bar.name),
      normalizedDish: normalizeText(bar.dish),
      normalizedNeighborhood: normalizeText(bar.neighborhood),
    }));
  }, []);

  // ─── OTIMIZAÇÃO 17: Aplicação de filtros e ordenação ──────────────────────
  const filteredAndSorted = useFilteredBars(barsWithNormalized, {
    visited,
    favorites,
    region: filters.region,
    search: filters.search,
    onlyTeam: filters.onlyTeam,
    onlyVisited: filters.onlyVisited,
    onlyFavorites: filters.onlyFavorites
  }, sortBy);

  // ─── OTIMIZAÇÃO 18: Agrupamento por região memoizado ──────────────────────
  const grouped = useMemo(() => {
    const g = {};
    filteredAndSorted.forEach(b => { (g[b.region] = g[b.region] || []).push(b); });
    return g;
  }, [filteredAndSorted]);
  const regionKeys = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // ─── OTIMIZAÇÃO 19: Handlers memoizados com useCallback ────────────────────
  const handleToggleVisit = useCallback((id) => {
    setVisited(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, [setVisited]);

  const handleToggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, [setFavorites]);

  const handleToggleExpand = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const handleImgError = useCallback((id) => {
    setImgErr(prev => new Set([...prev, id]));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      onlyVisited: false,
      onlyFavorites: false,
      region: "Todas",
      search: "",
      onlyTeam: false
    });
    setSortBy("none");
  }, []);

  const hasActiveFilters = filters.onlyVisited || filters.onlyFavorites || filters.region !== "Todas" || filters.search || filters.onlyTeam || sortBy !== "none";

  // ─── OTIMIZAÇÃO 20: Aplicar classe dark no body ───────────────────────────
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  // ─── OTIMIZAÇÃO 21: Memoizar estatísticas para evitar recálculo ───────────
  const stats = useMemo(() => [
    { v: BARS.length, l: "Bares" },
    { v: visited.size, l: "Eu visitei" },
    { v: favorites.size, l: "Favoritos" }
  ], [visited.size, favorites.size]);

  // ─── OTIMIZAÇÃO 22: Memoizar opções de ordenação ──────────────────────────
  const sortOptions = useMemo(() => [
    { value: "none", label: "📋 Ordenar" },
    { value: "rating", label: "⭐ Maior nota" },
    { value: "beerTemp", label: "🌡️ Mais gelada" }
  ], []);

  // ─── OTIMIZAÇÃO 23: Memoizar botões de filtro ─────────────────────────────
  const filterButtons = useMemo(() => [
    { 
      key: "onlyTeam", 
      active: filters.onlyTeam, 
      label: "Time visitou", 
      ac: "#27ae60", 
      acBg: dark ? "#0d2c1a" : "#eafaf1", 
      acText: "#1a5c30",
      icon: <CheckCircle d={filters.onlyTeam} />
    },
    { 
      key: "onlyVisited", 
      active: filters.onlyVisited, 
      label: "Eu visitei", 
      ac: "#27ae60", 
      acBg: dark ? "#0d2c1a" : "#eafaf1", 
      acText: "#1a5c30",
      icon: <CheckCircle d={filters.onlyVisited} />
    },
    { 
      key: "onlyFavorites", 
      active: filters.onlyFavorites, 
      label: "Favoritos", 
      ac: BRAND.red, 
      acBg: dark ? "#2c0d0d" : "#fdf0ed", 
      acText: "#c0392b",
      icon: <HeartIcon f={filters.onlyFavorites} />
    }
  ], [filters.onlyTeam, filters.onlyVisited, filters.onlyFavorites, dark]);

  // ─── OTIMIZAÇÃO 24: Componente do mapa com lazy loading ────────────────────
  const renderMapTab = useMemo(() => {
    if (tab !== "mapa") return null;
    return (
      <Suspense fallback={<div className="loading-state">Carregando mapa...</div>}>
        <MapComponent T={T} dark={dark} BRAND={BRAND} Logo={Logo} IgIcon={IgIcon} />
      </Suspense>
    );
  }, [tab, T, dark]);

  return (
    <div className="app-container" style={{ background: T.bg }}>
      {/* HEADER */}
      <header style={{ background: T.headerBg }}>
        <div className="instagram-bar">
          <IgIcon color={BRAND.goldLt} />
          <span style={{ color: "#ccc" }}>Curadoria realizada pelo perfil do Instagram</span>
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" className="instagram-link" style={{ color: BRAND.goldLt }}>
            @ParticipantesdiButeco
          </a>
          <span style={{ color: "#777" }}>— siga para dicas e novidades!</span>
        </div>

        <div className="header-content">
          <div className="d-flex align-center gap-2 flex-wrap">
            <div className="header-logo-title">
              <div className="logo-container" style={{ border: `3px solid ${BRAND.gold}66`, boxShadow: `0 0 32px ${BRAND.gold}44, 0 8px 20px rgba(0,0,0,0.3)` }}>
                <Logo size={85} />
              </div>
              <div>
                <div className="header-title" style={{ color: BRAND.goldLt }}>Belo Horizonte · 10 Abr – 10 Mai 2026</div>
                <h1 className="main-title" style={{ color: "#fff" }}>Participantes di Buteco</h1>
                <div className="main-subtitle" style={{ color: "#9BBFCE" }}>
                  Guia da 26ª Edição do Comida di Buteco · <span style={{ color: BRAND.goldLt }}>"Somos Todos Verduras"</span>
                </div>
              </div>
            </div>

            <div className="header-stats">
              {stats.map(s => (
                <div key={s.l} className="stat-card" style={{ background: T.statBg }}>
                  <div className="stat-value">{s.v}</div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}

              <button
                className="dm-toggle"
                onClick={() => setDark(prev => !prev)}
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

          <div className="tabs-container">
            {[
              { k: "bares", l: "🍺  Bares & Pratos" },
              { k: "mapa", l: "🗺️  Mapa Interativo" }
            ].map(t => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className="tab-button"
                style={{
                  borderBottom: `3px solid ${tab === t.k ? BRAND.goldLt : "transparent"}`,
                  color: tab === t.k ? "#fff" : "rgba(255,255,255,0.45)",
                  fontWeight: tab === t.k ? 700 : 400,
                }}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTEÚDO DINÂMICO */}
      {tab === "mapa" ? renderMapTab : (
        <>
          {/* FILTROS STICKY */}
          <div className="sticky-filters" style={{ background: T.filterBg, borderBottom: `1px solid ${T.filterBorder}`, boxShadow: `0 2px 12px rgba(0,0,0,${dark ? "0.4" : "0.07"})` }}>
            <div className="sticky-filters-inner">
              <div className="search-wrapper">
                <span className="search-icon" style={{ color: T.textFaint }}>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar (ex: coracao encontra coração)..."
                  value={filters.search}
                  onChange={e => handleFilterChange("search", e.target.value)}
                  className="search-input"
                  style={{ border: `1.5px solid ${T.border}`, background: T.inputBg, color: T.text }}
                />
              </div>

              <div className="filters-group">
                <select
                  value={filters.region}
                  onChange={e => handleFilterChange("region", e.target.value)}
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
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="filters-group">
                {filterButtons.map(btn => (
                  <button
                    key={btn.key}
                    onClick={() => handleFilterChange(btn.key, !btn.active)}
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

              <div className="filter-counter" style={{ color: T.textFaint }}>
                {filteredAndSorted.length} / {BARS.length}
              </div>
            </div>
          </div>

          {/* MAPA CTA BANNER */}
          <div className="max-width-1200 px-15 mt-2">
            <div
              onClick={() => setTab("mapa")}
              className="map-cta"
              style={{ background: T.bannerBg, boxShadow: `0 2px 14px rgba(28,45,110,${dark ? "0.5" : "0.2"})`, border: `1px solid ${BRAND.navy}55` }}
            >
              <Logo size={38} />
              <div>
                <div className="cta-title" style={{ color: "#fff" }}>Ver Mapa Interativo dos Bares</div>
                <div className="cta-subtitle" style={{ color: BRAND.goldLt }}>
                  Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco
                </div>
              </div>
              <span className="cta-arrow" style={{ color: BRAND.goldLt }}>→</span>
            </div>
          </div>

          {/* GRID DE CARDS */}
          <main className="max-width-1200 px-15" style={{ margin: "0 auto", padding: "1.8rem 1.5rem 3.5rem" }}>
            {filteredAndSorted.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p className="empty-state-text" style={{ color: T.textMuted }}>Nenhum bar encontrado com esses filtros.</p>
                <button onClick={clearFilters} className="empty-button" style={{ background: BRAND.navy, color: "#fff" }}>
                  Limpar filtros
                </button>
              </div>
            ) : sortBy !== "none" ? (
              <div className="bars-grid">
                {filteredAndSorted.map(b => (
                  <Card
                    key={b.id}
                    b={b}
                    visited={visited}
                    favorites={favorites}
                    onToggleVisit={handleToggleVisit}
                    onToggleFavorite={handleToggleFavorite}
                    expandedId={expandedId}
                    onToggleExpand={handleToggleExpand}
                    imgErr={imgErr}
                    onImgError={handleImgError}
                    T={T}
                    dark={dark}
                  />
                ))}
              </div>
            ) : (
              regionKeys.map(region => (
                <section key={region} className="section-margin">
                  <div className="region-header" style={{ borderBottom: `2px solid ${REGION_COLOR[region]}30` }}>
                    <div className="region-color-bar" style={{ background: REGION_COLOR[region] }} />
                    <h2 className="region-title" style={{ color: REGION_COLOR[region] }}>{region}</h2>
                    <span className="region-count" style={{ background: REGION_COLOR[region] + "22", color: REGION_COLOR[region] }}>
                      {grouped[region].length} bares
                    </span>
                  </div>
                  <div className="bars-grid">
                    {grouped[region].map(b => (
                      <Card
                        key={b.id}
                        b={b}
                        visited={visited}
                        favorites={favorites}
                        onToggleVisit={handleToggleVisit}
                        onToggleFavorite={handleToggleFavorite}
                        expandedId={expandedId}
                        onToggleExpand={handleToggleExpand}
                        imgErr={imgErr}
                        onImgError={handleImgError}
                        T={T}
                        dark={dark}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>
        </>
      )}

      {/* FOOTER */}
      <footer style={{ background: T.footerBg, padding: "2.5rem 1.5rem", textAlign: "center" }}>
        <div className="footer-logo">
          <Logo size={50} />
        </div>
        <div className="footer-credit">
          <IgIcon color={BRAND.goldLt} />
          <span className="cookie-text" style={{ color: "#aaa" }}>
            Curadoria:{" "}
            <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.goldLt }}>
              @ParticipantesdiButeco
            </a>
          </span>
        </div>
        <p className="footer-text">Comida di Buteco 2026 · 26ª Edição · Belo Horizonte · 10 abr – 10 mai · Petiscos a R$ 40</p>
        <button onClick={() => setDark(prev => !prev)} className="footer-theme-toggle" style={{ color: dark ? BRAND.goldLt : "#ccc" }}>
          {dark ? <SunIcon /> : <MoonIcon />}
          {dark ? "Modo Claro" : "Modo Escuro"}
        </button>
      </footer>
    </div>
  );
}
