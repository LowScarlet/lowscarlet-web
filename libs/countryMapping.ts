// Mapping common country names & ISO numeric codes to ISO 3166-1 alpha-2 and alpha-3 codes
export interface CountryMeta {
  code: string; // ISO 2-letter
  iso3: string; // ISO 3-letter
  name: string;
}

export const COUNTRY_MAP: Record<string, { code: string; iso3: string }> = {
  "Afghanistan": { code: "AF", iso3: "AFG" },
  "Albania": { code: "AL", iso3: "ALB" },
  "Algeria": { code: "DZ", iso3: "DZA" },
  "Andorra": { code: "AD", iso3: "AND" },
  "Angola": { code: "AO", iso3: "AGO" },
  "Argentina": { code: "AR", iso3: "ARG" },
  "Armenia": { code: "AM", iso3: "ARM" },
  "Australia": { code: "AU", iso3: "AUS" },
  "Austria": { code: "AT", iso3: "AUT" },
  "Azerbaijan": { code: "AZ", iso3: "AZE" },
  "Bahamas": { code: "BS", iso3: "BHS" },
  "Bahrain": { code: "BH", iso3: "BHR" },
  "Bangladesh": { code: "BD", iso3: "BGD" },
  "Belarus": { code: "BY", iso3: "BLR" },
  "Belgium": { code: "BE", iso3: "BEL" },
  "Belize": { code: "BZ", iso3: "BLZ" },
  "Benin": { code: "BJ", iso3: "BEN" },
  "Bhutan": { code: "BT", iso3: "BTN" },
  "Bolivia": { code: "BO", iso3: "BOL" },
  "Bosnia and Herzegovina": { code: "BA", iso3: "BIH" },
  "Bosnia and Herz.": { code: "BA", iso3: "BIH" },
  "Botswana": { code: "BW", iso3: "BWA" },
  "Brazil": { code: "BR", iso3: "BRA" },
  "Brunei": { code: "BN", iso3: "BRN" },
  "Brunei Darussalam": { code: "BN", iso3: "BRN" },
  "Bulgaria": { code: "BG", iso3: "BGR" },
  "Burkina Faso": { code: "BF", iso3: "BFA" },
  "Burundi": { code: "BI", iso3: "BDI" },
  "Cambodia": { code: "KH", iso3: "KHM" },
  "Cameroon": { code: "CM", iso3: "CMR" },
  "Canada": { code: "CA", iso3: "CAN" },
  "Central African Republic": { code: "CF", iso3: "CAF" },
  "Central African Rep.": { code: "CF", iso3: "CAF" },
  "Chad": { code: "TD", iso3: "TCD" },
  "Chile": { code: "CL", iso3: "CHL" },
  "China": { code: "CN", iso3: "CHN" },
  "Colombia": { code: "CO", iso3: "COL" },
  "Costa Rica": { code: "CR", iso3: "CRI" },
  "Croatia": { code: "HR", iso3: "HRV" },
  "Cuba": { code: "CU", iso3: "CUB" },
  "Cyprus": { code: "CY", iso3: "CYP" },
  "Czech Republic": { code: "CZ", iso3: "CZE" },
  "Czechia": { code: "CZ", iso3: "CZE" },
  "Dem. Rep. Congo": { code: "CD", iso3: "COD" },
  "Congo": { code: "CG", iso3: "COG" },
  "Denmark": { code: "DK", iso3: "DNK" },
  "Dominican Republic": { code: "DO", iso3: "DOM" },
  "Dominican Rep.": { code: "DO", iso3: "DOM" },
  "Ecuador": { code: "EC", iso3: "ECU" },
  "Egypt": { code: "EG", iso3: "EGY" },
  "El Salvador": { code: "SV", iso3: "SLV" },
  "Estonia": { code: "EE", iso3: "EST" },
  "Ethiopia": { code: "ET", iso3: "ETH" },
  "Fiji": { code: "FJ", iso3: "FJI" },
  "Finland": { code: "FI", iso3: "FIN" },
  "France": { code: "FR", iso3: "FRA" },
  "Georgia": { code: "GE", iso3: "GEO" },
  "Germany": { code: "DE", iso3: "DEU" },
  "Ghana": { code: "GH", iso3: "GHA" },
  "Greece": { code: "GR", iso3: "GRC" },
  "Guatemala": { code: "GT", iso3: "GTM" },
  "Honduras": { code: "HN", iso3: "HND" },
  "Hong Kong": { code: "HK", iso3: "HKG" },
  "Hungary": { code: "HU", iso3: "HUN" },
  "Iceland": { code: "IS", iso3: "ISL" },
  "India": { code: "IN", iso3: "IND" },
  "Indonesia": { code: "ID", iso3: "IDN" },
  "Iran": { code: "IR", iso3: "IRN" },
  "Iraq": { code: "IQ", iso3: "IRQ" },
  "Ireland": { code: "IE", iso3: "IRL" },
  "Israel": { code: "IL", iso3: "ISR" },
  "Italy": { code: "IT", iso3: "ITA" },
  "Ivory Coast": { code: "CI", iso3: "CIV" },
  "Côte d'Ivoire": { code: "CI", iso3: "CIV" },
  "Jamaica": { code: "JM", iso3: "JAM" },
  "Japan": { code: "JP", iso3: "JPN" },
  "Jordan": { code: "JO", iso3: "JOR" },
  "Kazakhstan": { code: "KZ", iso3: "KAZ" },
  "Kenya": { code: "KE", iso3: "KEN" },
  "Kuwait": { code: "KW", iso3: "KWT" },
  "Kyrgyzstan": { code: "KG", iso3: "KGZ" },
  "Laos": { code: "LA", iso3: "LAO" },
  "Latvia": { code: "LV", iso3: "LVA" },
  "Lebanon": { code: "LB", iso3: "LBN" },
  "Libya": { code: "LY", iso3: "LBY" },
  "Lithuania": { code: "LT", iso3: "LTU" },
  "Luxembourg": { code: "LU", iso3: "LUX" },
  "Madagascar": { code: "MG", iso3: "MDG" },
  "Malaysia": { code: "MY", iso3: "MYS" },
  "Maldives": { code: "MV", iso3: "MDV" },
  "Mali": { code: "ML", iso3: "MLI" },
  "Malta": { code: "MT", iso3: "MLT" },
  "Mexico": { code: "MX", iso3: "MEX" },
  "Moldova": { code: "MD", iso3: "MDA" },
  "Monaco": { code: "MC", iso3: "MCO" },
  "Mongolia": { code: "MN", iso3: "MNG" },
  "Montenegro": { code: "ME", iso3: "MNE" },
  "Morocco": { code: "MA", iso3: "MAR" },
  "Myanmar": { code: "MM", iso3: "MMR" },
  "Nepal": { code: "NP", iso3: "NPL" },
  "Netherlands": { code: "NL", iso3: "NLD" },
  "New Zealand": { code: "NZ", iso3: "NZL" },
  "Nicaragua": { code: "NI", iso3: "NIC" },
  "Nigeria": { code: "NG", iso3: "NGA" },
  "North Korea": { code: "KP", iso3: "PRK" },
  "North Macedonia": { code: "MK", iso3: "MKD" },
  "Macedonia": { code: "MK", iso3: "MKD" },
  "Norway": { code: "NO", iso3: "NOR" },
  "Oman": { code: "OM", iso3: "OMN" },
  "Pakistan": { code: "PK", iso3: "PAK" },
  "Palestine": { code: "PS", iso3: "PSE" },
  "Panama": { code: "PA", iso3: "PAN" },
  "Papua New Guinea": { code: "PG", iso3: "PNG" },
  "Paraguay": { code: "PY", iso3: "PRY" },
  "Peru": { code: "PE", iso3: "PER" },
  "Philippines": { code: "PH", iso3: "PHL" },
  "Poland": { code: "PL", iso3: "POL" },
  "Portugal": { code: "PT", iso3: "PRT" },
  "Qatar": { code: "QA", iso3: "QAT" },
  "Romania": { code: "RO", iso3: "ROU" },
  "Russia": { code: "RU", iso3: "RUS" },
  "Russian Federation": { code: "RU", iso3: "RUS" },
  "Rwanda": { code: "RW", iso3: "RWA" },
  "Saudi Arabia": { code: "SA", iso3: "SAU" },
  "Senegal": { code: "SN", iso3: "SEN" },
  "Serbia": { code: "RS", iso3: "SRB" },
  "Singapore": { code: "SG", iso3: "SGP" },
  "Slovakia": { code: "SK", iso3: "SVK" },
  "Slovenia": { code: "SI", iso3: "SVN" },
  "Somalia": { code: "SO", iso3: "SOM" },
  "South Africa": { code: "ZA", iso3: "ZAF" },
  "South Korea": { code: "KR", iso3: "KOR" },
  "Republic of Korea": { code: "KR", iso3: "KOR" },
  "S. Sudan": { code: "SS", iso3: "SSD" },
  "South Sudan": { code: "SS", iso3: "SSD" },
  "Spain": { code: "ES", iso3: "ESP" },
  "Sri Lanka": { code: "LK", iso3: "LKA" },
  "Sudan": { code: "SD", iso3: "SDN" },
  "Sweden": { code: "SE", iso3: "SWE" },
  "Switzerland": { code: "CH", iso3: "CHE" },
  "Taiwan": { code: "TW", iso3: "TWN" },
  "Tanzania": { code: "TZ", iso3: "TZA" },
  "Thailand": { code: "TH", iso3: "THA" },
  "Tunisia": { code: "TN", iso3: "TUN" },
  "Turkey": { code: "TR", iso3: "TUR" },
  "Türkiye": { code: "TR", iso3: "TUR" },
  "Uganda": { code: "UG", iso3: "UGA" },
  "Ukraine": { code: "UA", iso3: "UKR" },
  "United Arab Emirates": { code: "AE", iso3: "ARE" },
  "United Kingdom": { code: "GB", iso3: "GBR" },
  "UK": { code: "GB", iso3: "GBR" },
  "United States": { code: "US", iso3: "USA" },
  "United States of America": { code: "US", iso3: "USA" },
  "USA": { code: "US", iso3: "USA" },
  "Uruguay": { code: "UY", iso3: "URY" },
  "Uzbekistan": { code: "UZ", iso3: "UZB" },
  "Venezuela": { code: "VE", iso3: "VEN" },
  "Vietnam": { code: "VN", iso3: "VNM" },
  "Viet Nam": { code: "VN", iso3: "VNM" },
  "Yemen": { code: "YE", iso3: "YEM" },
  "Zambia": { code: "ZM", iso3: "ZMB" },
  "Zimbabwe": { code: "ZW", iso3: "ZWE" }
};

// Numeric ISO to ISO 2 code mapping
export const NUMERIC_ISO_MAP: Record<string, string> = {
  "360": "ID", // Indonesia
  "840": "US", // USA
  "392": "JP", // Japan
  "156": "CN", // China
  "356": "IN", // India
  "036": "AU", // Australia
  "826": "GB", // UK
  "276": "DE", // Germany
  "250": "FR", // France
  "724": "ES", // Spain
  "380": "IT", // Italy
  "076": "BR", // Brazil
  "643": "RU", // Russia
  "124": "CA", // Canada
  "710": "ZA", // South Africa
  "702": "SG", // Singapore
  "458": "MY", // Malaysia
  "764": "TH", // Thailand
  "704": "VN", // Vietnam
  "608": "PH", // Philippines
  "410": "KR", // South Korea
  "528": "NL", // Netherlands
  "752": "SE", // Sweden
  "578": "NO", // Norway
  "246": "FI", // Finland
  "484": "MX", // Mexico
  "032": "AR", // Argentina
  "818": "EG", // Egypt
  "682": "SA", // Saudi Arabia
  "784": "AE", // UAE
  "554": "NZ", // New Zealand
  "792": "TR", // Turkey
  "616": "PL", // Poland
  "804": "UA", // Ukraine
};

export function getCountryCode(countryName: string): { code: string; iso3: string } {
  if (!countryName || countryName === "Unknown") {
    return { code: "UN", iso3: "UNK" };
  }
  
  const trimmed = countryName.trim();
  if (COUNTRY_MAP[trimmed]) {
    return COUNTRY_MAP[trimmed];
  }

  // Check if it's numeric ISO
  if (NUMERIC_ISO_MAP[trimmed]) {
    const code2 = NUMERIC_ISO_MAP[trimmed];
    const match = Object.values(COUNTRY_MAP).find((m) => m.code === code2);
    if (match) return match;
    return { code: code2, iso3: code2 + "X" };
  }

  // Case insensitive check
  const lower = trimmed.toLowerCase();
  const foundKey = Object.keys(COUNTRY_MAP).find(
    (k) => k.toLowerCase() === lower
  );
  if (foundKey) {
    return COUNTRY_MAP[foundKey];
  }

  return { code: "UN", iso3: "UNK" };
}

export function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode === "UN" || countryCode.length !== 2) {
    return "🌐";
  }
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
