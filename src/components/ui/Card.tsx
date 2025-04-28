import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick, ...props }: CardProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}