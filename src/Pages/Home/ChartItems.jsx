import React, { useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchChartData } from "../../Provider/dashboardSlice";

const ChartItems = () => {
  const dispatch = useDispatch();
  const { labels, series, loading } = useSelector(
    (state) => state.dashboard.chart
  );
  const chartColors = useSelector((state) => state.dashboard.chartColors);

  useEffect(() => {
    dispatch(fetchChartData());
  }, [dispatch]);

  const total = useMemo(
    () => series.reduce((a, b) => a + (typeof b === "number" ? b : 0), 0),
    [series]
  );

  const legendData = useMemo(
    () =>
      labels.map((l, i) => {
        const val = series[i] || 0;
        return {
          label: l,
          value: val,
          pct: total ? (+((val / total) * 100).toFixed(1)).toString().replace(/\.0$/, "") : 0,
          color: chartColors[i % chartColors.length],
        };
      }),
    [labels, series, total, chartColors]
  );

  const options = {
    colors: chartColors,
    chart: {
      height: 260,
      type: "pie",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      animations: { easing: "easeinout", speed: 500 },
    },
    stroke: { colors: ["#fff"], width: 2 },
    dataLabels: {
      enabled: true,
      formatter: (val) => (val >= 5 ? `${Math.round(val)}%` : ""),
      style: { fontSize: "12px", fontWeight: 600 },
      dropShadow: { enabled: false },
    },
    legend: { show: false },
    tooltip: { y: { formatter: (val) => val } },
    labels,
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 220 },
          dataLabels: { style: { fontSize: "11px" } },
        },
      },
    ],
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm hover:shadow-md transition-shadow p-5 overflow-hidden">
      <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/10 dark:from-blue-500/10 dark:to-transparent blur-2xl" />
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div>
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 text-xs shadow-inner">
              𝛑
            </span>
            Harga Satuan LNG
          </h5>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Distribution of unit price components
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
          <span className="sr-only">Chart menu</span>
        </button>
      </div>
      <div className="flex flex-col items-center relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[260px] w-full">
            <div className="animate-pulse w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 mb-3" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Loading chart...
            </span>
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center h-[260px] text-center text-gray-500 dark:text-gray-400">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-lg">📊</span>
            </div>
            <p className="text-sm font-medium">No data available</p>
            <p className="text-xs mt-1">Data will appear once inputs are configured.</p>
          </div>
        ) : (
          <>
            <Chart
              options={options}
              series={series}
              type="pie"
              className="w-full"
              height={260}
            />
            <div className="mt-3 w-full">
              <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {legendData.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-800"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
                      {item.label}
                    </span>
                    <span className="text-xs tabular-nums font-semibold text-gray-900 dark:text-gray-100">
                      {item.pct}%
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 flex justify-between">
                <span>Total</span>
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {total}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartItems;
