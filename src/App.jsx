import { useState, useMemo, useEffect } from "react";
import data from "./data/bares.json";
import logoImg from "./data/logo.png";
import "./App.css";

// ─── Dados globais ────────────────────────────────────────────────────────────
const REGION_COLOR = data.regions;
const BARS = data.bars;
const REGIONS = ["Todas", ...Object.keys(REGION_COLOR)];

// ─── Paleta da marca (usada para cores dinâmicas) ─────────────────────────────
const BRAND = {
  navy: "#1C2D6E",
  navyDk: "#131f50",
  red: "#C0392B",
  gold: "#E8A820",
  goldLt: "#F4D03F",
  cream: "#F5EFE0",
  white: "#FFFFFF",
};

// ─── Função para normalizar textos (remover acentos) ─────────────────────────
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
};

// ─── Helpers de temperatura de cerveja ───────────────────────────────────────
const TEMP_SCALE = [
  { max: -5, color: "#2980B9", bg: "rgba(52,152,219,0.15)", label: "❄️ Muito gelada" },
  { max: -3, color: "#3498DB", bg: "rgba(52,152,219,0.12)", label: "🌡️ Bem gelada" },
  { max: 1, color: "#27AE60", bg: "rgba(46,204,113,0.15)", label: "🌡️ Ideal" },
  { max: 3, color: "#F39C12", bg: "rgba(243,156,18,0.15)", label: "🌡️ Pouco gelada" },
  { max: 6, color: "#E67E22", bg: "rgba(230,126,34,0.15)", label: "🌡️ Quente" },
  { max: Infinity, color: "#C0392B", bg: "rgba(231,76,60,0.15)", label: "🔥 Muito quente" },
];
const getTempStyle = (t) => TEMP_SCALE.find(s => t < s.max) ?? TEMP_SCALE[TEMP_SCALE.length - 1];

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const ls = {
  get: (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  },
};
const initSet = (key) => new Set(ls.get(key, []));
const toggleId = (set, id) => {
  const s = new Set(set);
  s.has(id) ? s.delete(id) : s.add(id);
  return s;
};

// ─── Ícones SVG ───────────────────────────────────────────────────────────────
const IgIcon = ({ color = "currentColor" }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const HeartIcon = ({ active }) => (
  <svg width="17" height="17" viewBox="0 0 24 24"
    fill={active ? BRAND.red : "none"} stroke={active ? BRAND.red : "#999"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CheckIcon = ({ active }) => (
  <svg width="17" height="17" viewBox="0 0 24 24"
    fill={active ? "#27ae60" : "none"} stroke={active ? "#27ae60" : "#999"} strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

// ─── Componente Logo ──────────────────────────────────────────────────────────
const Logo = ({ size = 80 }) => (
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

// ─── Sub-componente: Stat card do header ──────────────────────────────────────
const StatCard = ({ value, label }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

// ─── Sub-componente: Cabeçalho de seção regional ──────────────────────────────
const RegionHeader = ({ region, count }) => {
  const color = REGION_COLOR[region];
  return (
    <div className="region-header" style={{ borderBottom: `2px solid ${color}30` }}>
      <div className="region-color-bar" style={{ background: color }} />
      <h2 className="region-title" style={{ color }}>{region}</h2>
      <span className="region-count" style={{ background: color + "22", color }}>
        {count} bares
      </span>
    </div>
  );
};

// ─── Sub-componente: Aba do mapa ──────────────────────────────────────────────
const MapTab = () => (
  <div className="map-container">
    <div className="map-card">
      <div className="map-header">
        <Logo size={45} />
        <div>
          <div className="map-title">Mapa Personalizado — Comida di Buteco 2026 BH</div>
          <div className="map-subtitle">Todos os bares participantes marcados · Curadoria @ParticipantesdiButeco</div>
        </div>
      </div>
      <div className="map-iframe-wrapper">
        <iframe
          className="map-iframe"
          src="https://www.google.com/maps/d/u/0/embed?mid=1NKgMtDTJSU2KAuiadQub73yXZ4nEJLU&ehbc=2E312F&noprof=1"
          title="Mapa Comida di Buteco 2026 BH"
          allowFullScreen
        />
      </div>
      <div className="map-footer">
        <IgIcon color={BRAND.navy} />
        <span className="map-footer-text">
          Mapa criado por{" "}
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" className="map-footer-link">
            @ParticipantesdiButeco
          </a>{" "}· Siga para atualizações e dicas do concurso
        </span>
      </div>
    </div>
  </div>
);

// ─── Sub-componente: Barra de filtros sticky ──────────────────────────────────
const FilterBar = ({ q, setQ, fr, setFr, sortBy, setSortBy, onlyTeam, setOnlyTeam, fv, setFv, ff, setFf, total, shown, onClear }) => {
  const hasFilters = fv || ff || fr !== "Todas" || q || onlyTeam || sortBy !== "none";

  const getSelectStyle = (active) => active ? "select-input select-active" : "select-input";

  return (
    <div className="filter-bar">
      <div className="filter-container">
        {/* Busca */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar (ex: coracao encontra coração)..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        {/* Selects */}
        <div className="selects-container">
          <select 
            value={fr} 
            onChange={e => setFr(e.target.value)} 
            className={getSelectStyle(fr !== "Todas")}
          >
            {REGIONS.map(r => <option key={r}>{r === "Todas" ? "📌 Regiões" : r}</option>)}
          </select>
          
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)} 
            className={getSelectStyle(sortBy !== "none")}
          >
            <option value="none">📋 Ordenar</option>
            <option value="rating">⭐ Maior nota</option>
            <option value="beerTemp">🌡️ Mais gelada</option>
          </select>
        </div>

        {/* Pills */}
        <div className="pills-container">
          <button 
            onClick={() => setOnlyTeam(v => !v)} 
            className={`filter-pill ${onlyTeam ? 'pill-active pill-team' : ''}`}
          >
            <CheckIcon active={onlyTeam} /> Time visitou
          </button>
          
          <button 
            onClick={() => setFv(v => !v)} 
            className={`filter-pill ${fv ? 'pill-active pill-visited' : ''}`}
          >
            <CheckIcon active={fv} /> Eu visitei
          </button>
          
          <button 
            onClick={() => setFf(v => !v)} 
            className={`filter-pill ${ff ? 'pill-active pill-favorite' : ''}`}
          >
            <HeartIcon active={ff} /> Favoritos
          </button>
        </div>

        {hasFilters && (
          <button onClick={onClear} className="filter-pill clear-pill">
            ✕ Limpar
          </button>
        )}

        <span className="filter-counter">
          {shown} / {total}
        </span>
      </div>
    </div>
  );
};

// ─── Sub-componente: Card de bar ──────────────────────────────────────────────
function Card({ b, isV, isF, isE, onToggleVisited, onToggleFav, onToggleExpand, hasImgErr, onImgErr }) {
  const rc = REGION_COLOR[b.region] || "#555";
  const tmp = b.beerTemp != null ? getTempStyle(b.beerTemp) : null;

  return (
    <article className={`card-container ${isF ? 'card-favorite' : isV ? 'card-visited' : ''}`}>
      <div className="region-strip" style={{ background: rc }} />

      {/* Foto */}
      <div className="photo-container" onClick={onToggleExpand}>
        {!hasImgErr && b.photo ? (
          <img className="bi" src={b.photo} alt={b.dish} onError={onImgErr} />
        ) : (
          <div className="photo-fallback" style={{ background: `linear-gradient(135deg,${rc}22,${rc}44)` }}>
            🍽️
          </div>
        )}
        {b.champion && <div className="champion-badge">🏆 Ex-campeão</div>}
        {isV && <div className="visited-badge">✓ Visitado</div>}
        <div className="photo-gradient" />
      </div>

      {/* Crédito da foto */}
      {b.photoCredit && (
        <div className="photo-credit">
          📷 {b.photoCredit}
        </div>
      )}

      {/* Conteúdo */}
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-wrapper">
            <h3 className="card-title">{b.name}</h3>
            <div className="card-subtitle">
              {b.neighborhood} · <span style={{ color: rc, fontWeight: 600 }}>{b.region}</span>
            </div>
          </div>
          <div className="card-actions">
            <button onClick={onToggleFav} className="action-button" title={isF ? "Remover favorito" : "Favoritar"}>
              <HeartIcon active={isF} />
            </button>
            <button onClick={onToggleVisited} className="action-button" title={isV ? "Desmarcar visitado" : "Marcar visitado"}>
              <CheckIcon active={isV} />
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div className="info-bar">
          <div className="team-status">
            {b.visited ? (
              <>
                <CheckIcon active={true} />
                <span className="team-status-text">Time visitou</span>
              </>
            ) : (
              <span className="team-status-waiting">⏳ Aguardando</span>
            )}
          </div>
          
          {b.rating != null && (
            <div className="rating-badge">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{b.rating.toFixed(1)}</span>
            </div>
          )}
          
          {tmp && (
            <div className="temp-badge" style={{ background: tmp.bg, border: `1px solid ${tmp.color}30` }}>
              <span className="temp-icon" style={{ color: tmp.color }}>🌡️</span>
              <span className="temp-value" style={{ color: tmp.color }}>{b.beerTemp}°C</span>
              {b.beerTemp < -5 && <span style={{ fontSize: "0.58rem", marginLeft: "1px" }}>❄️</span>}
            </div>
          )}
        </div>

        {/* Petisco */}
        <div className="petisco-container" style={{ background: rc + "14", border: `1px solid ${rc}25` }}>
          <div className="petisco-label">Petisco</div>
          <div className="petisco-name" style={{ color: rc }}>{b.dish}</div>
        </div>

        {/* Descrição */}
        <p className="card-description">
          {isE ? b.desc : `${b.desc.slice(0, 88)}${b.desc.length > 88 ? "…" : ""}`}
        </p>
        
        {isE && (
          <div className="card-address">
            <span>📍</span><span>{b.address} – {b.neighborhood}, BH</span>
          </div>
        )}

        <button onClick={onToggleExpand} className="expand-btn" style={{ color: rc }}>
          {isE ? "Menos ↑" : "Mais ↓"}
        </button>
      </div>
    </article>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function App() {
  // Persistência de estado
  const [dark, setDark] = useState(() => ls.get("cdb26theme", null) === "dark");
  const [visited, setVisited] = useState(() => initSet("cdb26v"));
  const [favorites, setFavorites] = useState(() => initSet("cdb26f"));

  useEffect(() => ls.set("cdb26theme", dark ? "dark" : "light"), [dark]);
  useEffect(() => ls.set("cdb26v", [...visited]), [visited]);
  useEffect(() => ls.set("cdb26f", [...favorites]), [favorites]);

  // Aplica classe dark no body para estilos CSS
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  // Filtros
  const [fv, setFv] = useState(false);
  const [ff, setFf] = useState(false);
  const [fr, setFr] = useState("Todas");
  const [q, setQ] = useState("");
  const [onlyTeam, setOnlyTeam] = useState(false);
  const [sortBy, setSortBy] = useState("none");

  // UI
  const [tab, setTab] = useState("bares");
  const [exp, setExp] = useState(null);
  const [imgErr, setImgErr] = useState(new Set());

  // Pré-cálculo dos textos normalizados para busca
  const barsWithNormalized = useMemo(() => {
    return BARS.map(bar => ({
      ...bar,
      normalizedName: normalizeText(bar.name),
      normalizedDish: normalizeText(bar.dish),
      normalizedNeighborhood: normalizeText(bar.neighborhood),
    }));
  }, []);

  const toggleVisited = (id) => setVisited(s => toggleId(s, id));
  const toggleFavorite = (id) => setFavorites(s => toggleId(s, id));
  const toggleExp = (id) => setExp(prev => prev === id ? null : id);
  const clearFilters = () => { setFv(false); setFf(false); setFr("Todas"); setQ(""); setOnlyTeam(false); setSortBy("none"); };

  // Filtragem + ordenação
  const filteredAndSorted = useMemo(() => {
    const result = barsWithNormalized.filter(b => {
      if (fv && !visited.has(b.id)) return false;
      if (ff && !favorites.has(b.id)) return false;
      if (fr !== "Todas" && b.region !== fr) return false;
      if (onlyTeam && !b.visited) return false;
      if (q) {
        const normalizedQuery = normalizeText(q);
        return b.normalizedName.includes(normalizedQuery) ||
               b.normalizedDish.includes(normalizedQuery) ||
               b.normalizedNeighborhood.includes(normalizedQuery);
      }
      return true;
    });
    if (sortBy === "rating") return [...result].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    if (sortBy === "beerTemp") return [...result].sort((a, b) => (a.beerTemp ?? 999) - (b.beerTemp ?? 999));
    return result;
  }, [fv, ff, fr, q, visited, favorites, onlyTeam, sortBy, barsWithNormalized]);

  // Agrupamento por região
  const grouped = useMemo(() => {
    return filteredAndSorted.reduce((acc, b) => {
      (acc[b.region] ??= []).push(b);
      return acc;
    }, {});
  }, [filteredAndSorted]);
  const regionKeys = Object.keys(grouped).sort();

  // Grid de cards
  const renderGrid = (bars) => (
    <div className="cards-grid">
      {bars.map(b => (
        <Card
          key={b.id} b={b}
          isV={visited.has(b.id)} isF={favorites.has(b.id)} isE={exp === b.id}
          hasImgErr={imgErr.has(b.id)}
          onToggleVisited={() => toggleVisited(b.id)}
          onToggleFav={() => toggleFavorite(b.id)}
          onToggleExpand={() => toggleExp(b.id)}
          onImgErr={() => setImgErr(s => new Set([...s, b.id]))}
        />
      ))}
    </div>
  );

  return (
    <div className="app">
      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="app-header">
        {/* Barra Instagram */}
        <div className="instagram-bar">
          <IgIcon color={BRAND.goldLt} />
          <span>Curadoria realizada pelo perfil do Instagram</span>
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" className="instagram-link">
            @ParticipantesdiButeco
          </a>
          <span>— siga para dicas e novidades!</span>
        </div>

        <div className="header-container">
          <div className="logo-title-container">
            <div className="logo-container">
              <Logo size={85} />
            </div>
            <div>
              <div className="header-badge">Belo Horizonte · 10 Abr – 10 Mai 2026</div>
              <h1 className="header-title">Participantes di Buteco</h1>
              <div className="header-subtitle">
                Guia da 26ª Edição do Comida di Buteco · <span className="header-subtitle-highlight">"Somos Todos Verduras"</span>
              </div>
            </div>
          </div>

          <div className="stats-container">
            {[{ v: BARS.length, l: "Bares" }, { v: visited.size, l: "Eu visitei" }, { v: favorites.size, l: "Favoritos" }].map(s => (
              <StatCard key={s.l} value={s.v} label={s.l} />
            ))}
            
            <button
              onClick={() => setDark(d => !d)}
              className="dark-mode-toggle"
              title={dark ? "Modo claro" : "Modo escuro"}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="tabs-container">
          {[{ k: "bares", l: "🍺  Bares & Pratos" }, { k: "mapa", l: "🗺️  Mapa Interativo" }].map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`tab-button ${tab === t.k ? 'tab-button-active' : 'tab-button-inactive'}`}
            >
              {t.l}
            </button>
          ))}
        </div>
      </header>

      {/* ══ ABA MAPA ════════════════════════════════════════════════════════ */}
      {tab === "mapa" && <MapTab />}

      {/* ══ ABA BARES ═══════════════════════════════════════════════════════ */}
      {tab === "bares" && (
        <>
          <FilterBar
            q={q} setQ={setQ} fr={fr} setFr={setFr}
            sortBy={sortBy} setSortBy={setSortBy}
            onlyTeam={onlyTeam} setOnlyTeam={setOnlyTeam}
            fv={fv} setFv={setFv} ff={ff} setFf={setFf}
            total={BARS.length} shown={filteredAndSorted.length}
            onClear={clearFilters}
          />

          {/* Banner CTA do mapa */}
          <div className="map-cta-container">
            <div onClick={() => setTab("mapa")} className="map-cta-banner">
              <Logo size={38} />
              <div>
                <div className="map-cta-title">Ver Mapa Interativo dos Bares</div>
                <div className="map-cta-subtitle">
                  Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco
                </div>
              </div>
              <span className="map-cta-arrow">→</span>
            </div>
          </div>

          <main className="main-container">
            {filteredAndSorted.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p className="empty-text">Nenhum bar encontrado com esses filtros.</p>
                <button onClick={clearFilters} className="empty-button">
                  Limpar filtros
                </button>
              </div>
            ) : sortBy !== "none" ? (
              renderGrid(filteredAndSorted)
            ) : (
              regionKeys.map(region => (
                <section key={region} className="region-section">
                  <RegionHeader region={region} count={grouped[region].length} />
                  {renderGrid(grouped[region])}
                </section>
              ))
            )}
          </main>
        </>
      )}

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="app-footer">
        <div className="footer-logo">
          <Logo size={50} />
        </div>
        <div className="footer-credit">
          <IgIcon color={BRAND.goldLt} />
          <span className="footer-credit-text">
            Curadoria:{" "}
            <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" className="footer-credit-link">
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
          {dark ? <SunIcon /> : <MoonIcon />} {dark ? "Modo Claro" : "Modo Escuro"}
        </button>
      </footer>
    </div>
  );
}
