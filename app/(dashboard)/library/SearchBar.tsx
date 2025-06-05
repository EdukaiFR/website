import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export type SearchBarProps = {
  setSearch: (search: string) => void;
};

export const SearchBar = ({ setSearch }: SearchBarProps) => {
  return (
    <div className='relative flex items-center w-full group'>
      <Search className='absolute left-4 w-4 h-4 text-blue-600 z-10 group-focus-within:text-indigo-600 transition-colors duration-200' />
      <Input
        type='text'
        placeholder='Rechercher un document...'
        className='w-full h-11 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-xl 
                   text-gray-700 placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 
                   hover:border-indigo-300 hover:bg-white/90
                   transition-all duration-200 shadow-sm hover:shadow-md'
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
