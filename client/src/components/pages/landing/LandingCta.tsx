import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/animations/text/GradientText';
import { FadeContent } from '@/components/animations/FadeContent';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { pathTo, ROUTES } from '@/router/routes';
import { useLanguage } from '@/hooks/useLanguage';
import { ShieldCheck } from 'lucide-react';

export function LandingCta() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <FadeContent delay={600}>
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SpotlightCard className="bg-muted">
          <div className="p-8 text-center sm:p-10 lg:p-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t('landing.cta.title')}{' '}
              <GradientText>{t('landing.cta.titleHighlight')}</GradientText>
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base sm:mt-4 sm:text-lg">
              {t('landing.cta.description')}
            </p>
            <div className="mt-6 flex justify-center sm:mt-8">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to={pathTo(ROUTES.AUTH.SIGNUP, language)}>
                  <ShieldCheck className="me-2 size-5" />
                  {t('landing.cta.button')}
                </Link>
              </Button>
            </div>
          </div>
        </SpotlightCard>
      </section>
    </FadeContent>
  );
}
