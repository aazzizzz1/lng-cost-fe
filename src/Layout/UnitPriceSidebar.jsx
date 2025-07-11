import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  toggleHargaSatuan,
} from "../Provider/GlobalSlice";

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
  const {
    isHargaSatuanOpen,
  } = useSelector((state) => state.global);

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
          {/* LNG Plant Dropdown */}
          <li>
            <DropdownMenu
              title="Liquifection Plant"
              items={[
                {
                  label: "Onshore LNG Plant",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/liquifaction-plant?tab=onshore&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/liquifaction-plant?tab=onshore&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/liquifaction-plant?tab=onshore&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/liquifaction-plant?tab=onshore&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/liquifaction-plant?tab=onshore&kategori=Testing",
                    },
                  ],
                },
                {
                  label: "Offshore LNG Plant",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/liquifaction-plant?tab=offshore&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/liquifaction-plant?tab=offshore&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/liquifaction-plant?tab=offshore&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/liquifaction-plant?tab=offshore&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/liquifaction-plant?tab=offshore&kategori=Testing",
                    },
                  ],
                },
              ]}
            />
          </li>
          {/* Transportasi Dropdown */}
          <li>
            <DropdownMenu
              title="Transportasi"
              items={[
                {
                  label: "LNG Carier (LNGC)",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/transport?tab=lngc&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/transport?tab=lngc&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/transport?tab=lngc&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/transport?tab=lngc&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/transport?tab=lngc&kategori=Testing",
                    },
                  ],
                },
                {
                  label: "LNG Barge",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/transport?tab=lngbarge&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/transport?tab=lngbarge&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/transport?tab=lngbarge&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/transport?tab=lngbarge&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/transport?tab=lngbarge&kategori=Testing",
                    },
                  ],
                },
                {
                  label: "LNG Trucking",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/transport?tab=lngtrucking&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/transport?tab=lngtrucking&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/transport?tab=lngtrucking&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/transport?tab=lngtrucking&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/transport?tab=lngtrucking&kategori=Testing",
                    },
                  ],
                },
              ]}
            />
          </li>
          {/* Receiving Terminal Dropdown */}
          <li>
            <DropdownMenu
              title="Receiving Terminal"
              items={[
                {
                  label: "FSRU",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/receiving-terminal?tab=fsru&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/receiving-terminal?tab=fsru&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/receiving-terminal?tab=fsru&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/receiving-terminal?tab=fsru&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/receiving-terminal?tab=fsru&kategori=Testing",
                    },
                  ],
                },
                {
                  label: "ORF",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/receiving-terminal?tab=orf&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/receiving-terminal?tab=orf&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/receiving-terminal?tab=orf&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/receiving-terminal?tab=orf&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/receiving-terminal?tab=orf&kategori=Testing",
                    },
                  ],
                },
                {
                  label: "OTS",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/receiving-terminal?tab=ots&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/receiving-terminal?tab=ots&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/receiving-terminal?tab=ots&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/receiving-terminal?tab=ots&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/receiving-terminal?tab=ots&kategori=Testing",
                    },
                  ],
                },
                {
                  label: "ORU",
                  items: [
                    {
                      label: "Material Konstruksi",
                      link: "/receiving-terminal?tab=oru&kategori=Material Konstruksi",
                    },
                    {
                      label: "Peralatan",
                      link: "/receiving-terminal?tab=oru&kategori=Peralatan",
                    },
                    {
                      label: "Upah",
                      link: "/receiving-terminal?tab=oru&kategori=Upah",
                    },
                    {
                      label: "Jasa",
                      link: "/receiving-terminal?tab=oru&kategori=Jasa",
                    },
                    {
                      label: "Testing",
                      link: "/receiving-terminal?tab=oru&kategori=Testing",
                    },
                  ],
                },
              ]}
            />
          </li>
          {/* Material & Package Dropdown */}
          <li>
            <DropdownMenu
              title="Material & Package"
              items={[
                {
                  label: "Material",
                  link: "/material-package?tab=material",
                },
                {
                  label: "Package",
                  link: "/material-package?tab=package",
                },
              ]}
            />
          </li>
        </ul>
      )}
    </li>
  );
};

export default UnitPriceSidebar;