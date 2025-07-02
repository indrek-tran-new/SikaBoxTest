import React, { useState, useEffect, useRef } from 'react';
import { Country } from '../types/Country';
import { CountryCard } from './CountryCard';
import { CountryDetail } from './CountryDetail';
import { Loader2 } from 'lucide-react';

interface CountryListProps {
  countries: Country[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export const CountryList: React.FC<CountryListProps> = ({ 
  countries,
  hasMore,
  loadingMore,
  onLoadMore
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleCloseDetail = () => {
    setSelectedCountry(null);
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore, onLoadMore]);

  if (countries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300 text-lg">No countries found matching your search.</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Try searching for a different country name.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {countries.map((country) => (
          <CountryCard
            key={country.cca3}
            country={country}
            onClick={() => handleCountryClick(country)}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {hasMore && (
        <div 
          ref={observerRef}
          className="flex justify-center items-center py-8"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more countries...</span>
            </div>
          )}
        </div>
      )}

      {/* Load more button as fallback */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Load More Countries
          </button>
        </div>
      )}

      {selectedCountry && (
        <CountryDetail
          country={selectedCountry}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};
