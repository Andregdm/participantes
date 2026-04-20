// ═══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL (ORQUESTRADOR)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import "./App.css";

// Importações dos módulos segmentados
import { BRAND, THEMES, BARS, REGIONS, REGION_COLOR } from "./components/constants";
import { normalizeText } from "./components/utils";
import { HeartIcon, CheckCircle, MoonIcon, SunIcon, IgIcon } from "./components/icons";
import { Card } from "./components/Card";
import logoImg from "./data/logo.png";

// Componente Logo (mantido aqui por usar logoImg)
const Logo = ({ size = 80 }) => (
    <img
        src={logoImg}
        alt="Logo"
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

// Lazy loading do mapa
const MapComponent = lazy(() => import("./components/MapComponent"));

// Componente FilterButton (reutilizável nos filtros)
const FilterButton = ({ active, onClick, icon, label, activeColor, activeBg, activeText, T }) => (
    <button
        onClick={onClick}
        className="filter-pill"
        style={{
            border: `2px solid ${active ? activeColor : T.border}`,
            background: active ? activeBg : T.surface,
            color: active ? activeText : T.textMuted,
        }}
    >
        {icon} {label}
    </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
    // =========================== ESTADOS ===========================
    const [dark, setDark] = useState(() => localStorage.getItem("cdb26theme") === "dark");

    const [visited, setVisited] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem("cdb26v") || "[]"));
        } catch {
            return new Set();
        }
    });

    const [favorites, setFavorites] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem("cdb26f") || "[]"));
        } catch {
            return new Set();
        }
    });

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

    // =========================== PERSISTÊNCIA ===========================
    useEffect(() => {
        localStorage.setItem("cdb26theme", dark ? "dark" : "light");
        document.body.classList[dark ? "add" : "remove"]("dark");
    }, [dark]);

    useEffect(() => {
        localStorage.setItem("cdb26v", JSON.stringify([...visited]));
    }, [visited]);

    useEffect(() => {
        localStorage.setItem("cdb26f", JSON.stringify([...favorites]));
    }, [favorites]);

    // =========================== PRÉ-PROCESSAMENTO ===========================
    const barsWithNormalized = useMemo(() => {
        return BARS.map(bar => ({
            ...bar,
            normalizedName: normalizeText(bar.name),
            normalizedDish: normalizeText(bar.dish),
            normalizedNeighborhood: normalizeText(bar.neighborhood),
        }));
    }, []);

    // =========================== FILTRAGEM E ORDENAÇÃO ===========================
    const filteredAndSorted = useMemo(() => {
        let result = barsWithNormalized.filter(b => {
            if (filters.onlyVisited && !visited.has(b.id)) return false;
            if (filters.onlyFavorites && !favorites.has(b.id)) return false;
            if (filters.region !== "Todas" && b.region !== filters.region) return false;
            if (filters.onlyTeam && !b.visited) return false;

            if (filters.search) {
                const q = normalizeText(filters.search);
                if (
                    !b.normalizedName.includes(q) &&
                    !b.normalizedDish.includes(q) &&
                    !b.normalizedNeighborhood.includes(q)
                ) {
                    return false;
                }
            }
            return true;
        });

        if (sortBy === "rating") {
            result.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
        }
        if (sortBy === "beerTemp") {
            result.sort((a, b) => (a.beerTemp ?? 999) - (b.beerTemp ?? 999));
        }

        return result;
    }, [barsWithNormalized, filters, visited, favorites, sortBy]);

    // =========================== AGRUPAMENTO ===========================
    const grouped = useMemo(() => {
        const g = {};
        filteredAndSorted.forEach(b => {
            (g[b.region] = g[b.region] || []).push(b);
        });
        return g;
    }, [filteredAndSorted]);

    // =========================== HANDLERS ===========================
    const toggleSet = (setter) => (id) => {
        setter(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    const handleToggleVisit    = useCallback(toggleSet(setVisited), []);
    const handleToggleFavorite = useCallback(toggleSet(setFavorites), []);
    const handleToggleExpand   = useCallback((id) => {
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

    const hasActiveFilters = (
        filters.onlyVisited ||
        filters.onlyFavorites ||
        filters.region !== "Todas" ||
        filters.search ||
        filters.onlyTeam ||
        sortBy !== "none"
    );

    // =========================== ESTATÍSTICAS ===========================
    const stats = useMemo(() => [
        { v: BARS.length, l: "Bares" },
        { v: visited.size, l: "Eu visitei" },
        { v: favorites.size, l: "Favoritos" }
    ], [visited.size, favorites.size]);

    // =========================== RENDER ===========================
    return (
        <div className="app-container" style={{ background: T.bg }}>
            {/* ========== HEADER ========== */}
            <header style={{ background: T.headerBg }}>
                {/* Barra do Instagram */}
                <div className="instagram-bar">
                    <IgIcon color={BRAND.goldLt} />
                    <span style={{ color: "#ccc" }}>
                        Curadoria realizada pelo perfil do Instagram
                    </span>
                    <a
                        href="https://www.instagram.com/ParticipantesdiButeco"
                        target="_blank"
                        style={{ color: BRAND.goldLt, fontWeight: 700 }}
                    >
                        @ParticipantesdiButeco
                    </a>
                    <span style={{ color: "#777" }}>
                        — siga para dicas e novidades!
                    </span>
                </div>

                {/* Conteúdo principal do header */}
                <div className="header-content">
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                        {/* Logo e título */}
                        <div className="header-logo-title">
                            <div
                                className="logo-container"
                                style={{
                                    border: `3px solid ${BRAND.gold}66`,
                                    boxShadow: `0 0 32px ${BRAND.gold}44, 0 8px 20px rgba(0,0,0,0.3)`
                                }}
                            >
                                <Logo size={85} />
                            </div>
                            <div>
                                <div className="header-title" style={{ color: BRAND.goldLt }}>
                                    Belo Horizonte · 10 Abr – 10 Mai 2026
                                </div>
                                <h1 className="main-title" style={{ color: "#fff" }}>
                                    Participantes di Buteco
                                </h1>
                                <div className="main-subtitle" style={{ color: "#9BBFCE" }}>
                                    Guia da 26ª Edição do Comida di Buteco ·
                                    <span style={{ color: BRAND.goldLt }}> "Somos Todos Verduras"</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats e toggle tema */}
                        <div className="header-stats">
                            {stats.map(s => (
                                <div key={s.l} className="stat-card" style={{ background: T.statBg }}>
                                    <div className="stat-value">{s.v}</div>
                                    <div className="stat-label">{s.l}</div>
                                </div>
                            ))}

                            <button
                                className="dm-toggle"
                                onClick={() => setDark(p => !p)}
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
                                    backdropFilter: "blur(8px)"
                                }}
                            >
                                {dark ? <SunIcon /> : <MoonIcon />}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
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

            {/* ========== CONTEÚDO PRINCIPAL ========== */}
            {tab === "mapa" ? (
                <Suspense fallback={<div className="loading-state" style={{ textAlign: "center", padding: "3rem" }}>Carregando mapa...</div>}>
                    <MapComponent T={T} dark={dark} BRAND={BRAND} Logo={Logo} IgIcon={IgIcon} />
                </Suspense>
            ) : (
                <>
                    {/* ===== FILTROS STICKY ===== */}
                    <div
                        className="sticky-filters"
                        style={{
                            background: T.filterBg,
                            borderBottom: `1px solid ${T.filterBorder}`,
                            boxShadow: `0 2px 12px rgba(0,0,0,${dark ? "0.4" : "0.07"})`
                        }}
                    >
                        <div className="sticky-filters-inner">
                            {/* Busca */}
                            <div className="search-wrapper">
                                <span className="search-icon" style={{ color: T.textFaint }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar (ex: coracao encontra coração)..."
                                    value={filters.search}
                                    onChange={e => handleFilterChange("search", e.target.value)}
                                    className="search-input"
                                    style={{
                                        border: `1.5px solid ${T.border}`,
                                        background: T.inputBg,
                                        color: T.text
                                    }}
                                />
                            </div>

                            {/* Selects (Região e Ordenação) */}
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
                                    {REGIONS.map(r => (
                                        <option key={r}>{r === "Todas" ? "📌 Regiões" : r}</option>
                                    ))}
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

                            {/* Botões de filtro */}
                            <div className="filters-group">
                                <FilterButton
                                    active={filters.onlyTeam}
                                    onClick={() => handleFilterChange("onlyTeam", !filters.onlyTeam)}
                                    icon={<CheckCircle d={filters.onlyTeam} />}
                                    label="Time visitou"
                                    activeColor="#27ae60"
                                    activeBg={dark ? "#0d2c1a" : "#eafaf1"}
                                    activeText="#1a5c30"
                                    T={T}
                                />
                                <FilterButton
                                    active={filters.onlyVisited}
                                    onClick={() => handleFilterChange("onlyVisited", !filters.onlyVisited)}
                                    icon={<CheckCircle d={filters.onlyVisited} />}
                                    label="Eu visitei"
                                    activeColor="#27ae60"
                                    activeBg={dark ? "#0d2c1a" : "#eafaf1"}
                                    activeText="#1a5c30"
                                    T={T}
                                />
                                <FilterButton
                                    active={filters.onlyFavorites}
                                    onClick={() => handleFilterChange("onlyFavorites", !filters.onlyFavorites)}
                                    icon={<HeartIcon f={filters.onlyFavorites} />}
                                    label="Favoritos"
                                    activeColor={BRAND.red}
                                    activeBg={dark ? "#2c0d0d" : "#fdf0ed"}
                                    activeText="#c0392b"
                                    T={T}
                                />
                            </div>

                            {/* Limpar filtros */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="filter-pill"
                                    style={{
                                        border: `1px solid ${T.border}`,
                                        background: T.surface,
                                        color: T.textMuted
                                    }}
                                >
                                    ✕ Limpar
                                </button>
                            )}

                            {/* Contador */}
                            <div className="filter-counter" style={{ color: T.textFaint }}>
                                {filteredAndSorted.length} / {BARS.length}
                            </div>
                        </div>
                    </div>

                    {/* ===== MAPA CTA BANNER ===== */}
                    <div className="max-width-1200 px-15 mt-2">
                        <div
                            onClick={() => setTab("mapa")}
                            className="map-cta"
                            style={{
                                background: T.bannerBg,
                                boxShadow: `0 2px 14px rgba(28,45,110,${dark ? "0.5" : "0.2"})`,
                                border: `1px solid ${BRAND.navy}55`
                            }}
                        >
                            <Logo size={38} />
                            <div>
                                <div className="cta-title" style={{ color: "#fff" }}>
                                    Ver Mapa Interativo dos Bares
                                </div>
                                <div className="cta-subtitle" style={{ color: BRAND.goldLt }}>
                                    Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco
                                </div>
                            </div>
                            <span className="cta-arrow" style={{ color: BRAND.goldLt }}>→</span>
                        </div>
                    </div>

                    {/* ===== GRID DE CARDS ===== */}
                    <main className="max-width-1200 px-15" style={{ margin: "0 auto", padding: "1.8rem 1.5rem 3.5rem" }}>
                        {filteredAndSorted.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <p style={{ color: T.textMuted }}>Nenhum bar encontrado com esses filtros.</p>
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
                            Object.keys(grouped).sort().map(region => (
                                <section key={region} className="section-margin">
                                    <div
                                        className="region-header"
                                        style={{ borderBottom: `2px solid ${REGION_COLOR[region]}30` }}
                                    >
                                        <div
                                            className="region-color-bar"
                                            style={{ background: REGION_COLOR[region] }}
                                        />
                                        <h2 className="region-title" style={{ color: REGION_COLOR[region] }}>
                                            {region}
                                        </h2>
                                        <span
                                            className="region-count"
                                            style={{
                                                background: REGION_COLOR[region] + "22",
                                                color: REGION_COLOR[region]
                                            }}
                                        >
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

            {/* ========== FOOTER ========== */}
            <footer style={{ background: T.footerBg, padding: "2.5rem 1.5rem", textAlign: "center" }}>
                <div className="footer-logo">
                    <Logo size={50} />
                </div>
                <div className="footer-credit">
                    <IgIcon color={BRAND.goldLt} />
                    <span style={{ fontFamily: "sans-serif", fontSize: "0.85rem", color: "#aaa" }}>
                        Curadoria:{" "}
                        <a
                            href="https://www.instagram.com/ParticipantesdiButeco"
                            target="_blank"
                            style={{ color: BRAND.goldLt, fontWeight: 700 }}
                        >
                            @ParticipantesdiButeco
                        </a>
                    </span>
                </div>
                <p className="footer-text">
                    Comida di Buteco 2026 · 26ª Edição · Belo Horizonte · 10 abr – 10 mai · Petiscos a R$ 40
                </p>
                <button
                    onClick={() => setDark(p => !p)}
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
