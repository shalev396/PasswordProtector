import { Shield, EyeOff, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GradientText } from '@/components/animations/text/GradientText';
import { FadeContent } from '@/components/animations/FadeContent';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const FEATURES: { icon: LucideIcon; slug: string }[] = [
  { icon: Shield, slug: 'clientSide' },
  { icon: EyeOff, slug: 'zeroKnowledge' },
  { icon: Layers, slug: 'dualLayer' },
];

export function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <FadeContent delay={200}>
      <section
        id="features"
        className="container mx-auto scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {t('landing.features.title')}{' '}
            <GradientText>{t('landing.features.titleHighlight')}</GradientText>
          </h2>
          <p className="text-muted-foreground mt-3 text-base sm:mt-4 sm:text-lg">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, slug }) => (
            <SpotlightCard key={slug} className="bg-card">
              <div className="flex flex-col items-center p-6 text-center sm:p-8">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-200 hover:scale-105 sm:size-20">
                  <Icon className="size-8 sm:size-10" />
                </div>
                <h3 className="mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
                  {t(`landing.features.${slug}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t(`landing.features.${slug}.description`)}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>
    </FadeContent>
  );
}
