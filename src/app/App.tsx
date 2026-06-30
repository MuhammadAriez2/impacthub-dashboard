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
  AlertCircle,
  ChevronRight,
  Banknote,
  ShoppingCart,
  FolderCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ProgressScreen } from "./components/ProgressScreen";
import { PrivacyConsentScreen } from "./components/PrivacyConsentScreen";
import { IndustryForm } from "./components/IndustryForm";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { DataCleaningDemo } from "./components/DataCleaningDemo";
import { ReportPreviewModal } from "./components/ReportPreviewModal";
import { IndustryInsightsScreen } from "./components/IndustryInsightsScreen";
import { PROJECTS } from "./data/projects";
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

// Impact Score sub-components — weights sum to 1.00
// Reach Performance: avg of People Reached target (73%) + Activities Logged target (78%) = 75
const REACH_SCORE = 75;
// Outcome Strength: avg outcome achievement across 3 PROGRESS_ITEMS → illustrative 80
const OUTCOME_SCORE = 80;
// Trust & Compliance: PDPA consent composite (5/6 consented with 1 quality flag) → illustrative 79
const TRUST_SCORE = 79;
// Weighted composite: 0.40×75 + 0.35×80 + 0.25×79 = 77.75 → 78
const IMPACT_SCORE = Math.round(REACH_SCORE * 0.40 + OUTCOME_SCORE * 0.35 + TRUST_SCORE * 0.25);
const CONSENT_ISSUES = 1;
const TOTAL_BENEFICIARIES_CONSENT = 6;
const CONSENTED_COUNT = TOTAL_BENEFICIARIES_CONSENT - CONSENT_ISSUES;
const SCORE_DATA = [
  { value: IMPACT_SCORE, color: "#1F7A68" },
  { value: 100 - IMPACT_SCORE, color: "#E4EBF2" },
];
const SCORE_DATA_DARK = [
  { value: IMPACT_SCORE, color: "#4ACED1" },
  { value: 100 - IMPACT_SCORE, color: "rgba(255,255,255,0.12)" },
];

// Founder-view business summary metrics — Total Earnings first (most important), Feedback last
const FOUNDER_METRICS = [
  { icon: Banknote,     label: "Total Earnings",     value: "RM 184,500", unit: "this quarter",           color: "#1A3A6B", iconBg: "bg-[#C5D9F5]", iconColor: "text-[#1A3A6B]", cardBg: "bg-[#EBF3FB]" },
  { icon: ShoppingCart, label: "Products Sold",      value: "847",        unit: "sessions delivered",     color: "#1B5E38", iconBg: "bg-[#C2E8D4]", iconColor: "text-[#1B5E38]", cardBg: "bg-[#E8F5EE]" },
  { icon: FolderCheck,  label: "Projects Completed", value: "1",          unit: "of 3 active",            color: "#633806", iconBg: "bg-[#F5D9A8]", iconColor: "text-[#633806]", cardBg: "bg-[#FAEEDA]" },
  { icon: ThumbsUp,     label: "Feedback Responses", value: "148",        unit: "collected this quarter", color: "#5C7389", iconBg: "bg-[#E2E8F0]", iconColor: "text-[#5C7389]", cardBg: "bg-[#F1F5F9]" },
];

// All 17 official UN SDGs — aligned ones are highlighted, others dimmed
const SDG_ALL = [
  { n: 1,  color: "#E5243B", icon: "👨‍👩‍👧", title: "NO POVERTY" },
  { n: 2,  color: "#DDA63A", icon: "🍲",      title: "ZERO HUNGER" },
  { n: 3,  color: "#4C9F38", icon: "❤️",      title: "GOOD HEALTH & WELL-BEING" },
  { n: 4,  color: "#C5192D", icon: "📖",      title: "QUALITY EDUCATION" },
  { n: 5,  color: "#FF3A21", icon: "⚧️",      title: "GENDER EQUALITY" },
  { n: 6,  color: "#26BDE2", icon: "💧",      title: "CLEAN WATER & SANITATION" },
  { n: 7,  color: "#FCC30B", icon: "☀️",      title: "AFFORDABLE CLEAN ENERGY" },
  { n: 8,  color: "#A21942", icon: "📊",      title: "DECENT WORK & ECONOMIC GROWTH" },
  { n: 9,  color: "#FD6925", icon: "🏗️",      title: "INDUSTRY & INNOVATION" },
  { n: 10, color: "#DD1367", icon: "↕️",      title: "REDUCED INEQUALITIES" },
  { n: 11, color: "#FD9D24", icon: "🏙️",      title: "SUSTAINABLE CITIES" },
  { n: 12, color: "#BF8B2E", icon: "♻️",      title: "RESPONSIBLE CONSUMPTION" },
  { n: 13, color: "#3F7E44", icon: "🌍",      title: "CLIMATE ACTION" },
  { n: 14, color: "#0A97D9", icon: "🐟",      title: "LIFE BELOW WATER" },
  { n: 15, color: "#56C02B", icon: "🌳",      title: "LIFE ON LAND" },
  { n: 16, color: "#00689D", icon: "🕊️",      title: "PEACE, JUSTICE & STRONG INSTITUTIONS" },
  { n: 17, color: "#19486A", icon: "🔗",      title: "PARTNERSHIPS FOR THE GOALS" },
];
const SDG_ALIGNED_SET = new Set([1, 3, 4, 5, 8, 10]);

const PROGRESS_ITEMS = [
  { labelKey: "progressItem.digitalLiteracy", before: 28, after: 71, unitKey: "progressItem.digitalLiteracy.unit" },
  { labelKey: "progressItem.jobConfidence", before: 35, after: 68, unitKey: "progressItem.jobConfidence.unit" },
  { labelKey: "progressItem.monthlyIncome", before: 42, after: 79, unitKey: "progressItem.monthlyIncome.unit" },
];


const WORKFORCE_STATS = [
  "dash.corp.workforce.stat1",
  "dash.corp.workforce.stat2",
  "dash.corp.workforce.stat3",
] as const;

const MONTHLY_TREND = [
  { month: "Jan", people: 320, activities: 38 },
  { month: "Feb", people: 410, activities: 45 },
  { month: "Mar", people: 580, activities: 62 },
  { month: "Apr", people: 720, activities: 71 },
  { month: "May", people: 980, activities: 88 },
  { month: "Jun", people: 1240, activities: 104 },
];

const BEST_ACTIVITY = { pct: 71 };

const PROFIT_SPARKLINE = [
  { month: "Jan", revenue: 108000, expenses: 82000 },
  { month: "Feb", revenue: 124500, expenses: 91000 },
  { month: "Mar", revenue: 138000, expenses: 98000 },
  { month: "Apr", revenue: 151500, expenses: 108000 },
  { month: "May", revenue: 168000, expenses: 119000 },
  { month: "Jun", revenue: 184500, expenses: 127000 },
];

// Beneficiary type breakdown across all programmes (totals 2,184)
const BENEFICIARY_TYPES = [
  { name: "B40 Youth", value: 895, color: "#1F7A68" },
  { name: "Women", value: 640, color: "#4ACED1" },
  { name: "Disabled Persons", value: 287, color: "#1A3A6B" },
  { name: "Refugees", value: 362, color: "#F5A623" },
];

// Reach split: B2C (individuals) vs B2B (partner orgs)
const CUSTOMER_REACH = [
  { name: "Individuals", value: 2166, color: "#1F7A68" },
  { name: "Organisations", value: 18, color: "#4ACED1" },
];

// ESG illustrative scores for Corporate View
const ESG_SCORES = [
  { label: "Environmental", score: 62, color: "#4C9F38", bg: "#E8F5EE", textColor: "#1B5E38" },
  { label: "Social", score: 78, color: "#1A3A6B", bg: "#EBF3FB", textColor: "#1A3A6B" },
  { label: "Governance", score: 71, color: "#1F7A68", bg: "#EAF4F1", textColor: "#1F7A68" },
];


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
      style={{ backgroundColor: "#0F2E26", boxShadow: "3px 0 14px rgba(0,0,0,0.20)" }}
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left active:scale-[0.97]"
              style={
                isActive
                  ? { backgroundColor: "#1B5E38", color: "#ffffff", borderLeft: "3px solid #4ACED1", paddingLeft: "9px" }
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{t("dash.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("dash.subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1" ref={exportRef}>
          <div className="relative">
            <button
              onClick={() => setShowExport((v) => !v)}
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #1F7A68 0%, #0F5748 100%)",
                boxShadow: "0 4px 14px rgba(31,122,104,0.40), 0 1px 3px rgba(31,122,104,0.25)",
              }}
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

      {/* Impact Score — full-width synthesis card */}
      <div
        className="rounded-xl p-5"
        style={{ background: "linear-gradient(135deg, #0A1F40 0%, #1A3A6B 100%)", border: "1px solid rgba(26,58,107,0.8)", boxShadow: "0 8px 28px rgba(26,58,107,0.30), 0 2px 8px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-6">
          <div className="relative shrink-0" style={{ width: 164, height: 164 }}>
            <PieChart width={164} height={164}>
              <Pie data={SCORE_DATA_DARK} cx="50%" cy="50%" innerRadius={54} outerRadius={72} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {SCORE_DATA_DARK.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-mono)", lineHeight: 1 }}>{IMPACT_SCORE}</span>
              <span className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{t("dash.score.outOf")}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-bold text-white tracking-tight">{t("dash.score.title")}</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>{t("dash.score.period")}</span>
            </div>
            <div className="space-y-2">
              {([
                { labelKey: "dash.score.reach", score: REACH_SCORE },
                { labelKey: "dash.score.outcome", score: OUTCOME_SCORE },
                { labelKey: "dash.score.trust", score: TRUST_SCORE },
              ] as const).map(({ labelKey, score }) => (
                <div key={labelKey}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.60)" }}>{t(labelKey)}</span>
                    <span className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.90)", fontFamily: "var(--font-mono)" }}>{score}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: "#4ACED1" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION A: FOUNDER VIEW ═══ */}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5" style={{ letterSpacing: "0.12em" }}>Founder View</p>
          <div className="flex items-end gap-3">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{t("dash.founder.title")}</h2>
            <p className="text-sm text-muted-foreground mb-0.5">{t("dash.founder.subtitle")}</p>
          </div>
        </div>

        {/* Compliance flag */}
        {CONSENT_ISSUES > 0 ? (
          <button onClick={() => onNavigate("nav.privacyConsent", "privacy-consent")} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#F5A623]/40 bg-[#FAEEDA] hover:bg-[#F5E4C2] transition-colors text-left">
            <AlertCircle size={14} className="text-[#633806] shrink-0" />
            <p className="flex-1 text-sm text-[#633806]">
              <span className="font-semibold">{CONSENT_ISSUES}</span>{" "}{t("dash.consent.flag")}
            </p>
            <ChevronRight size={14} className="text-[#633806]/60 shrink-0" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#1B5E38]/20 bg-[#E8F5EE]">
            <CheckCircle2 size={14} className="text-[#1B5E38] shrink-0" />
            <p className="text-sm text-[#1B5E38]">{t("dash.consent.ok")}</p>
          </div>
        )}

        {/* Founder summary metrics — 4 cards: Earnings | Products | Projects | Feedback */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUNDER_METRICS.map(({ icon: Icon, label, value, unit, color, iconBg, iconColor, cardBg }) => (
            <div key={label} className={`${cardBg} rounded-xl border border-black/[0.05] p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
                <Icon size={17} className={iconColor} />
              </div>
              <p className="text-3xl font-bold tracking-tight leading-none" style={{ color, fontFamily: "var(--font-mono)" }}>{value}</p>
              <p className="text-sm font-semibold mt-1.5" style={{ color }}>{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{unit}</p>
            </div>
          ))}
        </div>

        {/* Profit card — full width in Founder section */}
        <div className="rounded-xl p-5 shadow-md" style={{ background: "linear-gradient(135deg, #0F2E26 0%, #1A4A38 100%)", border: "1px solid rgba(31,122,104,0.5)" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
              <Banknote size={17} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.60)" }}>Profit</p>
              <div className="flex items-center gap-0.5 text-xs font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                <ArrowUp size={11} /><span>+17% vs last month</span>
              </div>
            </div>
          </div>
          <p className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-mono)" }}>RM 57,500</p>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.42)" }}>Net profit = Revenue − Expenses</p>
          <p className="text-[11px] mt-3 mb-1" style={{ color: "rgba(255,255,255,0.50)" }}>6-month revenue vs expenses</p>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={PROFIT_SPARKLINE} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.30)" stopOpacity={1} />
                  <stop offset="95%" stopColor="rgba(255,255,255,0)" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(245,166,35,0.25)" stopOpacity={1} />
                  <stop offset="95%" stopColor="rgba(245,166,35,0)" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, backgroundColor: "#0F2E26", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} labelStyle={{ color: "rgba(255,255,255,0.6)" }} formatter={(v: number) => [`RM ${v.toLocaleString()}`]} />
              <Area type="monotone" dataKey="revenue" stroke="rgba(255,255,255,0.80)" strokeWidth={1.5} fill="url(#gradRevenue)" dot={false} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#F5A623" strokeWidth={1.5} fill="url(#gradExpenses)" dot={false} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white opacity-80" /><span className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>Revenue (RM 184,500)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F5A623]" /><span className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>Expenses (RM 127,000)</span></div>
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>RM 57,500 {t("dash.metric.of")} RM 75,000 {t("dash.metric.target")}</span>
              <span className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-mono)" }}>77%</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: "77%", backgroundColor: "rgba(255,255,255,0.70)" }} />
            </div>
          </div>
        </div>


        {/* Customers Reached + Beneficiaries Helped — 2-col pie chart cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Customers Reached breakdown */}
          <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
            <h2 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5" style={{ borderLeft: "3px solid #4ACED1" }}>Customers Reached</h2>
            <p className="text-xs text-muted-foreground mb-3">Reach by engagement type</p>
            <div className="flex justify-center">
              <PieChart width={230} height={230}>
                <Pie
                  data={CUSTOMER_REACH}
                  cx="50%" cy="50%"
                  innerRadius={0} outerRadius={102}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; value: number; percent: number }) => {
                    if (percent < 0.08) return null;
                    const RADIAN = Math.PI / 180;
                    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                    const x = cx + r * Math.cos(-midAngle * RADIAN);
                    const y = cy + r * Math.sin(-midAngle * RADIAN);
                    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="700" style={{ fontFamily: "var(--font-mono)" }}>{value.toLocaleString()}</text>;
                  }}
                  labelLine={false}
                >
                  {CUSTOMER_REACH.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
              {CUSTOMER_REACH.map((e) => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} /><span className="text-xs text-muted-foreground">{e.name}</span></div>
                  <span className="text-xs font-bold" style={{ color: e.color, fontFamily: "var(--font-mono)" }}>{e.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-2 pt-1.5" style={{ borderTop: "1px solid #E4EBF2" }}>Total: 2,184 reached</p>
          </div>

          {/* Beneficiaries Helped breakdown */}
          <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
            <h2 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5" style={{ borderLeft: "3px solid #4ACED1" }}>Beneficiaries Helped</h2>
            <p className="text-xs text-muted-foreground mb-3">By community group</p>
            <div className="flex justify-center">
              <PieChart width={230} height={230}>
                <Pie
                  data={BENEFICIARY_TYPES}
                  cx="50%" cy="50%"
                  innerRadius={0} outerRadius={102}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; value: number; percent: number }) => {
                    if (percent < 0.08) return null;
                    const RADIAN = Math.PI / 180;
                    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                    const x = cx + r * Math.cos(-midAngle * RADIAN);
                    const y = cy + r * Math.sin(-midAngle * RADIAN);
                    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="700" style={{ fontFamily: "var(--font-mono)" }}>{value}</text>;
                  }}
                  labelLine={false}
                >
                  {BENEFICIARY_TYPES.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
              {BENEFICIARY_TYPES.map((e) => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} /><span className="text-xs text-muted-foreground">{e.name}</span></div>
                  <span className="text-xs font-bold" style={{ color: e.color, fontFamily: "var(--font-mono)" }}>{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trend chart + Best performing activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
            <h2 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5" style={{ borderLeft: "3px solid #4ACED1" }}>{t("dash.chart.title")}</h2>
            <p className="text-xs text-muted-foreground mb-4">{t("dash.chart.subtitle")}</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={MONTHLY_TREND} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                <defs>
                  <linearGradient id="gradPeople" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F7A68" stopOpacity={0.2} /><stop offset="95%" stopColor="#1F7A68" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradActivities" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A3A6B" stopOpacity={0.2} /><stop offset="95%" stopColor="#1A3A6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4EBF2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5C7389" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5C7389" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E4EBF2" }} labelStyle={{ fontWeight: 600 }} />
                <Area type="monotone" dataKey="people" stroke="#1F7A68" strokeWidth={2} fill="url(#gradPeople)" name={t("metric.peopleReached")} />
                <Area type="monotone" dataKey="activities" stroke="#1A3A6B" strokeWidth={2} fill="url(#gradActivities)" name={t("metric.activitiesLogged")} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1F7A68]" /><span className="text-xs text-muted-foreground">{t("metric.peopleReached")}</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1A3A6B]" /><span className="text-xs text-muted-foreground">{t("metric.activitiesLogged")}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
            <h2 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5" style={{ borderLeft: "3px solid #4ACED1" }}>{t("dash.bestActivity.title")}</h2>
            <p className="text-xs text-muted-foreground mb-5">{t("dash.bestActivity.period")}</p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#E8F5EE] border border-[#1B5E38]/10 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#1F7A68] flex items-center justify-center flex-shrink-0">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1B5E38]">{t("dash.bestActivity.type")}</p>
                <p className="text-xs text-[#3A8A5E] mt-0.5">{t("dash.bestActivity.stat")}</p>
              </div>
              <span className="text-2xl font-bold text-[#1B5E38] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{BEST_ACTIVITY.pct}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{t("dash.bestActivity.desc")}</p>
          </div>
        </div>
      </div>

      {/* ═══ SECTION B: CORPORATE & PARTNER VIEW ═══ */}
      <div className="rounded-2xl p-5 space-y-5 pb-6" style={{ background: "linear-gradient(170deg, #EAF0FB 0%, #EDF5FF 100%)", border: "1px solid rgba(26,58,107,0.12)", boxShadow: "0 2px 16px rgba(26,58,107,0.07), inset 0 1px 0 rgba(255,255,255,0.65)" }}>
        <div className="pb-3" style={{ borderBottom: "1px solid rgba(26,58,107,0.10)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1A3A6B]/50 mb-1.5" style={{ letterSpacing: "0.12em" }}>Corporate &amp; Partner View</p>
          <h2 className="text-xl font-bold text-[#18293A]" style={{ fontFamily: "var(--font-display)" }}>{t("dash.corporate.title")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t("dash.corporate.subtitle")}</p>
        </div>

        {/* Active Projects — detailed cards per project */}
        <div>
          <h3 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ borderLeft: "3px solid #4ACED1" }}>{t("dash.corp.projects.title")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROJECTS.map((proj) => {
              const completionData = [
                { value: proj.completion, color: "#1F7A68" },
                { value: 100 - proj.completion, color: "#E4EBF2" },
              ];
              return (
                <div key={proj.name} className="bg-white rounded-xl p-4 border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{proj.icon}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${proj.statusColor}`}>{t(proj.statusKey)}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground leading-tight">{proj.name}</p>
                    <p className="text-[11px] text-muted-foreground">{proj.type}</p>
                  </div>
                  {/* Location + Budget */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><p className="text-muted-foreground">Location</p><p className="font-medium text-foreground">{proj.location}</p></div>
                    <div><p className="text-muted-foreground">Budget</p><p className="font-medium text-foreground">{proj.budget}</p></div>
                    <div><p className="text-muted-foreground">Used</p><p className="font-medium text-foreground">{proj.budgetUsed}</p></div>
                    <div><p className="text-muted-foreground">Since</p><p className="font-medium text-foreground">{proj.startDate}</p></div>
                  </div>
                  {/* Progress donut */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
                      <PieChart width={96} height={96}>
                        <Pie data={completionData} cx="50%" cy="50%" innerRadius={32} outerRadius={44} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                          {completionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-sm font-bold text-[#1B5E38]" style={{ fontFamily: "var(--font-mono)" }}>{proj.completion}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Completion</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{proj.beneficiaries} beneficiaries</p>
                    </div>
                  </div>
                  {/* Beneficiary pie — vertical layout */}
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-2">Beneficiaries involved</p>
                    <div className="flex justify-center">
                      <PieChart width={180} height={180}>
                        <Pie
                          data={proj.beneficiaryBreakdown}
                          cx="50%" cy="50%"
                          outerRadius={82}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="#fff"
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; value: number; percent: number }) => {
                            if (percent < 0.10) return null;
                            const RADIAN = Math.PI / 180;
                            const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                            const x = cx + r * Math.cos(-midAngle * RADIAN);
                            const y = cy + r * Math.sin(-midAngle * RADIAN);
                            return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="700" style={{ fontFamily: "var(--font-mono)" }}>{value}</text>;
                          }}
                          labelLine={false}
                        >
                          {proj.beneficiaryBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-2">
                      {proj.beneficiaryBreakdown.map((e) => (
                        <div key={e.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} /><span className="text-xs text-muted-foreground">{e.name}</span></div>
                          <span className="text-xs font-medium" style={{ color: e.color, fontFamily: "var(--font-mono)" }}>{e.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* c) ESG Compliance — three circular gauges */}
        <div>
          <h3 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ borderLeft: "3px solid #4ACED1" }}>ESG Compliance</h3>
          <div className="grid grid-cols-3 gap-3">
            {ESG_SCORES.map(({ label, score, color, bg, textColor }) => {
              const esgData = [{ value: score, color }, { value: 100 - score, color: "#E4EBF2" }];
              return (
                <div key={label} className="bg-white rounded-xl p-4 border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center">
                  <div className="relative shrink-0" style={{ width: 144, height: 144 }}>
                    <PieChart width={144} height={144}>
                      <Pie data={esgData} cx="50%" cy="50%" innerRadius={47} outerRadius={64} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                        {esgData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold" style={{ color, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{score}</span>
                      <span className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>/100</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold mt-2" style={{ color: textColor }}>{label}</p>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full mt-1.5" style={{ backgroundColor: bg, color: textColor }}>
                    {score >= 75 ? "Strong" : score >= 60 ? "Moderate" : "Developing"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* d) SDG Alignment */}
        <div>
          <h3 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1" style={{ borderLeft: "3px solid #4ACED1" }}>SDG Alignment</h3>
          <p className="text-xs text-muted-foreground mb-3">All 17 goals shown — highlighted tiles indicate this enterprise's alignment</p>
          <div className="flex flex-wrap gap-2">
            {SDG_ALL.map(({ n, color, icon, title }) => {
              const aligned = SDG_ALIGNED_SET.has(n);
              return (
                <div
                  key={n}
                  className="relative rounded-lg overflow-hidden flex-shrink-0"
                  style={{ width: 76, height: 76, backgroundColor: color, opacity: aligned ? 1 : 0.28 }}
                  title={title}
                >
                  {/* number + short title */}
                  <div className="flex items-start gap-1 p-1.5">
                    <span className="text-white font-black leading-none" style={{ fontSize: 20, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{n}</span>
                    <span className="text-white font-bold uppercase leading-[1.1]" style={{ fontSize: 6.5, marginTop: 1 }}>{title}</span>
                  </div>
                  {/* icon */}
                  <div className="absolute bottom-1 right-1" style={{ fontSize: 22, lineHeight: 1 }}>{icon}</div>
                  {/* aligned checkmark */}
                  {aligned && (
                    <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-white/25 flex items-center justify-center">
                      <span style={{ fontSize: 8, color: "white", lineHeight: 1 }}>✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Aligned SDGs: 1, 3, 4, 5, 8, 10 · Source: UN Sustainable Development Goals</p>
        </div>

        {/* e + f: Workforce + PDPA — 2-col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-black/[0.06] shadow-sm">
            <h3 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ borderLeft: "3px solid #4ACED1" }}>{t("dash.corp.workforce.title")}</h3>
            <div className="space-y-2.5">
              {WORKFORCE_STATS.map((key) => (
                <div key={key} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#1B5E38] shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{t(key)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-black/[0.06] shadow-sm">
            <h3 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ borderLeft: "3px solid #4ACED1" }}>{t("dash.corp.ethics.title")}</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-2 bg-[#D8E4F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#1F7A68] rounded-full" style={{ width: `${(CONSENTED_COUNT / TOTAL_BENEFICIARIES_CONSENT) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-[#1B5E38] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{CONSENTED_COUNT}/{TOTAL_BENEFICIARIES_CONSENT}</span>
            </div>
            <p className="text-sm text-foreground mb-1">{t("dash.corp.ethics.pdpa")}</p>
            {CONSENT_ISSUES > 0 && <p className="text-xs text-[#633806] mb-2">{t("dash.corp.ethics.pending")}</p>}
            <button onClick={() => onNavigate("nav.privacyConsent", "privacy-consent")} className="text-xs font-medium text-[#1F7A68] hover:text-[#196658] transition-colors flex items-center gap-1">
              {t("dash.corp.ethics.link")} <ChevronRight size={11} />
            </button>
          </div>
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
  const totalBeneficiaries = PROJECTS.reduce((sum, p) => sum + p.beneficiaries, 0);
  const activeCount = PROJECTS.filter((p) => p.statusKey === "projects.status.active").length;

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
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
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

      {/* ── Your Projects section ── */}
      <h2 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ borderLeft: "3px solid #4ACED1" }}>
        {t("logActivity.yourProjects")}
      </h2>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { labelKey: "projects.summary.total", value: String(PROJECTS.length), color: "text-[#1B5E38]", bg: "bg-[#E8F5EE]" },
          { labelKey: "projects.summary.active", value: String(activeCount), color: "text-[#1A3A6B]", bg: "bg-[#EBF3FB]" },
          { labelKey: "projects.summary.totalBeneficiaries", value: String(totalBeneficiaries), color: "text-[#633806]", bg: "bg-[#FAEEDA]" },
        ].map(({ labelKey, value, color, bg }) => (
          <div key={labelKey} className={`${bg} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${color} tracking-tight`} style={{ fontFamily: "var(--font-mono)" }}>{value}</p>
            <p className={`text-xs font-medium ${color} mt-0.5`}>{t(labelKey)}</p>
          </div>
        ))}
      </div>

      {/* Project cards */}
      <div className="space-y-3 mb-8">
        {PROJECTS.map((proj) => (
          <div key={proj.name} className="bg-white rounded-xl border border-black/[0.06] shadow-sm p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: proj.iconBg }}
              >
                {proj.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold text-foreground leading-tight">{proj.name}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${proj.statusColor}`}>
                    {t(proj.statusKey)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{t(proj.descKey)}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground bg-[#F0F3F6] px-2 py-0.5 rounded-md">{proj.location}</span>
                  <span className="text-xs text-muted-foreground bg-[#F0F3F6] px-2 py-0.5 rounded-md">{proj.beneficiaries} {t("projects.beneficiaries")}</span>
                  <span className="text-xs text-muted-foreground bg-[#F0F3F6] px-2 py-0.5 rounded-md">{proj.budget}</span>
                  <span className="text-xs text-muted-foreground bg-[#F0F3F6] px-2 py-0.5 rounded-md">{t("projects.started")} {proj.startDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Log an Activity section ── */}
      <h2 className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4" style={{ borderLeft: "3px solid #4ACED1" }}>
        {t("logActivity.formSection")}
      </h2>

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
        className="mt-3 mb-8 w-full text-sm font-medium py-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
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
          <div key={name} className="bg-white rounded-xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
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
            <div key={nameKey} className="bg-white rounded-xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex items-center gap-4">
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

      <div
        className="relative rounded-2xl overflow-hidden p-5 flex items-center gap-5 mb-4"
        style={{ background: "linear-gradient(135deg, #0F2E26 0%, #1A4A38 100%)" }}
      >
        <div className="absolute -right-4 -top-6 w-28 h-28 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(76,206,209,0.14) 0%, transparent 70%)" }} />
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.10)" }}>
          <Sparkles size={20} className="text-[#4ACED1]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-0.5">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#4ACED1", color: "#0F2E26", letterSpacing: "0.07em" }}>LIVE DEMO</span>
          </div>
          <h3 className="text-base font-bold text-white leading-tight">{t("cleaning.title")}</h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.48)" }}>{t("integrations.cleaningLinkDesc")}</p>
        </div>
        <button
          onClick={onNavigateToCleaning}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl shrink-0 transition-all hover:brightness-110"
          style={{ background: "rgba(255,255,255,0.10)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          {t("nav.dataCleaning")}
          <ChevronRight size={14} />
        </button>
      </div>

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
