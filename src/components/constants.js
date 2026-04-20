// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES GLOBAIS
// ═══════════════════════════════════════════════════════════════════════════════

import data from "../data/bares.json";

export const BRAND = {
    navy: "#1C2D6E",
    navyDk: "#131f50",
    red: "#C0392B",
    gold: "#E8A820",
    goldLt: "#F4D03F",
    cream: "#F5EFE0",
    white: "#FFFFFF"
};

export const THEMES = {
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

export const REGION_COLOR = data.regions;
export const BARS = data.bars;
export const REGIONS = ["Todas", ...Object.keys(REGION_COLOR)];
