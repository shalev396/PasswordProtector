import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Copy, Loader2, AlertTriangle, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { selectUser } from '@/store/userSlice';
import { selectMasterPassword } from '@/store/masterPasswordSlice';
import { getPassword } from '@/api/services/passwordService';
import { deriveKey, decryptData } from '@/lib/crypto';

interface DecryptPasswordDialogProps {
  passwordId: string | null;
  passwordTitle: string;
  passwordUsername: string | null;
  onClose: () => void;
}

export function DecryptPasswordDialog({
  passwordId,
  passwordTitle,
  passwordUsername,
  onClose,
}: DecryptPasswordDialogProps) {
  const { t } = useTranslation();
  const masterPassword = useSelector(selectMasterPassword);
  const user = useSelector(selectUser);
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (passwordId === null || masterPassword === null || !user?.email) {
      return;
    }

    const status = { cancelled: false };

    void (async () => {
      setIsLoading(true);
      setError(null);
      setDecryptedValue(null);

      try {
        const response = await getPassword(passwordId);
        const encryptedPassword = response.data.password;

        const key = await deriveKey(masterPassword, user.email);
        const plaintext = await decryptData(encryptedPassword, key);

        if (!status.cancelled) {
          setDecryptedValue(plaintext);
        }
      } catch {
        if (!status.cancelled) {
          setError(t('dashboard.decrypt.error'));
        }
      } finally {
        if (!status.cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      status.cancelled = true;
    };
  }, [passwordId, masterPassword, user?.email, t]);

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      toast.success(t('dashboard.card.copied'));
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDecryptedValue(null);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={passwordId !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{passwordTitle}</DialogTitle>
          <DialogDescription>{t('dashboard.decrypt.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <span className="ms-2 text-sm text-muted-foreground">
                {t('dashboard.decrypt.loading')}
              </span>
            </div>
          )}

          {error !== null && (
            <div className="flex items-start gap-3 rounded-md bg-destructive/10 p-4">
              <AlertTriangle className="size-5 shrink-0 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">{error}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.decrypt.errorHint')}</p>
              </div>
            </div>
          )}

          {decryptedValue !== null && (
            <>
              {/* Username row */}
              {passwordUsername !== null && (
                <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
                  <User className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm">{passwordUsername}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0"
                    onClick={() => {
                      handleCopy(passwordUsername);
                    }}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              )}

              {/* Decrypted value row */}
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
                <code className="flex-1 break-all text-sm font-mono">{decryptedValue}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  onClick={() => {
                    handleCopy(decryptedValue);
                  }}
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
