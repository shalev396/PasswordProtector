import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, Copy, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { pathTo, ROUTES } from '@/router/routes';
import type { PasswordItem } from '@/types';

interface PasswordCardProps {
  password: PasswordItem;
  decryptedPassword: string | null;
  onDecrypt: () => void;
  onDelete: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  social: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  email: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  finance: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  work: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  gaming: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  development: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
};

const DEFAULT_CATEGORY_COLOR = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? DEFAULT_CATEGORY_COLOR;
}

export function PasswordCard({
  password,
  decryptedPassword,
  onDecrypt,
  onDelete,
}: PasswordCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();
  const language = lng ?? 'en';
  const [isVisible, setIsVisible] = useState(false);

  const handleCopy = () => {
    if (decryptedPassword === null) {
      onDecrypt();
      return;
    }
    void navigator.clipboard.writeText(decryptedPassword).then(() => {
      toast.success(t('dashboard.card.copied'));
    });
  };

  const handleToggleVisibility = () => {
    if (decryptedPassword === null) {
      onDecrypt();
      return;
    }
    setIsVisible((prev) => !prev);
  };

  const handleEdit = () => {
    void navigate(pathTo(`${ROUTES.EDIT_PASSWORD}/${password.id}`, language));
  };

  const handleDelete = () => {
    const confirmed = window.confirm(t('dashboard.card.deleteConfirm'));
    if (confirmed) {
      onDelete();
    }
  };

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg truncate">{password.title}</CardTitle>
          {password.category !== null && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${getCategoryColor(password.category)}`}
            >
              {password.category}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {password.website !== null && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
            <a
              href={password.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {password.website}
            </a>
          </div>
        )}

        {password.username !== null && (
          <div className="text-sm">
            <span className="text-muted-foreground">{t('dashboard.card.username')}:</span>{' '}
            <span className="font-mono text-foreground">{password.username}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t('dashboard.card.password')}:</span>
          <span className="font-mono text-foreground">
            {isVisible && decryptedPassword !== null ? decryptedPassword : '••••••••'}
          </span>
          <Button variant="ghost" size="icon" className="size-7" onClick={handleToggleVisibility}>
            {isVisible && decryptedPassword !== null ? (
              <EyeOff className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
          </Button>
        </div>

        <Separator />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleCopy}
            title={t('dashboard.card.copy')}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleEdit}
            title={t('dashboard.card.edit')}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={handleDelete}
            title={t('dashboard.card.delete')}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
