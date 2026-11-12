import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button.js';

export const TestSensitivityCalculator: React.FC = () => {
  const [coverage, setCoverage] = useState(88);
  const [testCount, setTestCount] = useState(120);
  const [mockingLevel, setMockingLevel] = useState<'low' | 'medium' | 'heavy'>('medium');

  // Mathematical approximation of false confidence based on typical empirical mutation research
  const mockFactor = mockingLevel === 'low' ? 0.15 : mockingLevel === 'medium' ? 0.32 : 0.55;
  const coverageBlindspot = Math.max(0, (100 - coverage) * 0.4);
  const shallowTestFactor = Math.min(45, (100 - coverage) * 0.2 + mockFactor * 50);

  // False confidence index (0 - 100%)
  const falseConfidenceScore = Math.round(
    Math.min(85, Math.max(12, shallowTestFactor + coverageBlindspot))
  );

  const predictedMutants = Math.round(testCount * 2.8);
  const estimatedEscapes = Math.round(predictedMutants * (falseConfidenceScore / 100));

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-medium/10 text-medium border border-medium/20 mb-1.5">
            <Gauge className="w-3 h-3" /> Test Suite Vulnerability Estimator
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-body tracking-tight">
            Calculate Your Test Suite False Confidence Rate
          </h3>
          <p className="text-xs text-muted mt-1">
            Standard line coverage hides zero-assertion tests and unverified boundary mutants.
          </p>
        </div>

        <Link to="/register">
          <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Audit Real Repo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Coverage Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono font-semibold text-body">
                Reported Line Coverage:
              </label>
              <span className="text-sm font-mono font-bold text-accent">{coverage}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={100}
              value={coverage}
              onChange={(e) => setCoverage(Number(e.target.value))}
              className="w-full accent-accent h-2 bg-surface-soft rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
              <span>40% (Basic)</span>
              <span>80% (Standard)</span>
              <span>100% (Full Lines)</span>
            </div>
          </div>

          {/* Test Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono font-semibold text-body">
                Total Test Count:
              </label>
              <span className="text-sm font-mono font-bold text-body">{testCount} tests</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={testCount}
              onChange={(e) => setTestCount(Number(e.target.value))}
              className="w-full accent-accent h-2 bg-surface-soft rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
              <span>10 (Starter)</span>
              <span>250 (Mid-size)</span>
              <span>500+ (Enterprise)</span>
            </div>
          </div>

          {/* Mocking Level */}
          <div>
            <label className="block text-xs font-mono font-semibold text-body mb-2">
              Mocking & Stubbing Reliance:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'heavy'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setMockingLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono capitalize border transition-all ${
                    mockingLevel === lvl
                      ? 'bg-surface-soft border-accent text-accent font-bold shadow-sm'
                      : 'bg-surface border-border text-muted hover:border-border-secondary'
                  }`}
                >
                  {lvl} Mocking
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Results Column */}
        <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-2xl bg-surface-soft/60 border border-border">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <span className="text-xs font-mono font-bold uppercase text-muted">
                Audit Estimation Forecast
              </span>
              <span className="text-[11px] font-mono text-accent">Empirical Heuristics</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-surface border border-border">
                <div className="text-[10px] font-mono text-muted uppercase">
                  False Confidence Index
                </div>
                <div className="text-2xl font-bold font-mono text-critical mt-1">
                  {falseConfidenceScore}%
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  Probability of untested logical variants
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-border">
                <div className="text-[10px] font-mono text-muted uppercase">
                  Predicted Surviving Mutants
                </div>
                <div className="text-2xl font-bold font-mono text-medium mt-1">
                  ~{estimatedEscapes}
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  Out of ~{predictedMutants} injectable mutants
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-xs font-bold text-body mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-high" /> Critical Takeaway:
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Even with <strong className="text-body font-mono">{coverage}%</strong> reported line coverage, approximately{' '}
                <strong className="text-critical font-mono">{estimatedEscapes}</strong> subtle logic modifications would pass undetected because tests focus on execution rather than rigorous assertion validation.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted">Want exact proof for your codebase?</span>
            <Link
              to="/register"
              className="text-accent hover:text-accent-hover font-bold inline-flex items-center gap-1"
            >
              Run free analysis <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
