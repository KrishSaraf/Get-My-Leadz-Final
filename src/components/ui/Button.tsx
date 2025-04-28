import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center justify-center';
  const variantStyles = {
    primary: 'bg-[#5B3CC4] hover:bg-[#4B2CB4] text-white disabled:bg-gray-400',
    secondary: 'bg-[#00C2B2] hover:bg-[#00B2A2] text-white disabled:bg-gray-400',
    outline: 'border-2 border-[#5B3CC4] text-[#5B3CC4] hover:bg-[#5B3CC4] hover:text-white disabled:border-gray-400 disabled:text-gray-400',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}