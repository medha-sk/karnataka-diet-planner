import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("kdp_lang") || "en");
  const [meals, setMeals] = useState({});          // English dish name -> { name, description } in Kannada

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("kn", lang === "kn");
  }, [lang]);

  useEffect(() => {
    axios.get("/api/public/translations").then(r => setMeals(r.data)).catch(() => {});
  }, []);

  const setLang = (l) => { localStorage.setItem("kdp_lang", l); setLangState(l); };

  // t("key", { n: 5 }) -> translated string, falls back to English, then to the key
  const t = useCallback((key, vars) => {
    let s = translations[lang]?.[key] ?? translations.en[key] ?? key;
    if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
    return s;
  }, [lang]);

  // Dish helpers (work for plan items AND saved tracker names)
  const dishName = useCallback((name) => (lang === "kn" && meals[name]?.name) || name, [lang, meals]);
  const dishDesc = useCallback((name, fallback) => (lang === "kn" && meals[name]?.description) || fallback || "", [lang, meals]);
  // Condition helpers (API returns label/labelKn, tip/tipKn)
  const condLabel = useCallback((c) => (lang === "kn" && c.labelKn) || c.label, [lang]);
  const condTip   = useCallback((c) => (lang === "kn" && c.tipKn) || c.tip, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dishName, dishDesc, condLabel, condTip }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLang = () => useContext(LanguageContext);
