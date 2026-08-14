import React from 'react';

interface NeumorphicCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isPressed?: boolean;
  className?: string;
}

export function NeumorphicCard({ children, isPressed = false, className = '', ...props }: NeumorphicCardProps) {
  const hasCustomBg = className.includes('bg-');
  const bgClass = hasCustomBg ? '' : 'bg-sand-100';
  const baseClasses = 'rounded-2xl transition-all duration-200 ease-in-out border border-white/60';
  const shadowClass = className.includes('!shadow-none')
    ? ''
    : isPressed 
      ? 'shadow-neu-pressed scale-[0.98]' 
      : 'shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98]';
  
  return (
    <button 
      className={`${bgClass} ${baseClasses} ${shadowClass} ${className} text-left flex flex-col focus:outline-none focus:ring-2 focus:ring-sand-400 focus:ring-offset-2 focus:ring-offset-sand-100`}
      {...props}
    >
      {children}
    </button>
  );
}
