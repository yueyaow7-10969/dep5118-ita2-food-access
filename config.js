const storyConfig = {
  "title": "Is Convenience Priced In?",
  "style": "mapbox://styles/yesan7/cmtq1trdo003o01sd4w2n6ykh",
  "accessToken": "pk.eyJ1IjoieWVzYW43IiwiYSI6ImNsdXl4bjFvejEwbGMyaW52YzhwaWJ0Y3IifQ.9oX0IzdCaaT6LzXirBBbDA",
  "useLocalDataFallback": true,
  "initialView": {
    "center": [
      103.8198,
      1.3521
    ],
    "zoom": 10.55,
    "pitch": 0,
    "bearing": 0
  },
  "priceStops": [
    [
      2850,
      "#d7eef5"
    ],
    [
      3850,
      "#a5d8e4"
    ],
    [
      4536,
      "#77c4d8"
    ],
    [
      5167,
      "#6867ac"
    ],
    [
      6136,
      "#54236f"
    ],
    [
      10850,
      "#2b0d39"
    ]
  ],
  "floorAreaScale": 0.055,
  "chapters": [
    {
      "id": "chapter-food-network",
      "title": "Singapore's Food Network",
      "description": "The supplied dataset lists 526 supermarkets and 125 hawker centres. Supermarkets offer groceries to take home; hawker centres provide prepared meals and places to eat. Mapping both gives a starting point for looking at everyday food access.",
      "visibleLayers": [
        "outlets-supermarkets",
        "outlets-hawker-centres"
      ],
      "stats": [
        [
          "526",
          "supermarkets"
        ],
        [
          "125",
          "hawker centres"
        ]
      ],
      "legend": {
        "type": "categories",
        "title": "Food outlets",
        "items": [
          [
            "Supermarkets",
            "#18b64b"
          ],
          [
            "Hawker centres",
            "#249ac8"
          ]
        ]
      },
      "location": {
        "center": [
          103.8198,
          1.3521
        ],
        "zoom": 10.55,
        "pitch": 0,
        "bearing": 0
      },
      "nav": "Food network"
    },
    {
      "id": "chapter-service-area",
      "title": "The 500 Metre Threshold",
      "description": "The shaded areas are the 500-metre service areas supplied with the course data. Of the 6,163 addresses with resale transactions, 3,331 fall within them. This describes access to the listed outlets, not every possible place to buy food.",
      "visibleLayers": [
        "access-service-area",
        "outlets-supermarkets",
        "outlets-hawker-centres"
      ],
      "stats": [
        [
          "54.0%",
          "of sample addresses within"
        ],
        [
          "500 m",
          "supplied access threshold"
        ]
      ],
      "legend": {
        "type": "categories",
        "title": "Food access",
        "items": [
          [
            "500 m service area",
            "#b56bd6",
            "square"
          ],
          [
            "Supermarkets",
            "#18b64b"
          ],
          [
            "Hawker centres",
            "#249ac8"
          ]
        ]
      },
      "location": {
        "center": [
          103.8198,
          1.3521
        ],
        "zoom": 10.55,
        "pitch": 0,
        "bearing": 0
      },
      "nav": "500 metres",
      "note": "Coverage follows the supplied classification. The dates of the outlet and service-area datasets are not specified."
    },
    {
      "id": "chapter-price",
      "title": "The Geography of Price",
      "description": "Colour shows the median resale price per square metre at each address in January-June 2021. Higher values appear around central locations. This map shows where prices differ; it does not tell us how much of that difference comes from nearby food outlets.",
      "visibleLayers": [
        "hdb-price-sqm"
      ],
      "stats": [
        [
          "6,163",
          "addresses on the map"
        ],
        [
          "13,713",
          "transactions in the sample"
        ]
      ],
      "legend": {
        "type": "gradient",
        "title": "Median price per m²"
      },
      "location": {
        "center": [
          103.8198,
          1.3521
        ],
        "zoom": 10.55,
        "pitch": 0,
        "bearing": 0
      },
      "nav": "Price"
    },
    {
      "id": "chapter-space",
      "title": "Housing Size Adds Context",
      "description": "Larger circles represent addresses with larger median floor areas. Housing size and location both vary across the sample. These differences matter when comparing prices inside and outside the service areas, although this analysis does not control for them.",
      "visibleLayers": [
        "hdb-floor-area"
      ],
      "stats": [
        [
          "31–243 m²",
          "range of address medians"
        ]
      ],
      "legend": {
        "type": "sizes",
        "title": "Median floor area",
        "items": [
          67,
          102,
          133
        ]
      },
      "location": {
        "center": [
          103.8198,
          1.3521
        ],
        "zoom": 10.55,
        "pitch": 0,
        "bearing": 0
      },
      "nav": "Floor area",
      "note": "Circle area is proportional to floor area. Select a visible address for its price, size and transaction count."
    },
    {
      "id": "chapter-gap",
      "title": "A Closer Look at Jurong East",
      "description": "In Jurong East, 94 of 144 mapped resale addresses fall outside the supplied service areas. That is a higher share than the citywide sample. The red points identify gaps in this dataset's coverage; they do not establish that residents lack food.",
      "visibleLayers": [
        "access-service-area",
        "hdb-access-context",
        "hdb-outside-500m"
      ],
      "stats": [
        [
          "65.3%",
          "Jurong East outside · 94 / 144"
        ],
        [
          "46.0%",
          "citywide outside · 2,832 / 6,163"
        ]
      ],
      "legend": {
        "type": "categories",
        "title": "Sample addresses",
        "items": [
          [
            "Outside 500 m",
            "#ef3326"
          ],
          [
            "Within 500 m",
            "#606b60"
          ],
          [
            "500 m service area",
            "#b56bd6",
            "square"
          ]
        ]
      },
      "location": {
        "center": [
          103.739,
          1.3405
        ],
        "zoom": 12.9,
        "pitch": 0,
        "bearing": 0
      },
      "nav": "Jurong East"
    },
    {
      "id": "chapter-everyday",
      "title": "Beyond the 500-Metre Boundary",
      "description": "This 2025 photograph shows shared tables and food stalls at Yuhua Village Market and Food Centre. It adds a view of the place, rather than evidence of conditions in 2021.",
      "visibleLayers": [
        "outlets-supermarkets",
        "outlets-hawker-centres"
      ],
      "stats": [],
      "legend": {
        "type": "categories",
        "title": "Yuhua Village · Blk 254",
        "items": [
          [
            "Supermarkets",
            "#18b64b"
          ],
          [
            "Hawker centres",
            "#249ac8"
          ]
        ]
      },
      "location": {
        "center": [
          103.737781,
          1.343442
        ],
        "zoom": 14.3,
        "pitch": 0,
        "bearing": 0
      },
      "nav": "Everyday life",
      "kind": "qualitative",
      "image": {
        "src": "assets/yuhua-village.jpg",
        "alt": "Yuhua Village Market and Food Centre, photographed by Kbseah in September 2025.",
        "caption": "Yuhua Village Market and Food Centre, Blk 254 Jurong East Street 24. Photograph: Kbseah, 27 September 2025.",
        "source": "https://commons.wikimedia.org/wiki/File:Yuhua_Village_Market_and_Food_Centre.jpg",
        "license": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      "paragraphs": [
        "The National Heritage Board describes hawker centres as community dining spaces. Nearby food access can also mean having somewhere to sit and share a meal.",
        "Affordability, opening hours, shelter and crossing conditions are not recorded in the distance layer. They need separate evidence; no fieldwork or interviews are claimed here."
      ],
      "source": {
        "label": "National Heritage Board · About Hawker Culture",
        "url": "https://www.nhb.gov.sg/what-we-do/our-work/sector-development/unesco/hawker-culture-in-singapore/about-hawker-culture-in-singapore"
      }
    },
    {
      "id": "chapter-conclusion",
      "title": "A Small Difference, an Open Question",
      "description": "Across the transaction sample, the median price per square metre is about 4.6% higher inside the service areas than outside. This is an unadjusted comparison. It cannot separate food access from location, flat type, lease or other factors that may affect prices.",
      "visibleLayers": [
        "hdb-access-context",
        "hdb-outside-500m"
      ],
      "stats": [],
      "legend": {
        "type": "categories",
        "title": "Sample addresses",
        "items": [
          [
            "Outside 500 m",
            "#ef3326"
          ],
          [
            "Within 500 m",
            "#606b60"
          ]
        ]
      },
      "location": {
        "center": [
          103.8198,
          1.3521
        ],
        "zoom": 10.55,
        "pitch": 0,
        "bearing": 0
      },
      "nav": "Conclusion",
      "comparison": [
        [
          "Within 500 m",
          4875.06
        ],
        [
          "Outside 500 m",
          4662.16
        ]
      ],
      "note": "The comparison uses individual transactions; the price map uses the median at each address. Access shares count addresses, not residents.",
      "paragraphs": [
        "The coverage gaps are a starting point for closer local checks. The Yuhua example also shows why a distance threshold should be read alongside information about the places people use."
      ]
    }
  ]
};
