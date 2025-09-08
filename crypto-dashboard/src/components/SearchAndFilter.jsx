import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { debounce } from '../utils/helpers';

const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  loading 
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    onSearchChange(query);
  }, 300);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    debouncedSearch(query);
  };

  // Update local search when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const sortOptions = [
    { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
    { value: 'market_cap_asc', label: 'Market Cap (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'volume_desc', label: 'Volume (High to Low)' },
    { value: 'change_desc', label: '24h Change (High to Low)' },
    { value: 'change_asc', label: '24h Change (Low to High)' }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4"
              disabled={loading}
            />
          </div>

          {/* Sort/Filter Controls */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort by:
              </span>
            </div>
            
            <Select value={sortBy} onValueChange={onSortChange} disabled={loading}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      {option.value.includes('desc') ? (
                        <SortDesc className="w-3 h-3" />
                      ) : (
                        <SortAsc className="w-3 h-3" />
                      )}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  Search results for: <span className="font-medium">"{searchQuery}"</span>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLocalSearchQuery('');
                        onSearchChange('');
                      }}
                      className="ml-2 h-auto p-1 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;

