import React from 'react';
import { cn } from '@/utils/helpers';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 font-ui">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-[var(--destructive)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-white text-[var(--foreground)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]',
            'placeholder:text-[var(--muted-foreground)] transition-all duration-200 resize-y',
            error ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]' : 'border-[var(--border)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
