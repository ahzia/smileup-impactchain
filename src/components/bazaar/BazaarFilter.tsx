'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Tag, Building, DollarSign } from 'lucide-react';

interface FilterState {
  category: string;
  provider: string;
  priceRange: string;
}

interface BazaarFilterProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const BazaarFilter: React.FC<BazaarFilterProps> = ({ filter, onFilterChange }) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'experience', label: 'Experiences' },
    { value: 'certificate', label: 'Certificates' },
    { value: 'digital', label: 'Digital' },
    { value: 'merchandise', label: 'Merchandise' },
    { value: 'voucher', label: 'Vouchers' }
  ];

  const providerOptions = [
    { value: 'all', label: 'All Providers' },
    { value: 'SmileUp', label: 'SmileUp' },
    { value: 'Green Earth Initiative', label: 'Green Earth' },
    { value: 'Tech for Good', label: 'Tech for Good' },
    { value: 'Community Health', label: 'Community Health' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Under 100 Smiles' },
    { value: 'medium', label: '100-300 Smiles' },
    { value: 'high', label: 'Over 300 Smiles' }
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filter,
      category
    });
  };

  const handleProviderChange = (provider: string) => {
    onFilterChange({
      ...filter,
      provider
    });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    onFilterChange({
      ...filter,
      priceRange
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      provider: 'all',
      priceRange: 'all'
    });
  };

  const hasActiveFilters = filter.category !== 'all' || filter.provider !== 'all' || filter.priceRange !== 'all';

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Bazaar Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filter.category !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Category: {categoryOptions.find(c => c.value === filter.category)?.label}
            </Badge>
          )}
          {filter.provider !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Provider: {providerOptions.find(p => p.value === filter.provider)?.label}
            </Badge>
          )}
          {filter.priceRange !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Price: {priceRangeOptions.find(p => p.value === filter.priceRange)?.label}
            </Badge>
          )}
        </div>
      )}

      {/* Filter Options */}
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center space-x-1">
            <Tag className="h-4 w-4" />
            <span>Category</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter.category === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Provider Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center space-x-1">
            <Building className="h-4 w-4" />
            <span>Provider</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {providerOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter.provider === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleProviderChange(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>Price Range</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {priceRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter.priceRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handlePriceRangeChange(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 