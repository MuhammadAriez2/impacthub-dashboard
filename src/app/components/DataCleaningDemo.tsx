import { useState } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
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
      <style>{`
        @keyframes pulseRing {
          0%   { box-shadow: 0 4px 16px rgba(31,122,104,0.45), 0 0 0 0   rgba(31,122,104,0.40); }
          70%  { box-shadow: 0 4px 16px rgba(31,122,104,0.45), 0 0 0 10px rgba(31,122,104,0); }
          100% { box-shadow: 0 4px 16px rgba(31,122,104,0.45), 0 0 0 0   rgba(31,122,104,0); }
        }
        @keyframes scanLine {
          0%   { top: 0;                  opacity: 1; }
          85%  {                          opacity: 0.9; }
          100% { top: calc(100% - 2px);  opacity: 0; }
        }
        @keyframes rowReveal {
          from { opacity: 0; transform: translateY(8px);  background-color: rgba(196,232,212,0.55); }
          55%  {                                           background-color: rgba(196,232,212,0.20); }
          to   { opacity: 1; transform: translateY(0);    background-color: transparent; }
        }
        @keyframes shineSwipe {
          from { transform: translateX(-100%); }
          to   { transform: translateX(350%); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0);    opacity: 0; }
          65%  { transform: scale(1.3); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes cleanDropIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        {t("common.back")}
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {t("cleaning.title")}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {t("cleaning.subtitle")}
        </p>
      </div>

      {/* CTA button row */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleClean}
          disabled={state !== "idle"}
          className={`flex items-center gap-2.5 font-semibold rounded-xl transition-all ${
            state === "idle"
              ? "text-white text-base px-6 py-3"
              : state === "cleaning"
              ? "bg-[#EAF4F1] text-[#1F7A68] text-sm px-5 py-2.5 cursor-wait"
              : "bg-[#E8F5EE] text-[#1B5E38] text-sm px-5 py-2.5"
          }`}
          style={
            state === "idle"
              ? {
                  background: "linear-gradient(135deg, #1F7A68 0%, #0F5748 100%)",
                  animation: "pulseRing 2.5s ease-in-out infinite",
                }
              : undefined
          }
        >
          {state === "idle" && (
            <>
              <Sparkles size={17} />
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
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ animation: "cleanDropIn 300ms ease both" }}
          >
            <span
              className="font-bold text-base"
              style={{ color: "#1B5E38", fontFamily: "var(--font-mono)" }}
            >
              {totalIssues}
            </span>
            <span className="text-muted-foreground">{t("cleaning.issuesFound")}</span>
          </div>
        )}
      </div>

      {/* Before / After grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

        {/* BEFORE */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#FAECE7]">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-[#993C1D]" />
                <h2 className="text-sm font-semibold text-[#993C1D]">{t("cleaning.before.title")}</h2>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#993C1D", color: "white", letterSpacing: "0.04em" }}
              >
                ×{totalIssues}
              </span>
            </div>
            <p className="text-xs text-[#993C1D]/70">{t("cleaning.before.desc")}</p>
          </div>

          {/* Scan-line overlay container */}
          <div className="relative">
            {state === "cleaning" && (
              <div
                className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, #993C1D 25%, #F5A623 50%, #1F7A68 75%, transparent 100%)",
                  animation: "scanLine 1.8s ease-in-out both",
                }}
              />
            )}
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
                    <tr
                      key={i}
                      className="border-b border-border last:border-0"
                      style={
                        row.flagKeys.includes("cleaning.issue.duplicate")
                          ? { backgroundColor: "#FFF0ED", borderLeft: "3px solid #993C1D" }
                          : undefined
                      }
                    >
                      <td className="px-3 py-2.5 text-foreground">
                        <span
                          className={
                            row.flagKeys.includes("cleaning.issue.dateFormat")
                              ? "bg-[#FFCCC5] text-[#8B1A00] px-1.5 py-0.5 rounded font-medium"
                              : ""
                          }
                          style={
                            row.flagKeys.includes("cleaning.issue.dateFormat")
                              ? { fontFamily: "var(--font-mono)" }
                              : undefined
                          }
                        >
                          {row.date}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-foreground">
                        <span
                          className={
                            row.flagKeys.includes("cleaning.issue.typo")
                              ? "bg-[#FFCCC5] text-[#8B1A00] px-1.5 py-0.5 rounded font-medium"
                              : ""
                          }
                        >
                          {row.activity}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-foreground">
                        {row.people === "" ? (
                          <span className="bg-[#FFCCC5] text-[#8B1A00] px-1.5 py-0.5 rounded font-bold text-sm">
                            —
                          </span>
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
          <div
            className="px-4 py-3 border-b border-border transition-colors duration-700"
            style={{ backgroundColor: state === "done" ? "#C8EDD8" : "#E8F5EE" }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <CheckCircle2
                size={13}
                className="text-[#1B5E38]"
                style={state === "done" ? { animation: "checkPop 450ms ease both" } : undefined}
              />
              <h2 className="text-sm font-semibold text-[#1B5E38]">{t("cleaning.after.title")}</h2>
            </div>
            <p className="text-xs text-[#1B5E38]/70">{t("cleaning.after.desc")}</p>
          </div>

          {/* Table with shine overlay */}
          <div className="relative">
            {state === "done" && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "45%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(31,122,104,0.12), transparent)",
                    animation: `shineSwipe 750ms ease ${CLEAN_ROWS.length * 200 + 150}ms both`,
                  }}
                />
              </div>
            )}
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
                    <tr
                      key={i}
                      className="border-b border-border last:border-0"
                      style={
                        state === "done"
                          ? {
                              animation: `rowReveal 500ms ease ${i * 200}ms both`,
                            }
                          : undefined
                      }
                    >
                      <td
                        className="px-3 py-2.5 text-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {row.date}
                      </td>
                      <td className="px-3 py-2.5 text-foreground font-medium">{row.activity}</td>
                      <td
                        className="px-3 py-2.5 text-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
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
          </div>

          {/* Idle hint overlay */}
          {state === "idle" && (
            <div className="absolute inset-0 top-[52px] flex items-center justify-center pointer-events-none">
              <p className="text-xs text-muted-foreground bg-white/80 px-3 py-1.5 rounded-full">
                ↑ {t("cleaning.cta")}
              </p>
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
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "linear-gradient(135deg, #0A1F40 0%, #1A3A6B 100%)",
            animation: `cleanDropIn 400ms ease ${CLEAN_ROWS.length * 200 + 350}ms both`,
          }}
        >
          <p className="text-[11px] font-medium mb-4" style={{ color: "rgba(255,255,255,0.40)" }}>
            {t("cleaning.timeSaved.label")}
          </p>
          <div className="flex items-center gap-5">
            <div
              style={{
                animation: `cleanDropIn 350ms ease ${CLEAN_ROWS.length * 200 + 500}ms both`,
              }}
            >
              <p
                className="text-2xl font-bold line-through"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono)" }}
              >
                {t("cleaning.timeSaved.before")}
              </p>
            </div>
            <span className="text-2xl" style={{ color: "rgba(255,255,255,0.22)" }}>→</span>
            <div
              style={{
                animation: `cleanDropIn 400ms ease ${CLEAN_ROWS.length * 200 + 650}ms both`,
              }}
            >
              <p
                className="text-3xl font-bold"
                style={{ color: "#4ACED1", fontFamily: "var(--font-mono)" }}
              >
                {t("cleaning.timeSaved.after")}
              </p>
            </div>
            <div
              className="ml-auto text-right"
              style={{
                animation: `cleanDropIn 350ms ease ${CLEAN_ROWS.length * 200 + 550}ms both`,
              }}
            >
              <p
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {totalIssues}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                {t("cleaning.issuesFound")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
