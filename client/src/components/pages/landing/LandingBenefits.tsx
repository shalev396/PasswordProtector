import { useTranslation } from 'react-i18next';
import { CardContent } from '@/components/ui/card';
import { GradientText } from '@/components/animations/text/GradientText';
import { FadeContent } from '@/components/animations/FadeContent';
import { BounceCards, BounceCard } from '@/components/ui/bounce-cards';
import { Sparkles, Search, Monitor, Terminal } from 'lucide-react';

const benefits = [
  { icon: Sparkles, key: 'generator' },
  { icon: Search, key: 'search' },
  { icon: Monitor, key: 'device' },
  { icon: Terminal, key: 'cli' },
] as const;

export function LandingBenefits() {
  const { t } = useTranslation();

  return (
    <FadeContent>
      <section
        id="benefits"
        className="container mx-auto scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            <GradientText>{t('landing.benefits.title')}</GradientText>
          </h2>
        </div>
        <BounceCards className="lg:grid-cols-4">
          {benefits.map(({ icon: Icon, key }) => (
            <BounceCard key={key}>
              <CardContent className="p-6 text-center sm:p-8">
                <Icon className="mx-auto mb-3 size-10 text-primary sm:mb-4 sm:size-12" />
                <h3 className="mb-2 text-base font-semibold sm:text-lg">
                  {t(`landing.benefits.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`landing.benefits.${key}.description`)}
                </p>
              </CardContent>
            </BounceCard>
          ))}
        </BounceCards>
      </section>
    </FadeContent>
  );
}
