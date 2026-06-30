import { useState, useRef, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Lightbulb, Users2, Workflow, ChevronDown, CheckCircle2 } from "lucide-react";
import { useI18n } from "../i18n";

interface BenchmarkMetric {
  labelKey: string;
  you: number;
  sectorAvg: number;
  unit: string;
  color: string;
  bg: string;
}

type SectorKey = "education" | "environment" | "health" | "community";

interface SectorData {
  emoji: string;
  sectorKey: string;
  compareValueKey: string;
  practicesSubtitleKey: string;
  sampleSize: number;
  metrics: BenchmarkMetric[];
}

const SECTOR_DATA: Record<SectorKey, SectorData> = {
  education: {
    emoji: "🎓",
    sectorKey: "industry.education",
    compareValueKey: "insights.compareValue.education",
    practicesSubtitleKey: "insights.practicesSubtitle",
    sampleSize: 214,
    metrics: [
      { labelKey: "insights.metric.orgsReached", you: 13, sectorAvg: 9, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.individualsReached", you: 715, sectorAvg: 531, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.digitalLiteracy", you: 43, sectorAvg: 31, unit: "pp", color: "#1A3A6B", bg: "#EBF3FB" },
      { labelKey: "insights.metric.jobPlacement", you: 38, sectorAvg: 42, unit: "%", color: "#633806", bg: "#FAEEDA" },
      { labelKey: "insights.metric.consentRate", you: 100, sectorAvg: 87, unit: "%", color: "#1B5E38", bg: "#E8F5EE" },
    ],
  },
  environment: {
    emoji: "🌿",
    sectorKey: "industry.environment",
    compareValueKey: "insights.compareValue.environment",
    practicesSubtitleKey: "insights.practicesSubtitle.environment",
    sampleSize: 87,
    metrics: [
      { labelKey: "insights.metric.orgsReached", you: 8, sectorAvg: 6, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.individualsReached", you: 304, sectorAvg: 279, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.wastesDiverted", you: 8.4, sectorAvg: 5.1, unit: "t", color: "#1A3A6B", bg: "#EBF3FB" },
      { labelKey: "insights.metric.sdgTagRate", you: 91, sectorAvg: 78, unit: "%", color: "#633806", bg: "#FAEEDA" },
      { labelKey: "insights.metric.consentRate", you: 100, sectorAvg: 84, unit: "%", color: "#1B5E38", bg: "#E8F5EE" },
    ],
  },
  health: {
    emoji: "❤️",
    sectorKey: "industry.health",
    compareValueKey: "insights.compareValue.health",
    practicesSubtitleKey: "insights.practicesSubtitle.health",
    sampleSize: 156,
    metrics: [
      { labelKey: "insights.metric.orgsReached", you: 6, sectorAvg: 4, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.individualsReached", you: 439, sectorAvg: 386, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.healthScreenings", you: 289, sectorAvg: 220, unit: "", color: "#1A3A6B", bg: "#EBF3FB" },
      { labelKey: "insights.metric.careFollowUp", you: 74, sectorAvg: 58, unit: "%", color: "#633806", bg: "#FAEEDA" },
      { labelKey: "insights.metric.consentRate", you: 100, sectorAvg: 91, unit: "%", color: "#1B5E38", bg: "#E8F5EE" },
    ],
  },
  community: {
    emoji: "🤝",
    sectorKey: "industry.community",
    compareValueKey: "insights.compareValue.community",
    practicesSubtitleKey: "insights.practicesSubtitle.community",
    sampleSize: 193,
    metrics: [
      { labelKey: "insights.metric.orgsReached", you: 15, sectorAvg: 11, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.individualsReached", you: 548, sectorAvg: 409, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
      { labelKey: "insights.metric.employmentReadiness", you: 35, sectorAvg: 24, unit: "pp", color: "#1A3A6B", bg: "#EBF3FB" },
      { labelKey: "insights.metric.digitalSkills", you: 67, sectorAvg: 49, unit: "%", color: "#633806", bg: "#FAEEDA" },
      { labelKey: "insights.metric.consentRate", you: 100, sectorAvg: 88, unit: "%", color: "#1B5E38", bg: "#E8F5EE" },
    ],
  },
};

const PRACTICES = [
  { titleKey: "insights.practice1.title", bodyKey: "insights.practice1.body", icon: "📋" },
  { titleKey: "insights.practice2.title", bodyKey: "insights.practice2.body", icon: "⏱️" },
  { titleKey: "insights.practice3.title", bodyKey: "insights.practice3.body", icon: "🎯" },
];

function ComparisonBar({ you, sectorAvg, unit, color }: { you: number; sectorAvg: number; unit: string; color: string }) {
  const max = Math.max(you, sectorAvg) * 1.15;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-20 shrink-0" />
        <div className="flex-1 h-2.5 bg-[#E4EBF2] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(you / max) * 100}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-medium w-14 text-right shrink-0" style={{ color, fontFamily: "var(--font-mono)" }}>
          {you}{unit}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-20 shrink-0" />
        <div className="flex-1 h-2.5 bg-[#E4EBF2] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#B4B2A9] transition-all duration-700"
            style={{ width: `${(sectorAvg / max) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground w-14 text-right shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
          {sectorAvg}{unit}
        </span>
      </div>
    </div>
  );
}

export function IndustryInsightsScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [sector, setSector] = useState<SectorKey>("education");
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const sectorRef = useRef<HTMLDivElement>(null);

  const currentSector = SECTOR_DATA[sector];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sectorRef.current && !sectorRef.current.contains(e.target as Node)) {
        setShowSectorDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        {t("common.back")}
      </button>

      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#1B5E38] uppercase tracking-wide mb-2">{t("dash.founder.title")}</span>
          <h1 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>{t("insights.title")}</h1>
          <p className="text-sm text-muted-foreground max-w-xl">{t("insights.subtitle")}</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAEEDA] text-[#633806] shrink-0 mt-1">
          {t("insights.badge")}
        </span>
      </div>

      {/* How it fits workflow banner */}
      <div className="flex gap-3 p-4 rounded-xl bg-[#EBF3FA] border border-[#2E6EA6]/20 mb-6 mt-4">
        <Workflow size={18} className="text-[#2E6EA6] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#2E6EA6] mb-0.5">{t("insights.howItFits.title")}</p>
          <p className="text-xs text-[#2E6EA6]/80 leading-relaxed">{t("insights.howItFits.body")}</p>
        </div>
      </div>

      {/* Sector card + selector */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#E8F5EE] flex items-center justify-center shrink-0">
            <span className="text-base">{currentSector.emoji}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("insights.yourSector")}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-sm font-semibold text-foreground">{t(currentSector.sectorKey)}</p>
              <div className="relative" ref={sectorRef}>
                <button
                  onClick={() => setShowSectorDropdown((v) => !v)}
                  className="flex items-center gap-0.5 text-xs font-medium text-[#1F7A68] hover:text-[#196658] px-1.5 py-0.5 rounded hover:bg-[#E8F5EE] transition-colors"
                >
                  {t("insights.changeSector")}
                  <ChevronDown
                    size={11}
                    style={{
                      transform: showSectorDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 200ms",
                    }}
                  />
                </button>
                {showSectorDropdown && (
                  <div
                    className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-40"
                    style={{ animation: "dropIn 180ms ease both" }}
                  >
                    {(Object.keys(SECTOR_DATA) as SectorKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSector(key);
                          setShowSectorDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0F3F6] transition-colors text-left"
                      >
                        <span className="text-base">{SECTOR_DATA[key].emoji}</span>
                        <span className="text-sm text-foreground flex-1">{t(SECTOR_DATA[key].sectorKey)}</span>
                        {key === sector && <CheckCircle2 size={13} className="text-[#1F7A68] shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users2 size={13} />
          {t("insights.sampleSize")} <span className="font-medium text-foreground" style={{ fontFamily: "var(--font-mono)" }}>{currentSector.sampleSize}</span> {t("insights.smesCount")}
        </div>
      </div>

      {/* Comparison legend */}
      <div className="flex items-center gap-5 mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E38]" />
          <span className="text-xs text-muted-foreground">{t("insights.you")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B4B2A9]" />
          <span className="text-xs text-muted-foreground">{t("insights.sectorAvg")}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{t(currentSector.compareValueKey)}</span>
      </div>

      {/* Benchmark cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentSector.metrics.map(({ labelKey, you, sectorAvg, unit, color, bg }) => {
          const diff = you - sectorAvg;
          const pctDiff = Math.abs(Math.round((diff / sectorAvg) * 100));
          const isAbove = diff > 0;
          const isFlat = Math.abs(diff) < sectorAvg * 0.02;
          return (
            <div key={labelKey} className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">{t(labelKey)}</p>
                <span
                  className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: bg, color }}
                >
                  {isFlat ? <Minus size={11} /> : isAbove ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {isFlat ? "—" : `${pctDiff}%`} {isFlat ? t("insights.onPar") : isAbove ? t("insights.aboveAvg") : t("insights.belowAvg")}
                </span>
              </div>
              <ComparisonBar you={you} sectorAvg={sectorAvg} unit={unit} color={color} />
            </div>
          );
        })}
      </div>

      {/* Best practices */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <div className="mb-1">
          <h2 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground" style={{ borderLeft: "3px solid #4ACED1" }}>{t("insights.practicesTitle")}</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{t(currentSector.practicesSubtitleKey)}</p>

        <div className="space-y-3">
          {PRACTICES.map(({ titleKey, bodyKey, icon }) => (
            <div key={titleKey} className="flex gap-3 p-3 rounded-lg bg-[#F8FAFB] border border-border">
              <span className="text-lg leading-none shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">{t(titleKey)}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(bodyKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
