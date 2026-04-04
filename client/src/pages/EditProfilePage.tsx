import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FadeContent } from '@/components/animations/FadeContent';
import { ArrowLeft } from 'lucide-react';
import { PageMetadata } from '@/components/shared/PageMetadata';
import { useUpdateMe } from '@/api/queries';
import { selectProfile } from '@/store/userSlice';
import { useLanguage } from '@/hooks/useLanguage';
import { pathTo, ROUTES } from '@/router/routes';
import { app } from '@/data/app';

export default function EditProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const profile = useSelector(selectProfile);
  const updateMe = useUpdateMe();

  const [name, setName] = useState(profile?.name ?? '');

  const hasChanges = name !== '' && name !== (profile?.name ?? '');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!hasChanges) {
      toast.info(t('profile.edit.noChanges'));
      return;
    }

    try {
      await updateMe.mutateAsync({ name });
      toast.success(t('profile.edit.success'));
      void navigate(pathTo(ROUTES.PROFILE, language));
    } catch {
      // Error toast is handled by the axios interceptor
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <PageMetadata title={`Edit Profile | ${app.name}`} noIndex />
      <div className="mx-auto max-w-2xl space-y-6">
        <FadeContent>
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => {
                void navigate(pathTo(ROUTES.PROFILE, language));
              }}
            >
              <ArrowLeft className="me-2 size-4" />
              {t('profile.title')}
            </Button>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t('profile.edit.title')}
            </h1>
            <p className="text-muted-foreground mt-1">{t('profile.edit.subtitle')}</p>
          </div>
        </FadeContent>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          <FadeContent delay={50}>
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.info.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('profile.edit.nameLabel')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder={t('profile.edit.namePlaceholder')}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.edit.emailLabel')}</Label>
                  <Input
                    id="email"
                    value={profile?.email ?? ''}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-muted-foreground text-xs">{t('profile.edit.emailReadonly')}</p>
                </div>
              </CardContent>
            </Card>
          </FadeContent>

          <FadeContent delay={100}>
            <div className="flex justify-end">
              <Button type="submit" disabled={updateMe.isPending || !hasChanges}>
                {updateMe.isPending ? t('profile.edit.submitting') : t('profile.edit.submit')}
              </Button>
            </div>
          </FadeContent>
        </form>
      </div>
    </div>
  );
}
