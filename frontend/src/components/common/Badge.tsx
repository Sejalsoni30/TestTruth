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

  // Distinct hues strictly from the warm semantic specification
  const variantStyles = {
    critical: 'bg-critical/15 text-critical border border-critical/30',
    high: 'bg-high/15 text-high border border-high/30',
    medium: 'bg-medium/15 text-medium border border-medium/30',
    low: 'bg-low/15 text-low border border-low/30',
    info: 'bg-info/15 text-info border border-info/30',

    // Findings
    mismatch: 'bg-critical/15 text-critical border border-critical/30',
    survived: 'bg-critical/15 text-critical border border-critical/30',
    weak: 'bg-medium/15 text-medium border border-medium/30',
    missing: 'bg-high/15 text-high border border-high/30',
    inconclusive: 'bg-info/15 text-info border border-info/30',

    // Mutation outcomes
    killed: 'bg-low/15 text-low border border-low/30',
    timeout: 'bg-medium/15 text-medium border border-medium/30',

    accent: 'bg-accent/20 text-body border border-accent/40',
    neutral: 'bg-surface-raised text-muted border border-border',
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
