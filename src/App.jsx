import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import data from "./data/bares.json";
import logoImg from "./logo.png";
import "./App.css";

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

const BRAND = {
    navy: "#1C2D6E",
    navyDk: "#131f50",
    red: "#C0392B",
    gold: "#E8A820",
    goldLt: "#F4D03F",
    cream: "#F5EFE0",
    white: "#FFFFFF"
};

const THEMES = {
    light: {
        bg: "#F5EFE0",
        surface: "#FFFFFF",
        surfaceAlt: "#FAF7F0",
        border: "#E2D8C0",
        borderStrong: "#C8B890",
        text: "#1C1A14",
        textMuted: "#6B5F48",
        textFaint: "#9E9280",
        chipBg: "#F0EBE0",
        statBg: "rgba(255,255,255,0.13)",
        inputBg: "#FAF7F0",
        glassBg: "rgba(255,255,255,0.75)",
        glassBorder: "rgba(255,255,255,0.4)",
        headerBg: `linear-gradient(155deg, ${BRAND.navyDk} 0%, ${BRAND.navy} 60%, #1a2860 100%)`,
        filterBg: "#FFFFFF",
        filterBorder: "#E2D8C0",
        cardBg: "#FFFFFF",
        cardBorder: "#E2D8C0",
        bannerBg: `linear-gradient(90deg, ${BRAND.navyDk}, ${BRAND.navy})`,
        mapFooterBg: "#FAF7F0",
        footerBg: BRAND.navyDk
    },
    dark: {
        bg: "#0F1117",
        surface: "#1A1D26",
        surfaceAlt: "#21242F",
        border: "#2E3245",
        borderStrong: "#404666",
        text: "#EDE8DC",
        textMuted: "#9A94A8",
        textFaint: "#605A6E",
        chipBg: "#21242F",
        statBg: "rgba(255,255,255,0.07)",
        inputBg: "#21242F",
        glassBg: "rgba(26,29,38,0.85)",
        glassBorder: "rgba(255,255,255,0.08)",
        headerBg: `linear-gradient(155deg, #090C18 0%, #101428 60%, #0D1122 100%)`,
        filterBg: "#1A1D26",
        filterBorder: "#2E3245",
        cardBg: "#1A1D26",
        cardBorder: "#2E3245",
        bannerBg: `linear-gradient(90deg, #090C18, #101428)`,
        mapFooterBg: "#21242F",
        footerBg: "#090C18"
    }
};

const REGION_COLOR = data.regions;
const BARS = data.bars;
const REGIONS = ["Todas", ...Object.keys(REGION_COLOR)];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════════════════════

const normalizeText = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
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

// ═══════════════════════════════════════════════════════════════════════════════
// ÍCONES (componentes unificados)
// ═══════════════════════════════════════════════════════════════════════════════

const Icon = ({ type, active, color }) => {
    const icons = {
        heart: (
            <svg width="17" height="17" viewBox="0 0 24 24"
                fill={active ? BRAND.red : "none"}
                stroke={active ? BRAND.red : "#999"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        ),
        check: (
            <svg width="17" height="17" viewBox="0 0 24 24"
                fill={active ? "#27ae60" : "none"}
                stroke={active ? "#27ae60" : "#999"} strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        moon: (
            <svg width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        ),
        sun: (
            <svg width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
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
        ),
        ig: (
            <svg width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke={color || "currentColor"} strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
        )
    };
    return icons[type] || null;
};

const HeartIcon   = ({ f }) => <Icon type="heart" active={f} />;
const CheckCircle = ({ d }) => <Icon type="check" active={d} />;
const MoonIcon    = () => <Icon type="moon" />;
const SunIcon     = () => <Icon type="sun" />;
const IgIcon      = ({ color }) => <Icon type="ig" color={color} />;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTES SIMPLES
// ═══════════════════════════════════════════════════════════════════════════════

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

const MapComponent = lazy(() => import("./components/MapComponent"));

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE FILTER BUTTON (reutilizável)
// ═══════════════════════════════════════════════════════════════════════════════

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
// COMPONENTE CARD
// ═══════════════════════════════════════════════════════════════════════════════

const Card = ({
    b,
    visited,
    favorites,
    onToggleVisit,
    onToggleFavorite,
    expandedId,
    onToggleExpand,
    imgErr,
    onImgError,
    T,
    dark
}) => {
    const isV = visited.has(b.id);
    const isF = favorites.has(b.id);
    const isE = expandedId === b.id;
    const rc = REGION_COLOR[b.region] || "#555";
    const teamVisited = b.visited === true;
    const borderColor = isF ? BRAND.red : isV ? "#27ae60" : T.cardBorder;

    const handlers = {
        imgError: useCallback(() => onImgError(b.id), [b.id, onImgError]),
        visit:    useCallback(() => onToggleVisit(b.id), [b.id, onToggleVisit]),
        fav:      useCallback(() => onToggleFavorite(b.id), [b.id, onToggleFavorite]),
        expand:   useCallback(() => onToggleExpand(b.id), [b.id, onToggleExpand])
    };

    return (
        <article
            className="card"
            style={{
                background: T.cardBg,
                border: `2px solid ${borderColor}`,
                boxShadow: `0 2px 10px rgba(0,0,0,${dark ? "0.3" : "0.07"})`
            }}
        >
            {/* Barra de cor da região */}
            <div className="region-color-bar-top" style={{ background: rc }} />

            {/* Imagem do card */}
            <div
                className="card-image"
                style={{ background: rc + "18" }}
                onClick={handlers.expand}
            >
                {!imgErr.has(b.id) && b.photo ? (
                    <img
                        className="bi card-img"
                        src={b.photo}
                        alt={b.dish}
                        onError={handlers.imgError}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="card-img-fallback"
                        style={{ background: `linear-gradient(135deg,${rc}22,${rc}44)` }}
                    >
                        🍽️
                    </div>
                )}

                {b.champion && <div className="champion-badge">🏆 Ex-campeão</div>}
                {isV && <div className="visited-badge">✓ Visitado</div>}
                <div className="image-gradient" />
            </div>

            {/* Crédito da foto */}
            {b.photoCredit && (
                <div
                    className="photo-credit"
                    style={{
                        background: dark ? T.surfaceAlt : "#f5f0e8",
                        color: T.textFaint,
                        borderBottomColor: T.border
                    }}
                >
                    📷 {b.photoCredit}
                </div>
            )}

            {/* Conteúdo do card */}
            <div className="card-content">
                {/* Cabeçalho com nome e ações */}
                <div className="card-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 className="card-title" style={{ color: T.text }}>{b.name}</h3>
                        <div className="card-subtitle" style={{ color: T.textFaint }}>
                            {b.neighborhood} · <span style={{ color: rc, fontWeight: 600 }}>{b.region}</span>
                        </div>
                    </div>
                    <div className="card-actions">
                        <button
                            onClick={handlers.fav}
                            className="action-button"
                            title={isF ? "Remover favorito" : "Favoritar"}
                        >
                            <HeartIcon f={isF} />
                        </button>
                        <button
                            onClick={handlers.visit}
                            className="action-button"
                            title={isV ? "Desmarcar visitado" : "Marcar visitado"}
                        >
                            <CheckCircle d={isV} />
                        </button>
                    </div>
                </div>

                {/* Informações do time (visita, nota, temperatura) */}
                <div
                    className="info-bar"
                    style={{
                        background: T.glassBg,
                        border: `1px solid ${T.glassBorder}`
                    }}
                >
                    <div className="team-visit-status">
                        {teamVisited ? (
                            <>
                                <CheckCircle d={true} />
                                <span className="team-visit-text" style={{ color: "#16A085" }}>
                                    Time visitou
                                </span>
                            </>
                        ) : (
                            <span className="team-waiting-text" style={{ color: T.textFaint }}>
                                ⏳ Aguardando
                            </span>
                        )}
                    </div>

                    {b.rating !== undefined && b.rating !== null && (
                        <div className="rating-badge" style={{ background: BRAND.navy }}>
                            <span className="rating-star" style={{ color: BRAND.goldLt }}>⭐</span>
                            <span className="rating-value" style={{ color: "#fff" }}>
                                {b.rating.toFixed(1)}
                            </span>
                        </div>
                    )}

                    {b.beerTemp !== undefined && b.beerTemp !== null && (
                        <div
                            className="temp-badge"
                            style={{
                                background: getTempBg(b.beerTemp),
                                border: `1px solid ${getTempColor(b.beerTemp)}30`
                            }}
                        >
                            <span className="temp-icon" style={{ color: getTempColor(b.beerTemp) }}>
                                🌡️
                            </span>
                            <span className="temp-value" style={{ color: getTempColor(b.beerTemp) }}>
                                {b.beerTemp}°C
                            </span>
                            {b.beerTemp < -5 && (
                                <span style={{ fontSize: "0.58rem", marginLeft: "1px" }}>❄️</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Nome do petisco */}
                <div
                    className="petisco-container"
                    style={{
                        background: rc + "14",
                        border: `1px solid ${rc}25`
                    }}
                >
                    <div className="petisco-label" style={{ color: T.textFaint }}>Petisco</div>
                    <div className="petisco-name" style={{ color: rc }}>{b.dish}</div>
                </div>

                {/* Descrição */}
                <p className="description-text" style={{ color: T.textMuted }}>
                    {isE ? b.desc : b.desc.slice(0, 88) + (b.desc.length > 88 ? "…" : "")}
                </p>

                {/* Endereço (expandido) */}
                {isE && (
                    <div className="address-text" style={{ color: T.textFaint }}>
                        <span>📍</span>
                        <span>{b.address} – {b.neighborhood}, BH</span>
                    </div>
                )}

                {/* Botão expandir */}
                <button onClick={handlers.expand} className="expand-btn" style={{ color: rc }}>
                    {isE ? "Menos ↑" : "Mais ↓"}
                </button>
            </div>
        </article>
    );
};

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
