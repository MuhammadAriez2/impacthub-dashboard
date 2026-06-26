import { ArrowLeft, TrendingUp, TrendingDown, Minus, Lightbulb, Users2, Workflow } from "lucide-react";
import { useI18n } from "../i18n";

interface BenchmarkMetric {
  labelKey: string;
  you: number;
  sectorAvg: number;
  unit: string;
  color: string;
  bg: string;
}

const BENCHMARKS: BenchmarkMetric[] = [
  { labelKey: "insights.metric.peopleReached", you: 728, sectorAvg: 540, unit: "", color: "#1B5E38", bg: "#E8F5EE" },
  { labelKey: "insights.metric.digitalLiteracy", you: 43, sectorAvg: 31, unit: "pp", color: "#1A3A6B", bg: "#EBF3FB" },
  { labelKey: "insights.metric.jobPlacement", you: 38, sectorAvg: 42, unit: "%", color: "#633806", bg: "#FAEEDA" },
  { labelKey: "insights.metric.consentRate", you: 100, sectorAvg: 87, unit: "%", color: "#1B5E38", bg: "#E8F5EE" },
];

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
        <span className="text-xs text-muted-foreground w-20 shrink-0">{/* you label set by caller */}</span>
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
          <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">{t("insights.title")}</h1>
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

      {/* Sector + sample size */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#E8F5EE] flex items-center justify-center shrink-0">
            <span className="text-base">🎓</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("insights.yourSector")}</p>
            <p className="text-sm font-semibold text-foreground">{t("industry.education")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users2 size={13} />
          {t("insights.sampleSize")} <span className="font-medium text-foreground" style={{ fontFamily: "var(--font-mono)" }}>214</span> {t("insights.smesCount")}
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
        <span className="text-xs text-muted-foreground ml-auto">{t("insights.compareValue")}</span>
      </div>

      {/* Benchmark cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {BENCHMARKS.map(({ labelKey, you, sectorAvg, unit, color, bg }) => {
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
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb size={15} className="text-[#633806]" />
          <h2 className="text-sm font-semibold text-foreground">{t("insights.practicesTitle")}</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{t("insights.practicesSubtitle")}</p>

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
