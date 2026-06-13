import { useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 0, label: 'Sangat Lemah', color: '#EF4444' };
  if (score === 2) return { level: 1, label: 'Lemah', color: '#F97316' };
  if (score === 3) return { level: 2, label: 'Sedang', color: '#EAB308' };
  if (score === 4) return { level: 3, label: 'Kuat', color: '#22C55E' };
  return { level: 4, label: 'Sangat Kuat', color: '#16A34A' };
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  showStrength = false,
  error = '',
  className = '',
}) {
  const [visible, setVisible] = useState(false);
  const strength = useMemo(() => getStrength(value || ''), [value]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          className={`w-full h-11 px-4 pr-11 rounded-xl border bg-background text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
            ${error
              ? 'border-red-400 focus:ring-red-300/30 focus:border-red-400'
              : 'border-border hover:border-foreground/20'
            }`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
        </button>
      </div>

      {showStrength && value && (
        <div className="pt-1 space-y-1">
          <div className="flex gap-1 h-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-500 ease-out"
                style={{
                  backgroundColor: i <= strength.level ? strength.color : 'var(--border)',
                  transform: i <= strength.level ? 'scaleY(1)' : 'scaleY(0.7)',
                }}
              />
            ))}
          </div>
          <p className="text-xs font-medium transition-colors" style={{ color: strength.color }}>
            {strength.label}
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
