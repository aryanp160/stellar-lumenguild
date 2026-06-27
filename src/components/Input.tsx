import React from 'react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-textMuted mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-text placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
            error ? "border-error focus:ring-error" : "border-border",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
