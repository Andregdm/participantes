import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import "./App.css";

import { BRAND, THEMES, BARS, REGIONS, REGION_COLOR } from "./components/constants";
import { normalizeText } from "./components/utils";
import { HeartIcon, CheckCircle, MoonIcon, SunIcon, IgIcon } from "./components/icons";
import { Card } from "./components/Card";
import Logo from "./components/Logo";

// Pré-processamento estático — BARS é imutável, não precisa de useMemo
const BARS_NORMALIZED = BARS.map(b => ({
  ...b,
  _name:         normalizeText(b.name),
  _dish:         normalizeText(b.dish),
  _neighborhood: normalizeText(b.neighborhood),
}));

// Lazy — carrega o iframe do mapa só quando a aba for acessada
const MapComponent = lazy(() => import("./components/MapComponent"));

// Botão de filtro reutilizável
const FilterButton = ({ active, onClick, icon, label, activeColor, activeBg, activeText, T }) => (
  <button
    onClick={onClick}
    className="filter-pill"
    style={{
      border:     `2px solid ${active ? activeColor : T.border}`,
      background: active ? activeBg  : T.surface,
      color:      active ? activeText : T.textMuted,
    }}
  >
    {icon} {label}
  </button>
);

// Estado inicial dos filtros — centralizado para facilitar reset
const FILTER_INIT = { onlyVisited: false, onlyFavorites: false, region: "Todas", search: "", onlyTeam: false };

// ─── Componente principal ─────────────────────────────────────────────────────
export default function App() {

  // ── Tema ──────────────────────────────────────────────────────────────────
  const [dark, setDark] = useState(() => localStorage.getItem("cdb26theme") === "dark");
  const T = dark ? THEMES.dark : THEMES.light;

  useEffect(() => {
    localStorage.setItem("cdb26theme", dark ? "dark" : "light");
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  // ── Persistência de listas ─────────────────────────────────────────────────
  const [visited, setVisited] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26v") || "[]")); }
    catch { return new Set(); }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26f") || "[]")); }
    catch { return new Set(); }
  });

  useEffect(() => { localStorage.setItem("cdb26v", JSON.stringify([...visited]));   }, [visited]);
  useEffect(() => { localStorage.setItem("cdb26f", JSON.stringify([...favorites])); }, [favorites]);

  // ── Filtros (objeto único → reset trivial) ────────────────────────────────
  const [filters, setFilters] = useState(FILTER_INIT);
  const [sortBy,  setSortBy]  = useState("none");

  // ── UI ─────────────────────────────────────────────────────────────────────
  const [expandedId, setExpandedId] = useState(null);
  const [tab,        setTab]        = useState("bares");
  const [imgErr,     setImgErr]     = useState(new Set());

  // ── Handlers estáveis ──────────────────────────────────────────────────────
  const toggleSet = useCallback((setter) => (id) => {
    setter(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }, []);

  const handleToggleVisit    = useCallback(toggleSet(setVisited),   [toggleSet]);
  const handleToggleFavorite = useCallback(toggleSet(setFavorites), [toggleSet]);
  const handleToggleExpand   = useCallback((id) => setExpandedId(p => p === id ? null : id), []);
  const handleImgError       = useCallback((id) => setImgErr(p => new Set([...p, id])), []);
  const handleFilterChange   = useCallback((key, val) => setFilters(p => ({ ...p, [key]: val })), []);
  const clearFilters         = useCallback(() => { setFilters(FILTER_INIT); setSortBy("none"); }, []);

  const hasActiveFilters =
    filters.onlyVisited || filters.onlyFavorites ||
    filters.region !== "Todas" || filters.search ||
    filters.onlyTeam || sortBy !== "none";

  // ── Filtragem e ordenação ──────────────────────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    const q = normalizeText(filters.search);

    const result = BARS_NORMALIZED.filter(b => {
      if (filters.onlyVisited   && !visited.has(b.id))   return false;
      if (filters.onlyFavorites && !favorites.has(b.id)) return false;
      if (filters.region !== "Todas" && b.region !== filters.region) return false;
      if (filters.onlyTeam && !b.visited) return false;
      if (q && !b._name.includes(q) && !b._dish.includes(q) && !b._neighborhood.includes(q)) return false;
      return true;
    });

    if (sortBy === "rating")   result.sort((a, b) => (b.rating   ?? -1)  - (a.rating   ?? -1));
    if (sortBy === "beerTemp") result.sort((a, b) => (a.beerTemp ?? 999) - (b.beerTemp ?? 999));
    return result;
  }, [filters, visited, favorites, sortBy]);

  // ── Agrupamento por região ─────────────────────────────────────────────────
  const grouped = useMemo(() =>
    filteredAndSorted.reduce((acc, b) => {
      (acc[b.region] ??= []).push(b);
      return acc;
    }, {}),
  [filteredAndSorted]);

  // Props comuns de Card — evita repetição nos dois grids
  const cardProps = { visited, favorites, onToggleVisit: handleToggleVisit, onToggleFavorite: handleToggleFavorite, expandedId, onToggleExpand: handleToggleExpand, imgErr, onImgError: handleImgError, T, dark };

  // ── Select styles (inline mínimo, o resto no CSS) ─────────────────────────
  const selectActive = (active) => ({
    border:     `1.5px solid ${active ? BRAND.navy : T.border}`,
    background: active ? (dark ? "#1a2040" : "#e8ecf8") : T.inputBg,
    color:      active ? BRAND.navy : T.textMuted,
    fontWeight: active ? 700 : 400,
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-container" style={{ background: T.bg }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header style={{ background: T.headerBg }}>

        {/* Barra Instagram */}
        <div className="instagram-bar">
          <IgIcon color={BRAND.goldLt}/>
          <span style={{ color: "#ccc" }}>Curadoria realizada pelo perfil do Instagram</span>
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer"
            style={{ color: BRAND.goldLt, fontWeight: 700 }}>
            @ParticipantesdiButeco
          </a>
          <span style={{ color: "#777" }}>— siga para dicas e novidades!</span>
        </div>

        <div className="header-content">
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>

            {/* Logo + título */}
            <div className="header-logo-title">
              <div className="logo-container"
                style={{ border: `3px solid ${BRAND.gold}66`, boxShadow: `0 0 32px ${BRAND.gold}44, 0 8px 20px rgba(0,0,0,0.3)` }}>
                <Logo size={85}/>
              </div>
              <div>
                <div className="header-title" style={{ color: BRAND.goldLt }}>
                  Belo Horizonte · 10 Abr – 10 Mai 2026
                </div>
                <h1 className="main-title" style={{ color: "#fff" }}>Participantes di Buteco</h1>
                <div className="main-subtitle" style={{ color: "#9BBFCE" }}>
                  Guia da 26ª Edição do Comida di Buteco ·
                  <span style={{ color: BRAND.goldLt }}> "Somos Todos Verduras"</span>
                </div>
              </div>
            </div>

            {/* Stats + toggle de tema */}
            <div className="header-stats">
              {[
                { v: BARS.length,     l: "Bares"     },
                { v: visited.size,    l: "Eu visitei" },
                { v: favorites.size,  l: "Favoritos"  },
              ].map(s => (
                <div key={s.l} className="stat-card" style={{ background: T.statBg }}>
                  <div className="stat-value">{s.v}</div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}

              <button
                className="dm-toggle"
                onClick={() => setDark(p => !p)}
                style={{
                  background:     dark ? "rgba(232,168,32,0.2)" : "rgba(255,255,255,0.12)",
                  border:         `2px solid ${dark ? BRAND.gold : "rgba(255,255,255,0.3)"}`,
                  borderRadius:   "50%",
                  width:          "42px",
                  height:         "42px",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  color:          dark ? BRAND.goldLt : "#fff",
                  backdropFilter: "blur(8px)",
                }}
              >
                {dark ? <SunIcon/> : <MoonIcon/>}
              </button>
            </div>
          </div>

          {/* Abas */}
          <div className="tabs-container">
            {[{ k: "bares", l: "🍺  Bares & Pratos" }, { k: "mapa", l: "🗺️  Mapa Interativo" }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} className="tab-button"
                style={{
                  borderBottom: `3px solid ${tab === t.k ? BRAND.goldLt : "transparent"}`,
                  color:        tab === t.k ? "#fff" : "rgba(255,255,255,0.45)",
                  fontWeight:   tab === t.k ? 700 : 400,
                }}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Aba Mapa ────────────────────────────────────────────────────── */}
      {tab === "mapa" && (
        <Suspense fallback={<div style={{ textAlign: "center", padding: "3rem", color: T.textMuted }}>Carregando mapa…</div>}>
          <MapComponent T={T} dark={dark}/>
        </Suspense>
      )}

      {/* ── Aba Bares ───────────────────────────────────────────────────── */}
      {tab === "bares" && (
        <>
          {/* Filtros sticky */}
          <div className="sticky-filters"
            style={{ background: T.filterBg, borderBottom: `1px solid ${T.filterBorder}`, boxShadow: `0 2px 12px rgba(0,0,0,${dark ? "0.4" : "0.07"})` }}>
            <div className="sticky-filters-inner">

              {/* Busca */}
              <div className="search-wrapper">
                <span className="search-icon" style={{ color: T.textFaint }}>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar bar, prato ou bairro…"
                  value={filters.search}
                  onChange={e => handleFilterChange("search", e.target.value)}
                  className="search-input"
                  style={{ border: `1.5px solid ${T.border}`, background: T.inputBg, color: T.text }}
                />
              </div>

              {/* Selects */}
              <div className="filters-group">
                <select
                  value={filters.region}
                  onChange={e => handleFilterChange("region", e.target.value)}
                  className="select-input"
                  style={selectActive(filters.region !== "Todas")}
                >
                  {REGIONS.map(r => <option key={r}>{r === "Todas" ? "📌 Regiões" : r}</option>)}
                </select>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="select-input"
                  style={selectActive(sortBy !== "none")}
                >
                  <option value="none">📋 Ordenar</option>
                  <option value="rating">⭐ Maior nota</option>
                  <option value="beerTemp">🌡️ Mais gelada</option>
                </select>
              </div>

              {/* Pills */}
              <div className="filters-group">
                <FilterButton active={filters.onlyTeam}      onClick={() => handleFilterChange("onlyTeam",      !filters.onlyTeam)}      icon={<CheckCircle d={filters.onlyTeam}/>}      label="Time visitou" activeColor="#27ae60" activeBg={dark ? "#0d2c1a" : "#eafaf1"} activeText="#1a5c30" T={T}/>
                <FilterButton active={filters.onlyVisited}   onClick={() => handleFilterChange("onlyVisited",   !filters.onlyVisited)}   icon={<CheckCircle d={filters.onlyVisited}/>}   label="Eu visitei"   activeColor="#27ae60" activeBg={dark ? "#0d2c1a" : "#eafaf1"} activeText="#1a5c30" T={T}/>
                <FilterButton active={filters.onlyFavorites} onClick={() => handleFilterChange("onlyFavorites", !filters.onlyFavorites)} icon={<HeartIcon   f={filters.onlyFavorites}/>}  label="Favoritos"    activeColor={BRAND.red} activeBg={dark ? "#2c0d0d" : "#fdf0ed"} activeText="#c0392b" T={T}/>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="filter-pill"
                  style={{ border: `1px solid ${T.border}`, background: T.surface, color: T.textMuted }}>
                  ✕ Limpar
                </button>
              )}

              <div className="filter-counter" style={{ color: T.textFaint }}>
                {filteredAndSorted.length} / {BARS.length}
              </div>
            </div>
          </div>

          {/* Banner CTA do mapa */}
          <div className="max-width-1200 px-15 mt-2">
            <div onClick={() => setTab("mapa")} className="map-cta"
              style={{ background: T.bannerBg, boxShadow: `0 2px 14px rgba(28,45,110,${dark ? "0.5" : "0.2"})`, border: `1px solid ${BRAND.navy}55` }}>
              <Logo size={38}/>
              <div>
                <div className="cta-title">Ver Mapa Interativo dos Bares</div>
                <div className="cta-subtitle" style={{ color: BRAND.goldLt }}>
                  Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco
                </div>
              </div>
              <span className="cta-arrow" style={{ color: BRAND.goldLt }}>→</span>
            </div>
          </div>

          {/* Grid */}
          <main className="max-width-1200 px-15" style={{ padding: "1.8rem 1.5rem 3.5rem" }}>
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
                {filteredAndSorted.map(b => <Card key={b.id} b={b} {...cardProps}/>)}
              </div>
            ) : (
              Object.keys(grouped).sort().map(region => (
                <section key={region} className="section-margin">
                  <div className="region-header" style={{ borderBottom: `2px solid ${REGION_COLOR[region]}30` }}>
                    <div className="region-color-bar" style={{ background: REGION_COLOR[region] }}/>
                    <h2 className="region-title" style={{ color: REGION_COLOR[region] }}>{region}</h2>
                    <span className="region-count" style={{ background: REGION_COLOR[region] + "22", color: REGION_COLOR[region] }}>
                      {grouped[region].length} bares
                    </span>
                  </div>
                  <div className="bars-grid">
                    {grouped[region].map(b => <Card key={b.id} b={b} {...cardProps}/>)}
                  </div>
                </section>
              ))
            )}
          </main>
        </>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ background: T.footerBg, padding: "2.5rem 1.5rem", textAlign: "center" }}>
        <div className="footer-logo"><Logo size={50}/></div>
        <div className="footer-credit">
          <IgIcon color={BRAND.goldLt}/>
          <span className="cookie-text" style={{ color: "#aaa" }}>
            Curadoria:{" "}
            <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer"
              style={{ color: BRAND.goldLt, fontWeight: 700 }}>
              @ParticipantesdiButeco
            </a>
          </span>
        </div>
        <p className="footer-text">
          Comida di Buteco 2026 · 26ª Edição · Belo Horizonte · 10 abr – 10 mai · Petiscos a R$ 40
        </p>
        <button onClick={() => setDark(p => !p)} className="footer-theme-toggle" style={{ color: dark ? BRAND.goldLt : "#ccc" }}>
          {dark ? <SunIcon/> : <MoonIcon/>}
          {dark ? "Modo Claro" : "Modo Escuro"}
        </button>
      </footer>
    </div>
  );
}
