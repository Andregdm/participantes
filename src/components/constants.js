// Paleta da marca (extraída da logo)
export const BRAND = {
  navy:   "#23357A",   // mais claro que o anterior (#1C2D6E) para melhor contraste no modo escuro
  navyDk: "#131f50",
  red:    "#C0392B",
  gold:   "#E8A820",
  goldLt: "#F4D03F",
  cream:  "#F5EFE0",
};

// Tokens de tema — indexados para acesso direto por booleano
export const THEMES = {
  light: {
    bg:          "#F5EFE0",
    surface:     "#FFFFFF",
    surfaceAlt:  "#FAF7F0",
    border:      "#D6C8AC",       // mais definido
    text:        "#1E1B12",       // contraste aprimorado
    textMuted:   "#4E4432",       // mais legível
    textFaint:   "#8A7A64",       // agora com contraste aceitável
    statBg:      "rgba(255,255,255,0.13)",
    inputBg:     "#FAF7F0",
    glassBg:     "rgba(255,255,255,0.75)",
    glassBorder: "rgba(255,255,255,0.4)",
    headerBg:    `linear-gradient(155deg,#131f50 0%,#1C2D6E 60%,#1a2860 100%)`,
    filterBg:    "#FFFFFF",
    filterBorder:"#E2D8C0",
    cardBg:      "#FFFFFF",
    cardBorder:  "#E2D8C0",
    bannerBg:    "linear-gradient(90deg,#131f50,#1C2D6E)",
    mapFooterBg: "#FAF7F0",
    footerBg:    "#131f50",
  },
  dark: {
    bg:          "#0F1117",
    surface:     "#1A1D26",
    surfaceAlt:  "#21242F",
    border:      "#444A62",       // mais visível sem ofuscar
    text:        "#F5F0E8",       // branco mais puro
    textMuted:   "#C2BCCC",       // excelente contraste
    textFaint:   "#8E88A0",       // agora legível
    statBg:      "rgba(255,255,255,0.07)",
    inputBg:     "#21242F",
    glassBg:     "rgba(26,29,38,0.85)",
    glassBorder: "rgba(255,255,255,0.08)",
    headerBg:    "linear-gradient(155deg,#090C18 0%,#101428 60%,#0D1122 100%)",
    filterBg:    "#1A1D26",
    filterBorder:"#2E3245",
    cardBg:      "#1A1D26",
    cardBorder:  "#2E3245",
    bannerBg:    "linear-gradient(90deg,#090C18,#101428)",
    mapFooterBg: "#21242F",
    footerBg:    "#090C18",
  },
};

// Escala de temperatura — usada em getTempStyle()
export const TEMP_SCALE = [
  { max: -3,       color: "#2980B9", bg: "rgba(52,152,219,0.15)"  },
  { max:  1,       color: "#27AE60", bg: "rgba(46,204,113,0.15)"  },
  { max:  3,       color: "#F39C12", bg: "rgba(243,156,18,0.15)"  },
  { max:  6,       color: "#E67E22", bg: "rgba(230,126,34,0.15)"  },
  { max: Infinity, color: "#C0392B", bg: "rgba(231,76,60,0.15)"   },
];

// Dados dos bares — importados centralmente para evitar re-imports
import data from "../data/bares.json";
export const REGION_COLOR = data.regions;
export const BARS         = data.bars;
export const REGIONS      = ["Todas", ...Object.keys(data.regions)];
