import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilterJenis } from "../Provider/Project/ConstractionCostSlice";
import { useNavigate } from "react-router-dom";

const ConstructionPriceSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openLiquifaction, setOpenLiquifaction] = useState(false);
  const [openTransportasi, setOpenTransportasi] = useState(false);
  const [openReceiving, setOpenReceiving] = useState(false);
  const [openMaterial, setOpenMaterial] = useState(false);

  const handleClick = (jenis) => {
    dispatch(setFilterJenis(jenis));
    navigate("/construction-cost");
  };

  return (
    <li>
      <button
        type="button"
        className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        onClick={() => setOpen((v) => !v)}
      >
        {/* SVG di samping tombol Harga Konstruksi */}
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
          className={`w-6 h-6 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
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
      {open && (
        <ul className="py-2 space-y-2">
          {/* Liquifection Plant */}
          <li>
            <button
              type="button"
              className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              onClick={() => setOpenLiquifaction((v) => !v)}
            >
              <span className="flex-1 text-left whitespace-nowrap ml-3">
                Liquifection Plant
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  openLiquifaction ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openLiquifaction && (
              <ul className="ml-4 space-y-1">
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("Onshore LNG Plant")}
                  >
                    Onshore LNG Plant
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("Offshore LNG Plant")}
                  >
                    Offshore LNG Plant
                  </button>
                </li>
              </ul>
            )}
          </li>
          {/* Transportasi */}
          <li>
            <button
              type="button"
              className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              onClick={() => setOpenTransportasi((v) => !v)}
            >
              <span className="flex-1 text-left whitespace-nowrap ml-3">
                Transportasi
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  openTransportasi ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openTransportasi && (
              <ul className="ml-4 space-y-1">
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("LNGC")}
                  >
                    LNG Carier (LNGC)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("LNG Barge")}
                  >
                    LNG Barge
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("LNG Trucking")}
                  >
                    LNG Trucking
                  </button>
                </li>
              </ul>
            )}
          </li>
          {/* Receiving Terminal */}
          <li>
            <button
              type="button"
              className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              onClick={() => setOpenReceiving((v) => !v)}
            >
              <span className="flex-1 text-left whitespace-nowrap ml-3">
                Receiving Terminal
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  openReceiving ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openReceiving && (
              <ul className="ml-4 space-y-1">
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("FSRU")}
                  >
                    FSRU
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("ORF")}
                  >
                    ORF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("OTS")}
                  >
                    OTS
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("ORU")}
                  >
                    ORU
                  </button>
                </li>
              </ul>
            )}
          </li>
          {/* Material & Package */}
          <li>
            <button
              type="button"
              className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              onClick={() => setOpenMaterial((v) => !v)}
            >
              <span className="flex-1 text-left whitespace-nowrap ml-3">
                Material & Package
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  openMaterial ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openMaterial && (
              <ul className="ml-4 space-y-1">
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("Material")}
                  >
                    Material
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                    onClick={() => handleClick("Package")}
                  >
                    Package
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      )}
    </li>
  );
};

export default ConstructionPriceSidebar;