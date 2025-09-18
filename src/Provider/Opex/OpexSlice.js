import { createSlice } from "@reduxjs/toolkit";

// NOTE: Numbers are in USD; daily values unless stated otherwise.
// Dataset for LNG Vessel OPEX – 135–150k CBM segment
const vessel135150 = {
	profile: {
		type: "LNG - Steam",
		sectorCbm: "135-150,000 cbm",
		globalFleetNo: 160,
		globalFleetCbm: 22784013,
		avgAgeYrs: 20.0,
		youngestVesselYrs: 9.9,
		oldestVesselYrs: 34.7,
		avgScrapAgeYrs: null, // n/a
		avgSizeCbm: 142400,
		avgLDT: 31347,
		avgBHP: 36652,
		avgGT: 103745,
		profileYear: 2024,
	},
	byAgeDaily: {
		labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
		items: [
			{ name: "Manning", values: [6780, 6520, 6260, 6780, 7310] },
			{ name: "Insurance", values: [1060, 1120, 1060, 1240, 1390] },
			{ name: "Stores", values: [920, 1020, 1000, 1020, 1070] },
			{ name: "Spares", values: [1280, 1350, 1350, 1420, 1490] },
			{ name: "Lubricating oils", values: [180, 180, 180, 180, 190] },
			{ name: "Repair & maintenance", values: [620, 660, 630, 690, 750] },
			{ name: "Dry-docking", values: [0, 1580, 1650, 1800, 2100] },
			{ name: "Management & administration", values: [1860, 1860, 1820, 1860, 1960] },
		],
		totals: [12700, 14290, 13950, 14990, 16260],
	},
	index: {
		labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		values: [100, 103, 105, 108, 112, 116, 120, 122.5, 125, 128.5, 132.5],
	},
	categoriesYoY: {
		// 2020-2024 trend per main head (daily)
		years: [2020, 2021, 2022, 2023, 2024],
		series: [
			{ name: "Manning", data: [6500, 6600, 6700, 6900, 7000] },
			{ name: "Insurance", data: [900, 925, 950, 975, 1000] },
			{ name: "Stores, spares & lubricating oils", data: [2300, 2350, 2400, 2450, 2500] },
			{ name: "Repairs & maintenance", data: [400, 450, 500, 500, 500] },
			{ name: "Dry-docking", data: [1500, 1600, 1700, 1800, 1900] },
			{ name: "Management & administration", data: [1500, 1600, 1700, 1800, 1900] },
		],
	},
	totalYoY: {
		years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		totals: [13350, 13650, 14050, 14550, 15050, 15500, 15900, 16250, 16650, 17050],
		pctChange: [
			4.4, 2.2, 2.93, 3.56, 3.44, 2.99, 2.58, 2.2, 2.46, 2.4,
		],
	},
	// 2024 annual costs for a 15-yr old vessel
	annual2024: {
		manning: {
			items: [
				{ label: "Officer/rating numbers", value: 26 },
				{ label: "Crew wages & overtime", value: 2066110 },
				{ label: "Crew Victualling", value: 117870 },
				{ label: "Crew Travel", value: 85800 },
				{ label: "Miscellaneous Costs", value: 206610 },
			],
			total: 2476390,
		},
		insurance: {
			items: [
				{ label: "Hull & Machinery", value: 188860 },
				{ label: "Protection & Indemnity", value: 233620 },
				{ label: "War Risk", value: 11600 },
				{ label: "FD&D", value: 15850 },
				{ label: "COFR", value: 3150 },
			],
			total: 453080,
		},
		stores: {
			items: [
				{ label: "Deck & cabin stores", value: 98380 },
				{ label: "Safety items/protective equipment", value: 73220 },
				{ label: "Chemicals & gases", value: 17560 },
				{ label: "Medical", value: 15000 },
				{ label: "Mooring wires & ropes & hoses", value: 41260 },
				{ label: "Maintenance paint", value: 60020 },
				{ label: "Tools & hardware", value: 11250 },
				{ label: "Transportation costs", value: 21150 },
				{ label: "Others", value: 33110 },
			],
			total: 373620,
		},
		spares: {
			items: [
				{ label: "Main propulsion unit", value: 47880 },
				{ label: "Generator engines", value: 27210 },
				{ label: "Boilers", value: 152230 },
				{ label: "ER auxiliary machinery", value: 43530 },
				{ label: "Deck machinery", value: 54130 },
				{ label: "Electrical", value: 43530 },
				{ label: "Cargo & ballast system", value: 54410 },
				{ label: "Pipes & valves & hydraulic systems", value: 48970 },
				{ label: "Navigation equipment", value: 21080 },
				{ label: "Access equipment", value: 14050 },
				{ label: "Spares transportation", value: 27210 },
			],
			total: 517730,
		},
		luboils: {
			items: [
				{ label: "ME system oil", value: 46340 },
				{ label: "Aux engine oil", value: 6820 },
				{ label: "Hydraulic oils", value: 3040 },
				{ label: "Others", value: 10600 },
			],
			total: 66800,
		},
		repairMaintenance: {
			items: [
				{ label: "Boiler", value: 50180 },
				{ label: "Generators", value: 29160 },
				{ label: "ER auxiliaries", value: 24090 },
				{ label: "Cargo & ballast system inc. calibration", value: 15050 },
				{ label: "Electrical rewinding", value: 30110 },
				{ label: "Pipes & valves & hydraulic systems", value: 15050 },
				{ label: "Deck machinery inc. cranes", value: 20070 },
				{ label: "Navigation equipment", value: 21080 },
				{ label: "Access equipment", value: 14050 },
				{ label: "LSA & FFE (Life saving appliances & fire fighting equipment)", value: 25090 },
			],
			total: 239860,
		},
		intermediateSurvey: {
			items: [{ label: "Intermediate/Special survey", value: 655480 }],
			total: 655480,
		},
		managementAdmin: {
			groups: [
				{
					name: "Fees & Services",
					items: [
						{ label: "Management fee", value: 246240 },
						{ label: "Launches & other transport", value: 33960 },
						{ label: "Flag state inspection, certification & other charges", value: 16980 },
						{ label: "Classification charges", value: 16980 },
						{ label: "PSC charges", value: 0 },
						{ label: "Third party services", value: 22080 },
						{ label: "Consulting fees", value: 22080 },
						{ label: "Procurement costs", value: 56040 },
						{ label: "Communications, printing, IT & postage", value: 46200 },
						{ label: "Vetting", value: 76420 },
					],
				},
				{
					name: "Owner's Costs",
					items: [
						{ label: "Owners disbursement", value: 33960 },
						{ label: "Masters entertainment", value: 42450 },
					],
				},
				{
					name: "Safety & Environmental Compliance",
					items: [
						{ label: "Internal auditing & inspection", value: 2930 },
						{ label: "Training", value: 5130 },
						{ label: "Survey & calibration of equipment", value: 33960 },
						{ label: "Incinerator servicing & maintenance", value: 13590 },
						{ label: "OWS servicing & maintenance", value: 11890 },
						{ label: "OCM servicing & maintenance", value: 11390 },
						{ label: "Envirologger servicing & maintenance", value: 11390 },
						{ label: "Waste & garbage disposal", value: 33960 },
						{ label: "BWTS servicing & maintenance", value: 5180 },
					],
				},
			],
			// add missing sub-costs row as per image
			subCosts: 112090,
			// Keep dataset total consistent with the grand total
			total: 680120,
		},
		grandTotal: 5463080,
		perDay: 14990,
		perDayExDryDock: 13170,
		// add missing summary values
		totalExDryDockAnnual: 4807600,
		avgUpperRangePerDay: 14420,
		avgLowerRangePerDay: 12870,
	},
};

// Dataset for 3-5k cbm LPG vessel
const vessel3_5k = {
  profile: {
    type: "LPG",
    sectorCbm: "Small Semi-Refrigerated 1",
    globalFleetNo: 250,
    globalFleetCbm: 896540,
    avgAgeYrs: 18.7,
    youngestVesselYrs: 1.4,
    oldestVesselYrs: 45.2,
    avgScrapAgeYrs: 29.1,
    avgSizeCbm: 3586,
    avgLDT: 2430,
    avgBHP: 3447,
    avgGT: 3452,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [2640, 2640, 2880, 3120, 3360] },
      { name: "Insurance", values: [300, 320, 350, 410, 430] },
      { name: "Stores", values: [360, 400, 400, 410, 410] },
      { name: "Spares", values: [320, 340, 350, 370, 350] },
      { name: "Lubricating Oils", values: [200, 200, 200, 210, 210] },
      { name: "Repair & Maintenance", values: [280, 300, 310, 340, 340] },
      { name: "Dry-Docking", values: [0, 430, 460, 490, 570] },
      { name: "Management & Administration", values: [750, 750, 750, 790, 790] },
    ],
    totals: [4850, 5380, 5700, 6140, 6460],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 105, 106.5, 107, 108, 110, 112.5, 115.5, 118, 121.5, 124.5],
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [2900, 2950, 2960, 2970, 2980] },
      { name: "Insurance", data: [300, 310, 320, 330, 340] },
      { name: "Stores, spares & lubricating oils", data: [800, 850, 820, 830, 860] },
      { name: "Repairs & maintenance", data: [300, 310, 330, 340, 350] },
      { name: "Dry-docking", data: [400, 420, 410, 420, 430] },
      { name: "Management & administration", data: [600, 620, 610, 620, 630] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [5400, 5550, 5560, 5600, 5700, 5850, 6000, 6150, 6260, 6450],
    pctChange: [4.8, 1.9, 0.15, 0.7, 2, 2.8, 2.3, 2.1, 2.2, 2.9],
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 12 },
        { label: "Crew wages & overtime", value: 865477 },
        { label: "Crew victualling", value: 44457 },
        { label: "Crew travel", value: 54212 },
        { label: "Miscellaneous costs", value: 86548 },
      ],
      total: 1050694,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 48220 },
        { label: "Protection & Indemnity", value: 71100 },
        { label: "War Risk", value: 3800 },
        { label: "FD&D", value: 5170 },
        { label: "COFR", value: 1010 },
      ],
      total: 129300,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 42710 },
        { label: "Safety Items/Protective Equipment", value: 38290 },
        { label: "Chemicals & Gases", value: 13260 },
        { label: "Medical", value: 5890 },
        { label: "Mooring Wires & Ropes & Hoses", value: 17410 },
        { label: "Maintenance Paint", value: 23570 },
        { label: "Tools & Hardware", value: 4420 },
      ],
      total: 145550,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 33640 },
        { label: "Generator Engines", value: 22000 },
        { label: "Boilers", value: 7760 },
        { label: "ER Auxiliary Machinery", value: 22000 },
        { label: "Deck Machinery", value: 5180 },
        { label: "Electrical", value: 6470 },
        { label: "Cargo & Ballast System", value: 10350 },
        { label: "Pipes & Valves", value: 2590 },
        { label: "Navigation Equipment", value: 3880 },
        { label: "Access Equipment", value: 2590 },
        { label: "Spares Transportation", value: 12940 },
      ],
      total: 129400,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 55270 },
        { label: "ME System Oil", value: 1910 },
        { label: "Aux Engine Oil", value: 5890 },
        { label: "Hydraulic Oils", value: 6480 },
        { label: "Other Oils", value: 4050 },
      ],
      total: 73600,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 21760 },
        { label: "Boiler", value: 2290 },
        { label: "Generators", value: 20620 },
        { label: "ER Auxiliaries", value: 8020 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 5730 },
        { label: "Electrical Including Rewinds", value: 8020 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 5730 },
        { label: "Deck Machinery Inc. Cranes", value: 8020 },
        { label: "Navigation Equipment", value: 10310 },
        { label: "Access Equipment", value: 8020 },
        { label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 16030 },
      ],
      total: 114550,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 166890 }],
      total: 166890,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 94690 },
            { label: "Launches & other transport", value: 13060 },
            { label: "Flag state inspection, certification & other charges", value: 6530 },
            { label: "Classification charges", value: 6530 },
            { label: "PSC charges", value: 2290 },
            { label: "Third party services", value: 3270 },
            { label: "Consulting fees", value: 18740 },
            { label: "Procurement costs", value: 21550 },
            { label: "Communications, printing, IT & postage", value: 16330 },
            { label: "Vetting", value: 29390 },
          ],
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 13060 },
            { label: "Masters entertainment", value: 3270 },
          ],
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 3270 },
            { label: "Training", value: 1310 },
            { label: "Survey & calibration of equipment", value: 13060 },
            { label: "Incinerator servicing & maintenance", value: 1960 },
            { label: "OWS servicing & maintenance", value: 4570 },
            { label: "OCM servicing & maintenance", value: 1310 },
            { label: "Enviro-logger servicing & maintenance", value: 1630 },
            { label: "Waste & garbage disposal", value: 13060 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
        },
      ],
      subCosts: 212380 + 16330 + 45350,
      total: 274060,
    },
    grandTotal: 2084044,
    perDay: 5700,
    perDayExDryDock: 5700,
    totalExDryDockAnnual: 1917154,
    avgUpperRangePerDay: 6150,
    avgLowerRangePerDay: 3940,
  },
};

// Dataset for 5-6k cbm LPG vessel (Estimation, based on raw data 2024)
const vessel5_6k = {
  isEstimate: true,
  profile: {
    type: "LPG",
    sectorCbm: "Small Semi-Refrigerated 2",
    globalFleetNo: null,
    globalFleetCbm: null,
    avgAgeYrs: null,
    youngestVesselYrs: null,
    oldestVesselYrs: null,
    avgScrapAgeYrs: null,
    avgSizeCbm: 5309,
    avgLDT: 3046,
    avgBHP: 4513,
    avgGT: 4783,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [2755, 2755, 2970, 3185, 3400] },
      { name: "Insurance", values: [315, 335, 365, 425, 445] },
      { name: "Stores", values: [370, 415, 415, 420, 425] },
      { name: "Spares", values: [335, 355, 370, 390, 370] },
      { name: "Lubricating Oils", values: [225, 230, 230, 240, 240] },
      { name: "Repair & Maintenance", values: [300, 320, 330, 360, 360] },
      { name: "Dry-Docking", values: [0, 460, 490, 525, 610] },
      { name: "Management & Administration", values: [790, 790, 790, 830, 830] },
    ],
    totals: [5090, 5660, 5960, 6375, 6680],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 103, 105, 108, 109, 110, 113, 115, 116, 120, 125], // simulasi tren indeks
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [2900, 2900, 2900, 2900, 2900] }, // flat simulasi
      { name: "Insurance", data: [300, 305, 310, 310, 315] }, // simulasi naik
      { name: "Stores, spares & lubricating oils", data: [800, 805, 815, 820, 825] },
      { name: "Repairs & maintenance", data: [300, 310, 315, 320, 330] },
      { name: "Dry-docking", data: [600, 600, 610, 615, 620] },
      { name: "Management & administration", data: [750, 755, 760, 765, 770] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [4850, 5500, 5500, 5600, 5700, 5875, 6000, 6115, 6250, 6400], // tren naik
    pctChange: [5, 2, 0.1, 0.5, 2, 2.7, 2.4, 2.1, 2.3, 3], // simulasi
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 14 },
        { label: "Crew wages & overtime", value: 889558 },
        { label: "Crew victualling", value: 51868 },
        { label: "Crew travel", value: 53771 },
        { label: "Miscellaneous costs", value: 88954 },
      ],
      total: 1084151,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 50210 },
        { label: "Protection & Indemnity", value: 74035 },
        { label: "War Risk", value: 3955 },
        { label: "FD&D", value: 5385 },
        { label: "COFR", value: 1050 },
      ],
      total: 134635,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 44355 },
        { label: "Safety Items/Protective Equipment", value: 39765 },
        { label: "Chemicals & Gases", value: 13770 },
        { label: "Medical", value: 6115 },
        { label: "Mooring Wires & Ropes & Hoses", value: 17370 },
        { label: "Maintenance Paint", value: 24475 },
        { label: "Tools & Hardware", value: 4590 },
      ],
      total: 150440,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 35285 },
        { label: "Generator Engines", value: 23075 },
        { label: "Boilers", value: 8140 },
        { label: "ER Auxiliary Machinery", value: 23075 },
        { label: "Deck Machinery", value: 5430 },
        { label: "Electrical", value: 6785 },
        { label: "Cargo & Ballast System", value: 10855 },
        { label: "Pipes & Valves", value: 2715 },
        { label: "Navigation Equipment", value: 4070 },
        { label: "Access Equipment", value: 2715 },
        { label: "Spares Transportation", value: 13570 },
      ],
      total: 135715,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 63795 },
        { label: "ME System Oil", value: 2290 },
        { label: "Aux Engine Oil", value: 6805 },
        { label: "Hydraulic Oils", value: 7100 },
        { label: "Other Oils", value: 4455 },
      ],
      total: 84445,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 23160 },
        { label: "Boiler", value: 2440 },
        { label: "Generators", value: 21945 },
        { label: "ER Auxiliaries", value: 8535 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 6095 },
        { label: "Electrical Including Rewinds", value: 8535 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 6095 },
        { label: "Deck Machinery Inc. Cranes", value: 8535 },
        { label: "Navigation Equipment", value: 10975 },
        { label: "Access Equipment", value: 8535 },
        { label: "LSA & FFE", value: 17065 },
      ],
      total: 121915,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 173130 }],
      total: 173130,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 100105 },
            { label: "Launches & other transport", value: 13805 },
            { label: "Flag state inspection", value: 6905 },
            { label: "Classification charges", value: 6905 },
            { label: "PSC charges", value: 2420 },
            { label: "Third party services", value: 3455 },
            { label: "Consulting fees", value: 19225 },
            { label: "Procurement costs", value: 22785 },
            { label: "Communications, printing, IT & postage", value: 17260 },
            { label: "Vetting", value: 31070 },
          ],
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 13805 },
            { label: "Masters entertainment", value: 3455 },
          ],
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 3455 },
            { label: "Training", value: 1385 },
            { label: "Survey & calibration of equipment", value: 13805 },
            { label: "Incinerator servicing & maintenance", value: 2070 },
            { label: "OWS servicing & maintenance", value: 4830 },
            { label: "OCM servicing & maintenance", value: 1385 },
            { label: "Enviro-logger servicing & maintenance", value: 1725 },
            { label: "Waste & garbage disposal", value: 13805 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
        },
      ],
      total: 288835,
    },
    grandTotal: 2173266,
    perDay: 5960,
    perDayExDryDock: 5705,
    totalExDryDockAnnual: 2000137,
    avgUpperRangePerDay: 6675,
    avgLowerRangePerDay: 4160,
  },
};

// Dataset for 6-8k cbm LPG vessel
const vessel6_8k = {
  profile: {
    type: "LPG",
    sectorCbm: "Small Semi-Refrigerated 3",
    globalFleetNo: 110,
    globalFleetCbm: 773411,
    avgAgeYrs: 15.6,
    youngestVesselYrs: "<0.1",
    oldestVesselYrs: 32.6,
    avgScrapAgeYrs: 26.9,
    avgSizeCbm: 7031,
    avgLDT: 3662,
    avgBHP: 5578,
    avgGT: 6114,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [2870, 2870, 3060, 3250, 3440] },
      { name: "Insurance", values: [330, 350, 380, 440, 460] },
      { name: "Stores", values: [380, 430, 430, 430, 440] },
      { name: "Spares", values: [350, 370, 390, 410, 390] },
      { name: "Lubricating Oils", values: [250, 260, 260, 270, 270] },
      { name: "Repair & Maintenance", values: [320, 340, 350, 380, 380] },
      { name: "Dry-Docking", values: [0, 490, 520, 560, 650] },
      { name: "Management & Administration", values: [830, 830, 830, 870, 870] },
    ],
    totals: [5330, 5940, 6220, 6610, 6900],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 105, 106.5, 107, 107.5, 110, 113, 116, 118.5, 121.5, 124.5],
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [3050, 3070, 2990, 3000, 3030] },
      { name: "Insurance", data: [350, 360, 360, 365, 360] },
      { name: "Stores, spares & lubricating oils", data: [950, 960, 990, 1050, 1100] },
      { name: "Repairs & maintenance", data: [280, 290, 300, 295, 295] },
      { name: "Dry-docking", data: [530, 560, 600, 600, 640] },
      { name: "Management & administration", data: [730, 760, 770, 780, 800] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [5950, 6010, 6020, 6050, 6200, 6400, 6550, 6650, 6800, 7010],
    pctChange: [4.8, 1.9, 0.2, 0.4, 2.38, 2.9, 2.4, 2.15, 2.2, 2.5],
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 16 },
        { label: "Crew wages & overtime", value: 913640 },
        { label: "Crew victualling", value: 59280 },
        { label: "Crew travel", value: 53330 },
        { label: "Miscellaneous costs", value: 91360 },
      ],
      total: 1117610,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 52200 },
        { label: "Protection & Indemnity", value: 76970 },
        { label: "War Risk", value: 4110 },
        { label: "FD&D", value: 5600 },
        { label: "COFR", value: 1090 },
      ],
      total: 139970,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 46000 },
        { label: "Safety Items/Protective Equipment", value: 41240 },
        { label: "Chemicals & Gases", value: 14280 },
        { label: "Medical", value: 6340 },
        { label: "Mooring Wires & Ropes & Hoses", value: 17330 },
        { label: "Maintenance Paint", value: 25380 },
        { label: "Tools & Hardware", value: 4760 },
      ],
      total: 155330,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 36930 },
        { label: "Generator Engines", value: 24150 },
        { label: "Boilers", value: 8520 },
        { label: "ER Auxiliary Machinery", value: 24150 },
        { label: "Deck Machinery", value: 5680 },
        { label: "Electrical", value: 7100 },
        { label: "Cargo & Ballast System", value: 11360 },
        { label: "Pipes & Valves", value: 2840 },
        { label: "Navigation Equipment", value: 4260 },
        { label: "Access Equipment", value: 2840 },
        { label: "Spares Transportation", value: 14200 },
      ],
      total: 142030,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 72320 },
        { label: "ME System Oil", value: 2670 },
        { label: "Aux Engine Oil", value: 7720 },
        { label: "Hydraulic Oils", value: 7720 },
        { label: "Other Oils", value: 4860 },
      ],
      total: 95290,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 24560 },
        { label: "Boiler", value: 2590 },
        { label: "Generators", value: 23270 },
        { label: "ER Auxiliaries", value: 9050 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 6460 },
        { label: "Electrical Including Rewinds", value: 9050 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 6460 },
        { label: "Deck Machinery Inc. Cranes", value: 9050 },
        { label: "Navigation Equipment", value: 11640 },
        { label: "Access Equipment", value: 9050 },
        { label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 18100 },
      ],
      total: 129280,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 179370 }],
      total: 179370,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 105520 },
            { label: "Launches & other transport", value: 14550 },
            { label: "Flag state inspection, certification & other charges", value: 7280 },
            { label: "Classification charges", value: 7280 },
            { label: "PSC charges", value: 2550 },
            { label: "Third party services", value: 3640 },
            { label: "Consulting fees", value: 19710 },
            { label: "Procurement costs", value: 24020 },
            { label: "Communications, printing, IT & postage", value: 18190 },
            { label: "Vetting", value: 32750 },
          ],
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 14550 },
            { label: "Masters entertainment", value: 3640 },
          ],
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 3640 },
            { label: "Training", value: 1460 },
            { label: "Survey & calibration of equipment", value: 14550 },
            { label: "Incinerator servicing & maintenance", value: 2180 },
            { label: "OWS servicing & maintenance", value: 5090 },
            { label: "OCM servicing & maintenance", value: 1460 },
            { label: "Enviro-logger servicing & maintenance", value: 1820 },
            { label: "Waste & garbage disposal", value: 14550 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
        },
      ],
      total: 303610,
    },
    grandTotal: 2262490,
    perDay: 6220,
    perDayExDryDock: 5710,
    totalExDryDockAnnual: 2083120,
    avgUpperRangePerDay: 7200,
    avgLowerRangePerDay: 4380,
  },
};

// Dataset for 8–12k cbm LPG vessel (Estimation, 2024)
const vessel8_12k = {
	isEstimate: true,
	profile: {
		type: "LPG",
		sectorCbm: "Small Semi-Refrigerated 4",
		globalFleetNo: null, // N/A
		globalFleetCbm: null, // N/A
		avgAgeYrs: null, // N/A
		youngestVesselYrs: null,
		oldestVesselYrs: null,
		avgScrapAgeYrs: null,
		avgSizeCbm: 9530,
		avgLDT: 5139,
		avgBHP: 6828,
		avgGT: 9158,
		profileYear: 2024,
	},

	// Operating cost by vessel age
	byAgeDaily: {
		labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
		items: [
			{ name: "Manning", values: [3004, 3004, 3194, 3379, 3569] },
			{ name: "Insurance", values: [348, 368, 403, 468, 488] },
			{ name: "Stores", values: [393, 439, 439, 444, 454] },
			{ name: "Spares", values: [363, 388, 408, 428, 408] },
			{ name: "Lubricating Oils", values: [273, 278, 283, 293, 293] },
			{ name: "Repair & Maintenance", values: [329, 349, 364, 394, 394] },
			{ name: "Dry-Docking", values: [0, 518, 552, 592, 687] },
			{ name: "Management & Administration", values: [876, 876, 876, 921, 921] },
		],
		totals: [5586, 6220, 6519, 6919, 7214],
	},

	// Index development (example / estimation)
	index: {
		labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		values: [100, 103, 106, 109, 113, 117, 121, 126, 131, 136, 141], // estimation trend
	},

	// YoY by categories (example / estimation)
	categoriesYoY: {
		years: [2020, 2021, 2022, 2023, 2024],
		series: [
			{ name: "Manning", data: [2755, 2755, 2970, 3185, 3400] },
			{ name: "Insurance", data: [315, 335, 365, 425, 445] },
			{ name: "Stores, spares & lubricating oils", data: [930, 1000, 1015, 1050, 1035] },
			{ name: "Repairs & maintenance", data: [300, 320, 330, 360, 360] },
			{ name: "Dry-docking", data: [0, 460, 490, 525, 610] },
			{ name: "Management & administration", data: [790, 790, 790, 830, 830] },
		],
	},

	// Total YoY (estimation)
	totalYoY: {
		years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		totals: [5090, 5660, 5960, 6375, 6680, 6900, 7150, 7400, 7650, 7900],
		pctChange: [4.5, 11.2, 5.3, 7.0, 4.8, 3.3, 3.6, 3.5, 3.4, 3.3],
	},

	// Annual breakdown for 2024
	annual2024: {
		manning: {
			items: [
				{ label: "Officer/rating numbers", value: 17 },
				{ label: "Crew wages & overtime", value: 951518 },
				{ label: "Crew victualling", value: 62700 },
				{ label: "Crew travel", value: 56044 },
				{ label: "Miscellaneous costs", value: 95149 },
			],
			total: 1165411,
		},
		insurance: {
			items: [
				{ label: "Hull & Machinery", value: 55675 },
				{ label: "Protection & Indemnity", value: 82155 },
				{ label: "War Risk", value: 4440 },
				{ label: "FD&D", value: 6050 },
				{ label: "COFR", value: 1205 },
			],
			total: 149525,
		},
		stores: {
			items: [
				{ label: "Deck & Cabin Stores", value: 47297 },
				{ label: "Safety Items/Protective Equipment", value: 42403 },
				{ label: "Chemicals & Gases", value: 14682 },
				{ label: "Medical", value: 6520 },
				{ label: "Mooring Wires & Ropes & Hoses", value: 17819 },
				{ label: "Maintenance Paint", value: 26095 },
				{ label: "Tools & Hardware", value: 4894 },
			],
			total: 159710,
		},
		spares: {
			items: [
				{ label: "Main Propulsion Unit", value: 38605 },
				{ label: "Generator Engines", value: 25244 },
				{ label: "Boilers", value: 8908 },
				{ label: "ER Auxiliary Machinery", value: 25244 },
				{ label: "Deck Machinery", value: 5938 },
				{ label: "Electrical", value: 7423 },
				{ label: "Cargo & Ballast System", value: 11877 },
				{ label: "Pipes & Valves", value: 2969 },
				{ label: "Navigation Equipment", value: 4454 },
				{ label: "Access Equipment", value: 2969 },
				{ label: "Spares Transportation", value: 14856 },
			],
			total: 148477,
		},
		luboils: {
			items: [
				{ label: "ME Cylinder Oil", value: 78362 },
				{ label: "ME System Oil", value: 2947 },
				{ label: "Aux Engine Oil", value: 8325 },
				{ label: "Hydraulic Oils", value: 8218 },
				{ label: "Other Oils", value: 5169 },
			],
			total: 103021,
		},
		repairMaintenance: {
			items: [
				{ label: "Main Engine Inc. Re-Conditioning", value: 25437 },
				{ label: "Boiler", value: 2678 },
				{ label: "Generators", value: 24096 },
				{ label: "ER Auxiliaries", value: 9373 },
				{ label: "Cargo & Ballast System Inc. Calibration", value: 6691 },
				{ label: "Electrical Including Rewinds", value: 9373 },
				{ label: "Pipes & Valves & Hydraulic Systems", value: 6691 },
				{ label: "Deck Machinery Inc. Cranes", value: 9373 },
				{ label: "Navigation Equipment", value: 12051 },
				{ label: "Access Equipment", value: 9373 },
				{ label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 18742 },
			],
			total: 133878,
		},
		intermediateSurvey: {
			items: [{ label: "Intermediate/Special survey", value: 195399 }],
			total: 195399,
		},
		managementAdmin: {
			groups: [
				{
					name: "Fees & Services",
					items: [
						{ label: "Management fee", value: 111580 },
						{ label: "Launches & other transport", value: 15390 },
						{ label: "Flag state inspection, certification & other charges", value: 7695 },
						{ label: "Classification charges", value: 7695 },
						{ label: "PSC charges", value: 2693 },
						{ label: "Third party services", value: 3848 },
						{ label: "Consulting fees", value: 20255 },
						{ label: "Procurement costs", value: 25395 },
						{ label: "Communications, printing, IT & postage", value: 19238 },
						{ label: "Vetting", value: 34628 },
					],
					subTotal: 248417,
				},
				{
					name: "Owner's Costs",
					items: [
						{ label: "Owners disbursement", value: 15390 },
						{ label: "Masters entertainment", value: 3848 },
					],
					subTotal: 19238,
				},
				{
					name: "Safety & Environmental Compliance",
					items: [
						{ label: "Internal auditing & inspection", value: 3848 },
						{ label: "Training", value: 1543 },
						{ label: "Survey & calibration of equipment", value: 15390 },
						{ label: "Incinerator servicing & maintenance", value: 2305 },
						{ label: "OWS servicing & maintenance", value: 5385 },
						{ label: "OCM servicing & maintenance", value: 1543 },
						{ label: "Enviro-logger servicing & maintenance", value: 1926 },
						{ label: "Waste & garbage disposal", value: 15390 },
						{ label: "BWTS servicing & maintenance", value: 5180 },
					],
					subTotal: 52510,
				},
			],
			total: 320165,
		},

		// Final totals
		grandTotal: 2375586,
		perDay: 6520,
		totalExDryDockAnnual: 2179600,
		perDayExDryDock: 5973, // sesuai raw data
		avgUpperRangePerDay: 7938,
		avgLowerRangePerDay: 4911,
	},
};

// Dataset for 12-15k cbm LPG vessel
const vessel12_15k = {
  profile: {
    type: "LPG",
    sectorCbm: "Small Semi-Refrigerated 5",
    globalFleetNo: 33,
    globalFleetCbm: 410678,
    avgAgeYrs: 9.8,
    youngestVesselYrs: 1.4,
    oldestVesselYrs: 28.8,
    avgScrapAgeYrs: 51.4,
    avgSizeCbm: 12445,
    avgLDT: 6863,
    avgBHP: 8288,
    avgGT: 12710,
    profileYear: 2024,
  },

  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [3160, 3160, 3350, 3530, 3720] },
      { name: "Insurance", values: [370, 390, 430, 500, 520] },
      { name: "Stores", values: [410, 450, 450, 460, 470] },
      { name: "Spares", values: [380, 410, 430, 450, 430] },
      { name: "Lubricating Oils", values: [300, 300, 310, 320, 320] },
      { name: "Repair & Maintenance", values: [340, 360, 380, 410, 410] },
      { name: "Dry-Docking", values: [0, 550, 590, 630, 730] },
      { name: "Management & Administration", values: [930, 930, 930, 980, 980] },
    ],
    totals: [5890, 6550, 6870, 7280, 7580],
  },

  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 104.5, 106, 106.5, 107, 110, 113, 115.5, 118, 121, 124],
  },

  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [3500, 3550, 3550, 3550, 3600] },
      { name: "Insurance", data: [200, 210, 220, 230, 240] },
      { name: "Stores, spares & lubricating oils", data: [900, 950, 960, 970, 980] },
      { name: "Repairs & maintenance", data: [300, 310, 320, 325, 330] },
      { name: "Dry-docking", data: [600, 610, 630, 640, 650] },
      { name: "Management & administration", data: [800, 840, 850, 860, 870] },
    ],
  },

  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [6510, 6650, 6700, 6750, 6900, 7050, 7250, 7400, 7550, 7750],
    pctChange: [4.1, 2.05, 0.5, 0.6, 2.4, 2.6, 2.2, 2.1, 2.2, 2.55],
  },

  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 18 },
        { label: "Crew wages & overtime", value: 995710 },
        { label: "Crew victualling", value: 66690 },
        { label: "Crew travel", value: 59210 },
        { label: "Miscellaneous costs", value: 99570 },
      ],
      total: 1221180,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 59150 },
        { label: "Protection & Indemnity", value: 87220 },
        { label: "War Risk", value: 4660 },
        { label: "FD&D", value: 6340 },
        { label: "COFR", value: 1240 },
      ],
      total: 158610,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 48810 },
        { label: "Safety Items/Protective Equipment", value: 43760 },
        { label: "Chemicals & Gases", value: 15150 },
        { label: "Medical", value: 6730 },
        { label: "Mooring Wires & Ropes & Hoses", value: 18390 },
        { label: "Maintenance Paint", value: 26930 },
        { label: "Tools & Hardware", value: 5050 },
      ],
      total: 164820,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 40560 },
        { label: "Generator Engines", value: 26520 },
        { label: "Boilers", value: 9360 },
        { label: "ER Auxiliary Machinery", value: 26520 },
        { label: "Deck Machinery", value: 6240 },
        { label: "Electrical", value: 7800 },
        { label: "Cargo & Ballast System", value: 12480 },
        { label: "Pipes & Valves", value: 3120 },
        { label: "Navigation Equipment", value: 4680 },
        { label: "Access Equipment", value: 3120 },
        { label: "Spares Transportation", value: 15600 },
      ],
      total: 156000,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 85410 },
        { label: "ME System Oil", value: 3270 },
        { label: "Aux Engine Oil", value: 9030 },
        { label: "Hydraulic Oils", value: 8800 },
        { label: "Other Oils", value: 5530 },
        { label: "Gas & Reefer Compressors Oils", value: 790 },
      ],
      total: 112830,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 26460 },
        { label: "Boiler", value: 2780 },
        { label: "Generators", value: 25060 },
        { label: "ER Auxiliaries", value: 9750 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 6960 },
        { label: "Electrical Including Rewinds", value: 9750 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 6960 },
        { label: "Deck Machinery Inc. Cranes", value: 9750 },
        { label: "Navigation Equipment", value: 12530 },
        { label: "Access Equipment", value: 9750 },
        { label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 19490 },
      ],
      total: 139240,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 214100 }],
      total: 214100,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 118650 },
            { label: "Launches & other transport", value: 16370 },
            { label: "Flag state inspection, certification & other charges", value: 8180 },
            { label: "Classification charges", value: 8180 },
            { label: "PSC charges", value: 2860 },
            { label: "Third party services", value: 4090 },
            { label: "Consulting fees", value: 20890 },
            { label: "Procurement costs", value: 27000 },
            { label: "Communications, printing, IT & postage", value: 20460 },
            { label: "Vetting", value: 36820 },
          ],
          subCosts: 263500,
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 16370 },
            { label: "Masters entertainment", value: 4090 },
          ],
          subCosts: 20460,
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 4090 },
            { label: "Training", value: 1640 },
            { label: "Survey & calibration of equipment", value: 16370 },
            { label: "Incinerator servicing & maintenance", value: 2450 },
            { label: "OWS servicing & maintenance", value: 5730 },
            { label: "OCM servicing & maintenance", value: 1640 },
            { label: "Enviro-logger servicing & maintenance", value: 2050 },
            { label: "Waste & garbage disposal", value: 16370 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
          subCosts: 55520,
        },
      ],
      total: 339480,
    },
    grandTotal: 2506260,
    perDay: 6870,
    perDayExDryDock: 6280,
    totalExDryDockAnnual: 2292160,
    avgUpperRangePerDay: 8800,
    avgLowerRangePerDay: 5530,
  },
};

// Dataset for 15-30k cbm LPG vessel (Estimation)
const vessel15_30k = {
  isEstimate: true,
  profile: {
    type: "LPG",
    sectorCbm: "Medium Fully Refrigerated",
    globalFleetNo: null,
    globalFleetCbm: null,
    avgAgeYrs: null,
    youngestVesselYrs: null,
    oldestVesselYrs: null,
    avgScrapAgeYrs: null,
    avgSizeCbm: 22763,
    avgLDT: 8717,
    avgBHP: 9892,
    avgGT: 17741,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [3616, 3616, 3810, 3999, 4193] },
      { name: "Insurance", values: [403, 428, 472, 546, 566] },
      { name: "Stores", values: [431, 475, 475, 485, 495] },
      { name: "Spares", values: [397, 427, 447, 471, 447] },
      { name: "Lubricating Oils", values: [350, 350, 360, 370, 370] },
      { name: "Repair & Maintenance", values: [357, 377, 397, 427, 427] },
      { name: "Dry-Docking", values: [0, 575, 615, 663, 768] },
      { name: "Management & Administration", values: [972, 972, 972, 1022, 1022] },
    ],
    totals: [6526, 7220, 7548, 7983, 8288],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 104, 108, 112, 116, 120, 124, 128, 133, 138, 143], // estimasi tren naik
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [3616, 3616, 3810, 3999, 4193] },
      { name: "Insurance", data: [403, 428, 472, 546, 566] },
      { name: "Stores, spares & luboils", data: [1178, 1252, 1282, 1326, 1312] }, 
      { name: "Repairs & maintenance", data: [357, 377, 397, 427, 427] },
      { name: "Dry-docking", data: [0, 575, 615, 663, 768] },
      { name: "Management & administration", data: [972, 972, 972, 1022, 1022] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [6526, 7220, 7548, 7983, 8288, 8500, 8750, 9000, 9250, 9500], // estimasi tren naik
    pctChange: [5.5, 10.6, 4.5, 5.8, 3.8, 2.6, 2.9, 2.9, 2.8, 2.7],
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 20 },
        { label: "Crew wages & overtime", value: 1130647 },
        { label: "Crew victualling", value: 72890 },
        { label: "Crew travel", value: 73028 },
        { label: "Miscellaneous costs", value: 113066 },
      ],
      total: 1389631,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 65505 },
        { label: "Protection & Indemnity", value: 96764 },
        { label: "War Risk", value: 5246 },
        { label: "FD&D", value: 7075 },
        { label: "COFR", value: 1394 },
      ],
      total: 175984,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 50748 },
        { label: "Safety Items/Protective Equipment", value: 45497 },
        { label: "Chemicals & Gases", value: 15753 },
        { label: "Medical", value: 6998 },
        { label: "Mooring Wires & Ropes & Hoses", value: 20927 },
        { label: "Maintenance Paint", value: 28002 },
        { label: "Tools & Hardware", value: 5251 },
      ],
      total: 173176,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 42339 },
        { label: "Generator Engines", value: 27684 },
        { label: "Boilers", value: 9770 },
        { label: "ER Auxiliary Machinery", value: 27684 },
        { label: "Deck Machinery", value: 6512 },
        { label: "Electrical", value: 8143 },
        { label: "Cargo & Ballast System", value: 13028 },
        { label: "Pipes & Valves", value: 3258 },
        { label: "Navigation Equipment", value: 4885 },
        { label: "Access Equipment", value: 3258 },
        { label: "Spares Transportation", value: 16282 },
      ],
      total: 162843,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 99793 },
        { label: "ME System Oil", value: 4061 },
        { label: "Aux Engine Oil", value: 10617 },
        { label: "Hydraulic Oils", value: 9763 },
        { label: "Other Oils", value: 6028 },
        { label: "Gas & Reefer Compressors Oils", value: 786 },
      ],
      total: 131048,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 27565 },
        { label: "Boiler", value: 2897 },
        { label: "Generators", value: 26111 },
        { label: "ER Auxiliaries", value: 10156 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 7253 },
        { label: "Electrical Including Rewinds", value: 10156 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 7253 },
        { label: "Deck Machinery Inc. Cranes", value: 10156 },
        { label: "Navigation Equipment", value: 13053 },
        { label: "Access Equipment", value: 10156 },
        { label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 20306 },
      ],
      total: 145062,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 224280 }],
      total: 224280,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 124226 },
            { label: "Launches & other transport", value: 17136 },
            { label: "Flag state inspection, certification & other charges", value: 8565 },
            { label: "Classification charges", value: 8565 },
            { label: "PSC charges", value: 2998 },
            { label: "Third party services", value: 4283 },
            { label: "Consulting fees", value: 21388 },
            { label: "Procurement costs", value: 28268 },
            { label: "Communications, printing, IT & postage", value: 21419 },
            { label: "Vetting", value: 38553 },
          ],
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 17136 },
            { label: "Masters entertainment", value: 4283 },
          ],
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 4283 },
            { label: "Training", value: 1715 },
            { label: "Survey & calibration of equipment", value: 17136 },
            { label: "Incinerator servicing & maintenance", value: 2567 },
            { label: "OWS servicing & maintenance", value: 5998 },
            { label: "OCM servicing & maintenance", value: 1715 },
            { label: "Enviro-logger servicing & maintenance", value: 2146 },
            { label: "Waste & garbage disposal", value: 17136 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
        },
      ],
      total: 354696,
    },
    grandTotal: 2756720,
    perDay: 7548,
    perDayExDryDock: 6929,
    totalExDryDockAnnual: 2529329,
    avgUpperRangePerDay: 8620,
    avgLowerRangePerDay: 6078,
  },
};

// Dataset for 30-40k cbm LPG vessel
const vessel30_40k = {
  profile: {
    type: "LPG",
    sectorCbm: "Medium Fully Refrigerated",
    globalFleetNo: 114,
    globalFleetCbm: 4228821,
    avgAgeYrs: 12.1,
    youngestVesselYrs: 1.4,
    oldestVesselYrs: 31.2,
    avgScrapAgeYrs: 30.8,
    avgSizeCbm: 37095,
    avgLDT: 11292,
    avgBHP: 12121,
    avgGT: 24729,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [4250, 4250, 4450, 4650, 4850] },
      { name: "Insurance", values: [450, 480, 530, 610, 630] },
      { name: "Stores", values: [460, 510, 510, 520, 530] },
      { name: "Spares", values: [420, 450, 470, 500, 470] },
      { name: "Lubricating Oils", values: [420, 420, 430, 440, 440] },
      { name: "Repair & Maintenance", values: [380, 400, 420, 450, 450] },
      { name: "Dry-Docking", values: [0, 610, 650, 710, 820] },
      { name: "Management & Administration", values: [1030, 1030, 1030, 1080, 1080] },
    ],
    totals: [7410, 8150, 8490, 8960, 9270],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 104, 106, 106.5, 108, 110.5, 114, 116.5, 119, 122, 124.7],
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [4300, 4350, 4350, 4350, 4400] },
      { name: "Insurance", data: [400, 420, 460, 460, 500] },
      { name: "Stores, spares & lubricating oils", data: [1350, 1350, 1350, 1450, 1500] },
      { name: "Repairs & maintenance", data: [400, 420, 420, 420, 420] },
      { name: "Dry-docking", data: [580, 580, 580, 580, 580] },
      { name: "Management & administration", data: [950, 950, 950, 950, 950] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [8030, 8200, 8250, 8300, 8490, 8700, 8900, 9100, 9350, 9550],
    pctChange: [4.45, 1.8, 0.6, 0.7, 2.6, 2.8, 2.2, 2.0, 2.4, 2.7],
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 22 },
        { label: "Crew wages & overtime", value: 1318060 },
        { label: "Crew victualling", value: 81500 },
        { label: "Crew travel", value: 92220 },
        { label: "Miscellaneous costs", value: 131810 },
      ],
      total: 1623590,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 71860 },
        { label: "Protection & Indemnity", value: 105950 },
        { label: "War Risk", value: 5660 },
        { label: "FD&D", value: 7710 },
        { label: "COFR", value: 1500 },
      ],
      total: 192680,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 53440 },
        { label: "Safety Items/Protective Equipment", value: 47910 },
        { label: "Chemicals & Gases", value: 16590 },
        { label: "Medical", value: 7370 },
        { label: "Mooring Wires & Ropes & Hoses", value: 24450 },
        { label: "Maintenance Paint", value: 29490 },
        { label: "Tools & Hardware", value: 5530 },
      ],
      total: 184780,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 44810 },
        { label: "Generator Engines", value: 29300 },
        { label: "Boilers", value: 10340 },
        { label: "ER Auxiliary Machinery", value: 29300 },
        { label: "Deck Machinery", value: 6890 },
        { label: "Electrical", value: 8620 },
        { label: "Cargo & Ballast System", value: 13790 },
        { label: "Pipes & Valves", value: 3450 },
        { label: "Navigation Equipment", value: 5170 },
        { label: "Access Equipment", value: 3450 },
        { label: "Spares Transportation", value: 17230 },
      ],
      total: 172350,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 119770 },
        { label: "ME System Oil", value: 5160 },
        { label: "Aux Engine Oil", value: 12820 },
        { label: "Hydraulic Oils", value: 11100 },
        { label: "Other Oils", value: 6720 },
        { label: "Gas & Reefer Compressors Oil", value: 780 },
      ],
      total: 156350,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 29100 },
        { label: "Boiler", value: 3060 },
        { label: "Generators", value: 27570 },
        { label: "ER Auxiliaries", value: 10720 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 7660 },
        { label: "Electrical Including Rewinds", value: 10720 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 7660 },
        { label: "Deck Machinery Inc. Cranes", value: 10720 },
        { label: "Navigation Equipment", value: 13780 },
        { label: "Access Equipment", value: 10720 },
        { label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 21440 },
      ],
      total: 153150,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 238420 }],
      total: 238420,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 131970 },
            { label: "Launches & other transport", value: 18200 },
            { label: "Flag state inspection, certification & other charges", value: 9100 },
            { label: "Classification charges", value: 9100 },
            { label: "PSC charges", value: 3190 },
            { label: "Third party services", value: 4550 },
            { label: "Consulting fees", value: 22080 },
            { label: "Procurement costs", value: 30030 },
            { label: "Communications, printing, IT & postage", value: 22750 },
            { label: "Vetting", value: 40960 },
          ],
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 18200 },
            { label: "Masters entertainment", value: 4550 },
          ],
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 4550 },
            { label: "Training", value: 1820 },
            { label: "Survey & calibration of equipment", value: 18200 },
            { label: "Incinerator servicing & maintenance", value: 2730 },
            { label: "OWS servicing & maintenance", value: 6370 },
            { label: "OCM servicing & maintenance", value: 1820 },
            { label: "Envirologger servicing & maintenance", value: 2280 },
            { label: "Waste & garbage disposal", value: 18200 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
        },
      ],
      total: 375830,
    },
    grandTotal: 3097150,
    perDay: 8490,
    perDayExDryDock: 7830,
    totalExDryDockAnnual: 2858730,
    avgUpperRangePerDay: 8370,
    avgLowerRangePerDay: 6840,
  },
};

// Dataset for 40-50k cbm LPG vessel (Estimation)
const vessel40_50k = {
  isEstimate: true,
  profile: {
    type: "LPG",
    sectorCbm: "Medium Fully Refrigerated",
    globalFleetNo: null,
    globalFleetCbm: null,
    avgAgeYrs: null,
    youngestVesselYrs: null,
    oldestVesselYrs: null,
    avgScrapAgeYrs: null,
    avgSizeCbm: 46196,
    avgLDT: 12895,
    avgBHP: 13302,
    avgGT: 29247,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [4250, 4250, 4450, 4650, 4850] },
      { name: "Insurance", values: [478, 508, 562, 650, 674] },
      { name: "Stores", values: [476, 530, 530, 540, 550] },
      { name: "Spares", values: [440, 470, 490, 520, 490] },
      { name: "Lubricating Oils", values: [436, 436, 446, 456, 460] },
      { name: "Repair & Maintenance", values: [396, 416, 436, 470, 470] },
      { name: "Dry-Docking", values: [0, 642, 682, 742, 856] },
      { name: "Management & Administration", values: [1054, 1054, 1054, 1104, 1104] },
    ],
    totals: [7530, 8306, 8650, 9132, 9454],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 103, 106, 109, 113, 117, 121, 126, 131, 136, 141], // estimasi
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [4250, 4250, 4450, 4650, 4850] },
      { name: "Insurance", data: [478, 508, 562, 650, 674] },
      { name: "Stores, spares & lubricating oils", data: [1352, 1436, 1466, 1516, 1500] },
      { name: "Repairs & maintenance", data: [396, 416, 436, 470, 470] },
      { name: "Dry-docking", data: [0, 642, 682, 742, 856] },
      { name: "Management & administration", data: [1054, 1054, 1054, 1104, 1104] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [7530, 8306, 8650, 9132, 9454, 9700, 9950, 10200, 10450, 10700], // estimasi tren naik
    pctChange: [3.5, 10.3, 4.1, 5.6, 3.5, 2.6, 2.6, 2.5, 2.4, 2.4], // estimasi
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 22 },
        { label: "Crew wages & overtime", value: 1318060 },
        { label: "Crew victualling", value: 81500 },
        { label: "Crew travel", value: 92220 },
        { label: "Miscellaneous costs", value: 131810 },
      ],
      total: 1623590,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 71860 },
        { label: "Protection & Indemnity", value: 105950 },
        { label: "War Risk", value: 5660 },
        { label: "FD&D", value: 7710 },
        { label: "COFR", value: 1500 },
      ],
      total: 192680,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 55632 },
        { label: "Safety Items/Protective Equipment", value: 49878 },
        { label: "Chemicals & Gases", value: 17270 },
        { label: "Medical", value: 7674 },
        { label: "Mooring Wires & Ropes & Hoses", value: 25562 },
        { label: "Maintenance Paint", value: 30698 },
        { label: "Tools & Hardware", value: 5758 },
      ],
      total: 192472,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 46682 },
        { label: "Generator Engines", value: 30524 },
        { label: "Boilers", value: 10772 },
        { label: "ER Auxiliary Machinery", value: 30524 },
        { label: "Deck Machinery", value: 7178 },
        { label: "Electrical", value: 8980 },
        { label: "Cargo & Ballast System", value: 14366 },
        { label: "Pipes & Valves", value: 3594 },
        { label: "Navigation Equipment", value: 5386 },
        { label: "Access Equipment", value: 3594 },
        { label: "Spares Transportation", value: 17950 },
      ],
      total: 179550,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 124882 },
        { label: "ME System Oil", value: 5444 },
        { label: "Aux Engine Oil", value: 13352 },
        { label: "Hydraulic Oils", value: 11424 },
        { label: "Other Oils", value: 7000 },
        { label: "Gas & Reefer Compressors Oil", value: 744 },
      ],
      total: 162846,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 30324 },
        { label: "Boiler", value: 3192 },
        { label: "Generators", value: 28730 },
        { label: "ER Auxiliaries", value: 11172 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 7980 },
        { label: "Electrical Including Rewinds", value: 11172 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 7980 },
        { label: "Deck Machinery Inc. Cranes", value: 11172 },
        { label: "Navigation Equipment", value: 14360 },
        { label: "Access Equipment", value: 11172 },
        { label: "LSA & FFE", value: 22344 },
      ],
      total: 159598,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special Survey", value: 249792 }],
      total: 249792,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 135074 },
            { label: "Launches & other transport", value: 18628 },
            { label: "Flag state inspection, certification & other charges", value: 9316 },
            { label: "Classification charges", value: 9316 },
            { label: "PSC charges", value: 3262 },
            { label: "Third party services", value: 4658 },
            { label: "Consulting fees", value: 22360 },
            { label: "Procurement costs", value: 30738 },
            { label: "Communications, printing, IT & postage", value: 23286 },
            { label: "Vetting", value: 41920 },
          ],
          subCosts: 298558,
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 18628 },
            { label: "Masters entertainment", value: 4658 },
          ],
          subCosts: 23286,
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 4658 },
            { label: "Training", value: 1864 },
            { label: "Survey & calibration of equipment", value: 18628 },
            { label: "Incinerator servicing & maintenance", value: 2794 },
            { label: "OWS servicing & maintenance", value: 6522 },
            { label: "OCM servicing & maintenance", value: 1864 },
            { label: "Enviro-logger servicing & maintenance", value: 2332 },
            { label: "Waste & garbage disposal", value: 18628 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
          subCosts: 62470,
        },
      ],
      total: 384314,
    },
    grandTotal: 3144842,
    perDay: 8650,
    perDayExDryDock: 7966,
    totalExDryDockAnnual: 2907746,
    avgUpperRangePerDay: 8658,
    avgLowerRangePerDay: 7032,
  },
};

// Dataset for 50-70k cbm LPG vessel
const vessel50_70k = {
  profile: {
    type: "LPG",
    sectorCbm: "Medium Fully Refrigerated",
    globalFleetNo: 21,
    globalFleetCbm: 1256817,
    avgAgeYrs: 16.3,
    youngestVesselYrs: 8,
    oldestVesselYrs: 21.5,
    avgScrapAgeYrs: null, // n/a in raw data
    avgSizeCbm: 59848,
    avgLDT: 15301,
    avgBHP: 15075,
    avgGT: 36025,
    profileYear: 2024,
  },

  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [4250, 4250, 4450, 4650, 4850] },
      { name: "Insurance", values: [520, 550, 610, 710, 740] },
      { name: "Stores", values: [500, 560, 560, 570, 580] },
      { name: "Spares", values: [470, 500, 520, 550, 520] },
      { name: "Lubricating Oils", values: [460, 460, 470, 480, 490] },
      { name: "Repair & Maintenance", values: [420, 440, 460, 500, 500] },
      { name: "Dry-Docking", values: [0, 690, 730, 790, 910] },
      { name: "Management & Administration", values: [1090, 1090, 1090, 1140, 1140] },
    ],
    totals: [7710, 8540, 8890, 9390, 9730],
  },

  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 104, 106, 107, 108, 110.5, 114, 117, 119.5, 122, 124.8],
  },

  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [4300, 4350, 4250, 4250, 4400] },
      { name: "Insurance", data: [400, 420, 430, 440, 450] },
      { name: "Stores, spares & lubricating oils", data: [1400, 1450, 1550, 1550, 1600] },
      { name: "Repairs & maintenance", data: [500, 520, 540, 560, 570] },
      { name: "Dry-docking", data: [750, 720, 740, 740, 750] },
      { name: "Management & administration", data: [800, 820, 840, 860, 880] },
    ],
  },

  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [8400, 8550, 8600, 8700, 8900, 9120, 9420, 9520, 9750, 10030],
    pctChange: [4.2, 2.2, 0.65, 1.15, 2.15, 2.7, 2.77, 1.97, 2.4, 2.55],
  },

  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 22 },
        { label: "Crew wages & overtime", value: 1318060 },
        { label: "Crew victualling", value: 81500 },
        { label: "Crew travel", value: 92220 },
        { label: "Miscellaneous costs", value: 131810 },
      ],
      total: 1623590,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 83690 },
        { label: "Protection & Indemnity", value: 123410 },
        { label: "War Risk", value: 6590 },
        { label: "FD&D", value: 8980 },
        { label: "COFR", value: 1750 },
      ],
      total: 224420,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 58920 },
        { label: "Safety Items/Protective Equipment", value: 52830 },
        { label: "Chemicals & Gases", value: 18290 },
        { label: "Medical", value: 8130 },
        { label: "Mooring Wires & Ropes & Hoses", value: 27230 },
        { label: "Maintenance Paint", value: 32510 },
        { label: "Tools & Hardware", value: 6100 },
      ],
      total: 204010,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 49490 },
        { label: "Generator Engines", value: 32360 },
        { label: "Boilers", value: 11420 },
        { label: "ER Auxiliary Machinery", value: 32360 },
        { label: "Deck Machinery", value: 7610 },
        { label: "Electrical", value: 9520 },
        { label: "Cargo & Ballast System", value: 15230 },
        { label: "Pipes & Valves", value: 3810 },
        { label: "Navigation Equipment", value: 5710 },
        { label: "Access Equipment", value: 3810 },
        { label: "Spares Transportation", value: 19030 },
      ],
      total: 190350,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 132550 },
        { label: "ME System Oil", value: 5870 },
        { label: "Aux Engine Oil", value: 14150 },
        { label: "Hydraulic Oils", value: 11910 },
        { label: "Other Oils", value: 7420 },
        { label: "Gas & Reefer Compressors Oils", value: 690 },
      ],
      total: 172590,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine Inc. Re-Conditioning", value: 32160 },
        { label: "Boiler", value: 3390 },
        { label: "Generators", value: 30470 },
        { label: "ER Auxiliaries", value: 11850 },
        { label: "Cargo & Ballast System Inc. Calibration", value: 8460 },
        { label: "Electrical Including Rewinds", value: 11850 },
        { label: "Pipes & Valves & Hydraulic Systems", value: 8460 },
        { label: "Deck Machinery Inc. Cranes", value: 11850 },
        { label: "Navigation Equipment", value: 15230 },
        { label: "Access Equipment", value: 11850 },
        { label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 23700 },
      ],
      total: 169270,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 266850 }],
      total: 266850,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 139730 },
            { label: "Launches & other transport", value: 19270 },
            { label: "Flag state inspection, certification & other charges", value: 9640 },
            { label: "Classification charges", value: 9640 },
            { label: "PSC charges", value: 3370 },
            { label: "Third party services", value: 4820 },
            { label: "Consulting fees", value: 22780 },
            { label: "Procurement costs", value: 31800 },
            { label: "Communications, printing, IT & postage", value: 24090 },
            { label: "Vetting", value: 43360 },
          ],
          subCosts: 308500,
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 19270 },
            { label: "Masters entertainment", value: 4820 },
          ],
          subCosts: 24090,
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 4820 },
            { label: "Training", value: 1930 },
            { label: "Survey & calibration of equipment", value: 19270 },
            { label: "Incinerator servicing & maintenance", value: 2890 },
            { label: "OWS servicing & maintenance", value: 6750 },
            { label: "OCM servicing & maintenance", value: 1930 },
            { label: "Envirologger servicing & maintenance", value: 2410 },
            { label: "Waste & garbage disposal", value: 19270 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
          subCosts: 64450,
        },
      ],
      total: 397040,
    },

    grandTotal: 3248120,
    perDay: 8890,
    perDayExDryDock: 8170,
    totalExDryDockAnnual: 2981270,
    avgUpperRangePerDay: 9090,
    avgLowerRangePerDay: 7320,
  },
};

// Dataset for 70-80k cbm LPG vessel (Estimation)
const vessel70_80k = {
	isEstimate: true,
	profile: {
		type: "LPG",
		sectorCbm: "Large Fully Refrigerated",
		globalFleetNo: null,
		globalFleetCbm: null,
		avgAgeYrs: null,
		youngestVesselYrs: null,
		oldestVesselYrs: null,
		avgScrapAgeYrs: null,
		avgSizeCbm: 75200,
		avgLDT: 17683,
		avgBHP: 16998,
		avgGT: 44069,
		profileYear: 2024,
	},
	byAgeDaily: {
		labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
		items: [
			{ name: "Manning", values: [4442, 4442, 4636, 4830, 5024] },
			{ name: "Insurance", values: [568, 604, 670, 770, 806] },
			{ name: "Stores", values: [524, 584, 584, 594, 604] },
			{ name: "Spares", values: [500, 530, 556, 586, 556] },
			{ name: "Lubricating Oils", values: [508, 514, 524, 534, 544] },
			{ name: "Repair & Maintenance", values: [438, 464, 484, 524, 524] },
			{ name: "Dry-Docking", values: [0, 732, 778, 838, 970] },
			{ name: "Management & Administration", values: [1132, 1132, 1132, 1188, 1188] },
		],
		totals: [8112, 9002, 9364, 9864, 10216],
	},
	index: {
		labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		values: [100, 103, 106, 109, 113, 117, 121, 126, 131, 136, 141], // estimasi tren
	},
	categoriesYoY: {
		years: [2020, 2021, 2022, 2023, 2024],
		series: [
			{ name: "Manning", data: [4442, 4442, 4636, 4830, 5024] },
			{ name: "Insurance", data: [568, 604, 670, 770, 806] },
			{ name: "Stores, spares & luboils", data: [1532, 1628, 1664, 1714, 1704] },
			{ name: "Repairs & maintenance", data: [438, 464, 484, 524, 524] },
			{ name: "Dry-docking", data: [0, 732, 778, 838, 970] },
			{ name: "Management & administration", data: [1132, 1132, 1132, 1188, 1188] },
		],
	},
	totalYoY: {
		years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		totals: [8112, 9002, 9364, 9864, 10216, 10500, 10800, 11100, 11400, 11700], // estimasi naik
		pctChange: [4.0, 11.0, 4.0, 5.3, 3.6, 2.8, 2.9, 2.8, 2.7, 2.6], // tren estimasi
	},
	annual2024: {
		manning: {
			items: [
				{ label: "Officer/rating numbers", value: 24 },
				{ label: "Crew wages & overtime", value: 1370038 },
				{ label: "Crew victualling", value: 88172 },
				{ label: "Crew travel", value: 97032 },
				{ label: "Miscellaneous costs", value: 137006 },
			],
			total: 1692248,
		},
		insurance: {
			items: [
				{ label: "Hull & Machinery", value: 90005 },
				{ label: "Protection & Indemnity", value: 129185 },
				{ label: "War Risk", value: 7260 },
				{ label: "FD&D", value: 8615 },
				{ label: "COFR", value: 1865 },
			],
			total: 236930,
		},
		stores: {
			items: [
				{ label: "Deck & Cabin Stores", value: 61674 },
				{ label: "Safety Items/Protective Equipment", value: 55296 },
				{ label: "Chemicals & Gases", value: 19142 },
				{ label: "Medical", value: 8508 },
				{ label: "Mooring Wires & Ropes & Hoses", value: 27974 },
				{ label: "Maintenance Paint", value: 34028 },
				{ label: "Tools & Hardware", value: 6382 },
			],
			total: 213004,
		},
		spares: {
			items: [
				{ label: "Main Propulsion Unit", value: 52922 },
				{ label: "Generator Engines", value: 34604 },
				{ label: "Boilers", value: 12212 },
				{ label: "ER Auxiliary Machinery", value: 34604 },
				{ label: "Deck Machinery", value: 8138 },
				{ label: "Electrical", value: 10180 },
				{ label: "Cargo & Ballast System", value: 16286 },
				{ label: "Pipes & Valves", value: 4074 },
				{ label: "Navigation Equipment", value: 6106 },
				{ label: "Access Equipment", value: 4074 },
				{ label: "Spares Transportation", value: 20350 },
			],
			total: 203550,
		},
		luboils: {
			items: [
				{ label: "ME Cylinder Oil", value: 147442 },
				{ label: "ME System Oil", value: 6998 },
				{ label: "Aux Engine Oil", value: 15812 },
				{ label: "Hydraulic Oils", value: 12594 },
				{ label: "Other Oils", value: 7738 },
				{ label: "Gas & Reefer Compressors Oils", value: 768 },
			],
			total: 191352,
		},
		repairMaintenance: {
			items: [
				{ label: "Main Engine Inc. Re-Conditioning", value: 33714 },
				{ label: "Boiler", value: 3552 },
				{ label: "Generators", value: 31940 },
				{ label: "ER Auxiliaries", value: 12420 },
				{ label: "Cargo & Ballast System Inc. Calibration", value: 8868 },
				{ label: "Electrical Including Rewinds", value: 12420 },
				{ label: "Pipes & Valves & Hydraulic Systems", value: 8868 },
				{ label: "Deck Machinery Inc. Cranes", value: 12420 },
				{ label: "Navigation Equipment", value: 15968 },
				{ label: "Access Equipment", value: 12420 },
				{ label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 24840 },
			],
			total: 177430,
		},
		intermediateSurvey: {
			items: [{ label: "Intermediate/Special Survey", value: 283914 }],
			total: 283914,
		},
		managementAdmin: {
			groups: [
				{
					name: "Fees & Services",
					items: [
						{ label: "Management fee", value: 144356 },
						{ label: "Launches & other transport", value: 19912 },
						{ label: "Flag state inspection, certification & other charges", value: 9958 },
						{ label: "Classification charges", value: 9958 },
						{ label: "PSC charges", value: 3484 },
						{ label: "Third party services", value: 4976 },
						{ label: "Consulting fees", value: 26272 },
						{ label: "Procurement costs", value: 32850 },
						{ label: "Communications, printing, IT & postage", value: 24888 },
						{ label: "Vetting", value: 44800 },
					],
					subCosts: 321454,
				},
				{
					name: "Owner's Costs",
					items: [
						{ label: "Owners disbursement", value: 19912 },
						{ label: "Masters entertainment", value: 4976 },
					],
					subCosts: 24888,
				},
				{
					name: "Safety & Environmental Compliance",
					items: [
						{ label: "Internal auditing & inspection", value: 4976 },
						{ label: "Training", value: 1990 },
						{ label: "Survey & calibration of equipment", value: 19912 },
						{ label: "Incinerator servicing & maintenance", value: 2986 },
						{ label: "OWS servicing & maintenance", value: 6972 },
						{ label: "OCM servicing & maintenance", value: 1990 },
						{ label: "Enviro-logger servicing & maintenance", value: 2488 },
						{ label: "Waste & garbage disposal", value: 19912 },
						{ label: "BWTS servicing & maintenance", value: 5180 },
					],
					subCosts: 66406,
				},
			],
			total: 412748,
		},
		grandTotal: 3411176,
		perDay: 9364,
		perDayExDryDock: 8590,
		totalExDryDockAnnual: 3135062,
		avgUpperRangePerDay: 9498,
		avgLowerRangePerDay: 7530,
	},
};

// Dataset for 80k cbm LPG vessel
const vessel80k = {
  profile: {
    type: "LPG",
    sectorCbm: "Large Fully Refrigerated",
    globalFleetNo: 356,
    globalFleetCbm: 30415028,
    avgAgeYrs: 7.9,
    youngestVesselYrs: "<0.1",
    oldestVesselYrs: 31.8,
    avgScrapAgeYrs: null,
    avgSizeCbm: 85435,
    avgLDT: 19271,
    avgBHP: 18281,
    avgGT: 49432,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
    items: [
      { name: "Manning", values: [4570, 4570, 4760, 4950, 5140] },
      { name: "Insurance", values: [600, 640, 710, 810, 850] },
      { name: "Stores", values: [540, 600, 600, 610, 620] },
      { name: "Spares", values: [520, 550, 580, 610, 580] },
      { name: "Lubricating Oils", values: [540, 550, 560, 570, 580] },
      { name: "Repair & Maintenance", values: [450, 480, 500, 540, 540] },
      { name: "Dry-Docking", values: [0, 760, 810, 870, 1010] },
      { name: "Management & Administration", values: [1160, 1160, 1160, 1220, 1220] },
    ],
    totals: [8380, 9310, 9680, 10180, 10540],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 104.5, 106.5, 107.5, 108, 111, 114, 117, 119.7, 123, 125.5],
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [4600, 4700, 4700, 4800, 4900] },
      { name: "Insurance", data: [500, 550, 570, 600, 620] },
      { name: "Stores, spares & lubricating oils", data: [1600, 1650, 1700, 1720, 1750] },
      { name: "Repairs & maintenance", data: [450, 470, 470, 480, 490] },
      { name: "Dry-docking", data: [820, 830, 840, 850, 860] },
      { name: "Management & administration", data: [900, 950, 970, 990, 1010] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [9100, 9300, 9400, 9450, 9650, 9970, 10150, 10400, 10600, 10950],
    pctChange: [4.3, 2.1, 1.0, 0.4, 2.55, 2.9, 2.0, 2.2, 2.4, 2.9],
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 25 },
        { label: "Crew wages & overtime", value: 1404690 },
        { label: "Crew victualling", value: 92620 },
        { label: "Crew travel", value: 100240 },
        { label: "Miscellaneous costs", value: 140470 },
      ],
      total: 1738020,
    },
    insurance: {
      items: [
        { label: "Hull & machinery", value: 96320 },
        { label: "Protection & indemnity", value: 142020 },
        { label: "War risk", value: 7590 },
        { label: "FD&D", value: 10330 },
        { label: "COFR", value: 2010 },
      ],
      total: 258270,
    },
    stores: {
      items: [
        { label: "Deck & cabin stores", value: 63510 },
        { label: "Safety items/protective equipment", value: 56940 },
        { label: "Chemicals & gases", value: 19710 },
        { label: "Medical", value: 8760 },
        { label: "Mooring wires & ropes & hoses", value: 28470 },
        { label: "Maintenance paint", value: 35040 },
        { label: "Tools & hardware", value: 6570 },
      ],
      total: 219000,
    },
    spares: {
      items: [
        { label: "Main propulsion unit", value: 52342 },
        { label: "Generator engines", value: 32621 },
        { label: "Boilers", value: 67370 },
        { label: "ER auxiliary machinery", value: 39007 },
        { label: "Deck machinery", value: 26459 },
        { label: "Electrical", value: 23498 },
        { label: "Cargo & ballast system", value: 31633 },
        { label: "Pipes & valves", value: 21749 },
        { label: "Navigation equipment", value: 8158 },
        { label: "Access equipment", value: 5440 },
        { label: "Spares transportation", value: 23570 },
      ],
      total: 331847,
    },
    luboils: {
      items: [
        { label: "ME cylinder oil", value: 157370 },
        { label: "ME system oil", value: 7750 },
        { label: "Aux engine oil", value: 16920 },
        { label: "Hydraulic oils", value: 13050 },
        { label: "Other oils", value: 7950 },
        { label: "Gas & reefer compressors oils", value: 820 },
      ],
      total: 203860,
    },
    repairMaintenance: {
      items: [
        { label: "Main engine inc. re-conditioning", value: 34750 },
        { label: "Boiler", value: 3660 },
        { label: "Generators", value: 32920 },
        { label: "ER auxiliaries", value: 12800 },
        { label: "Cargo & ballast system inc. calibration", value: 9140 },
        { label: "Electrical including rewinds", value: 12800 },
        { label: "Pipes & valves & hydraulic systems", value: 9140 },
        { label: "Deck machinery inc. cranes", value: 12800 },
        { label: "Navigation equipment", value: 16460 },
        { label: "Access equipment", value: 12800 },
        { label: "LSA & FFE", value: 25600 },
      ],
      total: 182870,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 295290 }],
      total: 295290,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 147440 },
            { label: "Launches & other transport", value: 20340 },
            { label: "Flag state inspection, certification & other charges", value: 10170 },
            { label: "Classification charges", value: 10170 },
            { label: "PSC charges", value: 3560 },
            { label: "Third party services", value: 5080 },
            { label: "Consulting fees", value: 28600 },
            { label: "Procurement costs", value: 33550 },
            { label: "Communications, printing, IT & postage", value: 25420 },
            { label: "Vetting", value: 45760 },
          ],
          subCosts: 330090,
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 20340 },
            { label: "Masters entertainment", value: 5080 },
          ],
          subCosts: 25420,
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 5080 },
            { label: "Training", value: 2030 },
            { label: "Survey & calibration of equipment", value: 20340 },
            { label: "Incinerator servicing & maintenance", value: 3050 },
            { label: "OWS servicing & maintenance", value: 7120 },
            { label: "OCM servicing & maintenance", value: 2030 },
            { label: "Enviro-logger servicing & maintenance", value: 2540 },
            { label: "Waste & garbage disposal", value: 20340 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
          subCosts: 67710,
        },
      ],
      total: 423220,
    },
    grandTotal: 3532880,
    perDay: 9680,
    perDayExDryDock: 8870,
    totalExDryDockAnnual: 3237590,
    avgUpperRangePerDay: 9770,
    avgLowerRangePerDay: 7670,
  },
};

// Dataset for 80,000++ – 135,000 cbm LPG vessel (Estimation, 2024)
const vessel80_135k = {
	isEstimate: true,
	profile: {
		type: "LPG",
		sectorCbm: "Large Fully Refrigerated",
		globalFleetNo: null,
		globalFleetCbm: null,
		avgAgeYrs: null,
		youngestVesselYrs: null,
		oldestVesselYrs: null,
		avgScrapAgeYrs: null,
		avgSizeCbm: 107725,
		avgLDT: 23996,
		avgBHP: 25469,
		avgGT: 70684,
		profileYear: 2024,
	},
	byAgeDaily: {
		labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old", "20-yr old"],
		items: [
			{ name: "Manning", values: [5435, 5333, 5347, 5666, 5989] },
			{ name: "Insurance", values: [780, 828, 847, 978, 1061] },
			{ name: "Stores", values: [689, 764, 757, 770, 796] },
			{ name: "Spares", values: [817, 863, 881, 927, 936] },
			{ name: "Lubricating Oils", values: [399, 405, 411, 417, 427] },
			{ name: "Repair & Maintenance", values: [517, 550, 551, 599, 622] },
			{ name: "Dry-Docking", values: [0, 1081, 1139, 1234, 1437] },
			{ name: "Management & Administration", values: [1434, 1434, 1418, 1470, 1510] },
		],
		totals: [10071, 11258, 11351, 12061, 12778],
	},
	index: {
		labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		values: [100, 104, 108, 112, 115, 118, 122, 126, 130, 134, 138], // estimasi
	},
	categoriesYoY: {
		years: [2020, 2021, 2022, 2023, 2024],
		series: [
			{ name: "Manning", data: [5435, 5333, 5347, 5666, 5989] },
			{ name: "Insurance", data: [780, 828, 847, 978, 1061] },
			{ name: "Stores, spares & lubricating oils", data: [1905, 2032, 2049, 2114, 2159] },
			{ name: "Repairs & maintenance", data: [517, 550, 551, 599, 622] },
			{ name: "Dry-docking", data: [0, 1081, 1139, 1234, 1437] },
			{ name: "Management & administration", data: [1434, 1434, 1418, 1470, 1510] },
		],
	},
	totalYoY: {
		years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		totals: [10071, 11258, 11351, 12061, 12778, 13050, 13350, 13650, 13950, 14250], // estimasi tren naik
		pctChange: [5.0, 11.8, 0.8, 6.3, 5.9, 2.1, 2.3, 2.2, 2.2, 2.1], // estimasi
	},
	annual2024: {
		manning: {
			items: [
				{ label: "Officer/rating numbers", value: 25 },
				{ label: "Crew wages & overtime", value: 1663507 },
				{ label: "Crew victualling", value: 102500 },
				{ label: "Crew travel", value: 94590 },
				{ label: "Miscellaneous costs", value: 166351 },
			],
			total: 2026948,
		},
		insurance: {
			items: [
				{ label: "Hull & Machinery", value: 142648 },
				{ label: "Protection & Indemnity", value: 194676 },
				{ label: "War Risk", value: 9650 },
				{ label: "FD&D", value: 12413 },
				{ label: "COFR", value: 2488 },
			],
			total: 361875,
		},
		stores: {
			items: [
				{ label: "Deck & Cabin Stores", value: 77155 },
				{ label: "Safety Items/Protective Equipment", value: 63310 },
				{ label: "Chemicals & Gases", value: 18869 },
				{ label: "Medical", value: 11202 },
				{ label: "Mooring Wires & Ropes & Hoses", value: 33475 },
				{ label: "Maintenance Paint", value: 44815 },
				{ label: "Tools & Hardware", value: 8401 },
			],
			total: 257227,
		},
		spares: {
			items: [
				{ label: "Main Propulsion Unit", value: 51545 },
				{ label: "Generator Engines", value: 31655 },
				{ label: "Boilers", value: 82545 },
				{ label: "ER Auxiliary Machinery", value: 39815 },
				{ label: "Deck Machinery", value: 31450 },
				{ label: "Electrical", value: 27075 },
				{ label: "Cargo & Ballast System", value: 35700 },
				{ label: "Pipes & Valves", value: 26610 },
				{ label: "Navigation Equipment", value: 8655 },
				{ label: "Access Equipment", value: 5770 },
				{ label: "Spares Transportation", value: 24220 },
			],
			total: 365040,
		},
		luboils: {
			items: [
				{ label: "ME Cylinder Oil", value: 168342 },
				{ label: "ME System Oil", value: 22850 },
				{ label: "Aux Engine Oil", value: 12968 },
				{ label: "Hydraulic Oils", value: 10816 },
				{ label: "Other Oils", value: 7304 },
				{ label: "Gas & Reefer Compressors Oils", value: 766 },
			],
			total: 223046,
		},
		repairMaintenance: {
			items: [
				{ label: "Main Engine Inc. Re-Conditioning", value: 36353 },
				{ label: "Boiler", value: 21863 },
				{ label: "Generators", value: 29856 },
				{ label: "ER Auxiliaries", value: 17218 },
				{ label: "Cargo & Ballast System Inc. Calibration", value: 11453 },
				{ label: "Electrical Including Rewinds", value: 19573 },
				{ label: "Pipes & Valves & Hydraulic Systems", value: 11453 },
				{ label: "Deck Machinery Inc. Cranes", value: 15645 },
				{ label: "Navigation Equipment", value: 18268 },
				{ label: "Access Equipment", value: 13289 },
				{ label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 25400 },
			],
			total: 220371,
		},
		intermediateSurvey: {
			items: [{ label: "Intermediate/Special survey", value: 436234 }],
			total: 436234,
		},
		managementAdmin: {
			groups: [
				{
					name: "Fees & Services",
					items: [
						{ label: "Management fee", value: 186101 },
						{ label: "Launches & other transport", value: 25670 },
						{ label: "Flag state inspection, certification & other charges", value: 12835 },
						{ label: "Classification charges", value: 12835 },
						{ label: "PSC charges", value: 4491 },
						{ label: "Third party services", value: 6414 },
						{ label: "Consulting fees", value: 26049 },
						{ label: "Procurement costs", value: 42350 },
						{ label: "Communications, printing, IT & postage", value: 32084 },
						{ label: "Vetting", value: 57757 },
					],
				},
				{
					name: "Owner's Costs",
					items: [
						{ label: "Owners disbursement", value: 25670 },
						{ label: "Masters entertainment", value: 6414 },
					],
				},
				{
					name: "Safety & Environmental Compliance",
					items: [
						{ label: "Internal auditing & inspection", value: 6704 },
						{ label: "Training", value: 3243 },
						{ label: "Survey & calibration of equipment", value: 25670 },
						{ label: "Incinerator servicing & maintenance", value: 3848 },
						{ label: "OWS servicing & maintenance", value: 8987 },
						{ label: "OCM servicing & maintenance", value: 2566 },
						{ label: "Enviro-logger servicing & maintenance", value: 3209 },
						{ label: "Waste & garbage disposal", value: 25670 },
						{ label: "BWTS servicing & maintenance", value: 5180 },
					],
				},
			],
			total: 523747,
		},
		grandTotal: 4414488,
		perDay: 11758,
		perDayExDryDock: 10553,
		totalExDryDockAnnual: 3851942,
		avgUpperRangePerDay: 11590,
		avgLowerRangePerDay: 9705,
	},
};

// Dataset for LNG Vessel OPEX – 150–170k CBM segment
const vessel150170 = {
  profile: {
    type: "LNG - DFDE/TFDE",
    sectorCbm: "150-170,000 cbm",
    globalFleetNo: 90,
    globalFleetCbm: 14329863,
    avgAgeYrs: 11.4,
    youngestVesselYrs: 4.8,
    oldestVesselYrs: 17.8,
    avgScrapAgeYrs: null, // n/a
    avgSizeCbm: 159221,
    avgLDT: 31826,
    avgBHP: 37359,
    avgGT: 103922,
    profileYear: 2024,
  },
  byAgeDaily: {
    labels: ["Newbuild", "5-yr old", "10-yr old", "15-yr old"],
    items: [
      { name: "Manning", values: [7050, 6790, 7050, 7050] },
      { name: "Insurance", values: [1140, 1120, 1340, 1370] },
      { name: "Stores", values: [1170, 1300, 1300, 1350] },
      { name: "Spares", values: [1550, 1640, 1730, 1810] },
      { name: "Lubricating Oils", values: [490, 490, 490, 500] },
      { name: "Repair & Maintenance", values: [580, 610, 640, 670] },
      { name: "Dry-docking", values: [0, 1880, 2000, 2300] },
      { name: "Management & Administration", values: [2060, 2060, 2060, 2170] },
    ],
    totals: [14040, 15890, 16610, 17220],
  },
  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 105, 106, 108, 110, 115, 119, 122, 124, 126, 130],
  },
  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [6500, 6550, 6600, 6700, 6800] },
      { name: "Insurance", data: [1200, 1250, 1300, 1350, 1400] },
      { name: "Stores, spares & lubricating oils", data: [3000, 3050, 3100, 3150, 3250] },
      { name: "Repairs & maintenance", data: [600, 650, 700, 750, 800] },
      { name: "Dry-docking", data: [1800, 1850, 1900, 1950, 2000] },
      { name: "Management & administration", data: [2000, 2050, 2100, 2150, 2200] },
    ],
  },
  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [15000, 15400, 15700, 16000, 16500, 17200, 17500, 17800, 18200, 18800],
    pctChange: [4.5, 1.7, 2.0, 1.8, 3.5, 3.1, 2.1, 2.3, 2.2, 2.8],
  },
  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 27 },
        { label: "Crew wages & overtime", value: 2148120 },
        { label: "Crew Victualling", value: 122400 },
        { label: "Crew Travel", value: 89170 },
        { label: "Miscellaneous Costs", value: 214810 },
      ],
      total: 2574500,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 191320 },
        { label: "Protection & Indemnity", value: 264610 },
        { label: "War Risk", value: 13220 },
        { label: "FD&D", value: 17810 },
        { label: "COFR", value: 3510 },
      ],
      total: 490470,
    },
    stores: {
      items: [
        { label: "Deck & Cabin Stores", value: 101910 },
        { label: "Safety Items/Protective Equipment", value: 69850 },
        { label: "Chemicals & Gases", value: 17180 },
        { label: "Medical", value: 5730 },
        { label: "Mooring Wires & Ropes & Hoses", value: 62980 },
        { label: "Maintenance Paint", value: 74430 },
        { label: "Tools & Hardware", value: 17180 },
        { label: "Transportation Costs", value: 34350 },
        { label: "Others", value: 89320 },
      ],
      total: 472930,
    },
    spares: {
      items: [
        { label: "Main Propulsion Unit", value: 31950 },
        { label: "Generator Engines", value: 211050 },
        { label: "Boilers", value: 23520 },
        { label: "ER Auxilary Machinery", value: 42340 },
        { label: "Deck Machinery", value: 23520 },
        { label: "Electrical", value: 86260 },
        { label: "Cargo & Ballast System", value: 78410 },
        { label: "Pipes & Valves", value: 23520 },
        { label: "Navigation Equipment", value: 31370 },
        { label: "Access Equipment", value: 23520 },
        { label: "Other spares", value: 15680 },
        { label: "Spares Transportation", value: 39210 },
      ],
      total: 630350,
    },
    luboils: {
      items: [
        { label: "ME System Oil", value: 140000 },
        { label: "Aux Engine Oil", value: 17740 },
        { label: "Hydraulic Oils", value: 10950 },
        { label: "Other Oils", value: 8760 },
      ],
      total: 177450,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine inc. Re-conditioning", value: 10920 },
        { label: "Boiler", value: 4240 },
        { label: "Generators", value: 68790 },
        { label: "ER auxilliaries", value: 24020 },
        { label: "Cargo & ballast system inc. calibration", value: 14190 },
        { label: "Electrical including rewinds", value: 18560 },
        { label: "Pipes & valves & hydraulic systems", value: 13250 },
        { label: "Deck machinery inc. cranes", value: 8730 },
        { label: "Navigation Equipment", value: 23860 },
        { label: "Access Equipment", value: 12010 },
        { label: "LSA & FFE", value: 25110 },
        { label: "Marpol R7M", value: 10920 },
      ],
      total: 234600,
    },
    intermediateSurvey: {
      items: [{ label: "Intermediate/Special survey", value: 731410 }],
      total: 731410,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management Fee", value: 274050 },
            { label: "Launches & other transport", value: 37800 },
            { label: "Flag state inspection, certification & Other charges", value: 18900 },
            { label: "Classification Charges", value: 18900 },
            { label: "PSC Charges", value: 6620 },
            { label: "Third Party Services", value: 9450 },
            { label: "Consulting Fees", value: 24570 },
            { label: "Procurement Costs", value: 62370 },
            { label: "Communications, printing, IT & postage", value: 47250 },
            { label: "Vetting", value: 85050 },
          ],
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners's disbursement", value: 37800 },
            { label: "Masters entertainment", value: 9450 },
          ],
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing and inspection", value: 9450 },
            { label: "Training", value: 3780 },
            { label: "Survey & calibration of equipment", value: 37800 },
            { label: "Incinerator servicing & maintenance", value: 5670 },
            { label: "OWS servicing & maintenance", value: 13230 },
            { label: "OCM servicing & maintenance", value: 3780 },
            { label: "Envirologger servicing & maintenance", value: 4730 },
            { label: "Waste & garbage disposal", value: 37800 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
        },
      ],
      total: 753630,
    },
    grandTotal: 6065340,
    perDay: 16610,
    perDayExDryDock: 14610,
    totalExDryDockAnnual: 5333930,
    avgUpperRangePerDay: 16360,
    avgLowerRangePerDay: 13090,
  },
};

// Dataset for LNG Vessel OPEX – 170–180k CBM segment (MEGI/XDF)
const vessel170180 = {
  profile: {
    type: "LNG - MEGI/XDF",
    sectorCbm: "170-180,000 cbm",
    globalFleetNo: 205,
    globalFleetCbm: 35674910,
    avgAgeYrs: 3.3,
    youngestVesselYrs: 0.0,
    oldestVesselYrs: 8.6,
    avgScrapAgeYrs: null, // n/a
    avgSizeCbm: 174024,
    avgLDT: 35466,
    avgBHP: 35416,
    avgGT: 114811,
    profileYear: 2024,
  },

  byAgeDaily: {
    labels: ["Newbuild"],
    items: [
      { name: "Manning", values: [7650] },
      { name: "Insurance", values: [1380] },
      { name: "Stores", values: [1010] },
      { name: "Spares", values: [1270] },
      { name: "Lubricating Oils", values: [540] },
      { name: "Repair & Maintenance", values: [610] },
      { name: "Dry-docking", values: [0] },
      { name: "Management & Administration", values: [2070] },
    ],
    totals: [14530],
  },

  index: {
    labels: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    values: [100, 106, 108, 110, 112, 114.5, 117, 120, 123, 125, 129],
  },

  categoriesYoY: {
    years: [2020, 2021, 2022, 2023, 2024],
    series: [
      { name: "Manning", data: [7400, 7430, 7450, 7470, 7500] },
      { name: "Insurance", data: [1000, 1050, 1100, 1150, 1200] },
      { name: "Stores, spares & lubricating oils", data: [2500, 2600, 2650, 2700, 2750] },
      { name: "Repairs & maintenance", data: [800, 850, 900, 950, 1000] },
      { name: "Dry-docking", data: [0, 0, 0, 0, 0] },
      { name: "Management & administration", data: [1800, 1850, 1900, 1950, 2000] },
    ],
  },

  totalYoY: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    totals: [13500, 13700, 13900, 14100, 14600, 14900, 15100, 15500, 15800, 16200],
    pctChange: [4.5, 1.6, 1.8, 1.7, 2.6, 2.2, 2.0, 2.1, 2.2, 2.3],
  },

  annual2024: {
    manning: {
      items: [
        { label: "Officer/rating numbers", value: 28 },
        { label: "Crew wages & overtime", value: 2336800 },
        { label: "Crew Victualling", value: 136000 },
        { label: "Crew Travel", value: 84040 },
        { label: "Miscellaneous Costs", value: 233680 },
      ],
      total: 2790520,
    },
    insurance: {
      items: [
        { label: "Hull & Machinery", value: 202720 },
        { label: "Protection & Indemnity", value: 266330 },
        { label: "War Risk", value: 13340 },
        { label: "FD&D", value: 17920 },
        { label: "COFR", value: 3540 },
      ],
      total: 503850,
    },
    stores: {
      items: [
        { label: "Deck & cabin stores", value: 98710 },
        { label: "Safety items/protective equipment", value: 73820 },
        { label: "Chemicals & gases", value: 17910 },
        { label: "Medical", value: 15070 },
        { label: "Mooring wires & ropes & hoses", value: 41440 },
        { label: "Maintenance paint", value: 53050 },
        { label: "Tools & hardware", value: 11300 },
        { label: "Transportation costs", value: 13880 },
        { label: "Others", value: 43300 },
      ],
      total: 368480,
    },
    spares: {
      items: [
        { label: "Main propulsion unit", value: 110590 },
        { label: "Generator engines", value: 47390 },
        { label: "Boilers", value: 19840 },
        { label: "ER auxiliary machinery", value: 49590 },
        { label: "Deck machinery", value: 16530 },
        { label: "Electrical", value: 60610 },
        { label: "Cargo & ballast system", value: 55100 },
        { label: "Pipes & valves", value: 16530 },
        { label: "Navigation equipment", value: 22040 },
        { label: "Access equipment", value: 12050 },
        { label: "Other spares", value: 11020 },
        { label: "Spares transportation", value: 44080 },
      ],
      total: 465370,
    },
    luboils: {
      items: [
        { label: "ME Cylinder Oil", value: 144590 },
        { label: "ME System Oil", value: 27760 },
        { label: "Aux Engine Oil", value: 9250 },
        { label: "Hydraulic Oils", value: 9250 },
        { label: "Other Oils", value: 4630 },
      ],
      total: 50890,
    },
    repairMaintenance: {
      items: [
        { label: "Main Engine inc. Re-conditioning", value: 24730 },
        { label: "Boiler", value: 8900 },
        { label: "Generators", value: 24730 },
        { label: "ER auxiliaries", value: 23740 },
        { label: "Cargo & ballast system inc. calibration", value: 14840 },
        { label: "Electrical including rewinds", value: 24730 },
        { label: "Pipes & valves & hydraulic systems", value: 14840 },
        { label: "Deck machinery inc. cranes", value: 14840 },
        { label: "Navigation equipment", value: 20770 },
        { label: "Access equipment", value: 13850 },
        { label: "LSA & FFE", value: 24730 },
        { label: "Marpol R7M", value: 11870 },
      ],
      total: 222570,
    },
    managementAdmin: {
      groups: [
        {
          name: "Fees & Services",
          items: [
            { label: "Management fee", value: 274270 },
            { label: "Launches & other transport", value: 37830 },
            { label: "Flag state inspection, certification & other charges", value: 18920 },
            { label: "Classification charges", value: 18920 },
            { label: "PSC charges", value: 6620 },
            { label: "Third party services", value: 9460 },
            { label: "Consulting fees", value: 24590 },
            { label: "Procurement costs", value: 62420 },
            { label: "Communications, printing, IT & postage", value: 47290 },
            { label: "Vetting", value: 85120 },
          ],
        },
        {
          name: "Owner's Costs",
          items: [
            { label: "Owners disbursement", value: 37830 },
            { label: "Masters entertainment", value: 9460 },
          ],
        },
        {
          name: "Safety & Environmental Compliance",
          items: [
            { label: "Internal auditing & inspection", value: 9460 },
            { label: "Training", value: 3780 },
            { label: "Survey & calibration of equipment", value: 37830 },
            { label: "Incinerator servicing & maintenance", value: 5670 },
            { label: "OWS servicing & maintenance", value: 13240 },
            { label: "OCM servicing & maintenance", value: 3780 },
            { label: "Envirologger servicing & maintenance", value: 4730 },
            { label: "Waste & garbage disposal", value: 37830 },
            { label: "BWTS servicing & maintenance", value: 5180 },
          ],
        },
      ],
      total: 754230,
    },
    grandTotal: 5300550,
    perDay: 14530,
    perDayExDryDock: 14530,
    totalExDryDockAnnual: 5300550,
    avgUpperRangePerDay: 15460,
    avgLowerRangePerDay: 12790,
  },
};


// Helper: create a scaled copy of the base dataset for other infrastructures
const scaleDataset = (base, factor, profileOverrides = {}) => {
	// Deep clone
	const ds = JSON.parse(JSON.stringify(base));
	// Profile
	ds.profile = { ...ds.profile, ...profileOverrides };

	// byAgeDaily
	ds.byAgeDaily.items = ds.byAgeDaily.items.map((it) => ({
		name: it.name,
		values: it.values.map((v) => Math.round(v * factor)),
	}));
	ds.byAgeDaily.totals = ds.byAgeDaily.labels.map((_, colIdx) =>
		ds.byAgeDaily.items.reduce((sum, it) => sum + it.values[colIdx], 0)
	);

	// categoriesYoY
	ds.categoriesYoY.series = ds.categoriesYoY.series.map((s) => ({
		name: s.name,
		data: s.data.map((v) => Math.round(v * factor)),
	}));

	ds.totalYoY.totals = ds.totalYoY.totals.map((v) => Math.round(v * factor));
	// pctChange unchanged (index)

	// annual2024 (optional, scale items and totals where present)
	const safeMul = (v) => Math.round(v * factor);
	if (ds.annual2024) {
		const a = ds.annual2024;

		// Helper to scale an object with items[] and total
		const scaleSection = (section) => {
			if (!section) return section;
			if (Array.isArray(section.items)) {
				section.items = section.items.map((it, i) => ({
					...it,
					// Keep the first manning "count" (index 0) as-is (not a currency)
					value:
						typeof it.value === "number"
							? (section === a.manning && i === 0 ? it.value : safeMul(it.value))
							: it.value,
				}));
			}
			if (typeof section.total === "number") section.total = safeMul(section.total);
			return section;
		};

		scaleSection(a.manning);
		scaleSection(a.insurance);
		scaleSection(a.stores);
		scaleSection(a.spares);
		scaleSection(a.luboils);
		scaleSection(a.repairMaintenance);
		scaleSection(a.intermediateSurvey);

		// Management & Administration groups
		if (a.managementAdmin?.groups) {
			a.managementAdmin.groups = a.managementAdmin.groups.map((g) => ({
				...g,
				items: (g.items || []).map((it) => ({
					...it,
					value: typeof it.value === "number" ? safeMul(it.value) : it.value,
				})),
			}));
			// scale sub-costs if present
			if (typeof a.managementAdmin.subCosts === "number") {
				a.managementAdmin.subCosts = safeMul(a.managementAdmin.subCosts);
			}
			if (typeof a.managementAdmin.total === "number") {
				a.managementAdmin.total = safeMul(a.managementAdmin.total);
			}
		}

		// Recompute grandTotal from the (scaled) section totals
		const sectionTotals = [
			a.manning?.total,
			a.insurance?.total,
			a.stores?.total,
			a.spares?.total,
			a.luboils?.total,
			a.repairMaintenance?.total,
			a.intermediateSurvey?.total,
			a.managementAdmin?.total,
		].filter((v) => typeof v === "number");
		a.grandTotal = sectionTotals.reduce((s, v) => s + v, 0);

		// per-day for 15-yr (from byAgeDaily 15-yr index)
		const perDay15 = ds.byAgeDaily.totals[3] || 0;
		a.perDay = perDay15;
		const dryDock15 = ds.byAgeDaily.items.find((i) => i.name.toLowerCase().includes("dry-docking"))?.values?.[3] || 0;
		a.perDayExDryDock = perDay15 - dryDock15;

		// scale added top-level annual fields if present
		if (typeof a.totalExDryDockAnnual === "number") a.totalExDryDockAnnual = safeMul(a.totalExDryDockAnnual);
		if (typeof a.avgUpperRangePerDay === "number") a.avgUpperRangePerDay = safeMul(a.avgUpperRangePerDay);
		if (typeof a.avgLowerRangePerDay === "number") a.avgLowerRangePerDay = safeMul(a.avgLowerRangePerDay);
	}

	return ds;
};

// Scaled datasets for other LNG infrastructures (keeps 6 categories consistent)
const dsOnshore = scaleDataset(vessel135150, 1.25, { type: "Onshore LNG Plant" });
const dsOffshore = scaleDataset(vessel135150, 1.4, { type: "Offshore LNG Plant (FLNG)" });
const dsFSRU = scaleDataset(vessel135150, 1.15, { type: "FSRU" });
const dsStorage = scaleDataset(vessel135150, 0.65, { type: "Storage Tank" });
const dsORF = scaleDataset(vessel135150, 0.8, { type: "ORF Receiving Terminal" });
const dsTrucking = scaleDataset(vessel135150, 0.5, { type: "LNG Trucking" });
const dsPipeline = scaleDataset(vessel135150, 0.7, { type: "Gas Pipeline" });

const initialState = {
	// Categories under LNG Infrastructure for OPEX pages
	infrastructures: [
		{
			id: "onshore-lng-plant",
			label: "Onshore LNG Plant",
			desc: "Land-based facility processing and liquefying natural gas.",
			tabs: [{ id: "overview", label: "Overview", datasetKey: "onshore" }],
		},
		{
			id: "offshore-lng-plant",
			label: "Offshore LNG Plant (FLNG)",
			desc: "Floating liquefaction unit near offshore gas fields.",
			tabs: [{ id: "overview", label: "Overview", datasetKey: "offshore" }],
		},
		{
			id: "fsru",
			label: "FSRU",
			desc: "Floating Storage Regasification Unit converting LNG back to gas.",
			tabs: [{ id: "overview", label: "Overview", datasetKey: "fsru" }],
		},
		{
			id: "lng-vessel",
			label: "LNG Vessel",
			desc: "Specialized cryogenic ship transporting LNG between terminals.",
			tabs: [
				{ id: "3-5k", label: "3-5K CBM", datasetKey: "v3_5k" },
				{ id: "5-6k", label: "5-6K CBM", datasetKey: "v5_6k" }, // Estimasi
				{ id: "6-8k", label: "6-8K CBM", datasetKey: "v6_8k" },
				{ id: "8-12k", label: "8-12K CBM", datasetKey: "v8_12k" }, // Estimasi
				{ id: "12-15k", label: "12-15K CBM", datasetKey: "v12_15k" },
				{ id: "15-20k", label: "15-30K CBM", datasetKey: "v15_30k" }, // Estimasi
				{ id: "20-30k", label: "30-40K CBM", datasetKey: "v30_40k" },
				{ id: "30-40k", label: "40-50K CBM", datasetKey: "v40_50k" }, // Estimasi
				{ id: "30-70k", label: "50-70K CBM", datasetKey: "v50_70k" },
				{ id: "70k", label: "70-80K CBM", datasetKey: "v70_80k" }, // Estimasi
				{ id: "80k", label: "80K CBM", datasetKey: "v80k" },
				{ id: "70-80k", label: "80-135K CBM ", datasetKey: "v80_135k" }, // Estimasi
				{ id: "135-150k", label: "135-150K CBM", datasetKey: "v135150" },
				{ id: "150-170k", label: "150-170K CBM", datasetKey: "v150170" },
				{ id: "170-180k", label: "170-180K CBM", datasetKey: "v170180" },
				// { id: "170-180k", label: "170-180K CBM", datasetKey: "v170180", disabled: true },
			],
		},
		{
			id: "storage-tank",
			label: "Storage Tank",
			desc: "Cryogenic tank storing LNG at -162°C prior to handling.",
			tabs: [{ id: "overview", label: "Overview", datasetKey: "storage" }],
		},
		{
			id: "orf-terminal",
			label: "ORF Receiving Terminal",
			desc: "Onshore receiving facility with storage and send-out systems.",
			tabs: [{ id: "overview", label: "Overview", datasetKey: "orf" }],
		},
		{
			id: "lng-trucking",
			label: "LNG Trucking",
			desc: "Cryogenic road tankers distributing LNG to users/industries.",
			tabs: [{ id: "overview", label: "Overview", datasetKey: "trucking" }],
		},
		{
			id: "gas-pipeline",
			label: "Gas Pipeline",
			desc: "High-pressure transmission delivering regasified natural gas.",
			tabs: [{ id: "overview", label: "Overview", datasetKey: "pipeline" }],
		},
	],
	datasets: {
		v135150: vessel135150,
		v3_5k: vessel3_5k,
		v5_6k: vessel5_6k,
		v6_8k: vessel6_8k,
		v8_12k: vessel8_12k,
		v12_15k: vessel12_15k,
		v15_30k: vessel15_30k,
		v30_40k: vessel30_40k,
		v40_50k: vessel40_50k,
		v50_70k: vessel50_70k,
		v70_80k: vessel70_80k,
		v80k: vessel80k,
		v80_135k: vessel80_135k,
		v150170: vessel150170,
		v170180: vessel170180,
		onshore: dsOnshore,
		offshore: dsOffshore,
		fsru: dsFSRU,
		storage: dsStorage,
		orf: dsORF,
		trucking: dsTrucking,
		pipeline: dsPipeline,
		// v150170, v170180: future placeholders
	},
	ui: {
		activeInfra: "lng-vessel",
		activeTabByInfra: {
			"onshore-lng-plant": "overview",
			"offshore-lng-plant": "overview",
			"fsru": "overview",
			"lng-vessel": "135-150k", // default tetap
			"storage-tank": "overview",
			"orf-terminal": "overview",
			"lng-trucking": "overview",
			"gas-pipeline": "overview",
		},
	},
};

const opexSlice = createSlice({
	name: "opex",
	initialState,
	reducers: {
		setActiveInfra(state, action) {
			state.ui.activeInfra = action.payload;
		},
		setActiveTab(state, action) {
			const { infraId, tabId } = action.payload;
			state.ui.activeTabByInfra[infraId] = tabId;
		},
	},
});

export const { setActiveInfra, setActiveTab } = opexSlice.actions;

// Selectors
export const selectOpexInfra = (s) => s.opex.infrastructures;
export const selectOpexUI = (s) => s.opex.ui;
export const selectActiveDataset = (s) => {
	const ui = s.opex.ui;
	const tab = ui.activeTabByInfra[ui.activeInfra];
	const infra = s.opex.infrastructures.find((i) => i.id === ui.activeInfra);
	const dsKey = infra?.tabs.find((t) => t.id === tab)?.datasetKey;
	return s.opex.datasets[dsKey];
};

export default opexSlice.reducer;
