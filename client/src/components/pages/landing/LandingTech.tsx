import {
  Keyboard,
  Key,
  Send,
  Server,
  Database,
  MousePointer,
  Download,
  Unlock,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GradientText } from '@/components/animations/text/GradientText';
import { FadeContent } from '@/components/animations/FadeContent';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { ElectricBorder } from '@/components/animations/ElectricBorder';

interface StepConfig {
  icon: LucideIcon;
  translationKey: string;
  hasSub?: boolean;
}

const encryptionSteps: StepConfig[] = [
  { icon: Keyboard, translationKey: 'step1' },
  { icon: Key, translationKey: 'step2', hasSub: true },
  { icon: Send, translationKey: 'step3' },
  { icon: Server, translationKey: 'step4' },
  { icon: Database, translationKey: 'step5' },
];

const retrievalSteps: StepConfig[] = [
  { icon: MousePointer, translationKey: 'step1' },
  { icon: Database, translationKey: 'step2' },
  { icon: Unlock, translationKey: 'step3' },
  { icon: Download, translationKey: 'step4' },
  { icon: CheckCircle, translationKey: 'step5' },
];

function StepCard({
  step,
  index,
  section,
}: {
  step: StepConfig;
  index: number;
  section: 'encryption' | 'retrieval';
}) {
  const { t } = useTranslation();
  const Icon = step.icon;

  return (
    <FadeContent delay={index * 100}>
      <div className="group relative flex gap-4 sm:gap-6">
        {/* Timeline connector */}
        <div className="flex flex-col items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-4 ring-background transition-transform duration-200 group-hover:scale-110 sm:size-14">
            <Icon className="size-6 sm:size-7" />
          </div>
          <div className="mt-2 w-px flex-1 bg-gradient-to-b from-primary/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="pb-10 pt-1">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            {t(`landing.tech.${section}.title`)} {index + 1}
          </div>
          <h4 className="mb-2 text-lg font-bold sm:text-xl">
            {t(`landing.tech.${section}.${step.translationKey}.title`)}
          </h4>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t(`landing.tech.${section}.${step.translationKey}.description`)}
          </p>
          {step.hasSub && (
            <div className="mt-3 inline-block rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground sm:text-sm">
              {t(`landing.tech.${section}.${step.translationKey}.sub`)}
            </div>
          )}
        </div>
      </div>
    </FadeContent>
  );
}

export function LandingTech() {
  const { t } = useTranslation();

  return (
    <FadeContent delay={400}>
      <section
        id="tech"
        className="container mx-auto scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        {/* Section header */}
        <div className="mb-16 text-center sm:mb-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {t('landing.tech.title')}{' '}
            <GradientText>{t('landing.tech.titleHighlight')}</GradientText>
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base sm:mt-4 sm:text-lg">
            {t('landing.tech.subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Side-by-side on lg+, stacked on mobile */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Encryption Journey */}
            <div>
              <FadeContent delay={100}>
                <h3 className="mb-8 text-center text-xl font-bold sm:mb-10 sm:text-2xl">
                  <GradientText>{t('landing.tech.encryption.title')}</GradientText>
                </h3>
              </FadeContent>

              <div className="mb-12 lg:mb-0">
                {encryptionSteps.map((step, index) => (
                  <StepCard
                    key={step.translationKey}
                    step={step}
                    index={index}
                    section="encryption"
                  />
                ))}
              </div>
            </div>

            {/* Retrieval Journey */}
            <div>
              <FadeContent delay={300}>
                <h3 className="mb-8 text-center text-xl font-bold sm:mb-10 sm:text-2xl">
                  <GradientText>{t('landing.tech.retrieval.title')}</GradientText>
                </h3>
              </FadeContent>

              <div className="mb-12 lg:mb-0">
                {retrievalSteps.map((step, index) => (
                  <StepCard
                    key={step.translationKey}
                    step={step}
                    index={index}
                    section="retrieval"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Zero Knowledge Callout - full width between columns */}
          <FadeContent delay={200}>
            <ElectricBorder className="my-16">
              <SpotlightCard className="bg-card" spotlightColor="rgba(var(--primary-rgb), 0.2)">
                <div className="flex flex-col items-center gap-4 p-6 text-center sm:p-10">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-16">
                    <ShieldAlert className="size-7 sm:size-8" />
                  </div>
                  <h3 className="text-xl font-bold sm:text-2xl">
                    <GradientText>{t('landing.tech.zeroKnowledge.title')}</GradientText>
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t('landing.tech.zeroKnowledge.description')}
                  </p>
                </div>
              </SpotlightCard>
            </ElectricBorder>
          </FadeContent>

          {/* Final tagline */}
          <FadeContent delay={400}>
            <p className="text-center text-lg font-semibold italic text-muted-foreground sm:text-xl">
              {t('landing.tech.tagline')}
            </p>
          </FadeContent>
        </div>
      </section>
    </FadeContent>
  );
}
