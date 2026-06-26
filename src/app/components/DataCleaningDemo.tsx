import { useState } from "react";
import { ArrowLeft, Sparkles, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useI18n } from "../i18n";

interface RawRow {
  date: string;
  activity: string;
  people: string;
  outcome: string;
  flagKeys: string[];
}

interface CleanRow {
  date: string;
  activity: string;
  people: string;
  outcome: string;
  sdgTag: string;
}

const RAW_ROWS: RawRow[] = [
  {
    date: "12/3/26",
    activity: "training wrkshop",
    people: "24",
    outcome: "resume writing + mock interview",
    flagKeys: ["cleaning.issue.dateFormat", "cleaning.issue.typo"],
  },
  {
    date: "March 13",
    activity: "Training Workshop",
    people: "",
    outcome: "Resume writing module completed",
    flagKeys: ["cleaning.issue.missing"],
  },
  {
    date: "13-03-2026",
    activity: "training workshop",
    people: "24",
    outcome: "resume writing + mock interview",
    flagKeys: ["cleaning.issue.duplicate"],
  },
  {
    date: "14/3/26",
    activity: "mentorshp session",
    people: "8",
    outcome: "1:1 career guidance for final-year students",
    flagKeys: ["cleaning.issue.typo", "cleaning.issue.mapped"],
  },
];

const CLEAN_ROWS: CleanRow[] = [
  { date: "13 Mar 2026", activity: "Training & skills workshop", people: "24", outcome: "Resume writing module completed; mock interviews practised", sdgTag: "SDG 4" },
  { date: "14 Mar 2026", activity: "Mentorship session", people: "8", outcome: "1:1 career guidance for final-year students", sdgTag: "SDG 4" },
];

export function DataCleaningDemo({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "cleaning" | "done">("idle");

  function handleClean() {
    setState("cleaning");
    setTimeout(() => setState("done"), 1800);
  }

  const totalIssues = RAW_ROWS.reduce((sum, r) => sum + r.flagKeys.length, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        {t("common.back")}
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">
          {t("cleaning.title")}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {t("cleaning.subtitle")}
        </p>
      </div>

      {/* CTA button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleClean}
          disabled={state !== "idle"}
          className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-all ${
            state === "idle"
              ? "bg-[#1F7A68] text-white hover:bg-[#196658]"
              : state === "cleaning"
              ? "bg-[#EAF4F1] text-[#1F7A68] cursor-wait"
              : "bg-[#E8F5EE] text-[#1B5E38]"
          }`}
        >
          {state === "idle" && (
            <>
              <Sparkles size={15} />
              {t("cleaning.cta")}
            </>
          )}
          {state === "cleaning" && (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#1F7A68] border-t-transparent rounded-full animate-spin" />
              {t("cleaning.cleaning")}
            </>
          )}
          {state === "done" && (
            <>
              <CheckCircle2 size={15} />
              {t("cleaning.done")}
            </>
          )}
        </button>

        {state === "done" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-[#1B5E38]">{totalIssues}</span>
            {t("cleaning.issuesFound")}
          </div>
        )}
      </div>

      {/* Before / After grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* BEFORE */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#FAECE7]">
            <div className="flex items-center gap-2 mb-0.5">
              <AlertTriangle size={13} className="text-[#993C1D]" />
              <h2 className="text-sm font-semibold text-[#993C1D]">{t("cleaning.before.title")}</h2>
            </div>
            <p className="text-xs text-[#993C1D]/70">{t("cleaning.before.desc")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-[#F8FAFB] text-muted-foreground">
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.date")}</th>
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.activity")}</th>
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.people")}</th>
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.outcome")}</th>
                </tr>
              </thead>
              <tbody>
                {RAW_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-2.5 text-foreground">
                      <span
                        className={row.flagKeys.includes("cleaning.issue.dateFormat") ? "bg-[#FDECEA] text-[#993C1D] px-1 rounded" : ""}
                      >
                        {row.date}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-foreground">
                      <span
                        className={row.flagKeys.includes("cleaning.issue.typo") ? "bg-[#FDECEA] text-[#993C1D] px-1 rounded" : ""}
                      >
                        {row.activity}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-foreground">
                      {row.people === "" ? (
                        <span className="bg-[#FDECEA] text-[#993C1D] px-1 rounded italic">—</span>
                      ) : (
                        row.people
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground max-w-[160px] truncate">
                      {row.outcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Issue legend */}
          <div className="px-4 py-3 border-t border-border bg-[#F8FAFB] space-y-1">
            {[
              "cleaning.issue.dateFormat",
              "cleaning.issue.typo",
              "cleaning.issue.missing",
              "cleaning.issue.duplicate",
            ].map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#993C1D] shrink-0" />
                <span className="text-xs text-muted-foreground">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER */}
        <div className="bg-white rounded-xl border border-border overflow-hidden relative">
          <div className="px-4 py-3 border-b border-border bg-[#E8F5EE]">
            <div className="flex items-center gap-2 mb-0.5">
              <CheckCircle2 size={13} className="text-[#1B5E38]" />
              <h2 className="text-sm font-semibold text-[#1B5E38]">{t("cleaning.after.title")}</h2>
            </div>
            <p className="text-xs text-[#1B5E38]/70">{t("cleaning.after.desc")}</p>
          </div>

          <div
            className="overflow-x-auto transition-all duration-500"
            style={{
              filter: state === "done" ? "none" : "blur(3px) grayscale(0.6)",
              opacity: state === "done" ? 1 : 0.35,
            }}
          >
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-[#F8FAFB] text-muted-foreground">
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.date")}</th>
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.activity")}</th>
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.people")}</th>
                  <th className="text-left px-3 py-2 font-medium">{t("cleaning.col.outcome")}</th>
                </tr>
              </thead>
              <tbody>
                {CLEAN_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-2.5 text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                      {row.date}
                    </td>
                    <td className="px-3 py-2.5 text-foreground font-medium">{row.activity}</td>
                    <td className="px-3 py-2.5 text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                      {row.people}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground max-w-[160px]">
                      <div className="truncate">{row.outcome}</div>
                      <span className="inline-block mt-1 text-[10px] font-medium text-[#1F7A68] bg-[#EAF4F1] px-1.5 py-0.5 rounded">
                        {row.sdgTag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!state.includes("done") && (
            <div className="absolute inset-0 top-[52px] flex items-center justify-center">
              {state === "idle" && (
                <p className="text-xs text-muted-foreground bg-white/80 px-3 py-1.5 rounded-full">
                  ↑ {t("cleaning.cta")}
                </p>
              )}
            </div>
          )}

          {/* Mapped legend */}
          {state === "done" && (
            <div className="px-4 py-3 border-t border-border bg-[#F8FAFB]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A68] shrink-0" />
                <span className="text-xs text-muted-foreground">{t("cleaning.issue.mapped")}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time saved banner */}
      {state === "done" && (
        <div
          className="flex items-center gap-4 p-4 rounded-xl bg-[#EBF3FA] border border-[#2E6EA6]/20 pb-6 mb-6"
          style={{ animation: "dropIn 320ms ease both" }}
        >
          <div className="w-10 h-10 rounded-lg bg-[#2E6EA6]/10 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-[#2E6EA6]" />
          </div>
          <div>
            <p className="text-xs text-[#2E6EA6]/80">{t("cleaning.timeSaved.label")}</p>
            <p className="text-base font-bold text-[#2E6EA6]" style={{ fontFamily: "var(--font-mono)" }}>
              {t("cleaning.timeSaved.value")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
