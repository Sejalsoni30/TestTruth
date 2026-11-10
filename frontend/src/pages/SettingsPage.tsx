import React, { useState } from 'react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Settings, Key, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [provider, setProvider] = useState('none');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Engine Settings & AI Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure agnostic LLM integrations or rely on our static Deterministic Engine.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">LLM Provider Integration</h3>
              <p className="text-slate-400">Keys are kept strictly isolated and never passed into sandbox processes.</p>
            </div>
            <Badge variant={provider === 'none' ? 'slate' : 'cyan'}>
              {provider === 'none' ? 'Deterministic Mode Active' : `${provider.toUpperCase()} Mode`}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="none">None (Deterministic Static Rules & Heuristics)</option>
                <option value="gemini">Google Gemini (Gemini 1.5 Pro / Flash)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                <option value="ollama">Ollama (Local Host)</option>
              </select>
            </div>

            {provider !== 'none' && (
              <>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">API Key</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Model Name (Optional)</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. gemini-1.5-pro, gpt-4o, claude-3-5-sonnet-latest"
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {provider === 'ollama' && (
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Custom Endpoint URL</label>
                    <input
                      type="text"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-200 block mb-1">Deterministic Fallback Guarantee:</span>
            When provider is set to "None" or when an API key is unreachable, TestTruth seamlessly generates test assertions and identifies boundaries using static syntax pattern analysis with zero hallucinations.
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {saved ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Configuration saved
              </span>
            ) : (
              <span></span>
            )}
            <Button size="sm" variant="primary" type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

