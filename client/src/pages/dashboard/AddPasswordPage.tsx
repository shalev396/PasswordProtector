import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { PageMetadata } from '@/components/shared/PageMetadata';
import { PasswordForm } from '@/components/passwords/PasswordForm';
import type { PasswordFormData } from '@/components/passwords/PasswordForm';
import { FadeContent } from '@/components/animations/FadeContent';
import { useCreatePassword, usePasswords } from '@/api/queries';
import { selectUser } from '@/store/userSlice';
import { selectMasterPassword } from '@/store/masterPasswordSlice';
import { deriveKey, encryptData } from '@/lib/crypto';
import { useLanguage } from '@/hooks/useLanguage';
import { pathTo, ROUTES } from '@/router/routes';

export default function AddPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const user = useSelector(selectUser);
  const masterPassword = useSelector(selectMasterPassword);
  const createPassword = useCreatePassword();
  const { data: passwordsData } = usePasswords();

  const existingTags = useMemo(() => {
    if (passwordsData === undefined) {
      return [];
    }
    const tagSet = new Set<string>();
    for (const pw of passwordsData.passwords) {
      for (const tag of pw.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [passwordsData]);

  // Redirect to dashboard if no master password in memory
  useEffect(() => {
    if (!masterPassword) {
      toast.error(t('dashboard.toast.noMasterPassword'));
      void navigate(pathTo(ROUTES.DASHBOARD, language));
    }
  }, [masterPassword, navigate, language, t]);

  const handleSubmit = useCallback(
    async (data: PasswordFormData) => {
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
          tags: data.tags,
        });

        toast.success(t('dashboard.toast.createSuccess'));
        void navigate(pathTo(ROUTES.DASHBOARD, language));
      } catch {
        toast.error(t('dashboard.toast.encryptionError'));
      }
    },
    [user, masterPassword, createPassword, navigate, language, t],
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageMetadata title={`${t('dashboard.form.addTitle')} | Password Protector`} noIndex />
      <FadeContent>
        <PasswordForm
          mode="add"
          onSubmit={(data) => void handleSubmit(data)}
          isLoading={createPassword.isPending}
          existingTags={existingTags}
        />
      </FadeContent>
    </div>
  );
}
