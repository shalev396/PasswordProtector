import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { PageMetadata } from '@/components/shared/PageMetadata';
import { PasswordForm } from '@/components/passwords/PasswordForm';
import type { PasswordFormData } from '@/components/passwords/PasswordForm';
import { FadeContent } from '@/components/animations/FadeContent';
import { useCreatePassword } from '@/api/queries';
import { selectUser, selectMasterPassword } from '@/store/userSlice';
import { deriveKey, encryptData } from '@/lib/crypto';
import { useLanguage } from '@/hooks/useLanguage';
import { pathTo, ROUTES } from '@/router/routes';

export default function AddPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const user = useSelector(selectUser);
  const createPassword = useCreatePassword();

  // Redirect to dashboard if no master password in session
  useEffect(() => {
    const masterPassword = selectMasterPassword();
    if (!masterPassword) {
      toast.error(t('dashboard.toast.noMasterPassword'));
      void navigate(pathTo(ROUTES.DASHBOARD, language));
    }
  }, [navigate, language, t]);

  const handleSubmit = useCallback(
    async (data: PasswordFormData) => {
      const masterPassword = selectMasterPassword();
      if (!masterPassword || !user?.email) {
        toast.error(t('dashboard.toast.noMasterPassword'));
        void navigate(pathTo(ROUTES.DASHBOARD, language));
        return;
      }

      try {
        const key = await deriveKey(masterPassword, user.email);
        const encryptedPassword = await encryptData(data.password, key);

        await createPassword.mutateAsync({
          title: data.title,
          username: data.username || null,
          password: encryptedPassword,
          website: data.website || null,
          notes: data.notes || null,
          category: data.category || null,
        });

        toast.success(t('dashboard.toast.createSuccess'));
        void navigate(pathTo(ROUTES.DASHBOARD, language));
      } catch {
        toast.error(t('dashboard.toast.encryptionError'));
      }
    },
    [user, createPassword, navigate, language, t],
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageMetadata title={`${t('dashboard.form.addTitle')} | Elytra`} noIndex />
      <FadeContent>
        <PasswordForm
          mode="add"
          onSubmit={(data) => void handleSubmit(data)}
          isLoading={createPassword.isPending}
        />
      </FadeContent>
    </div>
  );
}
