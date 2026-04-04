import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { KeyRound, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  selectMasterPasswordExpiresAt,
  selectHasMasterPassword,
  clearMasterPassword,
} from '@/store/masterPasswordSlice';
import { MasterPasswordPrompt } from './MasterPasswordPrompt';

function formatTime(ms: number): string {
  if (ms <= 0) {
    return '0:00';
  }
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
}

export function MasterPasswordBar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const expiresAt = useSelector(selectMasterPasswordExpiresAt);
  const hasMasterPassword = useSelector(selectHasMasterPassword);
  const [remaining, setRemaining] = useState(() =>
    expiresAt !== null ? Math.max(0, expiresAt - Date.now()) : 0,
  );
  const [showReenter, setShowReenter] = useState(false);

  useEffect(() => {
    if (expiresAt === null) {
      return;
    }

    const tick = (): void => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        dispatch(clearMasterPassword());
        setRemaining(0);
      } else {
        setRemaining(diff);
      }
    };

    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [expiresAt, dispatch]);

  const handleReenterClose = useCallback(() => {
    setShowReenter(false);
  }, []);

  if (!hasMasterPassword && !showReenter) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/30">
        <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
          <KeyRound className="size-4" />
          <span>{t('dashboard.masterKey.expired')}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setShowReenter(true);
          }}
        >
          <RefreshCw className="size-3.5" />
          {t('dashboard.masterKey.reenter')}
        </Button>
      </div>
    );
  }

  if (showReenter) {
    return <MasterPasswordPrompt onSubmit={handleReenterClose} />;
  }

  const urgency = remaining < 60_000;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2 ${
        urgency
          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
          : 'border-border bg-muted/30'
      }`}
    >
      <div
        className={`flex items-center gap-2 text-sm ${
          urgency ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'
        }`}
      >
        <KeyRound className="size-4" />
        <span>
          {t('dashboard.masterKey.validFor')} <strong>{formatTime(remaining)}</strong>
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => {
          setShowReenter(true);
        }}
      >
        <RefreshCw className="size-3.5" />
        {t('dashboard.masterKey.reenter')}
      </Button>
    </div>
  );
}
