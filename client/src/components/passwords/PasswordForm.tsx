import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PasswordGenerator } from '@/components/passwords/PasswordGenerator';
import { StrengthMeter } from '@/components/passwords/StrengthMeter';
import { useLanguage } from '@/hooks/useLanguage';
import { pathTo, ROUTES } from '@/router/routes';

export interface PasswordFormData {
  title: string;
  username: string;
  password: string;
  website: string;
  notes: string;
  category: string;
}

interface PasswordFormProps {
  mode: 'add' | 'edit';
  initialData?: Partial<PasswordFormData>;
  onSubmit: (data: PasswordFormData) => void;
  isLoading: boolean;
}

const CATEGORIES = ['Login', 'Card', 'Note', 'Other'] as const;

export function PasswordForm({ mode, initialData, onSubmit, isLoading }: PasswordFormProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [username, setUsername] = useState(initialData?.username ?? '');
  const [password, setPassword] = useState(initialData?.password ?? '');
  const [website, setWebsite] = useState(initialData?.website ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; password?: string }>({});

  const validate = useCallback((): boolean => {
    const newErrors: { title?: string; password?: string } = {};

    if (title.trim() === '') {
      newErrors.title = t('dashboard.form.required');
    }
    if (password.trim() === '') {
      newErrors.password = t('dashboard.form.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, password, t]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validate()) {
        return;
      }
      onSubmit({
        title: title.trim(),
        username: username.trim(),
        password,
        website: website.trim(),
        notes: notes.trim(),
        category,
      });
    },
    [validate, onSubmit, title, username, password, website, notes, category],
  );

  const handleGeneratedPassword = useCallback((generated: string) => {
    setPassword(generated);
    setErrors((prev) => ({ ...prev, password: '' }));
  }, []);

  const pageTitle = mode === 'add' ? t('dashboard.form.addTitle') : t('dashboard.form.editTitle');
  const submitLabel =
    mode === 'add'
      ? isLoading
        ? t('dashboard.form.saving')
        : t('dashboard.form.save')
      : isLoading
        ? t('dashboard.form.saving')
        : t('dashboard.form.update');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link
            to={pathTo(ROUTES.DASHBOARD, language)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t('dashboard.form.backToVault')}
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <CardTitle className="text-xl">{pageTitle}</CardTitle>
            <CardDescription className="mt-1">
              {mode === 'add' ? t('dashboard.subtitle') : t('dashboard.form.editTitle')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('dashboard.form.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              placeholder={t('dashboard.form.titlePlaceholder')}
              disabled={isLoading}
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Username / Email */}
          <div className="space-y-2">
            <Label htmlFor="username">{t('dashboard.form.username')}</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder={t('dashboard.form.usernamePlaceholder')}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{t('dashboard.form.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                placeholder={t('dashboard.form.passwordPlaceholder')}
                disabled={isLoading}
                className="pe-10"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
                className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={
                  showPassword ? t('dashboard.card.hidePassword') : t('dashboard.card.showPassword')
                }
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            {password !== '' && <StrengthMeter password={password} />}
          </div>

          {/* Password Generator */}
          <PasswordGenerator onGenerate={handleGeneratedPassword} />

          <Separator />

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">{t('dashboard.form.website')}</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
              }}
              placeholder={t('dashboard.form.websitePlaceholder')}
              disabled={isLoading}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('dashboard.form.notes')}</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder={t('dashboard.form.notesPlaceholder')}
              disabled={isLoading}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">{t('dashboard.form.category')}</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            >
              <option value="">{t('dashboard.form.categoryPlaceholder')}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`dashboard.category.${cat.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" disabled={isLoading} asChild>
              <Link to={pathTo(ROUTES.DASHBOARD, language)}>{t('dashboard.form.cancel')}</Link>
            </Button>
            <Button type="submit" variant="gradient" disabled={isLoading}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
