// ═══════════════════════════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ═══════════════════════════════════════════════════════════════════════════════

export const normalizeText = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
};

export const getTempColor = (t) => {
    if (t === null) return "#95a5a6";
    if (t < -3) return "#2980B9";
    if (t <= 1) return "#27AE60";
    if (t <= 3) return "#F39C12";
    if (t <= 6) return "#E67E22";
    return "#C0392B";
};

export const getTempBg = (t) => {
    if (t === null) return "rgba(0,0,0,0.05)";
    if (t < -3) return "rgba(52,152,219,0.15)";
    if (t <= 1) return "rgba(46,204,113,0.15)";
    if (t <= 3) return "rgba(243,156,18,0.15)";
    if (t <= 6) return "rgba(230,126,34,0.15)";
    return "rgba(231,76,60,0.15)";
};
