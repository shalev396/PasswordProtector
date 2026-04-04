import { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  ChevronDown,
  LogIn,
  Key,
  FileCode,
  StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  tags: string[];
}

interface PasswordFormProps {
  mode: 'add' | 'edit';
  initialData?: Partial<PasswordFormData>;
  onSubmit: (data: PasswordFormData) => void;
  isLoading: boolean;
  /** All existing tags across the vault, used for autocomplete. */
  existingTags?: string[];
}

const CATEGORIES = [
  { value: 'Login', icon: LogIn },
  { value: 'API Key', icon: Key },
  { value: 'Environment', icon: FileCode },
  { value: 'Secure Note', icon: StickyNote },
] as const;

/** Categories that show a username / identifier field. */
const CATEGORIES_WITH_IDENTIFIER = new Set(['Login']);
/** Categories that show the password generator + strength meter. */
const CATEGORIES_WITH_GENERATOR = new Set(['Login']);
/** Categories that show the website URL field. */
const CATEGORIES_WITH_WEBSITE = new Set(['Login', 'API Key']);
/** Categories where the value is a large textarea instead of a single-line password. */
const CATEGORIES_WITH_TEXTAREA_VALUE = new Set(['Environment', 'Secure Note']);

export function PasswordForm({
  mode,
  initialData,
  onSubmit,
  isLoading,
  existingTags = [],
}: PasswordFormProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [username, setUsername] = useState(initialData?.username ?? '');
  const [password, setPassword] = useState(initialData?.password ?? '');
  const [website, setWebsite] = useState(initialData?.website ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [category, setCategory] = useState(initialData?.category ?? 'Login');
  const [tags, setTags] = useState(initialData?.tags ?? ([] as string[]));
  const [tagInput, setTagInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; password?: string }>({});
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const showIdentifier = useMemo(() => CATEGORIES_WITH_IDENTIFIER.has(category), [category]);
  const showGenerator = useMemo(() => CATEGORIES_WITH_GENERATOR.has(category), [category]);
  const showWebsite = useMemo(() => CATEGORIES_WITH_WEBSITE.has(category), [category]);
  const useTextarea = useMemo(() => CATEGORIES_WITH_TEXTAREA_VALUE.has(category), [category]);

  const valueLabel = useMemo(() => {
    switch (category) {
      case 'API Key':
        return t('dashboard.form.apiKey');
      case 'Environment':
        return t('dashboard.form.envValue');
      case 'Secure Note':
        return t('dashboard.form.noteContent');
      default:
        return t('dashboard.form.password');
    }
  }, [category, t]);

  const valuePlaceholder = useMemo(() => {
    switch (category) {
      case 'API Key':
        return t('dashboard.form.apiKeyPlaceholder');
      case 'Environment':
        return t('dashboard.form.envValuePlaceholder');
      case 'Secure Note':
        return t('dashboard.form.noteContentPlaceholder');
      default:
        return t('dashboard.form.passwordPlaceholder');
    }
  }, [category, t]);

  // Tag autocomplete suggestions
  const tagSuggestions = useMemo(() => {
    const query = tagInput.trim().toLowerCase();
    if (query === '') {
      return existingTags.filter((t) => !tags.includes(t));
    }
    return existingTags.filter((t) => t.toLowerCase().includes(query) && !tags.includes(t));
  }, [tagInput, existingTags, tags]);

  const tagPopoverOpen = tagInputFocused && tagInput.trim() !== '' && tagSuggestions.length > 0;

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
        username: showIdentifier ? username.trim() : '',
        password,
        website: showWebsite ? website.trim() : '',
        notes: notes.trim(),
        category,
        tags,
      });
    },
    [
      validate,
      onSubmit,
      title,
      username,
      password,
      website,
      notes,
      category,
      tags,
      showIdentifier,
      showWebsite,
    ],
  );

  const handleGeneratedPassword = useCallback((generated: string) => {
    setPassword(generated);
    setErrors((prev) => ({ ...prev, password: '' }));
  }, []);

  const addTag = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed !== '' && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
      }
      setTagInput('');
    },
    [tags],
  );

  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(tagInput);
      }
    },
    [addTag, tagInput],
  );

  const selectedCategoryObj = CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
  const CategoryIcon = selectedCategoryObj.icon;

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
          {/* Category - DropdownMenu */}
          <div className="space-y-2">
            <Label>{t('dashboard.form.category')}</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  <span className="flex items-center gap-2">
                    <CategoryIcon className="size-4" />
                    {t(`dashboard.category.${category.toLowerCase().replace(/ /g, '_')}`)}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {CATEGORIES.map(({ value, icon: Icon }) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => {
                      setCategory(value);
                    }}
                  >
                    <Icon className="size-4" />
                    {t(`dashboard.category.${value.toLowerCase().replace(/ /g, '_')}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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

          {/* Username / Email (only for Login) */}
          {showIdentifier && (
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
          )}

          {/* Password / Value */}
          <div className="space-y-2">
            <Label htmlFor="password">{valueLabel}</Label>
            {useTextarea ? (
              <textarea
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                placeholder={valuePlaceholder}
                disabled={isLoading}
                rows={6}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 resize-none"
                aria-invalid={!!errors.password}
              />
            ) : (
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
                  placeholder={valuePlaceholder}
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
                    showPassword
                      ? t('dashboard.card.hidePassword')
                      : t('dashboard.card.showPassword')
                  }
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            )}
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            {showGenerator && password !== '' && <StrengthMeter password={password} />}
          </div>

          {/* Password Generator (only for Login) */}
          {showGenerator && <PasswordGenerator onGenerate={handleGeneratedPassword} />}

          <Separator />

          {/* Website (Login + API Key) */}
          {showWebsite && (
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
          )}

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

          {/* Tags with autocomplete */}
          <div className="space-y-2">
            <Label htmlFor="tags">{t('dashboard.form.tags')}</Label>
            <Popover open={tagPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="flex gap-2">
                  <Input
                    ref={tagInputRef}
                    id="tags"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                    }}
                    onKeyDown={handleTagKeyDown}
                    onFocus={() => {
                      setTagInputFocused(true);
                    }}
                    onBlur={() => {
                      // Delay to allow click on suggestion
                      setTimeout(() => {
                        setTagInputFocused(false);
                      }, 200);
                    }}
                    placeholder={t('dashboard.form.tagsPlaceholder')}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      addTag(tagInput);
                    }}
                    disabled={isLoading || tagInput.trim() === ''}
                  >
                    {t('dashboard.form.addTag')}
                  </Button>
                </div>
              </PopoverTrigger>
              {tagSuggestions.length > 0 && (
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-1"
                  align="start"
                  onOpenAutoFocus={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="max-h-40 overflow-y-auto">
                    {tagSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-muted focus:bg-muted outline-hidden"
                        onClick={() => {
                          addTag(suggestion);
                          tagInputRef.current?.focus();
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              )}
            </Popover>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveTag(tag);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
