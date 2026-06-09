import React from 'react';
import { cn } from '@/utils/helpers';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 font-ui">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-[var(--destructive)] ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-white text-[var(--foreground)] cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]',
            'transition-all duration-200',
            error ? 'border-[var(--destructive)]' : 'border-[var(--border)]',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
