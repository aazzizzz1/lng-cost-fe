import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import { selectOpexInfra, selectOpexUI, selectActiveDataset, setActiveTab } from "../../Provider/Opex/OpexSlice";

const Tab = ({ active, label, onClick, disabled, isEstimate }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      `px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ` +
      (isEstimate
        ? (active
            ? "bg-yellow-400 text-white border-yellow-400"
            : "bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-800")
        : (active
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"))
    }
  >
    {label}
    {isEstimate && (
      <span className="ml-1 text-[10px] font-bold uppercase text-yellow-900 dark:text-yellow-200"></span>
    )}
  </button>
);

// Local safe deep copy to avoid passing frozen Redux objects to ApexCharts
const deepCopy = (obj) => {
  try {
    return obj == null ? obj : JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

const OpexChart = () => {
  const dispatch = useDispatch();
  const infrastructures = useSelector(selectOpexInfra);
  const ui = useSelector(selectOpexUI);
  const ds = useSelector(selectActiveDataset);

  // Use active infra instead of the first one
  const activeInfra = ui.activeInfra;
  const vessel =
    infrastructures.find((i) => i.id === activeInfra) || infrastructures[0] || { id: activeInfra, tabs: [] };
  const activeTabId = ui.activeTabByInfra[vessel.id];

  // Profile entries for the info card
  const profileEntries = useMemo(() => {
    const p = ds?.profile;
    if (!p) return [];
    const fmt = (v) => {
      if (v === null || v === undefined) return "n/a";
      if (typeof v === "number") return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(1);
      return v;
    };
    return [
      { k: "Type", v: fmt(p.type) },
      { k: "Sector", v: fmt(p.sectorCbm) },
      { k: "Global fleet — no.", v: fmt(p.globalFleetNo) },
      { k: "Global fleet — cbm", v: fmt(p.globalFleetCbm) },
      { k: "Avg age — yrs", v: fmt(p.avgAgeYrs) },
      { k: "Youngest vessel — yrs", v: fmt(p.youngestVesselYrs) },
      { k: "Oldest vessel — yrs", v: fmt(p.oldestVesselYrs) },
      { k: "Avg scrap age 2024— yrs", v: fmt(p.avgScrapAgeYrs) },
      { k: "Avg size — cbm", v: fmt(p.avgSizeCbm) },
      { k: "Avg LDT", v: fmt(p.avgLDT) },
      { k: "Avg BHP", v: fmt(p.avgBHP) },
      { k: "Avg GT", v: fmt(p.avgGT) },
    ];
  }, [ds]);

  // Replace pie with tabular breakdown (values only, no percentages)
  const breakdownTable = useMemo(() => {
    if (!ds) return { ages: [], rows: [], totals: [] };
    const ages = ds.byAgeDaily.labels || [];
    const rows = (ds.byAgeDaily.items || []).map((it) => ({ name: it.name, values: [...it.values] }));
    const totals =
      ds.byAgeDaily.totals && ds.byAgeDaily.totals.length
        ? [...ds.byAgeDaily.totals]
        : ages.map((_, colIdx) => rows.reduce((s, r) => s + (r.values[colIdx] || 0), 0));
    return { ages, rows, totals };
  }, [ds]);

  const indexLine = useMemo(() => {
    if (!ds) return { categories: [], series: [] };
    return {
      categories: [...ds.index.labels],
      series: [{ name: "Operating Cost Index", data: [...ds.index.values] }],
    };
  }, [ds]);

  const categoryTrends = useMemo(() => {
    if (!ds) return { categories: [], series: [] };
    return {
      categories: [...ds.categoriesYoY.years],
      // Deep clone each series object so ApexCharts can mutate safely
      series: ds.categoriesYoY.series.map((s) => ({ name: s.name, data: [...s.data] })),
    };
  }, [ds]);

  const totalYoY = useMemo(() => {
    if (!ds) return { categories: [], series: [] };
    return {
      categories: [...ds.totalYoY.years],
      series: [
        { name: "Total Costs ($/day)", data: [...ds.totalYoY.totals] },
        { name: "% Change y-o-y", data: [...ds.totalYoY.pctChange], type: "line" },
      ],
    };
  }, [ds]);

  const palette = ["#2563eb", "#0891b2", "#7c3aed", "#f59e0b", "#059669", "#dc2626", "#4f46e5", "#c026d3"];

  // Helpers to render money and sections
  const money = (v) => (typeof v === "number" ? `$${v.toLocaleString()}` : v);

  const Section = ({ title, items, total, note }) => (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
      {Array.isArray(items) && items.length > 0 && (
        <div className="space-y-1">
          {items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">{it.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{money(it.value)}</span>
            </div>
          ))}
        </div>
      )}
      {typeof total === "number" && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs">
          <span className="font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="font-semibold text-gray-900 dark:text-white">{money(total)}</span>
        </div>
      )}
      {note ? <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">{note}</p> : null}
    </div>
  );

  const isEstimate = !!ds?.isEstimate;

  return (
    <div className="space-y-6">
      <div className={
        "rounded-2xl border bg-gradient-to-b p-5 " +
        (isEstimate
          ? "border-yellow-400 from-yellow-50 to-white dark:from-yellow-900 dark:to-yellow-900/60"
          : "border-gray-200 dark:border-gray-700 from-indigo-50 to-white dark:from-gray-800 dark:to-gray-800/60")
      }>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={
              "text-2xl font-bold " +
              (isEstimate ? "text-yellow-700 dark:text-yellow-300" : "text-indigo-700 dark:text-indigo-300")
            }>
              {vessel.label}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{vessel.desc}</p>
          </div>
          <div className="flex gap-2">
            {vessel.tabs.map((t) => (
              <Tab
                key={t.id}
                label={t.label}
                disabled={t.disabled}
                active={activeTabId === t.id}
                onClick={() => dispatch(setActiveTab({ infraId: vessel.id, tabId: t.id }))}
                isEstimate={t.datasetKey && infrastructures.find(i => i.id === vessel.id)?.tabs?.find(tab => tab.id === t.id)?.datasetKey && (ds?.isEstimate && t.id === activeTabId)}
              />
            ))}
          </div>
        </div>
        {isEstimate && (
          <div className="mt-3 p-2 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 text-xs font-semibold border border-yellow-300 dark:border-yellow-700">
            Data pada kategori ini merupakan hasil estimasi, bukan data aktual. Mohon gunakan dengan kehati-hatian.
          </div>
        )}
      </div>

      {/* Fleet profile card (LNG Carrier 135–150k) */}
      {activeInfra === "lng-vessel" && profileEntries.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Fleet profile — {ds?.profile?.profileYear || 2024}
          </h3>
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profileEntries.map((e) => (
              <div key={e.k} className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
                <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{e.k}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{e.v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Operating Cost Breakdown — show all ages in a table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Daily Operating Cost Breakdown — by vessel age (2024)
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-3 font-semibold">Cost head</th>
                  {breakdownTable.ages.map((a) => (
                    <th key={a} className="py-2 px-2 font-semibold">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breakdownTable.rows.map((r) => (
                  <tr key={r.name} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 pr-3 text-gray-900 dark:text-white">{r.name}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className="py-2 px-2 tabular-nums text-gray-900 dark:text-white">
                        ${Number(v || 0).toLocaleString()}
                      </td>
                    ))}
                    <td className="py-2 px-2"></td>{/* no row total, match image */}
                  </tr>
                ))}
                <tr className="bg-indigo-50/50 dark:bg-indigo-500/10">
                  <td className="py-2 pr-3 font-semibold text-gray-900 dark:text-white">Total</td>
                  {breakdownTable.totals.map((v, i) => (
                    <td key={i} className="py-2 px-2 font-semibold tabular-nums text-gray-900 dark:text-white">
                      ${Number(v || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Index line */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Operating Cost Index (2019–2029)</h3>
          <Chart
            options={deepCopy({
              xaxis: { categories: indexLine.categories, labels: { style: { colors: undefined } } },
              colors: [palette[0]],
              stroke: { curve: "smooth", width: 3 },
              tooltip: { y: { formatter: (v) => v } },
              dataLabels: { enabled: false },
              // keterangan di bawah
              legend: { position: "bottom" },
            })}
            series={indexLine.series.map(s => ({ name: s.name, data: [...s.data] }))}
            type="line"
            height={320}
          />
        </div>

        {/* Category trends */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Main Cost Heads (2020–2024)</h3>
          <Chart
            options={deepCopy({
              xaxis: { categories: categoryTrends.categories },
              colors: palette,
              legend: { position: "bottom" },
              chart: { stacked: true },
              plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
              tooltip: { y: { formatter: (v) => `$${Math.round(v).toLocaleString()}` } },
              yaxis: { labels: { formatter: (v) => `$${v.toLocaleString()}` } },
              dataLabels: {
                enabled: true,
                formatter: (v) => `$${Math.round(v).toLocaleString()}`,
                style: { fontSize: "10px" },
              },
            })}
            series={categoryTrends.series.map((s) => ({ name: s.name, data: [...s.data] }))}
            type="bar"
            height={340}
          />
        </div>

        {/* Total costs and YoY % */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Total Costs and YoY Change (2020–2029)</h3>
          <Chart
            options={deepCopy({
              xaxis: { categories: totalYoY.categories },
              colors: ["#232c4b", "#d4a72c"],
              stroke: { width: [0, 3], curve: "smooth" },
              dataLabels: { enabled: false },
              chart: { stacked: false },
              plotOptions: { bar: { columnWidth: "50%", borderRadius: 2 } },
              grid: { strokeDashArray: 4 },
              // keterangan di bawah
              legend: { position: "bottom" },
              yaxis: [
                {
                  title: { text: "$ per day" },
                  min: 13000,
                  max: 17500,
                  tickAmount: 5,
                  labels: { formatter: (v) => `$${Math.round(v).toLocaleString()}` },
                },
                {
                  opposite: true,
                  title: { text: "%" },
                  min: 0,
                  max: 5,
                  tickAmount: 5,
                  labels: { formatter: (v) => `${v}%` },
                },
              ],
              annotations: {
                xaxis: [
                  {
                    x: 2025,
                    x2: 2028,
                    fillColor: "#fde68a",
                    opacity: 0.2,
                    borderColor: "transparent",
                  },
                ],
              },
              tooltip: {
                shared: true,
                y: {
                  formatter: (v, { seriesIndex }) =>
                    seriesIndex === 1 ? `${v.toFixed(1)}%` : `$${Math.round(v).toLocaleString()}/day`,
                },
              },
            })}
            series={[
              { name: "Total costs", data: [...(totalYoY.series[0]?.data || [])], type: "column" },
              { name: "% change y-o-y (right axis)", data: [...(totalYoY.series[1]?.data || [])], type: "line" },
            ]}
            type="line"
            height={340}
          />
        </div>
      </div>

      {/* Annual Operating Cost Details — shown for LNG Vessel 135–150k */}
      {activeInfra === "lng-vessel" && ds?.annual2024 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Annual Operating Cost Details — 15-yr old (2024)
          </h3>
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <Section title="MANNING" items={ds.annual2024.manning?.items} total={ds.annual2024.manning?.total} />
              <Section title="INSURANCE" items={ds.annual2024.insurance?.items} total={ds.annual2024.insurance?.total} />
              <Section title="STORES" items={ds.annual2024.stores?.items} total={ds.annual2024.stores?.total} />
              <Section title="SPARES" items={ds.annual2024.spares?.items} total={ds.annual2024.spares?.total} />
              <Section title="LUBRICATING OILS" items={ds.annual2024.luboils?.items} total={ds.annual2024.luboils?.total} />
            </div>
            {/* Right column */}
            <div className="space-y-4">
              <Section
                title="REPAIR & MAINTENANCE"
                items={ds.annual2024.repairMaintenance?.items}
                total={ds.annual2024.repairMaintenance?.total}
              />
              <Section
                title="INTERMEDIATE/SPECIAL SURVEY"
                items={ds.annual2024.intermediateSurvey?.items}
                total={ds.annual2024.intermediateSurvey?.total}
              />
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">MANAGEMENT & ADMINISTRATION</h4>
                {(ds.annual2024.managementAdmin?.groups || []).map((g) => (
                  <div key={g.name} className="mb-2">
                    <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{g.name}</p>
                    <div className="space-y-1">
                      {(g.items || []).map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-300">{it.label}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{money(it.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {/* show sub-costs row if present */}
                {typeof ds.annual2024.managementAdmin?.subCosts === "number" && (
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-300">Sub-costs</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {money(ds.annual2024.managementAdmin.subCosts)}
                    </span>
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{money(ds.annual2024.managementAdmin?.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* add the missing summary boxes */}
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Total operating costs</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{money(ds.annual2024.grandTotal)}</p>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Total operating costs ($ per day)</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{money(ds.annual2024.perDay)}</p>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Total operating cost exc. dry-docking</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{money(ds.annual2024.totalExDryDockAnnual)}</p>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Total op. costs exc. dry-docking ($ per day)</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{money(ds.annual2024.perDayExDryDock)}</p>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Average upper range — ($ per day)</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{money(ds.annual2024.avgUpperRangePerDay)}</p>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Average lower range — ($ per day)</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{money(ds.annual2024.avgLowerRangePerDay)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpexChart;