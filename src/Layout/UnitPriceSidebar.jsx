import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTransportData } from "../Provider/HargaSatuan/transportSlice";
import { toggleHargaSatuan } from "../Provider/GlobalSlice";

const UnitPriceSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isHargaSatuanOpen } = useSelector((state) => state.global);
  const { data: transportData } = useSelector((state) => state.transport);

  const [openSections, setOpenSections] = useState({});
  const [transportDropdownData, setTransportDropdownData] = useState([]);

  useEffect(() => {
    if (openSections["root-Transportasi"]) {
      dispatch(fetchTransportData({ tipe: "transportation" }));
    }
  }, [dispatch, openSections]);

  useEffect(() => {
    if (transportData.length > 0) {
      const dropdownData = [...new Set(transportData.map((item) => item.infrastruktur))].map(
        (infra) => ({
          label: infra,
          items: [...new Set(transportData.filter((item) => item.infrastruktur === infra).map((item) => item.kelompok))].map(
            (kelompok) => ({
              label: kelompok,
              link: `/transport?tab=${infra.toLowerCase().replace(/\s+/g, "")}&kelompok=${encodeURIComponent(kelompok)}`,
            })
          ),
        })
      );
      setTransportDropdownData(dropdownData);
    }
  }, [transportData]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTransportClick = () => {
    navigate("/transportation");
  };

  const renderItems = (items, parentKey) => {
    return items.map((item) => (
      <li key={item.label}>
        {item.items ? (
          <>
            <button
              type="button"
              className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              onClick={() => toggleSection(`${parentKey}-${item.label}`)}
            >
              <span className="flex-1 text-left whitespace-nowrap ml-3">{item.label}</span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  openSections[`${parentKey}-${item.label}`] ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSections[`${parentKey}-${item.label}`] && (
              <ul className="ml-4 space-y-1">{renderItems(item.items, `${parentKey}-${item.label}`)}</ul>
            )}
          </>
        ) : (
          <span className="flex items-center p-2 pl-8 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8">
            {item.label}
          </span>
        )}
      </li>
    ));
  };

  const sidebarData = [
    {
      label: "Liquifection Plant",
      items: [
        {
          label: "Onshore LNG Plant",
          items: [
            { label: "Material Konstruksi" },
            { label: "Peralatan" },
            { label: "Upah" },
            { label: "Jasa" },
            { label: "Testing" },
          ],
        },
        {
          label: "Offshore LNG Plant",
          items: [
            { label: "Material Konstruksi" },
            { label: "Peralatan" },
            { label: "Upah" },
            { label: "Jasa" },
            { label: "Testing" },
          ],
        },
      ],
    },
    {
      label: "Transportasi",
      items: transportDropdownData,
      onClick: handleTransportClick,
    },
    {
      label: "Receiving Terminal",
      items: [
        {
          label: "FSRU",
          items: [
            { label: "Material Konstruksi" },
            { label: "Peralatan" },
            { label: "Upah" },
            { label: "Jasa" },
            { label: "Testing" },
          ],
        },
        {
          label: "ORF",
          items: [
            { label: "Material Konstruksi" },
            { label: "Peralatan" },
            { label: "Upah" },
            { label: "Jasa" },
            { label: "Testing" },
          ],
        },
        {
          label: "OTS",
          items: [
            { label: "Material Konstruksi" },
            { label: "Peralatan" },
            { label: "Upah" },
            { label: "Jasa" },
            { label: "Testing" },
          ],
        },
        {
          label: "ORU",
          items: [
            { label: "Material Konstruksi" },
            { label: "Peralatan" },
            { label: "Upah" },
            { label: "Jasa" },
            { label: "Testing" },
          ],
        },
      ],
    },
    {
      label: "Material & Package",
      items: [
        { label: "Material" },
        { label: "Package" },
      ],
    },
  ];

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
          {sidebarData.map((item) => (
            <li key={item.label}>
              {item.onClick ? (
                <button
                  type="button"
                  className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={item.onClick}
                >
                  <span className="flex-1 text-left whitespace-nowrap ml-3">{item.label}</span>
                </button>
              ) : (
                renderItems(item.items, "root")
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default UnitPriceSidebar;