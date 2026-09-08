# Is Convenience Priced In

DEP5118 Individual Technology Assignment 2 by Wang Yueyao.

## Mapbox Studio tilesets

Upload the following files as three separate tilesets:

1. `data/food-outlets.geojson`
2. `data/food-access-500m.geojson`
3. `data/hdb-resale-addresses.geojson`

The custom style must expose these layer IDs because `config.js` uses them during chapter transitions:

- `outlets-supermarkets`
- `outlets-hawker-centres`
- `access-service-area`
- `hdb-price-sqm`
- `hdb-floor-area`
- `hdb-access-context`
- `hdb-outside-500m`

The page adds a local GeoJSON fallback only when the style is missing a required layer. It does not replace a vector source merely because a tile request fails.

## Seven-chapter revision

The qualitative chapter locates Yuhua Village Market and Food Centre (Blk 254), with a credited 2025 photograph and National Heritage Board context. Photo rights and display changes are recorded in `assets/ATTRIBUTION.md`.

`config.js` is the shared source for price stops and floor-area scale. The application applies these to existing Studio vector layers and to fallback layers. Circle area is proportional to floor area: radius = sqrt(0.055 × floor area in m²). The within-area context layer is filtered to `outside_500m = 0`.

Studio editor saving is currently blocked by the account's billing-address confirmation screen. The website applies the revised expressions at runtime; `../mapbox-style-updated.json` is the matching importable style prepared for Studio. The existing three published vector tilesets are unchanged.

## Preview and validation

Serve this directory over HTTP. Run `node ../scripts/validate_delivery.mjs .` to check counts, word limit, qualitative media and the final price comparison.

The comparison uses transaction-level medians; map prices are address-level medians. Access proportions count the sample addresses, not households or population. The inside median is 4.6% higher than the outside median; this is an unadjusted comparison.
