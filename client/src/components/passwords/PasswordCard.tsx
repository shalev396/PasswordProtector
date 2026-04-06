import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  Tag,
  LogIn,
  Key,
  FileCode,
  StickyNote,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { pathTo, ROUTES } from '@/router/routes';
import type { PasswordItem } from '@/types';

interface PasswordCardProps {
  password: PasswordItem;
  onShowPassword: () => void;
  onDelete: () => void;
}

const CATEGORY_ICON_MAP: Record<string, { icon: typeof LogIn; color: string }> = {
  login: { icon: LogIn, color: 'text-blue-500' },
  'api key': { icon: Key, color: 'text-cyan-500' },
  environment: { icon: FileCode, color: 'text-green-500' },
  'secure note': { icon: StickyNote, color: 'text-purple-500' },
};

const DEFAULT_CATEGORY_ICON = { icon: HelpCircle, color: 'text-muted-foreground' };

function getCategoryIcon(category: string): { icon: typeof LogIn; color: string } {
  return CATEGORY_ICON_MAP[category.toLowerCase()] ?? DEFAULT_CATEGORY_ICON;
}

function getDecryptLabel(category: string | null): string {
  const key = category?.toLowerCase() ?? '';
  if (key === 'environment') {
    return 'dashboard.decrypt.showEnv';
  }
  if (key === 'secure note') {
    return 'dashboard.decrypt.showNote';
  }
  if (key === 'api key') {
    return 'dashboard.decrypt.showKey';
  }
  return 'dashboard.decrypt.show';
}

export function PasswordCard({ password, onShowPassword, onDelete }: PasswordCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();
  const language = lng ?? 'en';

  const handleEdit = () => {
    void navigate(pathTo(`${ROUTES.EDIT_PASSWORD}/${password.id}`, language));
  };

  const handleDelete = () => {
    const confirmed = window.confirm(t('dashboard.card.deleteConfirm'));
    if (confirmed) {
      onDelete();
    }
  };

  const { icon: CategoryIcon, color: categoryColor } =
    password.category !== null ? getCategoryIcon(password.category) : DEFAULT_CATEGORY_ICON;

  // Subtitle: always show website if available, otherwise nothing
  const subtitle = password.website;

  return (
    <Card className="group flex flex-col">
      <CardContent className="flex flex-col gap-0 p-0">
        {/* Header: icon + title + subtitle */}
        <div className="flex items-center gap-3 px-3.5 pt-3.5 pb-2.5">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted ${categoryColor}`}
          >
            <CategoryIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold leading-tight truncate">{password.title}</h2>
            {subtitle !== null && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground truncate">
                <ExternalLink className="size-3 shrink-0" />
                <a
                  href={subtitle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                >
                  {subtitle}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Decrypt button */}
        <div className="px-3.5 pb-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 h-8 text-xs"
            onClick={onShowPassword}
          >
            <Eye className="size-3.5" />
            {t(getDecryptLabel(password.category))}
          </Button>
        </div>

        {/* Footer: tags (left) + actions (right) */}
        <div className="flex items-center justify-between gap-2 border-t px-3.5 py-2">
          <div className="flex flex-1 flex-wrap gap-1 min-w-0 overflow-hidden">
            {password.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground leading-none"
              >
                <Tag className="size-2.5" />
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handleEdit}
              title={t('dashboard.card.edit')}
              aria-label={t('dashboard.card.edit')}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:text-destructive"
              onClick={handleDelete}
              title={t('dashboard.card.delete')}
              aria-label={t('dashboard.card.delete')}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
