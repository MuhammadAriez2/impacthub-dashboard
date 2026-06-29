import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  Plug,
  ShieldCheck,
  Download,
  Users,
  Activity,
  ThumbsUp,
  CheckCircle2,
  ChevronDown,
  Quote,
  ArrowLeft,
  FileText,
  Star,
  Zap,
  Sparkles,
  BarChart3,
  Plus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ProgressScreen } from "./components/ProgressScreen";
import { PrivacyConsentScreen } from "./components/PrivacyConsentScreen";
import { IndustryForm } from "./components/IndustryForm";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { DataCleaningDemo } from "./components/DataCleaningDemo";
import { ReportPreviewModal } from "./components/ReportPreviewModal";
import { IndustryInsightsScreen } from "./components/IndustryInsightsScreen";
import { I18nProvider, useI18n } from "./i18n";
import impactHubLogo from "figma:asset/impacthub-logo.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "dashboard"
  | "log-activity"
  | "stakeholder-feedback"
  | "integrations"
  | "progress"
  | "privacy-consent"
  | "data-cleaning"
  | "industry-insights";

// ─── Data (translation keys instead of literal strings) ───────────────────────

const NAV_ITEMS: Array<{ icon: React.ElementType; labelKey: string; screen: Screen }> = [
  { icon: LayoutDashboard, labelKey: "nav.dashboard", screen: "dashboard" },
  { icon: ClipboardList, labelKey: "nav.logActivity", screen: "log-activity" },
  { icon: Plug, labelKey: "nav.integrations", screen: "integrations" },
  { icon: TrendingUp, labelKey: "nav.progress", screen: "progress" },
  { icon: BarChart3, labelKey: "nav.industryInsights", screen: "industry-insights" },
  { icon: MessageSquare, labelKey: "nav.stakeholderFeedback", screen: "stakeholder-feedback" },
  { icon: ShieldCheck, labelKey: "nav.privacyConsent", screen: "privacy-consent" },
];

const METRICS = [
  {
    icon: Users,
    labelKey: "metric.peopleReached",
    value: "2,184",
    trendPct: 12,
    trendUp: true,
    iconColor: "text-[#1B5E38]",
    iconBg: "bg-[#C2E8D4]",
    cardBg: "bg-[#E8F5EE]",
    valueColor: "text-[#1B5E38]",
    labelColor: "text-[#1B5E38]",
    trendColor: "text-[#3A8A5E]",
  },
  {
    icon: Activity,
    labelKey: "metric.activitiesLogged",
    value: "312",
    trendPct: 8,
    trendUp: true,
    showAdd: true,
    iconColor: "text-[#1A3A6B]",
    iconBg: "bg-[#C5D9F5]",
    cardBg: "bg-[#EBF3FB]",
    valueColor: "text-[#1A3A6B]",
    labelColor: "text-[#1A3A6B]",
    trendColor: "text-[#2E5EA6]",
  },
  {
    icon: ThumbsUp,
    labelKey: "metric.feedbackResponses",
    value: "148",
    trendPct: 5,
    trendUp: true,
    iconColor: "text-[#633806]",
    iconBg: "bg-[#F5D9A8]",
    cardBg: "bg-[#FAEEDA]",
    valueColor: "text-[#633806]",
    labelColor: "text-[#633806]",
    trendColor: "text-[#8B5015]",
  },
];

const PROGRESS_ITEMS = [
  { labelKey: "progressItem.digitalLiteracy", before: 28, after: 71, unitKey: "progressItem.digitalLiteracy.unit" },
  { labelKey: "progressItem.jobConfidence", before: 35, after: 68, unitKey: "progressItem.jobConfidence.unit" },
  { labelKey: "progressItem.monthlyIncome", before: 42, after: 79, unitKey: "progressItem.monthlyIncome.unit" },
];

const MONTHLY_TREND = [
  { month: "Jan", people: 320, activities: 38 },
  { month: "Feb", people: 410, activities: 45 },
  { month: "Mar", people: 580, activities: 62 },
  { month: "Apr", people: 720, activities: 71 },
  { month: "May", people: 980, activities: 88 },
  { month: "Jun", people: 1240, activities: 104 },
];

const BEST_ACTIVITY = { pct: 71 };

const FEEDBACK_QUOTES = [
  {
    roleKey: "role.beneficiary",
    name: "Siti Rahimah, 32",
    date: "12 June 2026",
    textKey: "quote.siti",
    avatar: "SR",
    avatarColor: "bg-[#EAF4F1] text-[#1F7A68]",
    rating: 5,
  },
  {
    roleKey: "role.investor",
    name: "Dato' Razif Hasnan",
    date: "8 June 2026",
    textKey: "quote.razif",
    avatar: "DH",
    avatarColor: "bg-[#EBF3FA] text-[#2E6EA6]",
    rating: 5,
  },
  {
    roleKey: "role.beneficiary",
    name: "Ahmad Fadzli, 28",
    date: "5 June 2026",
    textKey: "quote.ahmad",
    avatar: "AF",
    avatarColor: "bg-[#FAEEDA] text-[#633806]",
    rating: 4,
  },
  {
    roleKey: "role.communityPartner",
    name: "Pn. Zuraidah Musa",
    date: "2 June 2026",
    textKey: "quote.zuraidah",
    avatar: "ZM",
    avatarColor: "bg-[#EAF4F1] text-[#1F7A68]",
    rating: 5,
  },
];

const CONNECTED_SOURCES = [
  {
    nameKey: "source.googleDrive",
    descKey: "source.googleDrive.desc",
    statusKey: "status.synced",
    lastSyncKey: "source.lastSync.drive",
    icon: "📁",
    statusColor: "text-[#1F7A68] bg-[#EAF4F1]",
  },
  {
    nameKey: "source.googleSheets",
    descKey: "source.googleSheets.desc",
    statusKey: "status.synced",
    lastSyncKey: "source.lastSync.sheets",
    icon: "📊",
    statusColor: "text-[#1F7A68] bg-[#EAF4F1]",
  },
  {
    nameKey: "source.pdpaLog",
    descKey: "source.pdpaLog.desc",
    statusKey: "status.active",
    lastSyncKey: "source.lastSync.pdpa",
    icon: "🔒",
    statusColor: "text-[#2E6EA6] bg-[#EBF3FA]",
  },
];

const EXPORT_OPTIONS = [
  { labelKey: "dash.export.basic", icon: FileText, descKey: "dash.export.basic.desc", tierKey: "dash.tier.free" },
  { labelKey: "dash.export.medium", icon: Star, descKey: "dash.export.medium.desc", tierKey: "dash.tier.starter" },
  { labelKey: "dash.export.high", icon: Zap, descKey: "dash.export.high.desc", tierKey: "dash.tier.pro" },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-2 bg-[#E4EBF2] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activeNav,
  onNavigate,
}: {
  activeNav: string;
  onNavigate: (labelKey: string, screen: Screen) => void;
}) {
  const { t } = useI18n();
  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full"
      style={{ backgroundColor: "#0F2E26" }}
    >
      <div
        className="px-6 py-5 flex items-center gap-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
          <img src={impactHubLogo} alt={t("app.name")} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <span className="block font-bold text-white text-base tracking-tight leading-tight">{t("app.name")}</span>
          <span className="block text-[9px] uppercase tracking-wider" style={{ color: "#9FE1CB" }}>
            Measure · Act · Impact
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, labelKey, screen }) => {
          const isActive = activeNav === labelKey;
          return (
            <button
              key={labelKey}
              onClick={() => onNavigate(labelKey, screen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left"
              style={
                isActive
                  ? { backgroundColor: "#1B5E38", color: "#ffffff" }
                  : { color: "#9FE1CB" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(159,225,203,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#9FE1CB";
                }
              }}
            >
              <Icon size={17} />
              {t(labelKey)}
            </button>
          );
        })}
      </nav>

      <div
        className="px-3 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <LanguageSwitcher />
      </div>

      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#1B5E38" }}
          >
            <span className="text-white text-sm font-semibold">NR</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{t("user.name")}</p>
            <p className="text-xs truncate" style={{ color: "#9FE1CB" }}>
              {t("user.org")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 250);
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 bg-[#0F2E26] text-white px-5 py-3.5 rounded-xl shadow-lg"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        transition: "opacity 220ms ease, transform 220ms ease",
      }}
    >
      <div className="w-6 h-6 rounded-full bg-[#1F7A68] flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={14} className="text-white" />
      </div>
      <span className="text-sm font-medium">{t("toast.logged")}</span>
    </div>
  );
}

// ─── Dashboard screen ─────────────────────────────────────────────────────────

function DashboardScreen({
  onNavigate,
}: {
  onNavigate: (labelKey: string, screen: Screen) => void;
}) {
  const { t } = useI18n();
  const [showExport, setShowExport] = useState(false);
  const [selectedExportKey, setSelectedExportKey] = useState<string | null>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [reportTier, setReportTier] = useState<string>("dash.export.basic");
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExport(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">{t("dash.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("dash.subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1" ref={exportRef}>
          <div className="relative">
            <button
              onClick={() => setShowExport((v) => !v)}
              className="flex items-center gap-2 bg-[#1F7A68] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#196658] transition-colors"
            >
              <Download size={15} />
              {selectedExportKey ? t(selectedExportKey) : t("dash.export")}
              <ChevronDown
                size={13}
                className="opacity-80 transition-transform duration-200"
                style={{ transform: showExport ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {showExport && (
              <div
                className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-40"
                style={{ animation: "dropIn 180ms ease both" }}
              >
                {EXPORT_OPTIONS.map(({ labelKey, icon: Icon, descKey, tierKey }) => (
                  <button
                    key={labelKey}
                    onClick={() => {
                      setSelectedExportKey(labelKey);
                      setShowExport(false);
                      setReportTier(labelKey);
                      setShowReportPreview(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F0F3F6] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EAF4F1] flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[#1F7A68]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{t(labelKey)}</p>
                      <p className="text-xs text-muted-foreground">{t(descKey)}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {t(tierKey)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("dash.exportHint")}
          </p>
        </div>
      </div>

      {/* Metric cards — 3 columns with trend indicators */}
      <div className="grid grid-cols-3 gap-4">
        {METRICS.map(({ icon: Icon, labelKey, value, trendPct, trendUp, showAdd, iconColor, iconBg, cardBg, valueColor, labelColor, trendColor }) => (
          <div
            key={labelKey}
            className={`${cardBg} rounded-xl border border-transparent p-4 hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon size={17} className={iconColor} />
              </div>
              {showAdd && (
                <button
                  onClick={() => onNavigate("nav.logActivity", "log-activity")}
                  className="w-7 h-7 rounded-lg bg-[#1F7A68] flex items-center justify-center hover:bg-[#196658] transition-colors"
                  title={t("dash.addActivity")}
                >
                  <Plus size={14} className="text-white" />
                </button>
              )}
            </div>
            <p
              className={`text-2xl font-bold ${valueColor} tracking-tight`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {value}
            </p>
            <p className={`text-xs font-medium ${labelColor} mt-0.5`}>{t(labelKey)}</p>
            <div className={`flex items-center gap-0.5 mt-1.5 text-xs font-medium ${trendColor}`}>
              {trendUp ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
              <span>{trendPct}% {t("dash.trend.label")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mid row: Trend chart | Best performing activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
        {/* 6-month area chart */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-0.5">{t("dash.chart.title")}</h2>
          <p className="text-xs text-muted-foreground mb-4">{t("dash.chart.subtitle")}</p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={MONTHLY_TREND} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="gradPeople" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F7A68" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1F7A68" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradActivities" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A3A6B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1A3A6B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4EBF2" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5C7389" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5C7389" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E4EBF2" }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="people" stroke="#1F7A68" strokeWidth={2} fill="url(#gradPeople)" name={t("metric.peopleReached")} />
              <Area type="monotone" dataKey="activities" stroke="#1A3A6B" strokeWidth={2} fill="url(#gradActivities)" name={t("metric.activitiesLogged")} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F7A68]" />
              <span className="text-xs text-muted-foreground">{t("metric.peopleReached")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A3A6B]" />
              <span className="text-xs text-muted-foreground">{t("metric.activitiesLogged")}</span>
            </div>
          </div>
        </div>

        {/* Best performing activity */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-sm font-semibold text-foreground">{t("dash.bestActivity.title")}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-5">{t("dash.bestActivity.period")}</p>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#E8F5EE] border border-[#1B5E38]/10 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1F7A68] flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1B5E38]">{t("dash.bestActivity.type")}</p>
              <p className="text-xs text-[#3A8A5E] mt-0.5">{t("dash.bestActivity.stat")}</p>
            </div>
            <span
              className="text-2xl font-bold text-[#1B5E38] shrink-0"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {BEST_ACTIVITY.pct}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{t("dash.bestActivity.desc")}</p>
        </div>
      </div>
    </div>

    {showReportPreview && (
      <ReportPreviewModal tier={reportTier} onClose={() => setShowReportPreview(false)} />
    )}
    </>
  );
}

// ─── Log Activity screen ──────────────────────────────────────────────────────

function LogActivityScreen({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        {t("common.back")}
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {t("logActivity.title")}
          </h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#FAEEDA] text-[#633806]">
            {t("dash.logCard.badge")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("logActivity.subtitle")}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        {/* Date row */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            {t("logActivity.dateLabel")}
          </label>
          <input
            type="date"
            defaultValue="2026-06-24"
            className="w-full bg-[#F0F3F6] border border-border text-foreground text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1F7A68]/30 focus:border-[#1F7A68]"
          />
        </div>

        <IndustryForm onSubmit={onSuccess} submitLabelKey="form.submitDefault" />

        <div className="mt-4 p-3 rounded-lg bg-[#EBF3FA] border border-[#2E6EA6]/20">
          <p className="text-xs text-[#2E6EA6] font-medium">
            {t("logActivity.pdpaNote")}
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="mt-3 w-full text-sm font-medium py-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
      >
        {t("common.cancel")}
      </button>
    </div>
  );
}

// ─── Stakeholder feedback screen ──────────────────────────────────────────────

function StakeholderFeedbackScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [reflectionText, setReflectionText] = useState("");
  const [founderNotes, setFounderNotes] = useState<string[]>([]);

  function handleSubmitReflection() {
    const trimmed = reflectionText.trim();
    if (!trimmed) return;
    setFounderNotes((prev) => [trimmed, ...prev]);
    setReflectionText("");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        {t("common.back")}
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">
          {t("feedback.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("feedback.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { labelKey: "feedback.totalResponses", value: "148", color: "text-[#1B5E38]", bg: "bg-[#E8F5EE]" },
          { labelKey: "feedback.avgSatisfaction", value: "4.8 / 5", color: "text-[#1A3A6B]", bg: "bg-[#EBF3FB]" },
          { labelKey: "feedback.responseRate", value: "47%", color: "text-[#633806]", bg: "bg-[#FAEEDA]" },
        ].map(({ labelKey, value, color, bg }) => (
          <div key={labelKey} className={`${bg} rounded-xl p-4`}>
            <p
              className={`text-xl font-bold ${color} tracking-tight`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {value}
            </p>
            <p className={`text-xs font-medium ${color} mt-0.5`}>{t(labelKey)}</p>
          </div>
        ))}
      </div>

      {/* Founder reflection input */}
      <div className="bg-[#E8F5EE] rounded-xl border border-[#1B5E38]/15 p-5 mb-6">
        <h2 className="text-sm font-semibold text-[#1B5E38] mb-0.5">{t("feedback.addReflection")}</h2>
        <p className="text-xs text-[#3A8A5E] mb-3">{t("feedback.reflectionDesc")}</p>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder={t("feedback.reflectionPlaceholder")}
          rows={3}
          className="w-full bg-white border border-[#1B5E38]/20 text-foreground text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1F7A68]/30 focus:border-[#1F7A68] resize-none mb-3"
        />
        <button
          onClick={handleSubmitReflection}
          disabled={!reflectionText.trim()}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-[#1F7A68] text-white hover:bg-[#196658] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("feedback.submit")}
        </button>
      </div>

      {/* Founder notes */}
      {founderNotes.length > 0 && (
        <div className="space-y-3 mb-6">
          {founderNotes.map((note, i) => (
            <div key={i} className="bg-[#0F2E26] rounded-xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1B5E38] flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white">
                NR
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-white">{t("user.name")}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#1B5E38] text-[#9FE1CB] font-medium">{t("feedback.founderNote")}</span>
                </div>
                <p className="text-xs text-[#9FE1CB] leading-relaxed">{note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 pb-6">
        {FEEDBACK_QUOTES.map(({ roleKey, name, date, textKey, avatar, avatarColor, rating }) => (
          <div key={name} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 text-sm font-semibold`}>
                {avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground bg-[#E4EBF2] px-2 py-0.5 rounded-full">{t(roleKey)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{date}</span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i < rating ? "#F5A623" : "#E4EBF2"}>
                      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8l-2.78 1.55.53-3.09L1.5 4.27l3.11-.45L6 1z" />
                    </svg>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Quote size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(textKey)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Integrations screen ──────────────────────────────────────────────────────

function IntegrationsScreen({
  onBack,
  onNavigateToCleaning,
}: {
  onBack: () => void;
  onNavigateToCleaning: () => void;
}) {
  const { t } = useI18n();
  const [syncing, setSyncing] = useState<string | null>(null);

  function handleSync(nameKey: string) {
    setSyncing(nameKey);
    setTimeout(() => setSyncing(null), 1800);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        {t("common.back")}
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">{t("integrations.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("integrations.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-[#E8F5EE] border border-[#1B5E38]/20 rounded-xl px-4 py-3 mb-6">
        <CheckCircle2 size={16} className="text-[#1B5E38] flex-shrink-0" />
        <p className="text-sm font-medium text-[#1B5E38]">{t("integrations.allConnected")}</p>
      </div>

      <div className="space-y-3 mb-6">
        {CONNECTED_SOURCES.map(({ nameKey, descKey, statusKey, lastSyncKey, icon, statusColor }) => {
          const isSyncing = syncing === nameKey;
          return (
            <div key={nameKey} className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0F3F6] flex items-center justify-center flex-shrink-0 text-2xl">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground">{t(nameKey)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>{t(statusKey)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t(descKey)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("integrations.lastSync")} {isSyncing ? t("integrations.syncingNow") : t(lastSyncKey)}
                </p>
              </div>
              <button
                onClick={() => handleSync(nameKey)}
                disabled={isSyncing}
                className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                  isSyncing
                    ? "border-[#1F7A68]/30 text-[#1F7A68] bg-[#EAF4F1]"
                    : "border-border text-muted-foreground hover:border-[#1F7A68] hover:text-[#1F7A68]"
                }`}
              >
                {isSyncing ? t("integrations.syncing") : t("integrations.syncNow")}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNavigateToCleaning}
        className="w-full bg-white rounded-xl border border-border p-5 flex items-center gap-4 hover:border-[#1F7A68]/40 hover:bg-[#F8FAFB] transition-colors text-left mb-4"
      >
        <div className="w-12 h-12 rounded-xl bg-[#FAEEDA] flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-[#633806]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{t("cleaning.title")}</p>
          <p className="text-xs text-muted-foreground">{t("integrations.cleaningLinkDesc")}</p>
        </div>
        <ArrowLeft size={15} className="text-muted-foreground rotate-180" />
      </button>

      <div className="bg-white rounded-xl border border-dashed border-[#1F7A68]/40 p-5 flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#EAF4F1] flex items-center justify-center flex-shrink-0">
          <span className="text-[#1F7A68] text-xl">+</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{t("integrations.addSource.title")}</p>
          <p className="text-xs text-muted-foreground">{t("integrations.addSource.desc")}</p>
        </div>
        <button className="text-xs font-medium px-3 py-2 rounded-lg bg-[#1F7A68] text-white hover:bg-[#196658] transition-colors">
          {t("integrations.connect")}
        </button>
      </div>

      <div className="p-4 rounded-xl bg-[#EBF3FA] border border-[#2E6EA6]/20 pb-6">
        <p className="text-sm font-medium text-[#2E6EA6] mb-1">{t("integrations.privacyTitle")}</p>
        <p className="text-xs text-[#2E6EA6]/80 leading-relaxed">
          {t("integrations.privacyBody")}
        </p>
      </div>
    </div>
  );
}

// ─── App shell (uses i18n, must be inside provider) ───────────────────────────

function AppShell() {
  const { t } = useI18n();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [activeNav, setActiveNav] = useState("nav.dashboard");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function navigate(labelKey: string, target: Screen) {
    if (target === screen) { setActiveNav(labelKey); return; }
    setIsAnimating(true);
    setTimeout(() => {
      setScreen(target);
      setActiveNav(labelKey);
      setIsAnimating(false);
    }, 180);
  }

  function goBack() { navigate("nav.dashboard", "dashboard"); }

  function handleLogSuccess() {
    setShowToast(true);
    setIsAnimating(true);
    setTimeout(() => {
      setScreen("dashboard");
      setActiveNav("nav.dashboard");
      setIsAnimating(false);
    }, 180);
  }

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-background"
      style={{ fontFamily: "var(--font-family)" }}
    >
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
      `}</style>

      <Sidebar activeNav={activeNav} onNavigate={navigate} />

      <main
        className="flex-1 overflow-y-auto"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 180ms ease, transform 180ms ease",
        }}
      >
        {screen === "dashboard" && <DashboardScreen onNavigate={navigate} />}
        {screen === "log-activity" && (
          <LogActivityScreen onBack={goBack} onSuccess={handleLogSuccess} />
        )}
        {screen === "stakeholder-feedback" && (
          <StakeholderFeedbackScreen onBack={goBack} />
        )}
        {screen === "progress" && <ProgressScreen onBack={goBack} />}
        {screen === "integrations" && (
          <IntegrationsScreen
            onBack={goBack}
            onNavigateToCleaning={() => navigate("nav.dataCleaning", "data-cleaning")}
          />
        )}
        {screen === "data-cleaning" && <DataCleaningDemo onBack={() => navigate("nav.integrations", "integrations")} />}
        {screen === "industry-insights" && <IndustryInsightsScreen onBack={goBack} />}
        {screen === "privacy-consent" && <PrivacyConsentScreen onBack={goBack} />}
      </main>

      {showToast && <Toast onDone={() => setShowToast(false)} />}
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}
