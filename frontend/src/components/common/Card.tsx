import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'interactive';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const base = 'rounded-xl border transition-all duration-200';
  const variants = {
    default: 'bg-[#111827] border-slate-800 shadow-lg shadow-black/20',
    subtle: 'bg-[#161F30]/60 border-slate-800/80 backdrop-blur-sm',
    interactive:
      'bg-[#111827] border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

