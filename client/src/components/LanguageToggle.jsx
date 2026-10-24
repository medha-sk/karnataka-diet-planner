import { useLang } from "../context/LanguageContext";

export default function LanguageToggle({ dark = false }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-toggle ${dark ? "dark" : ""}`} role="group" aria-label="Language">
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
      <button className={lang === "kn" ? "on" : ""} onClick={() => setLang("kn")} aria-pressed={lang === "kn"}>ಕನ್ನಡ</button>
    </div>
  );
}
