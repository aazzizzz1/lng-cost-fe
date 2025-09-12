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
			4.402909205, 2.247191011, 2.93040293, 3.558718861, 3.436426117,
			2.990033223, 2.580645161, 2.201257862, 2.461538462, 2.402402402,
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
		values: [100, 103, 105, 108, 112, 116, 120, 125, 130, 135, 140], // estimasi, bisa update jika ada data
	},
	categoriesYoY: {
		years: [2020, 2021, 2022, 2023, 2024],
		series: [
			{ name: "Manning", data: [2640, 2640, 2880, 3120, 3360] },
			{ name: "Insurance", data: [300, 320, 350, 410, 430] },
			{ name: "Stores, spares & lubricating oils", data: [880, 940, 950, 990, 970] }, // Stores+Spares+Luboils
			{ name: "Repairs & maintenance", data: [280, 300, 310, 340, 340] },
			{ name: "Dry-docking", data: [0, 430, 460, 490, 570] },
			{ name: "Management & administration", data: [750, 750, 750, 790, 790] },
		],
	},
	totalYoY: {
		years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		totals: [4850, 5380, 5700, 6140, 6460, 6700, 6950, 7200, 7450, 7700], // estimasi tren naik
		pctChange: [4.5, 10.9, 5.9, 7.7, 5.2, 3.7, 3.7, 3.6, 3.5, 3.4], // estimasi
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
			subCosts: 212380 + 16330 + 45350, // Fees+Owner+Safety sub-costs
			total: 274060 + 212380 + 16330, // Safety total + Fees sub-costs + Owner sub-costs
		},
		grandTotal: 2084044,
		perDay: 5700,
		perDayExDryDock: 5700, // sesuai tabel
		totalExDryDockAnnual: 1917154,
		avgUpperRangePerDay: 6150,
		avgLowerRangePerDay: 3940,
	},
};

// Dataset for 5-6k cbm LPG vessel (Estimation)
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
		values: [100, 103, 106, 109, 113, 117, 121, 126, 131, 136, 141], // estimasi
	},
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
	totalYoY: {
		years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		totals: [5090, 5660, 5960, 6375, 6680, 6900, 7150, 7400, 7650, 7900], // estimasi tren naik
		pctChange: [4.5, 11.2, 5.3, 7.0, 4.8, 3.3, 3.6, 3.5, 3.4, 3.3], // estimasi
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
				{ label: "LSA & FFE (Life Saving Appliances & Fire Fighting Equipment)", value: 17065 },
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
						{ label: "Flag state inspection, certification & other charges", value: 6905 },
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
			subCosts: 223935 + 17260 + 47640,
			total: 288835 + 223935 + 17260, // Safety total + Fees sub-costs + Owner sub-costs
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
		values: [100, 105, 108, 112, 116, 120, 125, 130, 135, 140, 145],
	},
	categoriesYoY: {
		years: [2020, 2021, 2022, 2023, 2024],
		series: [
			{ name: "Manning", data: [2870, 2870, 3060, 3250, 3440] },
			{ name: "Insurance", data: [330, 350, 380, 440, 460] },
			{ name: "Stores, spares & lubricating oils", data: [980, 1060, 1080, 1110, 1100] },
			{ name: "Repairs & maintenance", data: [320, 340, 350, 380, 380] },
			{ name: "Dry-docking", data: [0, 490, 520, 560, 650] },
			{ name: "Management & administration", data: [830, 830, 830, 870, 870] },
		],
	},
	totalYoY: {
		years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
		totals: [5330, 5940, 6220, 6610, 6900, 7200, 7500, 7800, 8100, 8400],
		pctChange: [4.5, 11.5, 4.7, 6.3, 4.4, 4.3, 4.2, 4.1, 3.8, 3.7],
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
			subCosts: 235490 + 18190 + 49930,
			total: 303610 + 235490 + 18190, // Safety total + Fees sub-costs + Owner sub-costs
		},
		grandTotal: 2262490,
		perDay: 6220,
		perDayExDryDock: 5710,
		totalExDryDockAnnual: 2083120,
		avgUpperRangePerDay: 7200,
		avgLowerRangePerDay: 4380,
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
				{ id: "5-6k", label: "5-6K CBM (Est.)", datasetKey: "v5_6k" }, // Estimasi
				{ id: "6-8k", label: "6-8K CBM", datasetKey: "v6_8k" },
				{ id: "135-150k", label: "135-150K CBM", datasetKey: "v135150" },
				{ id: "150-170k", label: "150-170K CBM", datasetKey: "v150170", disabled: true },
				{ id: "170-180k", label: "170-180K CBM", datasetKey: "v170180", disabled: true },
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
