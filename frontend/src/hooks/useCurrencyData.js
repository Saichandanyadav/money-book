import { useState, useEffect } from 'react';
import { fetchCurrencyData, getCountryList } from '../utils/currency';

export default function useCurrencyData() {
  const [countries, setCountries] = useState(getCountryList());
  const [isLoading, setIsLoading] = useState(countries.length === 0);

  useEffect(() => {
    const loadData = async () => {
      if (getCountryList().length === 0) {
        setIsLoading(true);
        await fetchCurrencyData();
        setCountries(getCountryList());
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { countries, isLoading };
}