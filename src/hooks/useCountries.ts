import { useState, useEffect, useCallback } from 'react';
import { Country } from '../types/Country';
import { fetchAllCountries, searchCountries } from '../utils/api';

const COUNTRIES_PER_PAGE = 20;

export const useCountries = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const sortCountriesAlphabetically = (countries: Country[]) => {
    return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
  };

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(false); // Reset search state
      
      const data = await fetchAllCountries();
      
      if (!data || data.length === 0) {
        setError('No countries found. Please try again.');
        setDisplayedCountries([]);
        return;
      }
      
      // Ensure all required fields are present
      const validatedData = data.map(country => {
        // Ensure required properties exist
        return {
          ...country,
          timezones: country.timezones || [],
          continents: country.continents || [],
          currencies: country.currencies || {}
        };
      });
      
      const sortedCountries = sortCountriesAlphabetically(validatedData);
      setAllCountries(sortedCountries);
      
      // Load first page
      const firstPage = sortedCountries.slice(0, COUNTRIES_PER_PAGE);
      setDisplayedCountries(firstPage);
      setCurrentPage(1);
      setHasMore(sortedCountries.length > COUNTRIES_PER_PAGE);
    } catch (err) {
      setError('Failed to load countries. Please try again.');
      setDisplayedCountries([]);
      console.error('Error loading countries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreCountries = useCallback(() => {
    if (loadingMore || !hasMore || isSearching) return;

    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * COUNTRIES_PER_PAGE;
      const endIndex = startIndex + COUNTRIES_PER_PAGE;
      
      const newCountries = allCountries.slice(startIndex, endIndex);
      
      if (newCountries.length > 0) {
        setDisplayedCountries(prev => [...prev, ...newCountries]);
        setCurrentPage(nextPage);
        setHasMore(endIndex < allCountries.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 300); // Small delay to show loading state
  }, [currentPage, allCountries, loadingMore, hasMore, isSearching]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // Reset to show all countries with lazy loading
      setIsSearching(false);
      setError(null);
      setLoading(false); // Ensure loading is set to false
      
      // Make sure we have countries to display
      if (allCountries.length > 0) {
        const firstPage = allCountries.slice(0, COUNTRIES_PER_PAGE);
        setDisplayedCountries(firstPage);
        setCurrentPage(1);
        setHasMore(allCountries.length > COUNTRIES_PER_PAGE);
      } else {
        // If allCountries is empty, load them
        loadCountries();
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsSearching(true);
      const results = await searchCountries(query);
      const sortedResults = sortCountriesAlphabetically(results);
      setDisplayedCountries(sortedResults);
      setHasMore(false); // No lazy loading for search results
    } catch (err) {
      // Don't show error for search, just show empty results
      setDisplayedCountries([]);
      setHasMore(false);
      console.error('Error searching countries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  return {
    countries: displayedCountries,
    loading,
    loadingMore,
    error,
    searchQuery,
    hasMore,
    handleSearch,
    loadMoreCountries,
    retry: loadCountries
  };
};
