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
          className="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-50"
          style={{ animation: "dropIn 180ms ease both" }}
        >
          {LANGUAGES.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-[#F0F3F6] transition-colors text-left"
            >
              <span className="text-base leading-none">{flag}</span>
              <span className="flex-1 text-sm text-foreground">{label}</span>
              {code === lang && <Check size={14} className="text-[#1F7A68]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
