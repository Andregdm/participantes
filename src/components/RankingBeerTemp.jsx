// RankingBeerTemp.jsx
import { useMemo } from "react";
import { BRAND } from "./constants";

const getTempIcon = (temp) => {
  if (temp <= -7) return "❄️❄️";
  if (temp <= -4) return "❄️";
  if (temp <= 0) return "🥶";
  return "🌡️";
};

const RankingBeerTemp = ({ bars, T, dark }) => {
  // Filtra bares com temperatura definida e ordena por temperatura (crescente = mais gelada)
  const rankedBars = useMemo(() => {
    const withTemp = bars.filter(bar => bar.beerTemp !== null && bar.beerTemp !== undefined);
    const sorted = [...withTemp].sort((a, b) => a.beerTemp - b.beerTemp);
    
    // Atribui posições considerando empates
    const ranked = [];
    let lastTemp = null;
    let currentPos = 0;
    let skip = 0;
    
    for (let i = 0; i < sorted.length; i++) {
      const bar = sorted[i];
      const temp = bar.beerTemp;
      
      if (temp !== lastTemp) {
        currentPos += skip + 1;
        skip = 0;
        lastTemp = temp;
      } else {
        skip++;
      }
      
      ranked.push({
        ...bar,
        rank: currentPos
      });
    }
    return ranked;
  }, [bars]);

  if (rankedBars.length === 0) {
    return (
      <div className="empty-state" style={{ textAlign: "center", padding: "3rem", color: T.textMuted }}>
        <div className="empty-icon">🍺❄️</div>
        <p style={{ fontSize: "1rem" }}>Nenhuma temperatura de cerveja registrada ainda.</p>
        <p style={{ fontSize: "0.85rem" }}>Os dados aparecerão assim que o time atualizar a planilha.</p>
      </div>
    );
  }

  return (
    <div className="max-width-1200 px-15" style={{ margin: "2rem auto" }}>
      <div
        style={{
          background: T.surface,
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: `0 8px 30px rgba(0,0,0,${dark ? "0.4" : "0.08"})`,
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            background: dark ? "#0b2b26" : "#e0f2f1",
            padding: "1rem 1.8rem",
            borderBottom: `2px solid ${BRAND.gold}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🍺❄️</span> Ranking das Cervejas Mais Geladas
          </h2>
          <p style={{ margin: "0.5rem 0 0", opacity: 0.7, fontSize: "0.85rem" }}>
            Ordenado da cerveja mais gelada (menor °C) para a menos gelada.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}`, background: dark ? "#1e212b" : "#f5f0e8" }}>
                <th style={{ padding: "1rem 0.8rem", textAlign: "center", width: "80px" }}>Posição</th>
                <th style={{ padding: "1rem 0.8rem", textAlign: "left" }}>Estabelecimento</th>
                <th style={{ padding: "1rem 0.8rem", textAlign: "left" }}>Região</th>
                <th style={{ padding: "1rem 0.8rem", textAlign: "center", width: "120px" }}>Temperatura</th>
              </tr>
            </thead>
            <tbody>
              {rankedBars.map((bar, idx) => (
                <tr
                  key={bar.id}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    background: idx % 2 === 0 ? T.cardBg : T.surfaceAlt,
                  }}
                >
                  <td style={{ padding: "0.8rem", textAlign: "center", fontWeight: "bold", fontSize: "1.1rem" }}>
                    {bar.rank}º
                  </td>
                  <td style={{ padding: "0.8rem", fontWeight: 500 }}>
                    {bar.name}
                  </td>
                  <td style={{ padding: "0.8rem", color: T.textMuted }}>
                    {bar.region}
                  </td>
                  <td style={{
                    padding: "0.8rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: bar.beerTemp < 0 ? "#2980B9" : "#E67E22",
                  }}>
                    {getTempIcon(bar.beerTemp)} {bar.beerTemp}°C
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "0.8rem 1.8rem", background: T.surfaceAlt, fontSize: "0.7rem", color: T.textFaint, textAlign: "center" }}>
          Total de bares com temperatura registrada: {rankedBars.length}
        </div>
      </div>
    </div>
  );
};

export default RankingBeerTemp;
