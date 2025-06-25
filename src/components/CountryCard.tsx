import React from 'react';
import { Country } from '../types/Country';
import { formatPopulation } from '../utils/api';
import { MapPin, Users } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  onClick: () => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden group"
    >
      <div className="aspect-w-16 aspect-h-10 bg-gray-100 dark:bg-gray-700">
        <img
          src={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
          {country.name.common}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="line-clamp-1">
              {country.capital?.[0] || 'No capital'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
            <span>{formatPopulation(country.population)}</span>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {country.region} {country.subregion && `• ${country.subregion}`}
          </div>
        </div>
      </div>
    </div>
  );
};