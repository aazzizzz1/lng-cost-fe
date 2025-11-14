import React, { Component } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { selectOpexInfra, selectOpexUI, setActiveInfra, setActiveTab } from "../../Provider/Opex/OpexSlice";
import OpexChart from './OpexChart'

class ErrorBoundary extends Component{
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error("OpexPages ErrorBoundary:", err, info); }
  render() { return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children; }
}

const OpexPages = () => {
  const dispatch = useDispatch();
  const infrastructures = useSelector(selectOpexInfra);
  const ui = useSelector(selectOpexUI);

  const switchInfra = (infraId) => {
    const infra = infrastructures.find((i) => i.id === infraId);
    const firstTab = infra?.tabs?.[0]?.id;
    dispatch(setActiveInfra(infraId));
    if (firstTab) dispatch(setActiveTab({ infraId, tabId: firstTab }));
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">Operational Expenditure (OPEX) Data Overview</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Access reference-based operational cost data to support performance analysis and budget planning.
        </p>

        {/* Infra switcher */}
        <div className="flex flex-wrap gap-2 mb-4">
          {infrastructures.map((infra) => (
            <button
              key={infra.id}
              onClick={() => switchInfra(infra.id)}
              title={infra.desc}
              className={
                "px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors " +
                (ui.activeInfra === infra.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700")
              }
            >
              {infra.label}
            </button>
          ))}
        </div>

        {/* Render OpexChart ONCE */}
        <OpexChart />
      </div>
    </ErrorBoundary>
  );
};

export default OpexPages;