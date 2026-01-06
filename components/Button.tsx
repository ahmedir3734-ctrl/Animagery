import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', icon, ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 text-sm tracking-wide";
  
  const variants = {
    primary: "bg-brand-accent hover:bg-brand-glow text-white shadow-lg shadow-brand-accent/20",
    secondary: "bg-white text-black hover:bg-gray-200",
    glass: "glass-panel text-white hover:bg-white/10",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};
