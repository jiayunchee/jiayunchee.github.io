// Everywhere I've been. The map, the travel stats and the passport stamps
// all read from this file, so adding a trip here updates everything.
//
// To add a place: copy an entry and change the details.
// - coordinates: find the city on Google Maps, right-click it, and copy the
//   two numbers it shows (the first is lat, the second is lng)
// - image: put a photo in /public/images/travel and write its path,
//   e.g. "/images/travel/tokyo.jpg"
// - a place in a brand new country needs that country added to `countries` first

export type Country = {
  /** Short name for stamps and labels, e.g. "USA" */
  short: string;
  flag: string;
  /** The country's id in the world map data (its ISO 3166 numeric code) */
  mapId: string;
};

export const countries = {
  "United States": { short: "USA", flag: "🇺🇸", mapId: "840" },
  Japan: { short: "Japan", flag: "🇯🇵", mapId: "392" },
  "South Korea": { short: "South Korea", flag: "🇰🇷", mapId: "410" },
  Taiwan: { short: "Taiwan", flag: "🇹🇼", mapId: "158" },
  "Hong Kong": { short: "Hong Kong", flag: "🇭🇰", mapId: "344" },
  Thailand: { short: "Thailand", flag: "🇹🇭", mapId: "764" },
  Malaysia: { short: "Malaysia", flag: "🇲🇾", mapId: "458" },
  Indonesia: { short: "Indonesia", flag: "🇮🇩", mapId: "360" },
  Philippines: { short: "Philippines", flag: "🇵🇭", mapId: "608" },
  "United Kingdom": { short: "UK", flag: "🇬🇧", mapId: "826" },
  Australia: { short: "Australia", flag: "🇦🇺", mapId: "036" },
} satisfies Record<string, Country>;

export type CountryName = keyof typeof countries;

export type Place = {
  city: string;
  country: CountryName;
  coordinates: { lat: number; lng: number };
  /** When you went, e.g. "Sep 2025" */
  date?: string;
  /** A short label for the card, e.g. "UCSD exchange" */
  tag?: string;
  /** Your story. A placeholder shows until you write one. */
  description?: string;
  /** Photo path in /public. A placeholder shows until you add one. */
  image?: string;
};

export const home = {
  city: "Singapore",
  coordinates: { lat: 1.3521, lng: 103.8198 },
  mapId: "702",
};

export const places: Place[] = [
  // United States
  {
    city: "San Diego",
    country: "United States",
    coordinates: { lat: 32.7157, lng: -117.1611 },
    date: "Sep 2025",
    tag: "UCSD exchange",
    description: "One of the places that made me want to explore more of the US.",
  },
  { city: "Los Angeles", country: "United States", coordinates: { lat: 34.0522, lng: -118.2437 } },
  { city: "San Francisco", country: "United States", coordinates: { lat: 37.7749, lng: -122.4194 } },
  { city: "Las Vegas", country: "United States", coordinates: { lat: 36.1699, lng: -115.1398 } },
  { city: "Seattle", country: "United States", coordinates: { lat: 47.6062, lng: -122.3321 } },
  { city: "Miami", country: "United States", coordinates: { lat: 25.7617, lng: -80.1918 } },
  { city: "New York City", country: "United States", coordinates: { lat: 40.7128, lng: -74.006 } },

  // Japan
  { city: "Tokyo", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 } },
  { city: "Kyoto", country: "Japan", coordinates: { lat: 35.0116, lng: 135.7681 } },
  { city: "Hokkaido", country: "Japan", coordinates: { lat: 43.0618, lng: 141.3545 } },
  { city: "Gotemba", country: "Japan", coordinates: { lat: 35.3087, lng: 138.9347 } },
  { city: "Hakuba", country: "Japan", coordinates: { lat: 36.6982, lng: 137.8619 } },

  // South Korea
  { city: "Seoul", country: "South Korea", coordinates: { lat: 37.5665, lng: 126.978 } },
  { city: "Busan", country: "South Korea", coordinates: { lat: 35.1796, lng: 129.0756 } },
  { city: "Jeju", country: "South Korea", coordinates: { lat: 33.4996, lng: 126.5312 } },

  // Around Asia (the Taiwan pin sits on Taipei)
  { city: "Taiwan", country: "Taiwan", coordinates: { lat: 25.033, lng: 121.5654 } },
  { city: "Hong Kong", country: "Hong Kong", coordinates: { lat: 22.3193, lng: 114.1694 } },
  { city: "Chiang Mai", country: "Thailand", coordinates: { lat: 18.7883, lng: 98.9853 } },
  { city: "Phuket", country: "Thailand", coordinates: { lat: 7.8804, lng: 98.3923 } },
  { city: "Johor Bahru", country: "Malaysia", coordinates: { lat: 1.4927, lng: 103.7414 } },
  {
    city: "Jakarta",
    country: "Indonesia",
    coordinates: { lat: -6.2088, lng: 106.8456 },
    date: "Winter 2024/25",
    tag: "NUS STEER programme",
  },
  { city: "Bali", country: "Indonesia", coordinates: { lat: -8.4095, lng: 115.1889 } },
  { city: "Cebu", country: "Philippines", coordinates: { lat: 10.3157, lng: 123.8854 } },

  // Further afield
  { city: "London", country: "United Kingdom", coordinates: { lat: 51.5072, lng: -0.1276 } },
  { city: "Melbourne", country: "Australia", coordinates: { lat: -37.8136, lng: 144.9631 } },
];

/** A stable, URL-friendly id for a place, e.g. "new-york-city" */
export const placeId = (place: Place) =>
  place.city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Countries in the order they're listed in `countries`, with only the ones visited */
export const visitedCountries = (Object.keys(countries) as CountryName[]).filter((name) =>
  places.some((place) => place.country === name),
);
