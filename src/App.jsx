import { useState, useMemo, useEffect } from "react";
import data from "./data/bares.json";

const REGION_COLOR = data.regions;
const BARS = data.bars;
const REGIONS = ["Todas", ...Object.keys(REGION_COLOR)];

function HeartIcon({ f }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={f ? "#e74c3c" : "none"} stroke={f ? "#e74c3c" : "#bbb"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CheckCircle({ d }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={d ? "#27ae60" : "none"} stroke={d ? "#27ae60" : "#bbb"} strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function ThermometerIcon({ temp }) {
  const getColor = () => {
    if (temp === null) return "#aaa";
    if (temp < -5) return "#1a5276";
    if (temp < -3) return "#2980b9";
    if (temp >= -3 && temp <= 1) return "#2ecc71";
    if (temp > 1 && temp <= 3) return "#f1c40f";
    return "#e74c3c";
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={getColor()} strokeWidth="2.5">
      <path d="M12 9v8m-4-8a4 4 0 1 1 8 0m-4-6v2m-2 4a4 4 0 1 0 4 0"/>
    </svg>
  );
}

export default function App() {
  const [visited, setVisited] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26v") || "[]")) } catch { return new Set() }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("cdb26f") || "[]")) } catch { return new Set() }
  });
  const [fv, setFv] = useState(false);
  const [ff, setFf] = useState(false);
  const [fr, setFr] = useState("Todas");
  const [q, setQ] = useState("");
  const [exp, setExp] = useState(null);
  const [tab, setTab] = useState("bares");
  const [imgErr, setImgErr] = useState(new Set());
  
  const [onlyVisitedByTeam, setOnlyVisitedByTeam] = useState(false);
  const [sortBy, setSortBy] = useState("none");

  useEffect(() => { try { localStorage.setItem("cdb26v", JSON.stringify([...visited])) } catch {} }, [visited]);
  useEffect(() => { try { localStorage.setItem("cdb26f", JSON.stringify([...favorites])) } catch {} }, [favorites]);

  const tv = (id) => setVisited(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const tf = (id) => setFavorites(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filteredAndSorted = useMemo(() => {
    let result = BARS.filter(b => {
      if (fv && !visited.has(b.id)) return false;
      if (ff && !favorites.has(b.id)) return false;
      if (fr !== "Todas" && b.region !== fr) return false;
      if (onlyVisitedByTeam && !b.visited) return false;
      if (q) {
        const lq = q.toLowerCase();
        if (!b.name.toLowerCase().includes(lq) && !b.dish.toLowerCase().includes(lq) && !b.neighborhood.toLowerCase().includes(lq)) return false;
      }
      return true;
    });
    
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => {
        const ratingA = a.rating !== null ? a.rating : -1;
        const ratingB = b.rating !== null ? b.rating : -1;
        return ratingB - ratingA;
      });
    } else if (sortBy === "beerTemp") {
      result = [...result].sort((a, b) => {
        const tempA = a.beerTemp !== null ? a.beerTemp : 999;
        const tempB = b.beerTemp !== null ? b.beerTemp : 999;
        return tempA - tempB;
      });
    }
    
    return result;
  }, [fv, ff, fr, q, visited, favorites, onlyVisitedByTeam, sortBy]);

  const grouped = useMemo(() => {
    const g = {};
    filteredAndSorted.forEach(b => { (g[b.region] = g[b.region] || []).push(b) });
    return g;
  }, [filteredAndSorted]);
  const regionKeys = Object.keys(grouped).sort();

  return (
    <div style={{ fontFamily: "Georgia,serif", background: "#f7f4ee", minHeight: "100vh" }}>
      <style>{`
        *{box-sizing:border-box}
        .bc{transition:box-shadow .2s,transform .2s}
        .bc:hover{box-shadow:0 8px 28px rgba(0,0,0,0.13)!important;transform:translateY(-2px)}
        .bi{transition:transform .4s}
        .bc:hover .bi{transform:scale(1.05)}
        button{cursor:pointer}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#c5b899;border-radius:3px}
      `}</style>

      {/* HEADER */}
      <header style={{ background: "linear-gradient(155deg,#152b1c 0%,#1e4030 50%,#162a1e 100%)" }}>
        <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.5rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.78rem", fontFamily: "sans-serif", flexWrap: "wrap", textAlign: "center" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f4d03f" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span style={{ color: "#ccc" }}>Curadoria realizada pelo perfil do Instagram</span>
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: "#f4d03f", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>@ParticipantesdiButeco</a>
          <span style={{ color: "#888" }}>— siga para dicas e novidades do concurso!</span>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.2rem 1.5rem 0" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "0.68rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#80c994", marginBottom: "0.4rem" }}>Belo Horizonte · 10 Abr – 10 Mai 2026</div>
              <h1 style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", fontWeight: 700, margin: "0 0 0.2rem", lineHeight: 1.05, color: "#fff", letterSpacing: "-0.01em" }}>Comida di Buteco</h1>
              <div style={{ fontSize: "1rem", fontStyle: "italic", color: "#b0d8bc", fontWeight: 300, marginBottom: "0.8rem" }}>26ª Edição · "Somos Todos Verduras"</div>
              <p style={{ fontSize: "0.82rem", color: "#8ec9a0", margin: 0, maxWidth: "460px", lineHeight: 1.65, fontFamily: "sans-serif" }}>
                128 bares em disputa pelo melhor petisco de BH · Petiscos a R$ 40 · Couve, ora-pro-nóbis e taioba como protagonistas
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.7rem", flexShrink: 0 }}>
              {[{ v: BARS.length, l: "Bares" }, { v: visited.size, l: "Visitados" }, { v: favorites.size, l: "Favoritos" }].map(s => (
                <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.8rem 1rem", textAlign: "center", minWidth: "72px", backdropFilter: "blur(6px)" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: "0.65rem", fontFamily: "sans-serif", color: "#80c994", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", marginTop: "1.5rem" }}>
            {[{ k: "bares", l: "🍺  Bares & Pratos" }, { k: "mapa", l: "🗺️  Mapa Interativo" }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{ background: "none", border: "none", borderBottom: `3px solid ${tab === t.k ? "#f4d03f" : "transparent"}`, color: tab === t.k ? "#fff" : "rgba(255,255,255,0.5)", padding: "0.8rem 1.3rem", fontSize: "0.88rem", fontWeight: tab === t.k ? 700 : 400, fontFamily: "sans-serif", transition: "all .15s", letterSpacing: "0.01em" }}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAP TAB */}
      {tab === "mapa" && (
        <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
          <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: "1px solid #e8e0d0" }}>
            <div style={{ background: "linear-gradient(90deg,#152b1c,#1e4030)", padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.3rem" }}>🗺️</span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontFamily: "sans-serif", fontSize: "1rem" }}>Mapa Personalizado — Comida di Buteco 2026 BH</div>
                <div style={{ color: "#80c994", fontSize: "0.73rem", fontFamily: "sans-serif" }}>Todos os bares participantes marcados · Curadoria @ParticipantesdiButeco</div>
              </div>
            </div>
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#f0ebe0" }}>
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=1NKgMtDTJSU2KAuiadQub73yXZ4nEJLU&ehbc=2E312F&noprof=1"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                title="Mapa Comida di Buteco 2026 BH"
                allowFullScreen
              />
            </div>
            <div style={{ padding: "0.85rem 1.5rem", background: "#f9f6f0", borderTop: "1px solid #e8e0d0", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a472a" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <span style={{ fontSize: "0.78rem", color: "#666", fontFamily: "sans-serif" }}>
                Mapa criado por <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: "#1a472a", fontWeight: 700, textDecoration: "none" }}>@ParticipantesdiButeco</a> · Siga para atualizações e dicas do concurso
              </span>
            </div>
          </div>
        </div>
      )}

      {/* BARS TAB */}
      {tab === "bares" && (
        <>
          {/* Sticky filters */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e8e0d0", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.8rem 1.5rem", display: "flex", gap: "0.55rem", alignItems: "center", flexWrap: "wrap" }}>
              
              {/* Busca */}
              <div style={{ flex: "2 1 200px", position: "relative" }}>
                <span style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#aaa" }}>🔍</span>
                <input type="text" placeholder="Bar, prato ou bairro..." value={q} onChange={e => setQ(e.target.value)}
                  style={{ width: "100%", padding: "0.48rem 0.75rem 0.48rem 1.9rem", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "0.83rem", background: "#faf8f3", color: "#333", outline: "none" }}/>
              </div>
              
              {/* Regiões e Ordenação lado a lado */}
              <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
                <select value={fr} onChange={e => setFr(e.target.value)}
                  style={{ padding: "0.48rem 0.7rem", border: "1.5px solid #ddd", borderRadius: "8px", background: fr !== "Todas" ? "#eafaf1" : "#faf8f3", fontSize: "0.83rem", color: fr !== "Todas" ? "#1a472a" : "#555", outline: "none", fontWeight: fr !== "Todas" ? 700 : 400 }}>
                  {REGIONS.map(r => <option key={r}>{r === "Todas" ? "📌 Regiões" : r}</option>)}
                </select>
                
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ padding: "0.48rem 0.7rem", border: "1.5px solid #ddd", borderRadius: "8px", background: sortBy !== "none" ? "#e8f4f8" : "#faf8f3", fontSize: "0.83rem", color: sortBy !== "none" ? "#1a5276" : "#555", outline: "none", fontWeight: sortBy !== "none" ? 700 : 400 }}>
                  <option value="none">📋 Ordenar por</option>
                  <option value="rating">⭐ Maior nota</option>
                  <option value="beerTemp">🌡️ Mais gelada</option>
                </select>
              </div>
              
              {/* Botões de filtro lado a lado */}
              <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
                <button onClick={() => setOnlyVisitedByTeam(v => !v)} style={{ 
                  padding: "0.45rem 0.9rem", 
                  borderRadius: "20px", 
                  border: `2px solid ${onlyVisitedByTeam ? "#27ae60" : "#ddd"}`, 
                  background: onlyVisitedByTeam ? "#eafaf1" : "#fff", 
                  color: onlyVisitedByTeam ? "#1a5c30" : "#666", 
                  fontSize: "0.8rem", 
                  fontWeight: 600, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px", 
                  fontFamily: "sans-serif" 
                }}>
                  <CheckCircle d={onlyVisitedByTeam} /> Time visitou
                </button>
                
                <button onClick={() => setFv(v => !v)} style={{ padding: "0.45rem 0.9rem", borderRadius: "20px", border: `2px solid ${fv ? "#27ae60" : "#ddd"}`, background: fv ? "#eafaf1" : "#fff", color: fv ? "#1a5c30" : "#666", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", fontFamily: "sans-serif" }}>
                  <CheckCircle d={fv} /> Visitados
                </button>
                
                <button onClick={() => setFf(v => !v)} style={{ padding: "0.45rem 0.9rem", borderRadius: "20px", border: `2px solid ${ff ? "#e74c3c" : "#ddd"}`, background: ff ? "#fdf0ed" : "#fff", color: ff ? "#c0392b" : "#666", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", fontFamily: "sans-serif" }}>
                  <HeartIcon f={ff} /> Favoritos
                </button>
              </div>
              
              {/* Limpar filtros */}
              {(fv || ff || fr !== "Todas" || q || onlyVisitedByTeam || sortBy !== "none") && (
                <button onClick={() => { setFv(false); setFf(false); setFr("Todas"); setQ(""); setOnlyVisitedByTeam(false); setSortBy("none"); }} style={{ padding: "0.45rem 0.85rem", borderRadius: "20px", border: "1px solid #ccc", background: "#fff", color: "#888", fontSize: "0.78rem", fontFamily: "sans-serif" }}>✕ Limpar</button>
              )}
              
              {/* Contador */}
              <div style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#aaa", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{filteredAndSorted.length} / {BARS.length}</div>
            </div>
          </div>

          <div style={{ maxWidth: "1200px", margin: "1.5rem auto 0", padding: "0 1.5rem" }}>
            <div onClick={() => setTab("mapa")} style={{ background: "linear-gradient(90deg,#152b1c,#1e4030)", borderRadius: "12px", padding: "0.85rem 1.4rem", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", boxShadow: "0 2px 12px rgba(20,60,32,0.2)" }}>
              <span style={{ fontSize: "1.4rem" }}>🗺️</span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontFamily: "sans-serif", fontSize: "0.92rem" }}>Ver Mapa Interativo dos Bares</div>
                <div style={{ color: "#80c994", fontSize: "0.73rem", fontFamily: "sans-serif" }}>Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco</div>
              </div>
              <span style={{ marginLeft: "auto", color: "#f4d03f", fontSize: "1.2rem" }}>→</span>
            </div>
          </div>

          <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1.5rem 3rem" }}>
            {filteredAndSorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 2rem", color: "#888" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <p style={{ fontFamily: "sans-serif" }}>Nenhum bar encontrado com esses filtros.</p>
                <button onClick={() => { setFv(false); setFf(false); setFr("Todas"); setQ(""); setOnlyVisitedByTeam(false); setSortBy("none"); }} style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", background: "#1a472a", color: "#fff", border: "none", borderRadius: "8px", fontFamily: "sans-serif" }}>Limpar filtros</button>
              </div>
            ) : (
              sortBy !== "none" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.2rem" }}>
                  {filteredAndSorted.map(b => <Card key={b.id} b={b} visited={visited} favorites={favorites} tv={tv} tf={tf} exp={exp} setExp={setExp} imgErr={imgErr} setImgErr={setImgErr} sortBy={sortBy} />)}
                </div>
              ) : (
                regionKeys.map(region => (
                  <section key={region} style={{ marginBottom: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `2px solid ${REGION_COLOR[region]}25` }}>
                      <div style={{ width: "4px", height: "26px", background: REGION_COLOR[region], borderRadius: "2px" }}/>
                      <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: REGION_COLOR[region], fontFamily: "sans-serif", letterSpacing: "0.01em" }}>{region}</h2>
                      <span style={{ background: REGION_COLOR[region] + "18", color: REGION_COLOR[region], borderRadius: "20px", padding: "2px 10px", fontSize: "0.72rem", fontFamily: "sans-serif", fontWeight: 700 }}>{grouped[region].length} bares</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.1rem" }}>
                      {grouped[region].map(b => <Card key={b.id} b={b} visited={visited} favorites={favorites} tv={tv} tf={tf} exp={exp} setExp={setExp} imgErr={imgErr} setImgErr={setImgErr} sortBy={sortBy} />)}
                    </div>
                  </section>
                ))
              )
            )}
          </main>
        </>
      )}

      <footer style={{ background: "#152b1c", color: "#80c994", padding: "1.8rem 1.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", marginBottom: "0.4rem" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f4d03f" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span style={{ fontFamily: "sans-serif", fontSize: "0.83rem" }}>Curadoria: <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: "#f4d03f", fontWeight: 700, textDecoration: "none" }}>@ParticipantesdiButeco</a></span>
        </div>
        <p style={{ margin: 0, fontSize: "0.73rem", opacity: 0.5, fontFamily: "sans-serif" }}>Comida di Buteco 2026 · 26ª Edição · Belo Horizonte · 10 abr – 10 mai · Petiscos a R$ 40</p>
      </footer>
    </div>
  );
}

function Card({ b, visited, favorites, tv, tf, exp, setExp, imgErr, setImgErr, sortBy }) {
  const isV = visited.has(b.id), isF = favorites.has(b.id), isE = exp === b.id;
  const rc = REGION_COLOR[b.region] || "#555";
  const hasErr = imgErr.has(b.id);
  const hasRating = b.rating !== null && b.rating !== undefined;
  const hasBeerTemp = b.beerTemp !== null && b.beerTemp !== undefined;
  const hasVisitedByParticipants = b.visited === true;
  
  const getTempColor = (temp) => {
    if (temp === null) return "#aaa";
    if (temp < -7) return "#0d3b66";
    if (temp < -5) return "#1a5276";
    if (temp < -3) return "#2980b9";
    if (temp >= -3 && temp <= 1) return "#2ecc71";
    if (temp > 1 && temp <= 3) return "#f1c40f";
    if (temp > 3 && temp <= 6) return "#e67e22";
    return "#e74c3c";
  };
  
  const getTempGlow = (temp) => {
    if (temp === null) return "none";
    if (temp < -5) return "0 0 4px rgba(41,128,185,0.5)";
    return "none";
  };
  
  return (
    <article className="bc" style={{ background: "#fff", borderRadius: "14px", border: `2px solid ${isF ? "#e74c3c" : isV ? "#27ae60" : "#e8e0d0"}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "relative" }}>
      <div style={{ height: "4px", background: rc }}/>
      <div style={{ overflow: "hidden", height: "185px", position: "relative", background: rc + "11", cursor: "pointer" }} onClick={() => setExp(isE ? null : b.id)}>
        {!hasErr && b.photo ? (
          <img className="bi" src={b.photo} alt={b.dish} style={{ width: "100%", height: "185px", objectFit: "cover", display: "block" }} onError={() => setImgErr(s => new Set([...s, b.id]))}/>
        ) : (
          <div style={{ height: "185px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", background: `linear-gradient(135deg,${rc}18,${rc}33)` }}>🍽️</div>
        )}
        {b.champion && <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(243,156,18,0.9)", borderRadius: "6px", padding: "3px 8px", fontSize: "0.65rem", fontFamily: "sans-serif", fontWeight: 700, color: "#fff" }}>🏆 Ex-campeão</div>}
        {isV && <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(39,174,96,0.9)", borderRadius: "6px", padding: "3px 8px", fontSize: "0.65rem", fontFamily: "sans-serif", fontWeight: 700, color: "#fff" }}>✓ Visitado</div>}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45px", background: "linear-gradient(transparent,rgba(0,0,0,0.3))", pointerEvents: "none" }}/>
      </div>
      
      {/* CRÉDITO DA FOTO */}
      {b.photoCredit && b.photoCredit !== "" && (
        <div style={{ 
          padding: "0.25rem 0.75rem", 
          background: "#f5f0e8", 
          fontSize: "0.6rem", 
          fontFamily: "sans-serif", 
          color: "#888",
          textAlign: "right",
          borderBottom: "1px solid #eee",
          letterSpacing: "0.02em"
        }}>
          📷 {b.photoCredit}
        </div>
      )}
      
      <div style={{ padding: "0.9rem 1rem 0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: "0 0 2px", fontSize: "0.93rem", fontWeight: 700, color: "#1a2e1a", fontFamily: "sans-serif", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</h3>
            <div style={{ fontSize: "0.68rem", color: "#aaa", fontFamily: "sans-serif" }}>{b.neighborhood} · <span style={{ color: rc, fontWeight: 600 }}>{b.region}</span></div>
          </div>
          <div style={{ display: "flex", gap: "2px", flexShrink: 0, marginLeft: "6px" }}>
            <button onClick={() => tf(b.id)} style={{ background: "none", border: "none", padding: "4px", display: "flex" }}><HeartIcon f={isF}/></button>
            <button onClick={() => tv(b.id)} style={{ background: "none", border: "none", padding: "4px", display: "flex" }}><CheckCircle d={isV}/></button>
          </div>
        </div>
        
        {/* INFO VISITA DO TIME, RATING E TEMPERATURA - Fundo cinza claro */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginTop: "0.6rem",
          padding: "0.5rem 0.6rem",
          background: "#e8e8e8",
          borderRadius: "10px",
          gap: "8px",
          flexWrap: "wrap"
        }}>
          {/* Status da visita do time */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
            {hasVisitedByParticipants ? (
              <>
                <CheckCircle d={true} />
                <span style={{ 
                  fontSize: "0.72rem", 
                  fontFamily: "sans-serif", 
                  color: "#2c5e2e",
                  fontWeight: 600,
                  whiteSpace: "nowrap"
                }}>
                  Time visitou
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "0.72rem", fontFamily: "sans-serif", color: "#888" }}>⏳</span>
                <span style={{ 
                  fontSize: "0.72rem", 
                  fontFamily: "sans-serif", 
                  color: "#888",
                  whiteSpace: "nowrap"
                }}>
                  Aguardando
                </span>
              </>
            )}
          </div>
          
          {/* Nota do time */}
          {hasRating && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, background: "rgba(0,0,0,0.08)", padding: "2px 8px", borderRadius: "20px" }}>
              <span style={{ fontSize: "0.75rem", color: "#d4a017" }}>⭐</span>
              <span style={{ 
                fontSize: "0.75rem", 
                fontFamily: "sans-serif", 
                fontWeight: 700, 
                color: "#d4a017"
              }}>
                {b.rating.toFixed(1)}
              </span>
            </div>
          )}
          
          {/* Temperatura da cerveja */}
          {hasBeerTemp && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "4px", 
              flexShrink: 0,
              background: b.beerTemp < -3 ? "rgba(41,128,185,0.15)" : "rgba(0,0,0,0.05)",
              padding: "2px 8px",
              borderRadius: "20px",
              boxShadow: getTempGlow(b.beerTemp)
            }}>
              <ThermometerIcon temp={b.beerTemp} />
              <span style={{ 
                fontSize: "0.75rem", 
                fontFamily: "sans-serif", 
                fontWeight: 700,
                color: getTempColor(b.beerTemp),
                textShadow: b.beerTemp < -5 ? "0 0 2px rgba(0,0,0,0.2)" : "none"
              }}>
                {b.beerTemp}°C
              </span>
              {b.beerTemp < -5 && (
                <span style={{ fontSize: "0.6rem", color: "#2980b9", marginLeft: "2px" }}>❄️</span>
              )}
            </div>
          )}
        </div>
        
        <div style={{ background: rc + "12", border: `1px solid ${rc}22`, borderRadius: "7px", padding: "0.42rem 0.7rem", margin: "0.55rem 0" }}>
          <div style={{ fontSize: "0.58rem", fontFamily: "sans-serif", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1px" }}>Petisco</div>
          <div style={{ fontSize: "0.83rem", fontWeight: 700, color: rc, fontFamily: "sans-serif", lineHeight: 1.2 }}>{b.dish}</div>
        </div>
        
        <p style={{ fontSize: "0.76rem", color: "#555", lineHeight: 1.55, margin: "0 0 0.4rem", fontWeight: 300 }}>
          {isE ? b.desc : b.desc.slice(0, 88) + (b.desc.length > 88 ? "…" : "")}
        </p>
        {isE && <div style={{ fontSize: "0.68rem", color: "#aaa", fontFamily: "sans-serif", display: "flex", gap: "4px", marginBottom: "0.35rem" }}><span>📍</span><span>{b.address} – {b.neighborhood}, BH</span></div>}
        <button onClick={() => setExp(isE ? null : b.id)} style={{ background: "none", border: "none", color: rc, fontSize: "0.72rem", padding: "0", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px", fontFamily: "sans-serif" }}>
          {isE ? "Menos ↑" : "Mais ↓"}
        </button>
      </div>
    </article>
  );
}
