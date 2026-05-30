/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, HelpCircle, ArrowRight, TrendingUp, TrendingDown, ShieldAlert, BadgeCheck } from 'lucide-react';
import { ShapValue } from '../types';

interface ShapExplanationViewProps {
  shapValues: ShapValue[];
  riskPercentage: number;
}

export default function ShapExplanationView({ shapValues, riskPercentage }: ShapExplanationViewProps) {
  const [selectedFeature, setSelectedFeature] = useState<ShapValue | null>(shapValues[0] || null);

  // Separate positive/negative factors
  const riskBoosters = [...shapValues]
    .filter(s => s.shapValueHex > 0)
    .sort((a, b) => b.shapValueHex - a.shapValueHex);

  const riskReducers = [...shapValues]
    .filter(s => s.shapValueHex <= 0)
    .sort((a, b) => a.shapValueHex - b.shapValueHex);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-emerald-600" />
          <h3 className="font-display font-bold text-zinc-800 text-sm sm:text-base">XGBoost & SHAP Attribution Logic</h3>
        </div>
        <span className="text-[10px] sm:text-xs font-mono text-zinc-650 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200 font-bold shadow-sm">
          Global Core Thresholds: 10% base target
        </span>
      </div>

      <p className="font-sans text-xs text-zinc-500 leading-normal max-w-2xl font-semibold">
        SHAP (Shapley Additive exPlanations) distributes credit among each cardiovascular biomarker. Rose indicators reflect factors driving your risk <strong className="text-rose-600 font-bold">Upward</strong> from the normal baseline. Emerald indicators reflect protective factors driving risk <strong className="text-emerald-600 font-bold">Downward</strong>.
      </p>

      {/* Grid container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        
        {/* Graph Columns */}
        <div className="lg:col-span-3 space-y-5 border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm">
          
          {/* Risk Boosters Segment */}
          {riskBoosters.length > 0 && (
            <div className="space-y-3.5">
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 font-sans">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Risk Amplifiers (Positive SHAP Values)</span>
              </span>
              
              <div className="space-y-3">
                {riskBoosters.map((shap, idx) => {
                  const isCur = selectedFeature?.featureName === shap.featureName;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedFeature(shap)}
                      className={`p-3 rounded-xl border transition-smooth cursor-pointer ${
                        isCur
                          ? 'border-rose-200 bg-rose-50/50 shadow-sm'
                          : 'border-zinc-150 hover:border-zinc-200 bg-zinc-50/30 hover:bg-zinc-50/75'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-800 mb-1.5 leading-none">
                        <span>{shap.featureName} ({shap.featureValue})</span>
                        <span className="text-rose-600 font-bold font-mono">+{shap.shapValueHex}% risk modifier</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, (shap.percentageContribution / 30) * 100)}%` }}
                          className="h-full bg-rose-500 rounded-full"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Risk Reducers Segment */}
          {riskReducers.length > 0 && (
            <div className="space-y-3.5 border-t border-zinc-100 pt-5">
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 font-sans">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>Protective Factors (Negative SHAP Values)</span>
              </span>

              <div className="space-y-3">
                {riskReducers.map((shap, idx) => {
                  const isCur = selectedFeature?.featureName === shap.featureName;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedFeature(shap)}
                      className={`p-3 rounded-xl border transition-smooth cursor-pointer ${
                        isCur
                          ? 'border-emerald-200 bg-emerald-50/40 shadow-sm'
                          : 'border-zinc-150 hover:border-zinc-200 bg-zinc-50/30 hover:bg-zinc-50/75'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-800 mb-1.5 leading-none">
                        <span>{shap.featureName} ({shap.featureValue})</span>
                        <span className="text-emerald-700 font-bold font-mono">{shap.shapValueHex}% risk modifier</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, (shap.percentageContribution / 30) * 100)}%` }}
                          className="h-full bg-emerald-550 rounded-full"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Feature Explainer card sidebar */}
        <div className="lg:col-span-2">
          {selectedFeature ? (
            <div className="sticky top-24 rounded-2xl border border-zinc-200 p-5 leading-relaxed space-y-4 shadow-sm bg-white">
              <div className="flex items-center space-x-2.5">
                <HelpCircle className="h-5 w-5 text-emerald-650" />
                <h4 className="font-display font-bold text-zinc-850 text-sm">Biomarker Explanation</h4>
              </div>

              <div className="border-t border-zinc-100 pt-3 space-y-2">
                <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">Target Feature</div>
                <div className="font-display font-extrabold text-zinc-800 text-base">
                  {selectedFeature.featureName}
                </div>
                <div className="inline-flex items-center space-x-2 rounded-lg bg-zinc-50 border border-zinc-150 py-1.5 px-2.5">
                  <span className="text-zinc-500 font-mono text-xs font-semibold">Registered value:</span>
                  <span className="font-mono text-zinc-800 font-bold">{selectedFeature.featureValue}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-zinc-100 pt-3">
                <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">Biological Contribution</div>
                <div className={`text-base font-bold font-mono flex items-center space-x-1.5 ${
                  selectedFeature.shapValueHex > 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {selectedFeature.shapValueHex > 0 ? (
                    <>
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
                      <span>+{selectedFeature.shapValueHex}% Risk Increase</span>
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="h-4.5 w-4.5 text-emerald-600" />
                      <span>{selectedFeature.shapValueHex}% Risk Lowering</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-150 mt-2.5">
                  {selectedFeature.explanation}
                </p>
              </div>

              <div className="text-[10px] font-mono text-zinc-400 font-bold text-center leading-normal pt-1 bg-zinc-50 py-2 rounded-lg border border-zinc-150">
                Click other feature rows in the left board to review details.
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 bg-zinc-50 shadow-sm font-semibold">
              Select any biomarker row in the left graph to explore explanation.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
