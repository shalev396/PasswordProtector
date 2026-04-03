import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateStrength } from '@/lib/passwordGenerator';

interface StrengthMeterProps {
  password: string;
}

const SEGMENT_COLORS = [
  'bg-muted',
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
] as const;

export function StrengthMeter({ password }: StrengthMeterProps) {
  const { t } = useTranslation();

  const strength = useMemo(() => calculateStrength(password), [password]);

  const label = useMemo((): string => {
    switch (strength) {
      case 0:
        return '';
      case 1:
        return t('dashboard.strength.veryWeak');
      case 2:
        return t('dashboard.strength.weak');
      case 3:
        return t('dashboard.strength.fair');
      case 4:
        return t('dashboard.strength.strong');
      default:
        return '';
    }
  }, [strength, t]);

  const colorClass = SEGMENT_COLORS[strength] ?? SEGMENT_COLORS[0];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < strength ? colorClass : 'bg-muted'
            }`}
          />
        ))}
      </div>
      {label !== '' && (
        <p
          className={`text-xs font-medium transition-colors duration-300 ${
            strength <= 1
              ? 'text-red-500'
              : strength === 2
                ? 'text-orange-500'
                : strength === 3
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-green-500'
          }`}
        >
          {label}
        </p>
      )}
    </div>
  );
}
