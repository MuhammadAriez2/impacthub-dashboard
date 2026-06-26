import { useState } from "react";
import { ChevronDown, Plus, X, CheckCircle2 } from "lucide-react";
import { useI18n } from "../i18n";

// ─── Industry templates (keys reference translation dictionary) ───────────────

type FieldConfig = {
  key: string;
  labelKey: string;
  hintKey: string;
  type: "select" | "number" | "textarea" | "text";
  optionKeys?: string[];
  placeholderKey?: string;
  unitKey?: string;
};

type IndustryTemplate = {
  industryKey: string;
  emoji: string;
  fields: FieldConfig[];
};

const TEMPLATES: Record<string, IndustryTemplate> = {
  Education: {
    industryKey: "industry.education",
    emoji: "🎓",
    fields: [
      {
        key: "activityType",
        labelKey: "field.activityType",
        hintKey: "field.activityType.hint.education",
        type: "select",
        optionKeys: [
          "activityOption.trainingWorkshop",
          "activityOption.jobPlacement",
          "activityOption.literacy",
          "activityOption.mentorship",
          "activityOption.examPrep",
        ],
      },
      {
        key: "peopleReached",
        labelKey: "field.learnersReached",
        hintKey: "field.learnersReached.hint",
        type: "number",
      },
      {
        key: "outcome",
        labelKey: "field.outcomeObserved",
        hintKey: "field.outcomeObserved.hint",
        type: "textarea",
        placeholderKey: "field.outcomeObserved.placeholder",
      },
    ],
  },

  Environment: {
    industryKey: "industry.environment",
    emoji: "🌿",
    fields: [
      {
        key: "activityType",
        labelKey: "field.activityType",
        hintKey: "field.activityType.hint.environment",
        type: "select",
        optionKeys: [
          "activityOption.recycling",
          "activityOption.treePlanting",
          "activityOption.cleanup",
          "activityOption.awareness",
          "activityOption.solar",
          "activityOption.composting",
        ],
      },
      {
        key: "wasteDiverted",
        labelKey: "field.wasteDiverted",
        hintKey: "field.wasteDiverted.hint",
        type: "number",
        unitKey: "kg",
      },
      {
        key: "outcome",
        labelKey: "field.outcomeObserved",
        hintKey: "field.envOutcome.hint",
        type: "textarea",
        placeholderKey: "field.envOutcome.placeholder",
      },
    ],
  },

  Health: {
    industryKey: "industry.health",
    emoji: "❤️",
    fields: [
      {
        key: "activityType",
        labelKey: "field.activityType",
        hintKey: "field.activityType.hint.health",
        type: "select",
        optionKeys: [
          "activityOption.healthScreening",
          "activityOption.nutrition",
          "activityOption.mentalHealth",
          "activityOption.vaccination",
          "activityOption.firstAid",
          "activityOption.maternal",
        ],
      },
      {
        key: "peopleScreened",
        labelKey: "field.peopleScreened",
        hintKey: "field.peopleScreened.hint",
        type: "number",
      },
      {
        key: "outcome",
        labelKey: "field.healthOutcome",
        hintKey: "field.healthOutcome.hint",
        type: "textarea",
        placeholderKey: "field.healthOutcome.placeholder",
      },
    ],
  },

  "Community Development": {
    industryKey: "industry.community",
    emoji: "🏘️",
    fields: [
      {
        key: "activityType",
        labelKey: "field.activityType",
        hintKey: "field.activityType.hint.community",
        type: "select",
        optionKeys: [
          "activityOption.skillsEmployment",
          "activityOption.microfinance",
          "activityOption.womensEmpowerment",
          "activityOption.youthLeadership",
          "activityOption.communityGarden",
          "activityOption.housing",
        ],
      },
      {
        key: "householdsReached",
        labelKey: "field.householdsReached",
        hintKey: "field.householdsReached.hint",
        type: "number",
      },
      {
        key: "outcome",
        labelKey: "field.communityOutcome",
        hintKey: "field.communityOutcome.hint",
        type: "textarea",
        placeholderKey: "field.communityOutcome.placeholder",
      },
    ],
  },
};

const INDUSTRY_ORDER = ["Education", "Environment", "Health", "Community Development"];

// ─── Component ────────────────────────────────────────────────────────────────

interface IndustryFormProps {
  compact?: boolean;
  onSubmit?: () => void;
  submitLabelKey?: string;
}

export function IndustryForm({
  compact = false,
  onSubmit,
  submitLabelKey = "form.submitDefault",
}: IndustryFormProps) {
  const { t } = useI18n();
  const [industry, setIndustry] = useState("Education");
  const [values, setValues] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<Array<{ id: string; label: string; value: string }>>([]);
  const [logSuccess, setLogSuccess] = useState(false);

  const template = TEMPLATES[industry];

  function setValue(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function addCustomField() {
    setCustomFields((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, label: "", value: "" },
    ]);
  }

  function updateCustomField(id: string, field: "label" | "value", val: string) {
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: val } : f))
    );
  }

  function removeCustomField(id: string) {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  }

  function handleSubmit() {
    setLogSuccess(true);
    setTimeout(() => {
      setLogSuccess(false);
      setValues({});
      setCustomFields([]);
      onSubmit?.();
    }, 2400);
  }

  const inputBase =
    "w-full bg-[#F0F3F6] border border-border text-foreground text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1F7A68]/30 focus:border-[#1F7A68] placeholder:text-muted-foreground";

  return (
    <div className="space-y-3">
      {/* Industry selector */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {t("form.industryLabel")}
        </label>
        <div className="relative">
          <select
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              setValues({});
            }}
            className={inputBase + " appearance-none pr-8 cursor-pointer"}
          >
            {INDUSTRY_ORDER.map((ind) => (
              <option key={ind} value={ind}>
                {TEMPLATES[ind].emoji}  {t(TEMPLATES[ind].industryKey)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* Dynamic fields */}
      {template.fields.map(({ key, labelKey, hintKey, type, optionKeys, placeholderKey, unitKey }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            {t(labelKey)}
            {unitKey && (
              <span className="ml-1 font-normal text-muted-foreground">({unitKey})</span>
            )}
          </label>
          {!compact && hintKey && (
            <p className="text-xs text-muted-foreground mb-1.5">{t(hintKey)}</p>
          )}

          {type === "select" && (
            <div className="relative">
              <select
                value={values[key] ?? ""}
                onChange={(e) => setValue(key, e.target.value)}
                className={inputBase + " appearance-none pr-8 cursor-pointer"}
              >
                <option value="" disabled>{t("form.selectPlaceholder")}</option>
                {optionKeys?.map((ok) => (
                  <option key={ok} value={ok}>{t(ok)}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          )}

          {(type === "number" || type === "text") && (
            <input
              type={type}
              placeholder={placeholderKey ? t(placeholderKey) : undefined}
              value={values[key] ?? ""}
              onChange={(e) => setValue(key, e.target.value)}
              className={inputBase}
            />
          )}

          {type === "textarea" && (
            <textarea
              rows={compact ? 2 : 3}
              placeholder={placeholderKey ? t(placeholderKey) : undefined}
              value={values[key] ?? ""}
              onChange={(e) => setValue(key, e.target.value)}
              className={inputBase + " resize-none"}
            />
          )}
        </div>
      ))}

      {/* Custom fields */}
      {customFields.map(({ id, label, value }) => (
        <div key={id} className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <input
              type="text"
              placeholder={t("form.customFieldName")}
              value={label}
              onChange={(e) => updateCustomField(id, "label", e.target.value)}
              className="flex-1 bg-[#F0F3F6] border border-border text-foreground text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1F7A68]/30 focus:border-[#1F7A68] placeholder:text-muted-foreground"
            />
            <button
              onClick={() => removeCustomField(id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <input
            type="text"
            placeholder={t("form.customFieldValue")}
            value={value}
            onChange={(e) => updateCustomField(id, "value", e.target.value)}
            className={inputBase}
          />
        </div>
      ))}

      {/* Add custom field */}
      {customFields.length < 3 && (
        <button
          onClick={addCustomField}
          className="flex items-center gap-1.5 text-xs text-[#1F7A68] font-medium hover:text-[#196658] transition-colors"
        >
          <Plus size={12} />
          {t("form.addCustomField")}
        </button>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-all mt-1 ${
          logSuccess
            ? "bg-[#EAF4F1] text-[#1F7A68]"
            : "bg-[#1F7A68] text-white hover:bg-[#196658]"
        }`}
      >
        {logSuccess ? (
          <>
            <CheckCircle2 size={15} />
            {t("form.submitSuccess")}
          </>
        ) : (
          t(submitLabelKey)
        )}
      </button>
    </div>
  );
}
