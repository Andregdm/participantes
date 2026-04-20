import { memo } from "react";

const MapComponent = memo(({ T, dark, BRAND, Logo, IgIcon }) => {
  return (
    <div className="max-width-1200 px-15 mt-2">
      <div className="map-card" style={{ background: T.surface, borderRadius: "16px", overflow: "hidden", boxShadow: `0 4px 28px rgba(0,0,0,${dark ? "0.5" : "0.1"})`, border: `1px solid ${T.border}` }}>
        <div className="map-header" style={{ background: T.bannerBg, padding: "1.2rem 1.8rem", display: "flex", alignItems: "center", gap: "15px" }}>
          <Logo size={45} />
          <div>
            <div className="map-header-title" style={{ color: "#fff" }}>Mapa Personalizado — Comida di Buteco 2026 BH</div>
            <div className="map-header-subtitle" style={{ color: BRAND.goldLt }}>Todos os bares participantes marcados · Curadoria @ParticipantesdiButeco</div>
          </div>
        </div>
        <div className="map-container" style={{ background: dark ? "#111" : "#f0ebe0" }}>
          <iframe
            className="map-iframe"
            src="https://www.google.com/maps/d/u/0/embed?mid=1NKgMtDTJSU2KAuiadQub73yXZ4nEJLU&ehbc=2E312F&noprof=1"
            title="Mapa Comida di Buteco 2026 BH"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="map-footer" style={{ padding: "0.9rem 1.8rem", background: T.mapFooterBg, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <IgIcon color={BRAND.navy} />
          <span className="map-footer-text" style={{ color: T.textMuted }}>
            Mapa criado por{" "}
            <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.navy }}>
              @ParticipantesdiButeco
            </a>{" "}· Siga para atualizações e dicas do concurso
          </span>
        </div>
      </div>
    </div>
  );
});

export default MapComponent;
