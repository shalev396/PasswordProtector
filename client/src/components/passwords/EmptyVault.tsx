import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeContent } from '@/components/animations/FadeContent';
import { pathTo, ROUTES } from '@/router/routes';

export function EmptyVault() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();
  const language = lng ?? 'en';

  return (
    <FadeContent>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldCheck className="size-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('dashboard.empty.title')}</h2>
        <p className="text-muted-foreground mb-6">{t('dashboard.empty.description')}</p>
        <Button
          variant="gradient"
          onClick={() => {
            void navigate(pathTo(ROUTES.ADD_PASSWORD, language));
          }}
        >
          {t('dashboard.addPassword')}
        </Button>
      </div>
    </FadeContent>
  );
}
