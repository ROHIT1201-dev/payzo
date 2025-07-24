"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = ({ 
  onClick=()=>{}, 
  children, 
  disabled = false, 
  className = "",
  variant = "default",
  size = "md"
}: ButtonProps) => {
  // Base classes
  const baseClasses = "focus:outline-none focus:ring-4 font-medium rounded-lg transition-all duration-200";
  
  // Variant classes
  const variantClasses = {
    default: "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300",
    outline: "text-gray-800 bg-transparent border-2 border-gray-800 hover:bg-gray-800 hover:text-white focus:ring-gray-300",
    ghost: "text-gray-800 bg-transparent hover:bg-gray-100 focus:ring-gray-300"
  };
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm", 
    lg: "px-6 py-3 text-base"
  };
  
  // Disabled classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabledClasses} 
    ${className}
    me-2 mb-2
  `.trim().replace(/\s+/g, ' ');

  return (
    <button 
      onClick={disabled ? undefined : onClick}
      type="button" 
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
