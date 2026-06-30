import { useState } from "react";
import { ArrowLeft, ShieldCheck, Eye, Share2, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { useI18n } from "../i18n";

interface Beneficiary {
  id: string;
  name: string;
  ic: string;
  programmeKey: string;
  consentDate: string;
  consented: boolean;
}

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  { id: "B001", name: "Siti Rahimah bt Nordin", ic: "940312-**-****", programmeKey: "programme.digitalSkills", consentDate: "3 Jan 2026", consented: true },
  { id: "B002", name: "Ahmad Fadzli bin Razali", ic: "980712-**-****", programmeKey: "programme.jobReadiness", consentDate: "3 Jan 2026", consented: true },
  { id: "B003", name: "Nurul Ain bt Kamarudin", ic: "010522-**-****", programmeKey: "programme.digitalSkills", consentDate: "10 Jan 2026", consented: true },
  { id: "B004", name: "Mohd Haris bin Saad", ic: "960830-**-****", programmeKey: "programme.financialLiteracy", consentDate: "17 Jan 2026", consented: true },
  { id: "B005", name: "Fatimah bt Yusof", ic: "030214-**-****", programmeKey: "programme.jobReadiness", consentDate: "17 Jan 2026", consented: false },
  { id: "B006", name: "Zainal Abidin bin Mat", ic: "880905-**-****", programmeKey: "programme.financialLiteracy", consentDate: "24 Jan 2026", consented: true },
];

const DATA_COLLECTED = [
  { icon: "👤", labelKey: "dataCollected.name" },
  { icon: "📞", labelKey: "dataCollected.phone" },
  { icon: "📋", labelKey: "dataCollected.dates" },
  { icon: "📊", labelKey: "dataCollected.scores" },
  { icon: "🗓️", labelKey: "dataCollected.consent" },
];

const DATA_SHARING = [
  { partyKey: "dataSharing.govReports", detailKey: "dataSharing.govReports.detail", shared: true, icon: "🏛️" },
  { partyKey: "dataSharing.auditors", detailKey: "dataSharing.auditors.detail", shared: false, icon: "🔍" },
  { partyKey: "dataSharing.marketing", detailKey: "dataSharing.marketing.detail", shared: false, icon: "🚫" },
];

export function PrivacyConsentScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [saved, setSaved] = useState<string | null>(null);

  function toggleConsent(id: string) {
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, consented: !b.consented } : b))
    );
    setSaved(id);
    setTimeout(() => setSaved(null), 1800);
  }

  const consentedCount = beneficiaries.filter((b) => b.consented).length;
  const total = beneficiaries.length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
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
            {t("privacy.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("privacy.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#E8F5EE] text-[#1B5E38] px-3 py-1.5 rounded-lg">
          <ShieldCheck size={14} />
          <span className="text-xs font-medium">{t("privacy.badge")}</span>
        </div>
      </div>

      {/* Consent summary */}
      <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">{t("privacy.consentOnFile")}</h2>
          <span
            className="text-lg font-bold text-[#1B5E38] tracking-tight"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {consentedCount}/{total}
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#E4EBF2] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-[#1F7A68] transition-all duration-500"
            style={{ width: `${(consentedCount / total) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {consentedCount} {t("privacy.consentSummary1")} {total} {t("privacy.consentSummary2")}{" "}
          {consentedCount < total && (
            <span className="text-[#8B5015] font-medium">
              {total - consentedCount} {t("privacy.recordsNeedAttention")}
            </span>
          )}
        </p>
      </div>

      {/* Data collected */}
      <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Database size={15} className="text-[#1F7A68]" />
          <h2 className="text-sm font-semibold text-foreground">{t("privacy.whatDataTitle")}</h2>
        </div>
        <div className="space-y-2.5">
          {DATA_COLLECTED.map(({ icon, labelKey }) => (
            <div key={labelKey} className="flex items-start gap-3">
              <span className="text-base leading-none mt-0.5 shrink-0">{icon}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data sharing */}
      <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Share2 size={15} className="text-[#1F7A68]" />
          <h2 className="text-sm font-semibold text-foreground">{t("privacy.whoSharedTitle")}</h2>
        </div>
        <div className="space-y-3">
          {DATA_SHARING.map(({ partyKey, detailKey, shared, icon }) => (
            <div key={partyKey} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-black/[0.06] shadow-sm">
              <span className="text-lg leading-none shrink-0 mt-0.5">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-0.5">{t(partyKey)}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(detailKey)}</p>
              </div>
              <div className="shrink-0">
                {shared ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#8B5015] bg-[#FAEEDA] px-2 py-0.5 rounded-full">
                    <Eye size={10} />
                    {t("privacy.shared.possible")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#1B5E38] bg-[#E8F5EE] px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} />
                    {t("privacy.shared.never")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beneficiary consent list */}
      <div className="bg-white rounded-xl border border-black/[0.06] shadow-sm p-5 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-1">{t("privacy.beneficiaryListTitle")}</h2>
        <p className="text-xs text-muted-foreground mb-4">
          {t("privacy.beneficiaryListDesc")}
        </p>

        <div className="space-y-2">
          {beneficiaries.map((b) => {
            const justSaved = saved === b.id;
            return (
              <div
                key={b.id}
                className="flex items-center gap-3 px-3 py-3 rounded-lg border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200 hover:bg-[#F8FAFB] transition-colors"
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                  style={{
                    backgroundColor: b.consented ? "#EAF4F1" : "#FAEEDA",
                    color: b.consented ? "#1F7A68" : "#633806",
                  }}
                >
                  {b.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.ic} · {t(b.programmeKey)} · {b.consentDate}
                  </p>
                </div>

                {/* Status + toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  {justSaved && (
                    <span className="text-xs text-[#1F7A68] font-medium">{t("privacy.saved")}</span>
                  )}
                  {!b.consented && !justSaved && (
                    <span className="flex items-center gap-1 text-xs text-[#8B5015]">
                      <AlertCircle size={11} />
                      {t("privacy.pending")}
                    </span>
                  )}

                  {/* Toggle */}
                  <button
                    onClick={() => toggleConsent(b.id)}
                    className="relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none"
                    style={{
                      backgroundColor: b.consented ? "#1F7A68" : "#CBD5E1",
                      width: 40,
                      height: 22,
                    }}
                    aria-label={`Toggle consent for ${b.name}`}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200"
                      style={{
                        width: 18,
                        height: 18,
                        transform: b.consented ? "translateX(18px)" : "translateX(0)",
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal note */}
      <div className="p-4 rounded-xl bg-[#EBF3FA] border border-[#2E6EA6]/20 pb-6">
        <p className="text-sm font-medium text-[#2E6EA6] mb-1">{t("privacy.legalTitle")}</p>
        <p className="text-xs text-[#2E6EA6]/80 leading-relaxed">
          {t("privacy.legalBody")}
        </p>
      </div>
    </div>
  );
}
