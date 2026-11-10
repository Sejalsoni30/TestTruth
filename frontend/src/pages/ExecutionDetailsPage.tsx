import React from 'react';
import { Card } from '../components/common/Card.js';
import { Terminal, Shield, Cpu, Lock } from 'lucide-react';
import { Badge } from '../components/common/Badge.js';

export const ExecutionDetailsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Execution Sandbox Telemetry</h1>
        <p className="text-xs text-slate-400 mt-1">
          Isolated runtime monitoring: timeouts, memory bounds, stdout/stderr streams, and environment sanitization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Lock className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold">Network Isolation</h4>
          </div>
          <p className="text-xs text-slate-300">
            Untrusted code runs strictly with outbound sockets blocked or non-existent to protect against data exfiltration.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Cpu className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold">Resource Ceilings</h4>
          </div>
          <p className="text-xs text-slate-300">
            Strict 512MB RAM cap and 10-second CPU watchdog to terminate runaway execution and infinite loops.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Shield className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold">Sterile Environment</h4>
          </div>
          <p className="text-xs text-slate-300">
            Host environment secrets and API keys are completely purged from child process environment memory.
          </p>
        </Card>
      </div>
    </div>
  );
};

