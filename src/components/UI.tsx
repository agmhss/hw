import React from 'react';
import { LucideIcon } from 'lucide-react';

export const Card = ({ children, className = "", id, ...props }: { children: React.ReactNode, className?: string, id?: string, [key: string]: any }) => (
  <div id={id} className={`bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

export const Button = ({ children, onClick, className = "", variant = "primary", disabled, id, type }: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string, 
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline",
  disabled?: boolean,
  id?: string,
  type?: "button" | "submit" | "reset"
}) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50",
    outline: "bg-transparent border-2 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
  };

  return (
    <button 
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm tracking-tight disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", placeholder, value, onChange, className = "", id }: {
  label?: string,
  type?: string,
  placeholder?: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  id?: string
}) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>}
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-300 font-medium"
    />
  </div>
);

export const Badge = ({ children, variant = "neutral", className = "", id }: { 
  children: React.ReactNode, 
  variant?: "neutral" | "success" | "warning" | "danger",
  className?: string,
  id?: string 
}) => {
  const variants = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700"
  };
  return (
    <span id={id} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Textarea = ({ label, placeholder, value, onChange, className = "", id, rows = 3 }: {
  label?: string,
  placeholder?: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  className?: string,
  id?: string,
  rows?: number
}) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>}
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-300 font-medium resize-none"
    />
  </div>
);

export const IconLabel = ({ icon: Icon, label, className = "" }: { icon: LucideIcon, label: string, className?: string }) => (
  <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </div>
);
