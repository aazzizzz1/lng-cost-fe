import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterJenis, fetchUniqueInfrastruktur } from "../Provider/ConstructionCost/ConstractionCostSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner/Spinner";
import { toggleHargaKonstruksi } from "../Provider/GlobalSlice"; // renamed import

const ConstructionPriceSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uniqueInfrastruktur = {}, uniqueLoading } = useSelector((state) => state.constractionCost); // ganti: tambah uniqueLoading
  const { isHargaKonstruksiOpen } = useSelector((state) => state.global); // renamed state key
  const [openSections, setOpenSections] = useState({});
  const [openInfra, setOpenInfra] = useState({});

  const handleToggleHargaKonstruksi = () => { // renamed handler
    dispatch(toggleHargaKonstruksi());
    if (!isHargaKonstruksiOpen && Object.keys(uniqueInfrastruktur).length === 0) {
      dispatch(fetchUniqueInfrastruktur());
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleInfra = (infraKey) => {
    setOpenInfra((prev) => ({ ...prev, [infraKey]: !prev[infraKey] }));
  };

  const handleSelectTipe = (tipe) => {
    toggleSection(tipe); // hanya expand/collapse
  };

  const handleSelectInfra = (tipe, infraKey) => {
    toggleInfra(`${tipe}-${infraKey}`); // hanya expand/collapse
  };

  const handleSelectVolume = (tipe, infraKey, volume) => {
    dispatch(setFilterJenis({ tipe, proyek: infraKey, volume }));
    const qs = new URLSearchParams({ tipe, infrastruktur: infraKey, volume }).toString();
    navigate(`/construction-cost?${qs}`);
  };

  return (
    <li>
      <button
        type="button"
        className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        onClick={handleToggleHargaKonstruksi} // updated
      >
        {/* Icon */}
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="flex-1 ml-3 text-left whitespace-nowrap">
          Harga Konstruksi
        </span>
        <svg
          aria-hidden="true"
          className={`w-6 h-6 transform transition-transform ${isHargaKonstruksiOpen ? "rotate-180" : ""}`} // updated
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isHargaKonstruksiOpen && (
        <ul className="py-2 space-y-2">
          {uniqueLoading && ( // ganti dari loading
            <li className="flex justify-center items-center py-4">
              <Spinner />
            </li>
          )}
          {!uniqueLoading &&
            Object.entries(uniqueInfrastruktur).map(([tipe, infraObj]) => (
              <li key={tipe}>
                {/* Level 1: Tipe */}
                <button
                  type="button"
                  className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => handleSelectTipe(tipe)} // fetch + toggle
                >
                  <span className="flex-1 text-left whitespace-nowrap ml-3">
                    {tipe}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-auto transition-transform ${openSections[tipe] ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections[tipe] && (
                  <ul className="ml-4 space-y-1">
                    {/* Level 2: Infrastruktur */}
                    {Object.entries(infraObj).map(([infraKey, volumes]) => (
                      <li key={infraKey}>
                        <button
                          type="button"
                          className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                          onClick={() => handleSelectInfra(tipe, infraKey)} // fetch + toggle
                        >
                          <span className="flex items-center flex-1 text-left">
                            {/* Icon penanda dropdown volume */}
                            <svg
                              className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-300"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 19l9 4 9-4"
                              />
                            </svg>
                            {infraKey}
                          </span>
                          <svg
                            className={`w-4 h-4 ml-2 transition-transform ${openInfra[`${tipe}-${infraKey}`] ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openInfra[`${tipe}-${infraKey}`] && (
                          <ul className="ml-12 space-y-1">
                            {volumes.map((v, idx) => {
                              const unit =
                                v?.satuanVolume || v?.satuan || v?.unit || "";
                              const label = unit
                                ? `${v.volume} ${unit}`
                                : `${v.volume}`;
                              return (
                                <li key={idx}>
                                  <button
                                    type="button"
                                    className="flex items-center p-2 w-full text-[11px] font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => handleSelectVolume(tipe, infraKey, v.volume)}
                                  >
                                    {label}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      )}
    </li>
  );
};

export default ConstructionPriceSidebar;