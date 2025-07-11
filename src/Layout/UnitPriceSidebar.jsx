import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchTransportData } from "../Provider/HargaSatuan/transportSlice";
import { toggleHargaSatuan } from "../Provider/GlobalSlice";

// DropdownMenu with nested items support
function DropdownMenu({ title, items }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Helper to check if a path is active
  const isActive = (path) => location.pathname + location.search === path;

  return (
    <>
      <button
        type="button"
        className="flex items-center p-2 pl-8 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm flex-1 ml-3 text-left whitespace-nowrap">
          {title}
        </span>
        <svg
          aria-hidden="true"
          className={`w-4 h-4 ml-auto transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="py-2 space-y-2 ml-4">
          {items.map((item) =>
            item.items ? (
              // Nested dropdown
              <li key={item.label}>
                <DropdownMenu title={item.label} items={item.items} />
              </li>
            ) : item.link ? (
              <Link to={item.link} key={item.label}>
                <li
                  className={
                    isActive(item.link)
                      ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                      : ""
                  }
                >
                  <span
                    className={`text-xs flex items-center p-2 w-full font-medium rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8 ${
                      isActive(item.link) ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              </Link>
            ) : (
              <li key={item.label}>
                <span className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8">
                  {item.label}
                </span>
              </li>
            )
          )}
        </ul>
      )}
    </>
  );
}

const UnitPriceSidebar = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.transport);
  const { isHargaSatuanOpen } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(fetchTransportData());
  }, [dispatch]);

  // Generate Transportasi dropdown dynamically
  const transportDropdown = {
    title: "Transportation",
    items: [...new Set(data.map((item) => item.infrastruktur))].map((infra) => ({
      label: infra,
      items: [...new Set(data.filter((item) => item.infrastruktur === infra).map((item) => item.kelompok))].map((kelompok) => ({
        label: kelompok,
        link: `/transport?tab=${infra.toLowerCase().replace(/\s+/g, '')}&kelompok=${encodeURIComponent(kelompok)}`,
      })),
    })),
  };

  return (
    <li>
      <button
        type="button"
        className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        onClick={() => dispatch(toggleHargaSatuan())}
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
          Harga Satuan
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
          {/* Transportasi Dropdown */}
          <li>
            <DropdownMenu title={transportDropdown.title} items={transportDropdown.items} />
          </li>
        </ul>
      )}
    </li>
  );
};

export default UnitPriceSidebar;