import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterByJenis } from "../../Provider/materialSlice";
import PLILogo from "../../Assets/Images/PLI.jpeg";
import { useNavigate } from "react-router-dom";

const MaterialKonstruksi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jenisMaterial = useSelector((state) => state.material.jenisMaterial);

  const handleJenisClick = (jenis) => {
    dispatch(filterByJenis(jenis));
    navigate("/material-konstruksi/tabel");
  };

  return (
      <div className="grid grid-cols-4 gap-4">
        {jenisMaterial.map((jenis) => (
          <button
            key={jenis.id}
            onClick={() => handleJenisClick(jenis.id)}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex flex-col items-center px-2 py-2">
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src={PLILogo}
                alt={jenis.nama}
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {jenis.jumlah}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {jenis.nama}
              </span>
            </div>
          </button>
        ))}
      </div>
  );
};

export default MaterialKonstruksi;
