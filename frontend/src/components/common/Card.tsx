import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'interactive' | 'glass';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const base = 'rounded-2xl border transition-all duration-200';
  const variants = {
    default: 'glass-card shadow-elevation-md',
    subtle: 'bg-surface/50 border-border/80 backdrop-blur-md shadow-elevation-sm',
    interactive:
      'glass-card shadow-elevation-sm hover:shadow-elevation-md hover:border-accent/40 cursor-pointer',
    glass: 'glass-card shadow-elevation-lg',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
