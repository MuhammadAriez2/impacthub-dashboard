import { useState, useEffect } from "react";
import { X, Download, FileText, Sparkles, Quote } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useI18n } from "../i18n";

const METRICS = [
  { label: "Total Earnings",     value: "RM 184,500", color: "#FFFFFF", bg: "#1A3A6B" },
  { label: "Products Sold",      value: "847",        color: "#FFFFFF", bg: "#0F2E26" },
  { label: "Projects Completed", value: "1 of 3",     color: "#FFFFFF", bg: "#633806" },
  { label: "Feedback Responses", value: "148",        color: "#FFFFFF", bg: "#1B5E38" },
];

const PROFIT_SPARKLINE_REPORT = [
  { month: "Jan", profit: 26000 },
  { month: "Feb", profit: 33500 },
  { month: "Mar", profit: 40000 },
  { month: "Apr", profit: 43500 },
  { month: "May", profit: 49000 },
  { month: "Jun", profit: 57500 },
];

const ACTIVITY_PIE_DATA = [
  { name: "Training & Skills", value: 45, color: "#1F7A68" },
  { name: "Mentorship", value: 25, color: "#1A3A6B" },
  { name: "Community Events", value: 20, color: "#F5A623" },
  { name: "Other", value: 10, color: "#B4B2A9" },
];

const FEEDBACK_SNIPPETS = [
  { quoteKey: "quote.siti", name: "Siti Rahimah, 32", roleKey: "role.beneficiary" },
  { quoteKey: "quote.razif", name: "Dato' Razif Hasnan", roleKey: "role.investor" },
];

type Tier = "dash.export.basic" | "dash.export.medium" | "dash.export.high";

interface ReportPreviewModalProps {
  tier: string;
  onClose: () => void;
}

export function ReportPreviewModal({ tier, onClose }: ReportPreviewModalProps) {
  const { t } = useI18n();
  const [stage, setStage] = useState<"generating" | "ready">("generating");

  const tierKey = (tier as Tier) || "dash.export.basic";
  const isMedium = tierKey === "dash.export.medium";
  const isHigh = tierKey === "dash.export.high";

  const titleKey =
    tierKey === "dash.export.high"
      ? "report.high.title"
      : tierKey === "dash.export.medium"
      ? "report.medium.title"
      : "report.previewTitle";

  const footerKey =
    tierKey === "dash.export.high"
      ? "report.footer.high"
      : tierKey === "dash.export.medium"
      ? "report.footer.medium"
      : "report.footer";

  useEffect(() => {
    const time = tier === "dash.export.high" ? 2200 : tier === "dash.export.medium" ? 1800 : 1500;
    setStage("generating");
    const timer = setTimeout(() => setStage("ready"), time);
    return () => clearTimeout(timer);
  }, [tier]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(15,46,38,0.45)", animation: "fadeIn 180ms ease both" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>

      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        style={{ animation: "popIn 220ms ease both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {stage === "generating" ? (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-12 h-12 rounded-full border-[3px] border-[#1F7A68]/20 border-t-[#1F7A68] animate-spin mb-5" />
            <p className="text-sm font-medium text-foreground">{t("report.generating")}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-5 bg-[#0F2E26] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1B5E38] flex items-center justify-center">
                  <FileText size={15} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white leading-tight">{t(titleKey)}</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: isHigh ? "#C97B10" : isMedium ? "#1D4ED8" : "#374151",
                        color: "white",
                        letterSpacing: "0.07em",
                        boxShadow: isHigh ? "0 0 0 1px #F0A818" : "none",
                      }}
                    >
                      {isHigh ? "PRO" : isMedium ? "STARTER" : "FREE"}
                    </span>
                  </div>
                  <p className="text-xs leading-tight" style={{ color: "#9FE1CB" }}>
                    {t("report.previewPeriod")}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Success banner */}
            <div className="flex items-center gap-2 px-6 py-2.5 bg-[#E8F5EE] border-b border-[#1B5E38]/10">
              <Sparkles size={13} className="text-[#1B5E38]" />
              <p className="text-xs font-medium text-[#1B5E38]">{t("report.ready")}</p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
              {/* Summary */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {t("report.section.summary")}
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {t("report.section.summary.body")}
                </p>
              </div>

              {/* Metrics grid */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {t("report.section.metrics")}
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {METRICS.map(({ label, value, color, bg }) => (
                    <div key={label} className="rounded-lg p-3.5" style={{ backgroundColor: bg }}>
                      <p className="text-2xl font-bold" style={{ color, fontFamily: "var(--font-mono)" }}>
                        {value}
                      </p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.72)" }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcomes */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {t("report.section.outcomes")}
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {t("report.section.outcomes.body")}
                </p>
              </div>

              {/* Medium + High: stakeholder quotes */}
              {(isMedium || isHigh) && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {t("report.section.quotes")}
                  </h3>
                  <div className="space-y-2">
                    {FEEDBACK_SNIPPETS.map(({ quoteKey, name, roleKey }) => (
                      <div key={name} className="flex gap-2 p-3 rounded-lg bg-white border border-black/[0.06] shadow-sm">
                        <Quote size={12} className="text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-foreground leading-relaxed mb-1">{t(quoteKey)}</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{name}</span> · {t(roleKey)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High only: full narrative + visual summary + SDG alignment */}
              {isHigh && (
                <>
                  <div className="mb-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      {t("report.section.narrative")}
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {t("report.section.narrative.body")}
                    </p>
                  </div>

                  {/* Visual Summary — before/after bar chart + activity donut */}
                  <div className="mb-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                      {t("report.section.visualSummary")}
                    </h3>

                    <p className="text-xs font-medium text-foreground mb-2">Net Profit Trend (Jan–Jun 2026)</p>
                    <div className="rounded-xl p-3 mb-4" style={{ background: "linear-gradient(135deg, #0F2E26 0%, #1A4A38 100%)" }}>
                      <p className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-mono)" }}>RM 57,500</p>
                      <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.50)" }}>Revenue RM 184,500 · Expenses RM 127,000</p>
                      <ResponsiveContainer width="100%" height={70}>
                        <AreaChart data={PROFIT_SPARKLINE_REPORT} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id="gradProfitReport" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgba(255,255,255,0.30)" stopOpacity={1} />
                              <stop offset="95%" stopColor="rgba(255,255,255,0)" stopOpacity={1} />
                            </linearGradient>
                          </defs>
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6, backgroundColor: "#0F2E26", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} formatter={(v: number) => [`RM ${v.toLocaleString()}`, "Profit"]} />
                          <Area type="monotone" dataKey="profit" stroke="rgba(255,255,255,0.80)" strokeWidth={1.5} fill="url(#gradProfitReport)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="text-xs font-medium text-foreground mb-2">{t("report.chart.activities")}</p>
                    <div className="flex items-center gap-3">
                      <PieChart width={130} height={130}>
                        <Pie
                          data={ACTIVITY_PIE_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={58}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {ACTIVITY_PIE_DATA.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E4EBF2" }}
                          formatter={(value: number) => [`${value}%`, ""]}
                        />
                      </PieChart>
                      <div className="flex flex-col gap-2 flex-1">
                        {ACTIVITY_PIE_DATA.map(({ name, value, color }) => (
                          <div key={name} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                              <span className="text-xs text-muted-foreground leading-tight">{name}</span>
                            </div>
                            <span
                              className="text-xs font-semibold ml-2 shrink-0"
                              style={{ color, fontFamily: "var(--font-mono)" }}
                            >
                              {value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      {t("report.section.sdgAlignment")}
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {t("report.section.sdgAlignment.body")}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Upgrade / downgrade note */}
            <div className="px-6 py-3 bg-[#FAEEDA]">
              <p className="text-xs text-[#633806]">
                {isHigh ? t("report.downgrade") : t("report.upgrade")}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{t(footerKey)}</p>
              <button
                onClick={onClose}
                className="flex items-center gap-2 bg-[#1F7A68] text-white text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-[#196658] transition-colors shrink-0 active:scale-[0.97]"
              >
                <Download size={13} />
                {t("report.download")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
