import React from 'react';
import { Globe } from 'lucide-react';
import { useCountries } from './hooks/useCountries';
import { SearchBar } from './components/SearchBar';
import { CountryList } from './components/CountryList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const { 
    countries, 
    loading, 
    loadingMore, 
    error, 
    searchQuery, 
    hasMore, 
    handleSearch, 
    loadMoreCountries, 
    retry 
  } = useCountries();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-center flex-1">
              <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Countries Explorer</h1>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex justify-center">
            <SearchBar 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for any country..."
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={retry}
          />
        )}
        
        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 text-center transition-colors duration-300">
                {searchQuery ? (
                  <>Showing {countries.length} {countries.length === 1 ? 'country' : 'countries'} for "{searchQuery}"</>
                ) : (
                  <>Showing {countries.length} countries{hasMore ? ' (loading more as you scroll)' : ''}</>
                )}
              </p>
            </div>
            <CountryList 
              countries={countries}
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={loadMoreCountries}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-2">Data provided by <a href="https://restcountries.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors" target="_blank" rel="noopener noreferrer">REST Countries API</a></p>
            <p className="text-sm">Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
