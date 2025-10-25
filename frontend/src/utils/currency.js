export const currencyMap = {
  Australia: "A$",
  Brazil: "R$",
  Canada: "CA$",
  China: "¥",
  Denmark: "kr",
  Egypt: "E£",
  France: "€",
  Germany: "€",
  India: "₹",
  Indonesia: "Rp",
  Italy: "€",
  Japan: "¥",
  Malaysia: "RM",
  Mexico: "MX$",
  Netherlands: "€",
  Nigeria: "₦",
  Norway: "kr",
  Philippines: "₱",
  Poland: "zł",
  Russia: "₽",
  SaudiArabia: "SAR",
  Singapore: "S$",
  SouthAfrica: "R",
  SouthKorea: "₩",
  Spain: "€",
  Sweden: "kr",
  Switzerland: "CHF",
  Thailand: "฿",
  Turkey: "₺",
  UAE: "AED",
  UK: "£",
  "United Kingdom": "£",
  "United States": "$",
  USA: "$",
  Vietnam: "₫"
};

export const getCurrencySymbol = (country) => {
  if (!country) return "₹";
  const key = Object.keys(currencyMap).find(
    c => c.toLowerCase() === country.toLowerCase()
  );
  return key ? currencyMap[key] : "₹";
};

export const countryList = Object.keys(currencyMap);
