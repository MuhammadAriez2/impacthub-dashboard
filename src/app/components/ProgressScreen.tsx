import { ArrowLeft, TrendingUp, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useI18n } from "../i18n";

const METRIC_TRENDS = [
  {
    labelKey: "progressItem.digitalLiteracy",
    unitKey: "progressItem.digitalLiteracy.unit",
    before: 28,
    after: 71,
    gain: "+43pp",
    color: "#1F7A68",
    cardBg: "bg-[#E8F5EE]",
    textColor: "text-[#1B5E38]",
    data: [
      { month: "Jan", value: 28 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 44 },
      { month: "Apr", value: 54 },
      { month: "May", value: 63 },
      { month: "Jun", value: 71 },
    ],
    insightKey: "progressScreen.insight.digital",
  },
  {
    labelKey: "progressItem.jobConfidence",
    unitKey: "progressItem.jobConfidence.unit",
    before: 35,
    after: 68,
    gain: "+33pp",
    color: "#2E6EA6",
    cardBg: "bg-[#EBF3FB]",
    textColor: "text-[#1A3A6B]",
    data: [
      { month: "Jan", value: 35 },
      { month: "Feb", value: 41 },
      { month: "Mar", value: 48 },
      { month: "Apr", value: 55 },
      { month: "May", value: 62 },
      { month: "Jun", value: 68 },
    ],
    insightKey: "progressScreen.insight.confidence",
  },
  {
    labelKey: "progressItem.monthlyIncome",
    unitKey: "progressItem.monthlyIncome.unit",
    before: 42,
    after: 79,
    gain: "+37pp",
    color: "#8B5015",
    cardBg: "bg-[#FAEEDA]",
    textColor: "text-[#633806]",
    data: [
      { month: "Jan", value: 42 },
      { month: "Feb", value: 49 },
      { month: "Mar", value: 56 },
      { month: "Apr", value: 63 },
      { month: "May", value: 71 },
      { month: "Jun", value: 79 },
    ],
    insightKey: "progressScreen.insight.income",
  },
];

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-2 bg-[#E4EBF2] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-foreground">{payload[0].value}%</p>
    </div>
  );
}

export function ProgressScreen({ onBack }: { onBack: () => void }) {
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

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">
            {t("progressScreen.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("progressScreen.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#E8F5EE] text-[#1B5E38] px-3 py-1.5 rounded-lg">
          <TrendingUp size={14} />
          <span className="text-xs font-medium">{t("progressScreen.allImproving")}</span>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {METRIC_TRENDS.map(({ labelKey, gain, cardBg, textColor }) => (
          <div key={labelKey} className={`${cardBg} rounded-xl p-4`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <ArrowUpRight size={14} className={textColor} />
              <p className={`text-lg font-bold ${textColor} tracking-tight`} style={{ fontFamily: "var(--font-mono)" }}>
                {gain}
              </p>
            </div>
            <p className={`text-xs font-medium ${textColor}`}>{t(labelKey)}</p>
          </div>
        ))}
      </div>

      {/* Per-metric cards */}
      <div className="space-y-5 pb-6">
        {METRIC_TRENDS.map(({ labelKey, unitKey, before, after, color, data, insightKey }) => (
          <div key={labelKey} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{t(labelKey)}</h2>
                <p className="text-xs text-muted-foreground">{t(unitKey)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t("progressScreen.sixMonthGain")}</p>
                <p
                  className="text-base font-bold"
                  style={{ color, fontFamily: "var(--font-mono)" }}
                >
                  {before}% → {after}%
                </p>
              </div>
            </div>

            {/* Before / After bars */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{t("progress.before")}</span>
                <div className="flex-1">
                  <ProgressBar value={before} color="#CBD5E1" />
                </div>
                <span
                  className="text-xs font-medium text-muted-foreground w-8"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {before}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{t("progress.after")}</span>
                <div className="flex-1">
                  <ProgressBar value={after} color={color} />
                </div>
                <span
                  className="text-xs font-medium w-8"
                  style={{ color, fontFamily: "var(--font-mono)" }}
                >
                  {after}%
                </span>
              </div>
            </div>

            {/* Trend chart */}
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t("progressScreen.sixMonthTrend")}
              </p>
              <div style={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4EBF2" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#5C7389" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[20, 85]}
                      tick={{ fontSize: 11, fill: "#5C7389" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: color, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insight */}
            <div className="flex gap-2 p-3 rounded-lg bg-[#F8FAFB] border border-border">
              <span className="text-base leading-none mt-0.5">💡</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{t(insightKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
