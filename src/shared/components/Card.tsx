import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-brand-dark-900 border border-brand-dark-700 rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:border-brand-dark-600 ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-brand-dark-700 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="px-5 py-4 text-sm text-slate-200">
        {children}
      </div>
      {footer && (
        <div className="px-5 py-3 border-t border-brand-dark-700 bg-brand-dark-900/50 flex items-center justify-end text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};
