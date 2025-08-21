import React, { useState } from "react";
import ChartItems from "./ChartItems";
import { useSelector } from "react-redux";
import CreateProjectModal from "../Project/CreateProjectModal";
import { useNavigate } from "react-router-dom";
import ModalCapacityFactor from "../CapacityFactor/ModalCapacityFactor";

const AccentRing = ({ accent, styles }) => {
  const a = styles[accent];
  return (
    <span className={`absolute inset-0 rounded-2xl ${a.ringClass} opacity-0 group-hover:opacity-100 transition-opacity`} />
  );
};

const Dashboard = () => {
  const {
    statCards,
    quickActions,
    recentEstimates,
    infrastructures,
    accentStyles,
    chartGradients,
  } = useSelector((s) => s.dashboard);
  const { labels: chartLabels, series: chartSeries, loading: chartLoading } = useSelector(
    (state) => state.dashboard.chart
  );
  const totalValue = chartSeries.reduce((a, b) => a + (typeof b === "number" ? b : 0), 0);
  const topItems = chartLabels
    .map((l, i) => ({ label: l, value: chartSeries[i] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="px-4 py-6 space-y-8 max-w-7xl mx-auto">
        {/* Quick Actions / Recent / Stats */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-blue-600">⚡</span> Quick Actions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Common tasks and shortcuts</p>
            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {quickActions.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    if (a.id === "new-estimate") setShowCreateModal(true);
                    else if (a.id === "view-reports") navigate("/rekap"); // NEW
                    // else if (a.id === "cost-analytics") navigate("/unitprice"); // OPTIONAL example route
                    else if (a.id === "cost-analytics") setShowCapacityModal(true);
                  }}
                  className="group flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-800/60 hover:bg-blue-50 dark:hover:bg-gray-700/70 text-left transition-colors"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-white">
                    {a.label}
                  </span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-opacity">
                    Go →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Estimates */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-emerald-600">🗂️</span> Recent Estimates
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your latest cost estimations</p>
            <ul className="space-y-3">
              {recentEstimates.map((r) => (
                <li
                  key={r.id}
                  className="group relative rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white/70 dark:bg-gray-800/60 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{r.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{r.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{r.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{r.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View all →
            </button>
          </div>

          {/* Stats Column */}
          <div className="flex flex-col gap-5">
            {statCards.map((c) => (
              <div
                key={c.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 shadow-sm hover:shadow-md transition-all p-5"
              >
                <div className={`absolute inset-0 ${c.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-700/60 shadow-inner text-xl">
                    {c.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{c.label}</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{c.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart + Metrics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartItems />
          <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm p-6 overflow-hidden flex flex-col">
            <div className="pointer-events-none absolute -top-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-100/70 to-transparent dark:from-indigo-500/10 blur-2xl" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300 text-xs shadow-inner">
                    Σ
                  </span>
                  Key Metrics
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Composition & top contributors
                </p>
              </div>
              <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                View details →
              </button>
            </div>

            {chartLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between mb-1">
                      <div className="h-2.5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-2.5 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="h-2.5 w-full rounded bg-gray-100 dark:bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : totalValue === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 text-gray-500 dark:text-gray-400">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                  <span className="text-lg">📉</span>
                </div>
                <p className="text-sm font-medium">No metric data</p>
                <p className="text-[11px] mt-1">Populate unit price sources to see metrics.</p>
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {topItems.map((item, idx) => {
                    const pct = totalValue ? (item.value / totalValue) * 100 : 0;
                    const grad = chartGradients[idx % chartGradients.length]; // string class like 'bg-gradient-metric-1'
                    return (
                      <li key={item.label} className="relative">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate pr-2">
                            {idx + 1}. {item.label}
                          </span>
                          <span className="text-xs font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                            {pct.toFixed(pct >= 10 ? 0 : 1)}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${grad} transition-all duration-500 ease-out shadow-inner`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Segments
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {chartLabels.length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Top Share
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {topItems.length ? Math.round((topItems[0].value / totalValue) * 100) : 0}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                      {totalValue}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* LNG Infrastructure */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-600">🧾</span> LNG Infrastructure
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {infrastructures.map((c) => {
              const a = accentStyles[c.accent];
              return (
                <div key={c.id} className="group relative overflow-hidden rounded-2xl p-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm hover:shadow-md transition-all">
                  <AccentRing accent={c.accent} styles={accentStyles} />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${a.iconBgClass} ${a.iconBorder} border`}>
                      {c.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {c.label}
                      </span>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {c.desc}
                      </p>
                      <button className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                        Details <span>→</span>
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-transparent transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <ModalCapacityFactor isOpen={showCapacityModal} onClose={() => setShowCapacityModal(false)} />
    </section>
  );
};

export default Dashboard;
