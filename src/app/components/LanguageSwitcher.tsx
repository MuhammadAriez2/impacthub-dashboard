import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useI18n, LANGUAGES } from "../i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
        style={{ color: "#9FE1CB", backgroundColor: open ? "rgba(159,225,203,0.1)" : "transparent" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(159,225,203,0.1)";
          (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#9FE1CB";
          }
        }}
        aria-label={t("lang.select")}
      >
        <Globe size={15} />
        <span className="flex-1 text-left truncate">
          {current.flag} {current.label}
        </span>
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 w-52 rounded-xl overflow-hidden z-50 shadow-lg"
          style={{ animation: "dropIn 180ms ease both", backgroundColor: "#0F2E26", border: "1px solid #1B5E38" }}
        >
          {LANGUAGES.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left"
              style={{ color: "#9FE1CB" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(159,225,203,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <span className="text-base leading-none">{flag}</span>
              <span className="flex-1 text-sm">{label}</span>
              {code === lang && <Check size={14} style={{ color: "#4ACED1" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
