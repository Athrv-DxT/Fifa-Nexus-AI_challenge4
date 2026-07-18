import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2 focus:ring-offset-brand-dark-900 disabled:opacity-50 disabled:pointer-events-none";

  // Custom colors mapped from standard styles (e.g. bg-brand-red is translated to tailwind's red)
  // Let's make sure bg-brand-red resolves. We defined brand-dark, brand-blue, brand-gold.
  // Wait, let's look at the colors. In css / tailwind we can define custom red. In tailwind config we didn't add brand.red explicitly, but we can write CSS code or use red-500 etc. Let's make sure it matches.
  // Let's use Tailwind's built-in red-600 for danger.
  const customVariants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-transparent shadow",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-transparent shadow",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-slate-900 border border-transparent shadow",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button
      className={`${baseStyle} ${customVariants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
