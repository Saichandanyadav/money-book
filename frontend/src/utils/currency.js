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
  } catch {
    isDataFetched = true;
    currencyMap = { India: "₹", "United States": "$", China: "¥", Mexico: "MX$" };
    countryList = ["India", "United States", "China", "Mexico"];
    return { currencyMap, countryList };
  }
};

export const getCurrencySymbol = (country) => {
  if (!country) return "$";
  const key = Object.keys(currencyMap).find(c => c.toLowerCase() === country.toLowerCase());
  if (key) return currencyMap[key];
  const fallback = { India: "₹", "United States": "$", China: "¥", UK: "£", Germany: "€", Mexico: "MX$" };
  return fallback[country] || "$";
};

export const getCountryList = () => countryList;
