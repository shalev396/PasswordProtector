import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { PageMetadata } from '@/components/shared/PageMetadata';
import { PasswordForm } from '@/components/passwords/PasswordForm';
import type { PasswordFormData } from '@/components/passwords/PasswordForm';
import { FadeContent } from '@/components/animations/FadeContent';
import { usePassword, useUpdatePassword } from '@/api/queries';
import { selectUser, selectMasterPassword } from '@/store/userSlice';
import { deriveKey, encryptData, decryptData } from '@/lib/crypto';
import { useLanguage } from '@/hooks/useLanguage';
import { pathTo, ROUTES } from '@/router/routes';

export default function EditPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const user = useSelector(selectUser);
  const updatePassword = useUpdatePassword();

  const { data: passwordData, isLoading: isFetching, error: fetchError } = usePassword(id ?? '');

  const [decryptedData, setDecryptedData] = useState<Partial<PasswordFormData> | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(true);

  // Redirect to dashboard if no master password
  useEffect(() => {
    const masterPassword = selectMasterPassword();
    if (!masterPassword) {
      toast.error(t('dashboard.toast.noMasterPassword'));
      void navigate(pathTo(ROUTES.DASHBOARD, language));
    }
  }, [navigate, language, t]);

  // Decrypt password data once fetched
  useEffect(() => {
    if (!passwordData) {
      return;
    }

    const masterPassword = selectMasterPassword();
    if (!masterPassword || !user?.email) {
      return;
    }

    const status = { cancelled: false };

    void (async () => {
      try {
        setIsDecrypting(true);
        const key = await deriveKey(masterPassword, user.email);
        const decryptedPassword = await decryptData(passwordData.password, key);

        if (!status.cancelled) {
          setDecryptedData({
            title: passwordData.title,
            username: passwordData.username ?? '',
            password: decryptedPassword,
            website: passwordData.website ?? '',
            notes: passwordData.notes ?? '',
            category: passwordData.category ?? '',
          });
        }
      } catch {
        if (!status.cancelled) {
          toast.error(t('dashboard.toast.decryptionError'));
        }
      } finally {
        if (!status.cancelled) {
          setIsDecrypting(false);
        }
      }
    })();

    return () => {
      status.cancelled = true;
    };
  }, [passwordData, user, t]);

  const handleSubmit = useCallback(
    async (data: PasswordFormData) => {
      const masterPassword = selectMasterPassword();
      if (!masterPassword || !user?.email || !id) {
        toast.error(t('dashboard.toast.noMasterPassword'));
        void navigate(pathTo(ROUTES.DASHBOARD, language));
        return;
      }

      try {
        const key = await deriveKey(masterPassword, user.email);
        const encryptedPassword = await encryptData(data.password, key);

        await updatePassword.mutateAsync({
          id,
          body: {
            title: data.title,
            username: data.username || null,
            password: encryptedPassword,
            website: data.website || null,
            notes: data.notes || null,
            category: data.category || null,
          },
        });

        toast.success(t('dashboard.toast.updateSuccess'));
        void navigate(pathTo(ROUTES.DASHBOARD, language));
      } catch {
        toast.error(t('dashboard.toast.encryptionError'));
      }
    },
    [user, id, updatePassword, navigate, language, t],
  );

  const isLoadingState = isFetching || isDecrypting;

  // Error state
  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PageMetadata title={`${t('dashboard.form.editTitle')} | Elytra`} noIndex />
        <div className="max-w-2xl mx-auto rounded-md bg-destructive/10 p-6 text-center text-destructive">
          <p className="text-lg font-medium">{t('dashboard.errorLoading')}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingState || !decryptedData) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PageMetadata title={`${t('dashboard.form.editTitle')} | Elytra`} noIndex />
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">{t('dashboard.loadingPassword')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageMetadata title={`${t('dashboard.form.editTitle')} | Elytra`} noIndex />
      <FadeContent>
        <PasswordForm
          mode="edit"
          initialData={decryptedData}
          onSubmit={(data) => void handleSubmit(data)}
          isLoading={updatePassword.isPending}
        />
      </FadeContent>
    </div>
  );
}
