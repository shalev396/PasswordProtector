import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  const { t } = useTranslation();

  const displayLabel = value === '' ? t('dashboard.category.all') : value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4" />
          <span className="truncate max-w-[120px]">{displayLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            onChange('');
          }}
        >
          {t('dashboard.category.all')}
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => {
              onChange(category);
            }}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
