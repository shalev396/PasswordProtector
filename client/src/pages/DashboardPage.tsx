import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageMetadata } from '@/components/shared/PageMetadata';
import { FadeContent } from '@/components/animations/FadeContent';
import { Button } from '@/components/ui/button';
import { usePasswords, useDeletePassword } from '@/api/queries';
import { selectUser, selectMasterPassword, setMasterPassword } from '@/store/userSlice';
import { deriveKey, decryptData } from '@/lib/crypto';
import { pathTo, ROUTES } from '@/router/routes';
import { SearchBar } from '@/components/passwords/SearchBar';
import { CategoryFilter } from '@/components/passwords/CategoryFilter';
import { SortControls } from '@/components/passwords/SortControls';
import { PasswordCard } from '@/components/passwords/PasswordCard';
import { EmptyVault } from '@/components/passwords/EmptyVault';
import { MasterPasswordPrompt } from '@/components/passwords/MasterPasswordPrompt';
import type { SortBy, SortDirection } from '@/components/passwords/SortControls';
import type { PasswordItem } from '@/types';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();
  const language = lng ?? 'en';
  const user = useSelector(selectUser);

  const { data, isLoading, error } = usePasswords();
  const deletePasswordMutation = useDeletePassword();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
  const [hasMasterPassword, setHasMasterPassword] = useState(() => selectMasterPassword() !== null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const passwords: PasswordItem[] = useMemo(() => {
    if (data === undefined) {
      return [];
    }
    return data.passwords.map((pw) => ({
      ...pw,
      createdAt: String(pw.createdAt),
      updatedAt: String(pw.updatedAt),
    }));
  }, [data]);

  // Derive encryption key and decrypt all passwords when master password is available
  const decryptAllPasswords = useCallback(async () => {
    const masterPw = selectMasterPassword();
    if (masterPw === null || passwords.length === 0 || !user?.email) {
      return;
    }

    setIsDecrypting(true);
    try {
      const key = await deriveKey(masterPw, user.email);
      const decrypted: Record<string, string> = {};

      for (const pw of passwords) {
        try {
          decrypted[pw.id] = await decryptData(pw.password, key);
        } catch {
          decrypted[pw.id] = t('dashboard.toast.decryptionError');
        }
      }

      setDecryptedPasswords(decrypted);
    } catch {
      toast.error(t('dashboard.toast.decryptionError'));
    } finally {
      setIsDecrypting(false);
    }
  }, [passwords, user?.email, t]);

  useEffect(() => {
    if (hasMasterPassword && passwords.length > 0) {
      void decryptAllPasswords();
    }
  }, [hasMasterPassword, passwords, decryptAllPasswords]);

  const handleMasterPasswordSubmit = (key: string) => {
    setMasterPassword(key);
    setHasMasterPassword(true);
  };

  const handleDecryptSingle = useCallback(
    async (passwordItem: PasswordItem) => {
      const masterPw = selectMasterPassword();
      if (masterPw === null || !user?.email) {
        return;
      }

      try {
        const key = await deriveKey(masterPw, user.email);
        const decrypted = await decryptData(passwordItem.password, key);
        setDecryptedPasswords((prev) => ({ ...prev, [passwordItem.id]: decrypted }));
      } catch {
        toast.error(t('dashboard.toast.decryptionError'));
      }
    },
    [user?.email, t],
  );

  const handleDelete = (id: string) => {
    deletePasswordMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('dashboard.card.deleted'));
        setDecryptedPasswords((prev) =>
          Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id)),
        );
      },
    });
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const pw of passwords) {
      if (pw.category !== null) {
        cats.add(pw.category);
      }
    }
    return Array.from(cats).sort();
  }, [passwords]);

  // Filter and sort
  const filteredPasswords = useMemo(() => {
    let result = passwords;

    // Search filter
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      result = result.filter((pw) => {
        const titleMatch = pw.title.toLowerCase().includes(query);
        const usernameMatch = pw.username?.toLowerCase().includes(query) === true;
        const websiteMatch = pw.website?.toLowerCase().includes(query) === true;
        return titleMatch || usernameMatch || websiteMatch;
      });
    }

    // Category filter
    if (categoryFilter !== '') {
      result = result.filter((pw) => pw.category === categoryFilter);
    }

    // Sort
    const sorted = [...result];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'recent':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = (a.category ?? '').localeCompare(b.category ?? '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [passwords, search, categoryFilter, sortBy, sortDirection]);

  // Show master password prompt if not set
  if (!hasMasterPassword && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <PageMetadata title="Dashboard | Elytra" noIndex />
        <MasterPasswordPrompt onSubmit={handleMasterPasswordSubmit} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <PageMetadata title="Dashboard | Elytra" noIndex />

      <FadeContent>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t('dashboard.title')}
            </h1>
          </div>

          {/* Error state */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {t('dashboard.error')}
            </div>
          )}

          {/* Loading state */}
          {(isLoading || isDecrypting) && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <span className="ms-3 text-muted-foreground">
                {isDecrypting ? t('dashboard.decrypting') : t('dashboard.loading')}
              </span>
            </div>
          )}

          {/* Content */}
          {!isLoading && !isDecrypting && !error && (
            <>
              {passwords.length === 0 ? (
                <EmptyVault />
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <SearchBar value={search} onChange={setSearch} />
                    <div className="flex items-center gap-2">
                      <CategoryFilter
                        categories={categories}
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                      />
                      <SortControls
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSortChange={setSortBy}
                        onDirectionChange={() => {
                          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                        }}
                      />
                      <Button
                        variant="gradient"
                        className="gap-2"
                        onClick={() => {
                          void navigate(pathTo(ROUTES.ADD_PASSWORD, language));
                        }}
                      >
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">{t('dashboard.addPassword')}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Password grid */}
                  {filteredPasswords.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">{t('dashboard.noResults')}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredPasswords.map((pw) => (
                        <PasswordCard
                          key={pw.id}
                          password={pw}
                          decryptedPassword={decryptedPasswords[pw.id] ?? null}
                          onDecrypt={() => {
                            void handleDecryptSingle(pw);
                          }}
                          onDelete={() => {
                            handleDelete(pw.id);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </FadeContent>
    </div>
  );
}
