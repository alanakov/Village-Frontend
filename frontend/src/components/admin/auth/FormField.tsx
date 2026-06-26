interface FormFieldProps {
  id: string
  label: string
  type?: string
  autoComplete?: string
  placeholder?: string
  error?: string
  registration: object
  disabled?: boolean
}

export function FormField({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  error,
  registration,
  disabled,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--foreground)] font-ui">
        {label} <span className="text-[var(--destructive)]">*</span>
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        {...registration}
        className={`w-full px-4 py-3 rounded-xl border bg-white font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
          error
            ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
            : 'border-[var(--border)] focus:ring-[var(--primary)]'
        }`}
      />
      {error && (
        <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
