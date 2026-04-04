import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setMasterPassword } from '@/store/masterPasswordSlice';

interface MasterPasswordPromptProps {
  onSubmit?: (key: string) => void;
}

export function MasterPasswordPrompt({ onSubmit }: MasterPasswordPromptProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim() !== '') {
      dispatch(setMasterPassword(value));
      onSubmit?.(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <KeyRound className="size-10 text-primary" />
          </div>
          <CardTitle className="text-xl">{t('dashboard.masterKey.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t('dashboard.masterKey.description')}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-password">{t('dashboard.masterKey.title')}</Label>
              <Input
                id="master-password"
                type="password"
                placeholder={t('dashboard.masterKey.placeholder')}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                autoFocus
                required
              />
            </div>
            <Button type="submit" variant="gradient" className="w-full">
              {t('dashboard.masterKey.submit')}
            </Button>
          </form>
          <div className="mt-4 flex items-start gap-2 rounded-md bg-muted px-3 py-2.5">
            <AlertCircle className="size-4 shrink-0 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('dashboard.masterKey.wrongKeyWarning')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
