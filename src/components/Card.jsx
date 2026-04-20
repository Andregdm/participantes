import { useCallback } from "react";
import { BRAND, REGION_COLOR } from "./constants";
import { getTempStyle } from "./utils";
import { HeartIcon, CheckCircle } from "./icons";

export const Card = ({
  b,
  visited, favorites,
  onToggleVisit, onToggleFavorite,
  expandedId, onToggleExpand,
  imgErr, onImgError,
  T, dark,
}) => {
  const isV = visited.has(b.id);
  const isF = favorites.has(b.id);
  const isE = expandedId === b.id;
  const rc  = REGION_COLOR[b.region] ?? "#555";
  const tmp = getTempStyle(b.beerTemp);

  // Handlers estáveis — useCallback no nível do componente (correto per Rules of Hooks)
  const handleImgError = useCallback(() => onImgError(b.id),       [b.id, onImgError]);
  const handleVisit    = useCallback(() => onToggleVisit(b.id),    [b.id, onToggleVisit]);
  const handleFav      = useCallback(() => onToggleFavorite(b.id), [b.id, onToggleFavorite]);
  const handleExpand   = useCallback(() => onToggleExpand(b.id),   [b.id, onToggleExpand]);

  const borderColor = isF ? BRAND.red : isV ? "#27ae60" : T.cardBorder;

  return (
    <article
      className="card bc"
      style={{
        background:  T.cardBg,
        border:      `2px solid ${borderColor}`,
        boxShadow:   `0 2px 10px rgba(0,0,0,${dark ? "0.3" : "0.07"})`,
      }}
    >
      {/* Faixa de cor regional */}
      <div className="region-color-bar-top" style={{ background: rc }}/>

      {/* Foto */}
      <div className="card-image" style={{ background: rc + "18" }} onClick={handleExpand}>
        {!imgErr.has(b.id) && b.photo ? (
          <img
            className="bi card-img"
            src={b.photo}
            alt={b.dish}
            onError={handleImgError}
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
        {isV         && <div className="visited-badge">✓ Visitado</div>}
        <div className="image-gradient"/>
      </div>

      {/* Crédito da foto */}
      {b.photoCredit && (
        <div
          className="photo-credit"
          style={{ background: dark ? T.surfaceAlt : "#f5f0e8", color: T.textFaint, borderBottomColor: T.border }}
        >
          📷 {b.photoCredit}
        </div>
      )}

      {/* Conteúdo */}
      <div className="card-content">

        {/* Nome + ações */}
        <div className="card-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="card-title"      style={{ color: T.text }}>    {b.name}</h3>
            <div className="card-subtitle"  style={{ color: T.textFaint }}>
              {b.neighborhood} · <span style={{ color: rc, fontWeight: 600 }}>{b.region}</span>
            </div>
          </div>
          <div className="card-actions">
            <button onClick={handleFav}   className="action-button" title={isF ? "Remover favorito" : "Favoritar"}>
              <HeartIcon f={isF}/>
            </button>
            <button onClick={handleVisit} className="action-button" title={isV ? "Desmarcar" : "Marcar visitado"}>
              <CheckCircle d={isV}/>
            </button>
          </div>
        </div>

        {/* Pill row — time visitou / nota / temperatura */}
        <div className="info-bar" style={{ background: T.glassBg, border: `1px solid ${T.glassBorder}` }}>
          <div className="team-visit-status">
            {b.visited ? (
              <><CheckCircle d/><span className="team-visit-text" style={{ color: "#16A085" }}>Time visitou</span></>
            ) : (
              <span className="team-waiting-text" style={{ color: T.textFaint }}>⏳ Aguardando</span>
            )}
          </div>

          {b.rating != null && (
            <div className="rating-badge" style={{ background: BRAND.navy }}>
              <span className="rating-star" style={{ color: BRAND.goldLt }}>⭐</span>
              <span className="rating-value" style={{ color: "#fff" }}>{b.rating.toFixed(1)}</span>
            </div>
          )}

          {tmp && (
            <div className="temp-badge" style={{ background: tmp.bg, border: `1px solid ${tmp.color}30` }}>
              <span className="temp-icon"  style={{ color: tmp.color }}>🌡️</span>
              <span className="temp-value" style={{ color: tmp.color }}>{b.beerTemp}°C</span>
              {b.beerTemp < -5 && <span style={{ fontSize: "0.58rem", marginLeft: "1px" }}>❄️</span>}
            </div>
          )}
        </div>

        {/* Petisco */}
        <div className="petisco-container" style={{ background: rc + "14", border: `1px solid ${rc}25` }}>
          <div className="petisco-label" style={{ color: T.textFaint }}>Petisco</div>
          <div className="petisco-name"  style={{ color: rc }}>{b.dish}</div>
        </div>

        {/* Descrição */}
        <p className="description-text" style={{ color: T.textMuted }}>
          {isE ? b.desc : `${b.desc.slice(0, 88)}${b.desc.length > 88 ? "…" : ""}`}
        </p>

        {/* Endereço (expandido) */}
        {isE && (
          <div className="address-text" style={{ color: T.textFaint }}>
            <span>📍</span>
            <span>{b.address} – {b.neighborhood}, BH</span>
          </div>
        )}

        <button onClick={handleExpand} className="expand-btn" style={{ color: rc }}>
          {isE ? "Menos ↑" : "Mais ↓"}
        </button>
      </div>
    </article>
  );
};
