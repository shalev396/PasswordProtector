import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { generatePassword } from '@/lib/passwordGenerator';
import type { GeneratorOptions } from '@/lib/passwordGenerator';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
}

export function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const handleGenerate = useCallback(() => {
    const password = generatePassword(options);
    setGenerated(password);
    onGenerate(password);
    setCopied(false);
  }, [options, onGenerate]);

  const handleCopy = useCallback(async () => {
    if (generated === '') {
      return;
    }
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [generated]);

  const toggleOption = useCallback((key: keyof Omit<GeneratorOptions, 'length'>) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleLengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions((prev) => ({ ...prev, length: Number(e.target.value) }));
  }, []);

  return (
    <div className="rounded-lg border bg-muted/30">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-lg"
      >
        <span>{t('dashboard.generator.title')}</span>
        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <Separator />

          {/* Length slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('dashboard.generator.length')}</Label>
              <span className="text-sm font-mono font-medium tabular-nums">{options.length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              value={options.length}
              onChange={handleLengthChange}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          {/* Character toggles */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: 'uppercase', label: t('dashboard.generator.uppercase') },
                { key: 'lowercase', label: t('dashboard.generator.lowercase') },
                { key: 'numbers', label: t('dashboard.generator.numbers') },
                { key: 'symbols', label: t('dashboard.generator.symbols') },
              ] as const
            ).map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => {
                    toggleOption(key);
                  }}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {/* Generate button */}
          <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGenerate}>
            <RefreshCw className="size-4" />
            {t('dashboard.generator.generate')}
          </Button>

          {/* Generated password display */}
          {generated !== '' && (
            <div className="flex gap-2">
              <Input value={generated} readOnly className="font-mono text-sm" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => void handleCopy()}
                className="shrink-0"
                aria-label={t('dashboard.generator.copyGenerated')}
              >
                {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
