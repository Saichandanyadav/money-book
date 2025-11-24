const getCurrencyMap = () => ({
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
});

exports.getCountryAndCurrencyData = async (req, res) => {
  try {
    const currencyMap = getCurrencyMap();
    const countryList = Object.keys(currencyMap);
    res.json({ currencyMap, countryList });
  } catch (error) {
    res.status(500).json({ toast: { title: "Server error", description: error.message } });
  }
};