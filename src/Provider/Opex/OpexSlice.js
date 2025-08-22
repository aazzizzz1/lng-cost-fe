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
			"lng-vessel": "135-150k",
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
