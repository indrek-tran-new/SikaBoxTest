const BASE_URL = '/api';

export const fetchAllCountries = async (): Promise<Country[]> => {
  try {
    // Specify required fields to avoid 400 Bad Request
    const fields = [
      'name',
      'capital',
      'population',
      'flags',
      'cca2',
      'cca3',
      'region',
      'subregion',
      'area',
      'languages'
    ].join(',');

    const response = await fetch(`${BASE_URL}/all?fields=${fields}`);

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch countries');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const searchCountries = async (query: string): Promise<Country[]> => {
  try {
    const response = await fetch(`${BASE_URL}/name/${encodeURIComponent(query)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to search countries');
    }
    return response.json();
  } catch (error) {
    console.error('Error searching countries:', error);
    if (error instanceof Error && error.message.includes('404')) {
      return [];
    }
    throw error;
  }
};

export const formatPopulation = (population: number): string => {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  }
  if (population >= 1000) {
    return `${(population / 1000).toFixed(1)}K`;
  }
  return population.toString();
};

export const formatArea = (area: number): string => {
  return area.toLocaleString() + ' km²';
};
