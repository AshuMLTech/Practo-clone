import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterSectionProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

export default function FilterSection({ sortBy, setSortBy }: FilterSectionProps) {
  const filters = [
    { label: 'Gender', value: 'gender' },
    { label: 'Patient Stories', value: 'stories' },
    { label: 'Experience', value: 'experience' },
    { label: 'All Filters', value: 'all' }
  ];

  return (
    <div className="bg-blue-800 text-white p-4 rounded-lg mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="ghost"
              className="text-white hover:bg-white/10 flex items-center gap-2"
            >
              {filter.label}
              <ChevronDown className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort By</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="fee">Consultation Fee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
