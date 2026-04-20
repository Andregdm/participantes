// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE MAPA (lazy loading)
// ═══════════════════════════════════════════════════════════════════════════════

import React from "react";

const MapComponent = ({ T, dark, BRAND, Logo, IgIcon }) => {
    return (
        <div className="max-width-1200 px-15 mt-2">
            <div
                style={{
                    background: T.surface,
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: `0 4px 28px rgba(0,0,0,${dark ? "0.5" : "0.1"})`,
                    border: `1px solid ${T.border}`
                }}
            >
                {/* Cabeçalho do mapa */}
                <div
                    style={{
                        background: T.bannerBg,
                        padding: "1.2rem 1.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}
                >
                    <Logo size={45} />
                    <div>
                        <div
                            style={{
                                color: "#fff",
                                fontWeight: 700,
                                fontFamily: "sans-serif",
                                fontSize: "1rem"
                            }}
                        >
                            Mapa Personalizado — Comida di Buteco 2026 BH
                        </div>
                        <div
                            style={{
                                color: BRAND.goldLt,
                                fontSize: "0.74rem",
                                fontFamily: "sans-serif",
                                opacity: 0.85
                            }}
                        >
                            Todos os bares participantes marcados · Curadoria @ParticipantesdiButeco
                        </div>
                    </div>
                </div>

                {/* Iframe do mapa */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%",
                        background: dark ? "#111" : "#f0ebe0"
                    }}
                >
                    <iframe
                        src="https://www.google.com/maps/d/u/0/embed?mid=1NKgMtDTJSU2KAuiadQub73yXZ4nEJLU&ehbc=2E312F&noprof=1"
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            border: "none"
                        }}
                        title="Mapa Comida di Buteco 2026 BH"
                        allowFullScreen
                        loading="lazy"
                    />
                </div>

                {/* Rodapé do mapa */}
                <div
                    style={{
                        padding: "0.9rem 1.8rem",
                        background: T.mapFooterBg,
                        borderTop: `1px solid ${T.border}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <IgIcon color={BRAND.navy} />
                    <span
                        style={{
                            fontSize: "0.78rem",
                            color: T.textMuted,
                            fontFamily: "sans-serif"
                        }}
                    >
                        Mapa criado por{" "}
                        <a
                            href="https://www.instagram.com/ParticipantesdiButeco"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: BRAND.navy, fontWeight: 700 }}
                        >
                            @ParticipantesdiButeco
                        </a>{" "}
                        · Siga para atualizações e dicas do concurso
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
