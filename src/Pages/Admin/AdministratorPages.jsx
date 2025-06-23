import React, { Component, useState } from "react";
import AdministratorLocation from "./AdministratorLocation";
import AdministratorInflasi from "./AdministratorInflasi";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const TABS = [
  {
    key: "location",
    label: "Locations",
    icon: (
      <svg
        className="w-[20px] h-[20px] me-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
        />
      </svg>
    ),
  },
  {
    key: "inflasi",
    label: "Inflasi",
    icon: (
      <svg
        className="w-3 h-3 me-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
        />
      </svg>
    ),
  },
  {
    key: "downloads",
    label: "Downloads",
    icon: (
      <svg
        className="w-3 h-3 me-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
        <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
    ),
  },
];

const AdministratorPages = () => {
  const [tab, setTab] = useState("location");

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Management and Configuration Administrator
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Management and Configuration Admin Detail
        </p>
        <div className="flex justify-center items-center my-8">
          <div className="inline-flex rounded-md shadow-xs" role="tablist">
            {TABS.map((t, idx) => (
              <button
                key={t.key}
                type="button"
                className={
                  "inline-flex items-center px-4 py-2 text-sm font-medium border " +
                  (idx === 0 ? "rounded-s-lg " : "") +
                  (idx === TABS.length - 1 ? "rounded-e-lg " : "") +
                  (tab === t.key
                    ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:text-white"
                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700")
                }
                onClick={() => setTab(t.key)}
                aria-selected={tab === t.key}
                role="tab"
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          {tab === "location" && <AdministratorLocation />}
          {tab === "inflasi" && <AdministratorInflasi />}
          {tab === "downloads" && (
            <div className="text-center text-gray-500 dark:text-gray-300 py-8">
              Download feature coming soon.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdministratorPages;
