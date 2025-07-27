"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = ({ 
  onClick=()=>{}, 
  children, 
  disabled = false, 
  className = "",
  variant = "default",
  size = "md",
  ...rest
}: ButtonProps) => {

  const baseClasses = "focus:outline-none focus:ring-4 font-medium rounded-lg transition-all duration-200";
  
  
  const variantClasses = {
    default: "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300",
    outline: "text-gray-800 bg-transparent border-2 border-gray-800 hover:bg-gray-800 hover:text-white focus:ring-gray-300",
    ghost: "text-gray-800 bg-transparent hover:bg-gray-100 focus:ring-gray-300"
  };
  

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm", 
    lg: "px-6 py-3 text-base"
  };
  

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  

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
      {...rest}
    >
      {children}
    </button>
  );
};
