import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SortBy = 'recent' | 'alphabetical' | 'category';
export type SortDirection = 'asc' | 'desc';

interface SortControlsProps {
  sortBy: SortBy;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortBy) => void;
  onDirectionChange: () => void;
}

export function SortControls({
  sortBy,
  sortDirection,
  onSortChange,
  onDirectionChange,
}: SortControlsProps) {
  const { t } = useTranslation();

  const sortLabels: Record<SortBy, string> = {
    recent: t('dashboard.sort.recent'),
    alphabetical: t('dashboard.sort.alphabetical'),
    category: t('dashboard.sort.category'),
  };

  const DirectionIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="size-4" />
            <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              onSortChange('recent');
            }}
          >
            {t('dashboard.sort.recent')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onSortChange('alphabetical');
            }}
          >
            {t('dashboard.sort.alphabetical')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onSortChange('category');
            }}
          >
            {t('dashboard.sort.category')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="icon" onClick={onDirectionChange}>
        <DirectionIcon className="size-4" />
      </Button>
    </div>
  );
}
