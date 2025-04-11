import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export type SearchBarProps = {
  setSearch: (search: string) => void;
};

export const SearchBar = ({ setSearch }: SearchBarProps) => {
  return (
    <div className='relative flex items-center w-full max-w-[40%]'>
      <Search className='absolute left-[3%] w-4 h-4 text-[#2D6BCF] mr-2' />
      <Input
        type='text'
        placeholder='Rechercher un document...'
        className='w-full bg-transparent py-5 pl-10 border border-[#E3E3E7] focus:outline-none focus:ring-0 focus:border-transparent shadow-none'
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setSearch(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
};
