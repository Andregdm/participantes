import { TEMP_SCALE } from "./constants";

// Busca sem acentos: "coração" → "coracao"
export const normalizeText = (text) =>
  text
    ? text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
    : "";

// Retorna { color, bg } para uma dada temperatura
export const getTempStyle = (t) =>
  t == null ? null : (TEMP_SCALE.find(s => t < s.max) ?? TEMP_SCALE.at(-1));

// Mantidos por compatibilidade com Card.jsx (serão removidos na próxima limpeza)
export const getTempColor = (t) => getTempStyle(t)?.color ?? "#95a5a6";
export const getTempBg    = (t) => getTempStyle(t)?.bg    ?? "rgba(0,0,0,0.05)";
