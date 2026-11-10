import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'critical'
    | 'high'
    | 'medium'
    | 'low'
    | 'info'
    | 'mismatch'
    | 'survived'
    | 'weak'
    | 'missing'
    | 'inconclusive'
    | 'killed'
    | 'timeout'
    | 'no_coverage'
    | 'accent'
    | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium gap-1',
    md: 'text-xs px-3 py-1 font-medium gap-1.5',
  };

  // Status colours mapped strictly to the specification:
  // critical #B3261E | high #C75B12 | medium #B8860B | low #4F7A5C | info #3F6C9E
  // Mutation: killed #4F7A5C | survived #B3261E | timeout #B8860B | no coverage #9E8189
  const variantStyles = {
    critical: 'bg-critical/10 text-critical border border-critical/25',
    high: 'bg-high/10 text-high border border-high/25',
    medium: 'bg-medium/10 text-medium border border-medium/25',
    low: 'bg-low/10 text-low border border-low/25',
    info: 'bg-info/10 text-info border border-info/25',

    // Findings aliases
    mismatch: 'bg-critical/10 text-critical border border-critical/25',
    survived: 'bg-mutation-survived/10 text-mutation-survived border border-mutation-survived/25',
    weak: 'bg-medium/10 text-medium border border-medium/25',
    missing: 'bg-high/10 text-high border border-high/25',
    inconclusive: 'bg-info/10 text-info border border-info/25',

    // Mutation outcomes
    killed: 'bg-mutation-killed/10 text-mutation-killed border border-mutation-killed/25',
    timeout: 'bg-mutation-timeout/10 text-mutation-timeout border border-mutation-timeout/25',
    no_coverage: 'bg-mutation-no-coverage/10 text-mutation-no-coverage border border-mutation-no-coverage/25',

    accent: 'bg-accent/10 text-accent border border-accent/25',
    neutral: 'bg-surface-soft text-body border border-border',
  };

  // Default accessible icons for status
  const defaultIcons: Record<string, React.ReactNode> = {
    critical: <AlertOctagon className="w-3 h-3 shrink-0" />,
    mismatch: <AlertOctagon className="w-3 h-3 shrink-0" />,
    survived: <XCircle className="w-3 h-3 shrink-0" />,
    high: <AlertTriangle className="w-3 h-3 shrink-0" />,
    missing: <AlertTriangle className="w-3 h-3 shrink-0" />,
    medium: <HelpCircle className="w-3 h-3 shrink-0" />,
    weak: <HelpCircle className="w-3 h-3 shrink-0" />,
    timeout: <Clock className="w-3 h-3 shrink-0" />,
    low: <CheckCircle2 className="w-3 h-3 shrink-0" />,
    killed: <CheckCircle2 className="w-3 h-3 shrink-0" />,
    info: <Info className="w-3 h-3 shrink-0" />,
    inconclusive: <Info className="w-3 h-3 shrink-0" />,
    no_coverage: <HelpCircle className="w-3 h-3 shrink-0" />,
  };

  const renderIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {renderIcon}
      <span>{children}</span>
    </span>
  );
};
