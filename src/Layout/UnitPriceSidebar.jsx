import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUniqueFields } from "../Provider/HargaSatuan/unitPriceSlice";
import { toggleHargaSatuan } from "../Provider/GlobalSlice";
import { useNavigate } from "react-router-dom";

const UnitPriceSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isHargaSatuanOpen } = useSelector((state) => state.global);
  const { uniqueFields = {}, uniqueLoading } = useSelector((state) => state.unitPrice || {});
  const [openTipe, setOpenTipe] = useState({});
  const [openInfra, setOpenInfra] = useState({});

  const handleToggleHargaSatuan = () => {
    dispatch(toggleHargaSatuan());
    if (!isHargaSatuanOpen) {
      dispatch(fetchUniqueFields()); // Fetch unique fields when opening the sidebar
    }
  };

  const toggleTipe = (tipe) => {
    setOpenTipe((prev) => ({ ...prev, [tipe]: !prev[tipe] }));
  };

  const toggleInfra = (infra) => {
    setOpenInfra((prev) => ({ ...prev, [infra]: !prev[infra] }));
  };

  const handleNavigateWithParams = (tipe, infra, kelompok) => {
    const queryParams = new URLSearchParams({
      tipe: tipe || "",
      infrastruktur: infra || "",
      kelompok: kelompok || "",
    }).toString();
    navigate(`/unitprice?${queryParams}`);
  };

  return (
    <li>
      <button
        type="button"
        className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        onClick={handleToggleHargaSatuan}
      >
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
            d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="flex-1 ml-3 text-left whitespace-nowrap">
          Unit Price
        </span>
        <svg
          aria-hidden="true"
          className={`w-6 h-6 transform transition-transform ${isHargaSatuanOpen ? "rotate-180" : ""}`}
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
      {isHargaSatuanOpen && (
        <ul className="py-2 space-y-2">
          {uniqueLoading ? (
            <li className="flex justify-center items-center py-4">
              <div className="loader border-t-4 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
            </li>
          ) : (
            Object.keys(uniqueFields).map((tipe) => (
              <li key={tipe}>
                <button
                  type="button"
                  className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => toggleTipe(tipe)}
                >
                  <span className="flex-1 text-left whitespace-nowrap ml-3">{tipe}</span>
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 transform transition-transform ${openTipe[tipe] ? "rotate-180" : ""}`}
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
                {openTipe[tipe] && (
                  <ul className="py-2 space-y-2 pl-4">
                    {Object.keys(uniqueFields[tipe] || {}).map((infra) => (
                      <li key={infra}>
                        <button
                          type="button"
                          className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                          onClick={() => toggleInfra(infra)}
                        >
                          <span className="flex-1 text-left whitespace-nowrap ml-3">{infra}</span>
                          <svg
                            aria-hidden="true"
                            className={`w-4 h-4 transform transition-transform ${openInfra[infra] ? "rotate-180" : ""}`}
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
                        {openInfra[infra] && (
                          <ul className="py-2 space-y-2 pl-4">
                            {(uniqueFields[tipe][infra] || []).map((kelompok) => (
                              <li key={kelompok}>
                                <button
                                  type="button"
                                  className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                  onClick={() => handleNavigateWithParams(tipe, infra, kelompok)}
                                >
                                  <span className="flex-1 text-left whitespace-nowrap ml-3">{kelompok}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </li>
  );
};

export default UnitPriceSidebar;