import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  ...props
}) => {
  const styles = {
    info: "bg-blue-900/40 text-blue-300 border-blue-800",
    success: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
    warning: "bg-yellow-900/40 text-yellow-300 border-yellow-800",
    danger: "bg-red-900/40 text-red-300 border-red-800",
    neutral: "bg-slate-800 text-slate-300 border-slate-700"
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
