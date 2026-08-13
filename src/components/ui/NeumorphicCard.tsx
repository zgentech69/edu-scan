import React from 'react';

interface NeumorphicCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isPressed?: boolean;
  className?: string;
}

export function NeumorphicCard({ children, isPressed = false, className = '', ...props }: NeumorphicCardProps) {
  const baseClasses = 'bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out';
  const shadowClass = isPressed ? 'shadow-neu-pressed scale-95' : 'shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-95';
  
  return (
    <button 
      className={`${baseClasses} ${shadowClass} ${className} text-left flex flex-col focus:outline-none focus:ring-2 focus:ring-sand-300 focus:ring-offset-2 focus:ring-offset-sand-100`}
      {...props}
    >
      {children}
    </button>
  );
}
