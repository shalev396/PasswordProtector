import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="relative flex-1">
      <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={t('dashboard.search.placeholder')}
        className="ps-9"
      />
    </div>
  );
}
