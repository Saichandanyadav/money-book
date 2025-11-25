import api from "../api/api";

let currencyMap = {};
let countryList = [];
let isDataFetched = false;

export const fetchCurrencyData = async () => {
  if (isDataFetched) return { currencyMap, countryList };
  try {
    const { data } = await api.get("/utils/data");
    currencyMap = data.currencyMap;
    countryList = data.countryList;
    isDataFetched = true;
    return { currencyMap, countryList };
  } catch (error) {
    isDataFetched = true;
    // Fallback data in case of API failure
    currencyMap = { India: "₹", "United States": "$", Mexico: "MX$" };
    countryList = ["India", "United States", "Mexico"];
    return { currencyMap, countryList };
  }
};

export const getCurrencySymbol = (country) => {
  if (!country) return "$";

  // Normalize the country key (e.g., "mexico" -> "Mexico" or "United States" -> "UnitedStates")
  const key = Object.keys(currencyMap).find(
    c => c.toLowerCase() === country.toLowerCase()
  );

  // If data is fetched and a specific country key is found, use its symbol
  if (isDataFetched && key) {
    return currencyMap[key];
  }

  // If data is not yet fetched or country wasn't found in the map, use a simple local fallback logic
  const simpleMap = { India: "₹", "United States": "$", UK: "£", Germany: "€", Mexico: "MX$" };
  const normalizedCountry = country.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  
  // Use the symbol from the simple map if available, otherwise default to $
  return simpleMap[normalizedCountry] || simpleMap[country] || "$";
};

export const getCountryList = () => countryList;

export const isCurrencyDataFetched = () => isDataFetched;