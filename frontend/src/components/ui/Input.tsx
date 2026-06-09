import React from 'react';
import { cn } from '@/utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 font-ui">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-[var(--destructive)] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-white text-[var(--foreground)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]',
            'placeholder:text-[var(--muted-foreground)] transition-all duration-200',
            error ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]' : 'border-[var(--border)]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-[var(--destructive)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
