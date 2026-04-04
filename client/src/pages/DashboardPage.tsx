import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { PageMetadata } from '@/components/shared/PageMetadata';
import { FadeContent } from '@/components/animations/FadeContent';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePasswords, useDeletePassword } from '@/api/queries';
import { selectHasMasterPassword } from '@/store/masterPasswordSlice';
import { pathTo, ROUTES } from '@/router/routes';
import { SearchBar } from '@/components/passwords/SearchBar';
import { CategoryFilter } from '@/components/passwords/CategoryFilter';
import { SortControls } from '@/components/passwords/SortControls';
import { PasswordCard } from '@/components/passwords/PasswordCard';
import { EmptyVault } from '@/components/passwords/EmptyVault';
import { MasterPasswordPrompt } from '@/components/passwords/MasterPasswordPrompt';
import { MasterPasswordBar } from '@/components/passwords/MasterPasswordBar';
import { DecryptPasswordDialog } from '@/components/passwords/DecryptPasswordDialog';
import type { SortBy, SortDirection } from '@/components/passwords/SortControls';
import type { PasswordItem } from '@/types';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();
  const language = lng ?? 'en';

  const hasMasterPassword = useSelector(selectHasMasterPassword);
  const { data, isLoading, error } = usePasswords();
  const deletePasswordMutation = useDeletePassword();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Decrypt dialog state
  const [decryptPasswordId, setDecryptPasswordId] = useState<string | null>(null);
  const [decryptPasswordTitle, setDecryptPasswordTitle] = useState('');
  const [decryptPasswordUsername, setDecryptPasswordUsername] = useState<string | null>(null);

  const passwords: PasswordItem[] = useMemo(() => {
    if (data === undefined) {
      return [];
    }
    return data.passwords.map((pw) => ({
      ...pw,
      tags: pw.tags,
      createdAt: String(pw.createdAt),
      updatedAt: String(pw.updatedAt),
    }));
  }, [data]);

  const handleDelete = (id: string) => {
    deletePasswordMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('dashboard.card.deleted'));
      },
    });
  };

  const handleShowPassword = (pw: PasswordItem) => {
    if (!hasMasterPassword) {
      toast.error(t('dashboard.toast.noMasterPassword'));
      return;
    }
    setDecryptPasswordId(pw.id);
    setDecryptPasswordTitle(pw.title);
    setDecryptPasswordUsername(pw.username);
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

  // Extract unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const pw of passwords) {
      for (const tag of pw.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
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
        const tagMatch = pw.tags.some((tag) => tag.toLowerCase().includes(query));
        return titleMatch || usernameMatch || websiteMatch || tagMatch;
      });
    }

    // Category filter
    if (categoryFilter !== '') {
      result = result.filter((pw) => pw.category === categoryFilter);
    }

    // Tag filter
    if (tagFilter !== '') {
      result = result.filter((pw) => pw.tags.includes(tagFilter));
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
  }, [passwords, search, categoryFilter, tagFilter, sortBy, sortDirection]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 2xl:px-12">
      <PageMetadata title="Dashboard | Password Protector" noIndex />

      {/* Master password prompt overlay — shown over the page with navbar/footer visible */}
      {!hasMasterPassword && !isLoading && <MasterPasswordPrompt />}

      <FadeContent>
        <div className="flex flex-col gap-6">
          {/* Master password timer bar */}
          <MasterPasswordBar />

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
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <span className="ms-3 text-muted-foreground">{t('dashboard.loading')}</span>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <>
              {passwords.length === 0 ? (
                <EmptyVault />
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <SearchBar value={search} onChange={setSearch} />
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryFilter
                        categories={categories}
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                      />
                      {allTags.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                              <Tag className="size-4" />
                              <span className="truncate max-w-[120px]">
                                {tagFilter === '' ? t('dashboard.tags.all') : tagFilter}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setTagFilter('');
                              }}
                            >
                              {t('dashboard.tags.all')}
                            </DropdownMenuItem>
                            {allTags.map((tag) => (
                              <DropdownMenuItem
                                key={tag}
                                onClick={() => {
                                  setTagFilter(tag);
                                }}
                              >
                                {tag}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[2200px]:grid-cols-5">
                      {filteredPasswords.map((pw) => (
                        <PasswordCard
                          key={pw.id}
                          password={pw}
                          onShowPassword={() => {
                            handleShowPassword(pw);
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

      {/* Decrypt password dialog */}
      <DecryptPasswordDialog
        passwordId={decryptPasswordId}
        passwordTitle={decryptPasswordTitle}
        passwordUsername={decryptPasswordUsername}
        onClose={() => {
          setDecryptPasswordId(null);
        }}
      />
    </div>
  );
}
