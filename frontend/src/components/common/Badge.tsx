import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'mismatch'
    | 'survived'
    | 'weak'
    | 'missing'
    | 'inconclusive'
    | 'success'
    | 'indigo'
    | 'cyan'
    | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    mismatch: 'bg-red-500/10 text-red-400 border border-red-500/20',
    survived: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    weak: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    missing: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
    inconclusive: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

