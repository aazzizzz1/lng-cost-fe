import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProvinces } from "../../Provider/administratorSlice";
import { fetchRecommendedCosts, createProject } from "../../Provider/Project/ProjectSlice";
import { setItems } from "../../Provider/Project/detailCreateProjectConstructionSlice";

// Mapping satuan berdasarkan jenis project
const satuanByJenis = {
  "Onshore LNG Plant": "MTPA",
  "Offshore LNG Plant": "MTPA",
  "LNG Carrier": "m³",
  "LNG Trucking": "CBM",
  FSRU: "m³ / MMSCFD",
  ORF: "MMSCFD",
  OTS: "MMSCFD",
  ORU: "m³ / MMSCFD",
};

const jenisOptions = [
  { value: "LNGBV", label: "LNG Bunkering Vessel" },
  { value: "FSRU", label: "Floating Storage Regasification Unit" },
  { value: "LNGC", label: "LNG Carrier" },
  { value: "LNG Trucking", label: "LNG Trucking" },
  { value: "Onshore LNG Plant", label: "Onshore LNG Plant" },
  { value: "Offshore LNG Plant", label: "Offshore LNG Plant" },
  { value: "ORF", label: "Onshore Receiving Facility" },
  { value: "OTS", label: "Offshore Terminal System" },
  { value: "ORU", label: "Onshore Regasification Unit" },
];

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [infrastruktur, setInfrastruktur] = useState("Onshore LNG Plant");
  const [kategori, setKategori] = useState("");
  const [volume, setVolume] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [inflasi, setInflasi] = useState(5.0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const provinces = useSelector((state) => state.administrator.provinces);

  // Fetch provinces on mount
  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Auto set kategori FSRU & LNGC berdasarkan volume
  React.useEffect(() => {
    if (infrastruktur === "FSRU" && volume) {
      const v = Number(volume);
      if (v > 150000) {
        setKategori("BIG SCALE LNG FSRU [> 150.000 m³]");
      } else if (v >= 50000) {
        setKategori("MID SCALE LNG FSRU [50.000 - 150.000 m³]");
      } else if (v > 0) {
        setKategori("SMALL SCALE LNG FSRU [< 30.000 m³]");
      } else {
        setKategori("");
      }
    } else if (infrastruktur === "LNGC" && volume) {
      const v = Number(volume);
      if (v > 100000) {
        setKategori("BIG SCALE LNG CARRIER (LNGC) [> 100.000 m³]");
      } else if (v >= 30000) {
        setKategori("MID SCALE LNG CARRIER (LNGC) [30.000 - 100.000 m³]");
      } else if (v > 0) {
        setKategori("SMALL SCALE LNG CARRIER (LNGC) [< 30.000 m³]");
      } else {
        setKategori("");
      }
    } else if (infrastruktur === "LNGBV" && volume) {
      const v = Number(volume);
      if (v > 5000) {
        setKategori("BIG SCALE LNG BUNKERING VESSEL [> 5.000 m³]");
      } else if (v >= 1000) {
        setKategori("MID SCALE LNG BUNKERING VESSEL [1.000 - 5.000 m³]");
      } else if (v > 0) {
        setKategori("SMALL SCALE LNG BUNKERING VESSEL [< 1.000 m³]");
      } else {
        setKategori("");
      }
    }
    // Jika bukan FSRU/LNGC/LNGBV, jangan auto set kategori
  }, [infrastruktur, volume]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      name,
      infrastruktur,
      lokasi,
      volume: Number(volume),
      tahun: Number(tahun),
      kategori,
      inflasi: Number(inflasi),
    };

    try {
      const response = await dispatch(fetchRecommendedCosts(projectData));
      const recommendedCosts = response?.payload || []; // Ensure response payload is handled

      if (!Array.isArray(recommendedCosts)) {
        console.error("Invalid recommended costs data:", recommendedCosts);
        alert("Failed to fetch recommendations. Please try again.");
        return;
      }

      const newProject = {
        id: Date.now(),
        name,
        infrastruktur,
        kategori,
        lokasi,
        tahun: Number(tahun),
        inflasi: Number(inflasi),
        volume: Number(volume),
      };

      dispatch(createProject(newProject));

      const constructionItems = recommendedCosts.map((cost) => ({
        kode: cost.id,
        uraian: cost.uraian,
        satuan: cost.satuan,
        qty: cost.qty,
        hargaSatuan: cost.hargaSatuan,
        totalHarga: cost.totalHarga,
        kelompok: cost.kelompok,
        tahun: cost.tahun,
        proyek: newProject.name,
        lokasi: newProject.lokasi,
        tipe: newProject.infrastruktur,
        aaceClass: cost.aaceClass,
        isCategory: false,
      }));

      dispatch(setItems(constructionItems));
      onClose();
      navigate(`/project/${newProject.id}/detail-construction`);
      // navigate(`/project`);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to fetch recommendations. Please try again.");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[32rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a new Project
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 sm:gap-6 w-full">
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nama Project
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Project"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Infrastruktur
                </label>
                <select
                  value={infrastruktur}
                  onChange={(e) => setInfrastruktur(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  {jenisOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Volume
                </label>
                <div className="flex flex-row gap-2">
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="Volume"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                  <div className="text-sm flex items-center px-2 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                    {satuanByJenis[infrastruktur] || "-"}
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Kategori
                </label>
                <input
                  type="text"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="Kategori"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  readOnly={infrastruktur === "FSRU" && volume}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Lokasi
                </label>
                <select
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="">Pilih Lokasi</option>
                  {provinces.map((prov) => (
                    <option key={prov.code} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tahun
                </label>
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  placeholder="Tahun"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Asumsi Inflasi (%)
                </label>
                <input
                  type="number"
                  value={inflasi}
                  onChange={(e) => setInflasi(e.target.value)}
                  placeholder="5%"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              {/* //Tambahan dropdown perhitungan Galileo
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Perhitungan Galileo
                </label>
                <select
                  value={useGalileo}
                  onChange={e => setUseGalileo(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="ya">Ya</option>
                  <option value="tidak">Tidak</option>
                </select>
              </div> */}
            </div>
            <div className="gap-2 flex flex-row mt-4">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Get Recommendations
              </button>
              <button
                type="button"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                onClick={onClose}
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  ) : null;
};

export default CreateProjectModal;