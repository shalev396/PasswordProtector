import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ShinyText } from '@/components/animations/text/ShinyText';
import { FadeContent } from '@/components/animations/FadeContent';
import { BeamsBackground } from '@/components/animations/backgrounds/BeamsBackground';
import { pathTo, ROUTES } from '@/router/routes';
import { useLanguage } from '@/hooks/useLanguage';
import { Lock, Shield, Sparkles, Layers, CircleDot } from 'lucide-react';

const sectionNavItems = [
  { id: 'benefits', icon: Sparkles, key: 'benefits' },
  { id: 'features', icon: Shield, key: 'features' },
  { id: 'tech', icon: Layers, key: 'tech' },
] as const;

const vaultEntries = [
  { key: 'email', color: 'text-blue-400' },
  { key: 'social', color: 'text-purple-400' },
  { key: 'api', color: 'text-orange-400' },
  { key: 'secrets', color: 'text-green-400' },
] as const;

export function LandingHero() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BeamsBackground className="relative">
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <FadeContent className="space-y-6 text-center sm:space-y-8 lg:text-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:px-4 sm:py-2 sm:text-sm">
              <Lock className="size-3.5 sm:size-4" />
              {t('landing.hero.badge')}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t('landing.hero.title')}{' '}
              <ShinyText className="block">{t('landing.hero.titleHighlight')}</ShinyText>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg lg:mx-0">
              {t('landing.hero.description')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to={pathTo(ROUTES.AUTH.SIGNUP, language)}>{t('landing.hero.cta')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  scrollToSection('tech');
                }}
              >
                <Shield className="me-2 size-4" />
                {t('landing.hero.seeHow')}
              </Button>
            </div>

            {/* Section Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 sm:gap-3 sm:pt-6 lg:justify-start">
              {sectionNavItems.map(({ id, icon: Icon, key }) => (
                <button
                  key={id}
                  onClick={() => {
                    scrollToSection(id);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground sm:px-4 sm:py-2"
                >
                  <Icon className="size-3.5 sm:size-4" />
                  {t(`landing.nav.${key}`)}
                </button>
              ))}
            </div>
          </FadeContent>

          {/* Right: Vault mockup card */}
          <FadeContent delay={300} className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              {/* Vault header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="size-5 text-primary" />
                  <span className="text-lg font-semibold">{t('landing.hero.vault.title')}</span>
                </div>
                <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500">
                  {t('landing.hero.vault.badge')}
                </span>
              </div>

              {/* Vault entries */}
              <div className="space-y-3">
                {vaultEntries.map(({ key, color }) => (
                  <div
                    key={key}
                    className="group flex items-center justify-between rounded-lg border border-border/40 bg-background/50 px-4 py-3 transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <CircleDot className={`size-4 ${color}`} />
                      <span className="text-sm font-medium">{t(`landing.hero.vault.${key}`)}</span>
                    </div>
                    <span className="font-mono text-sm tracking-wider text-muted-foreground">
                      {'●●●●●●●●'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Vault footer */}
              <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary/5 py-2.5 text-xs text-muted-foreground">
                <Shield className="size-3.5 text-primary" />
                <span>{t('landing.hero.vault.badge')}</span>
              </div>
            </div>
          </FadeContent>
        </div>
      </section>
    </BeamsBackground>
  );
}
