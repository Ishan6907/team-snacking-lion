import { useState, useEffect } from 'react';

export interface RiskThresholds {
  criticalDelay: number;    // default 180 days
  warningDelay: number;     // default 60 days
  confidenceCutoff: number; // default 75%
  emailAlerts: boolean;     // default true
  autoRecompute: boolean;   // default true
}

export const DEFAULT_THRESHOLDS: RiskThresholds = {
  criticalDelay: 180,
  warningDelay: 60,
  confidenceCutoff: 75,
  emailAlerts: true,
  autoRecompute: true,
};

export const THRESHOLDS_STORAGE_KEY = 'paimana_risk_thresholds';
export const THRESHOLDS_EVENT_NAME = 'paimana-thresholds-updated';

export function getStoredThresholds(): RiskThresholds {
  try {
    const raw = localStorage.getItem(THRESHOLDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_THRESHOLDS,
        ...parsed,
        criticalDelay: Number(parsed.criticalDelay) || DEFAULT_THRESHOLDS.criticalDelay,
        warningDelay: Number(parsed.warningDelay) || DEFAULT_THRESHOLDS.warningDelay,
        confidenceCutoff: Number(parsed.confidenceCutoff) || DEFAULT_THRESHOLDS.confidenceCutoff,
      };
    }
  } catch (err) {
    console.error('Failed to parse stored thresholds:', err);
  }
  return DEFAULT_THRESHOLDS;
}

export function saveStoredThresholds(thresholds: Partial<RiskThresholds>): RiskThresholds {
  const current = getStoredThresholds();
  const updated: RiskThresholds = {
    ...current,
    ...thresholds,
    criticalDelay: thresholds.criticalDelay !== undefined ? Number(thresholds.criticalDelay) : current.criticalDelay,
    warningDelay: thresholds.warningDelay !== undefined ? Number(thresholds.warningDelay) : current.warningDelay,
    confidenceCutoff: thresholds.confidenceCutoff !== undefined ? Number(thresholds.confidenceCutoff) : current.confidenceCutoff,
  };
  try {
    localStorage.setItem(THRESHOLDS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(THRESHOLDS_EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.error('Failed to save thresholds:', err);
  }
  return updated;
}

export function useRiskThresholds(): RiskThresholds {
  const [thresholds, setThresholds] = useState<RiskThresholds>(getStoredThresholds);

  useEffect(() => {
    const handleUpdate = () => {
      setThresholds(getStoredThresholds());
    };
    window.addEventListener(THRESHOLDS_EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(THRESHOLDS_EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return thresholds;
}

export function getDelaySeverity(
  delayDays: number,
  thresholds: RiskThresholds
): 'critical' | 'moderate' | 'nominal' {
  if (delayDays >= thresholds.criticalDelay) return 'critical';
  if (delayDays >= thresholds.warningDelay) return 'moderate';
  return 'nominal';
}

export interface PortfolioRiskCalculation {
  totalCapExCr: number;
  severeRiskCapExCr: number;
  severeRiskPct: number;
  criticalCount: number;
  warningCount: number;
  nominalCount: number;
  avgDelay: number;
}

export function calculatePortfolioMetrics(
  projects: Array<{ outlayCr?: number; sanctionedCost?: number; predictedDelayDays?: number; delayDays?: number }>,
  thresholds: RiskThresholds
): PortfolioRiskCalculation {
  let totalCapExCr = 0;
  let severeRiskCapExCr = 0;
  let criticalCount = 0;
  let warningCount = 0;
  let nominalCount = 0;
  let totalDelay = 0;

  for (const p of projects) {
    const delay = p.predictedDelayDays !== undefined ? p.predictedDelayDays : (p.delayDays ?? 0);
    // outlayCr is already in Crores. If only sanctionedCost (in Rupees) is given, convert to Crores.
    const outlay = p.outlayCr !== undefined ? p.outlayCr : ((p.sanctionedCost ?? 0) / 10000000);
    totalCapExCr += outlay;
    totalDelay += delay;

    if (delay >= thresholds.criticalDelay) {
      criticalCount++;
      severeRiskCapExCr += outlay;
    } else if (delay >= thresholds.warningDelay) {
      warningCount++;
    } else {
      nominalCount++;
    }
  }

  const avgDelay = projects.length ? Math.round(totalDelay / projects.length) : 0;
  const severeRiskPct = totalCapExCr > 0 ? (severeRiskCapExCr / totalCapExCr) * 100 : 0;

  return {
    totalCapExCr,
    severeRiskCapExCr,
    severeRiskPct,
    criticalCount,
    warningCount,
    nominalCount,
    avgDelay,
  };
}
