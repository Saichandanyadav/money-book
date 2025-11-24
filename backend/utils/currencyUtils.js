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

exports.getCurrencySymbol = (country) => {
    const map = getCurrencyMap();
    const normalizedCountry = country.replace(/\s/g, "");
    return map[normalizedCountry] || "$";
};

exports.getCurrencyMap = getCurrencyMap;