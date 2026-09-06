const storyConfig = {
  title: "Is Convenience Priced In?",
  style: "mapbox://styles/yesan7/cmtq1trdo003o01sd4w2n6ykh",
  accessToken: "pk.eyJ1IjoieWVzYW43IiwiYSI6ImNsdXl4bjFvejEwbGMyaW52YzhwaWJ0Y3IifQ.9oX0IzdCaaT6LzXirBBbDA",
  useLocalDataFallback: true,
  initialView: { center: [103.8198, 1.3521], zoom: 10.55, pitch: 0, bearing: 0 },
  chapters: [
    {
      id: "chapter-food-network",
      alignment: "left",
      title: "Singapore's Food Network",
      description: "Food access begins with a distributed everyday network. The supplied data records 526 supermarkets and 125 hawker centres across Singapore. These are categorical points: each represents a place and type, not a quantity.",
      location: { center: [103.8198, 1.3521], zoom: 10.65, pitch: 0, bearing: 0 },
      stats: [["526", "supermarkets"], ["125", "hawker centres"]],
      legend: { type: "categories", title: "Food outlets", items: [["Supermarkets", "#18b64b"], ["Hawker centres", "#249ac8"]] },
      visibleLayers: ["outlets-supermarkets", "outlets-hawker-centres"]
    },
    {
      id: "chapter-service-area",
      alignment: "right",
      title: "The 500 Metre Threshold",
      description: "The purple service areas provide a consistent way to ask which HDB resale addresses are close to a mapped food outlet. A 500-metre boundary simplifies real journeys, but it makes the uneven geography of proximity visible.",
      location: { center: [103.8198, 1.3521], zoom: 10.8, pitch: 0, bearing: 0 },
      stats: [["500 m", "access threshold"], ["145", "service-area features"]],
      legend: { type: "categories", title: "Access layer", items: [["500 m service area", "#b56bd6", "square"], ["Food outlets", "#249ac8"]] },
      visibleLayers: ["access-service-area", "outlets-supermarkets", "outlets-hawker-centres"]
    },
    {
      id: "chapter-price",
      alignment: "left",
      title: "The Geography of Price",
      description: "Each point now represents an HDB address with at least one resale transaction from January to June 2021. Colour shows the address-level median price per square metre. The highest values cluster in and around central locations, while lower values extend across the north and west.",
      location: { center: [103.8198, 1.3521], zoom: 10.75, pitch: 0, bearing: 0 },
      stats: [["6,163", "resale addresses"], ["13,713", "transaction records"]],
      legend: { type: "gradient", title: "Median price per m²", min: "S$2.8k", max: "S$10.8k" },
      visibleLayers: ["hdb-price-sqm"]
    },
    {
      id: "chapter-space",
      alignment: "right",
      title: "What Buyers Pay For",
      description: "Price is not just location. Circle size represents median floor area at each address, from compact flats to much larger units. Select a point to compare floor area, median resale price, price per square metre and the number of transactions behind the address-level summary.",
      location: { center: [103.8198, 1.3521], zoom: 10.85, pitch: 22, bearing: -5 },
      stats: [["31 m²", "smallest address median"], ["243 m²", "largest address median"]],
      legend: { type: "sizes", title: "Median floor area", items: [["67 m²", 8], ["102 m²", 14], ["133+ m²", 20]] },
      visibleLayers: ["hdb-floor-area"]
    },
    {
      id: "chapter-gap",
      alignment: "left",
      title: "Where Access Falls Short",
      description: "Red points mark addresses beyond the supplied 500-metre service areas. Jurong East illustrates the local contrast: 94 of 144 mapped resale addresses, or 65.3%, fall outside. The pattern is an access signal, not a measure of food insecurity or individual behaviour.",
      location: { center: [103.7423, 1.3329], zoom: 13.0, pitch: 38, bearing: -12 },
      stats: [["65.3%", "Jurong East addresses outside"], ["94 / 144", "mapped addresses"]],
      legend: { type: "categories", title: "Access classification", items: [["Outside 500 m", "#ef3326"], ["500 m service area", "#b56bd6", "square"]] },
      visibleLayers: ["access-service-area", "hdb-outside-500m"]
    },
    {
      id: "chapter-conclusion",
      alignment: "right",
      title: "A Modest Price Gap Uneven Access",
      description: "Across all transactions, the median price per square metre is about S$4,875 inside the service areas and S$4,662 outside - a gap of roughly 4.4%. Yet 46.0% of mapped resale addresses sit outside. Convenience is not simply priced into housing; access remains a neighbourhood planning question.",
      location: { center: [103.8198, 1.3521], zoom: 10.7, pitch: 0, bearing: 0 },
      stats: [["S$4,875/m²", "inside median"], ["S$4,662/m²", "outside median"]],
      legend: { type: "categories", title: "Access classification", items: [["Outside 500 m", "#ef3326"], ["Within 500 m", "#606b60"]] },
      visibleLayers: ["hdb-access-context", "hdb-outside-500m"]
    }
  ]
};
