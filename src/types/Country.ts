export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  population: number;
  languages?: { [key: string]: string };
  timezones: string[];
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  cca2: string;
  cca3: string;
  region: string;
  subregion?: string;
  area: number;
  borders?: string[];
  continents: string[];
}