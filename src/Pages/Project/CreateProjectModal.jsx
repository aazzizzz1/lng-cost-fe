import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProvinces } from "../../Provider/administratorSlice";
import { fetchRecommendedCosts, createProject, fetchUniqueInfrastrukturProyek } from "../../Provider/Project/ProjectSlice";
import { setItems } from "../../Provider/Project/detailCreateProjectConstructionSlice";

// Mapping satuan berdasarkan jenis project
const satuanByJenis = {
  "LNGBV": "m³/CBM",
  "Onshore LNG Plant": "MMSCFD",
  "Offshore LNG Plant": "MMSCFD",
  "LNGC": "m³/CBM",
  "LNG Trucking": "m³/CBM",
  FSRU: "m³/CBM",
  "Onshore Receiving Facility (ORF)": "MMSCFD",
  OTS: "m³/CBM",
  "Onshore Regasification Unit (ORU)": "MMSCFD",
  "Self-Propelled Barge (SPB)": "m³/CBM",
  "Self-Propelled Barge": "m³/CBM",
  "Dolphin SPB Infrastructure": "m³/CBM",
  "Dolphin LNGBV Infrastructure": "m³/CBM",
  "Jetty SPB Infrastructure": "m³/CBM",
  "Jetty LNGBV Infrastructure": "m³/CBM",
};

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  // Infrastruktur default akan di-set setelah data uniqueInfrastrukturProyek didapat
  const [infrastruktur, setInfrastruktur] = useState("");
  const [kategori, setKategori] = useState("");
  const [volume, setVolume] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [inflasi, setInflasi] = useState(5.0);
  const [proyek, setProyek] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const provinces = useSelector((state) => state.administrator.provinces);

  // Ambil unique infrastruktur & proyek dari redux
  const uniqueInfrastrukturProyek = useSelector(
    (state) => state.projects.uniqueInfrastrukturProyek
  );

  // Fetch provinces & unique infrastruktur/proyek on mount
  useEffect(() => {
    dispatch(fetchProvinces());
    dispatch(fetchUniqueInfrastrukturProyek());
  }, [dispatch]);

  // Set default infrastruktur jika belum ada
  useEffect(() => {
    const infraKeys = Object.keys(uniqueInfrastrukturProyek || {});
    if (!infrastruktur && infraKeys.length > 0) {
      setInfrastruktur(infraKeys[0]);
    }
  }, [uniqueInfrastrukturProyek, infrastruktur]);

  // Jenis options diambil dari backend
  const jenisOptions = Object.keys(uniqueInfrastrukturProyek || {}).map((key) => ({
    value: key,
    label: key,
  }));

  // Proyek referensi yang tersedia untuk infrastruktur terpilih
  const availableProyek = uniqueInfrastrukturProyek?.[infrastruktur] || [];

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
      proyek, // NEW: tambahkan proyek ke payload
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
        kode: cost.workcode || cost.id, // CHANGED: prefer workcode
        workcode: cost.workcode || "",   // NEW
        uraian: cost.uraian,
        satuan: cost.satuan,
        qty: cost.qty,
        hargaSatuan: cost.hargaSatuan,
        totalHarga: cost.totalHarga,
        kelompok: cost.kelompok,
        tahun: cost.tahun,
        proyek: newProject.name,
        lokasi: newProject.lokasi,
        tipe: cost.tipe || '', // CHANGED: use tipe from cost, not infrastruktur
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto ring-1 ring-black/5">
        <div className="p-6 md:p-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Add New Project
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter project details to generate recommended construction cost estimates</p>
           <form onSubmit={handleSubmit}>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 sm:gap-6 w-full">
               <div className="sm:col-span-2">
                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Project Name
                 </label>
                 <input
                   type="text"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Nama Project"
                   className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500 block w-full p-3 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
                   required
                 />
               </div>
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Infrastructure
                 </label>
                 <select
                   value={infrastruktur}
                   onChange={(e) => {
                     setInfrastruktur(e.target.value);
                     setProyek(""); // reset proyek jika infrastruktur berubah
                   }}
                   className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                     className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                     required
                   />
                   <div className="text-sm flex items-center px-3 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {satuanByJenis[infrastruktur] || "-"}
                   </div>
                 </div>
               </div>
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Category
                 </label>
                 <input
                   type="text"
                   value={kategori}
                   onChange={(e) => setKategori(e.target.value)}
                   placeholder="Kategori"
                   className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-200 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                   readOnly={infrastruktur === "FSRU" && volume}
                 />
               </div>
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Location
                 </label>
                 <select
                   value={lokasi}
                   onChange={(e) => setLokasi(e.target.value)}
                   className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-200 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                   required
                 >
                   <option value="">Select Location</option>
                   {provinces.map((prov) => (
                     <option key={prov.code} value={prov.name}>
                       {prov.name}
                     </option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Year
                 </label>
                 <input
                   type="number"
                   value={tahun}
                   onChange={(e) => setTahun(e.target.value)}
                   placeholder="Tahun"
                   className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-200 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                 />
               </div>
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Inflation Rate (%)
                 </label>
                 <input
                   type="number"
                   value={inflasi}
                   onChange={(e) => setInflasi(e.target.value)}
                   placeholder="5%"
                   className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-200 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                 />
               </div>
               {/* Dropdown proyek referensi jika tersedia */}
               {availableProyek.length > 0 && (
                 <div>
                   <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Reference Project Technology
                   </label>
                   <select
                     value={proyek}
                     onChange={(e) => setProyek(e.target.value)}
                     className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-200 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                   >
                     <option value="">Select Reference Project</option>
                     {availableProyek.map((p, idx) => (
                       <option key={idx} value={p}>{p}</option>
                     ))}
                   </select>
                 </div>
               )}
             </div>
             <div className="gap-2 flex flex-row mt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg hover:scale-[1.01] transform transition"
              >
                <svg className="w-4 h-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10h4l3 10 4-18 3 10h4"/></svg>
                Get Recommendations
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition"
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