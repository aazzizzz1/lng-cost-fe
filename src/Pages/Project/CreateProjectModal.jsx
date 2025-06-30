import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Tambahkan useDispatch
import { setItems } from "../../Provider/Project/detailCreateProjectConstructionSlice"; // Import setItems

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
  { value: "Onshore LNG Plant", label: "Onshore LNG Plant" },
  { value: "Offshore LNG Plant", label: "Offshore LNG Plant" },
  { value: "LNG Carrier", label: "LNG Carrier" },
  { value: "LNG Trucking", label: "LNG Trucking" },
  { value: "FSRU", label: "FSRU" },
  { value: "ORF", label: "ORF" },
  { value: "OTS", label: "OTS" },
  { value: "ORU", label: "ORU" },
];

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [jenis, setJenis] = useState("Onshore LNG Plant");
  const [kategori, setKategori] = useState("");
  const [volume, setVolume] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [levelAACE, setLevelAACE] = useState(4);
  const [harga, setHarga] = useState("");
  const [useGalileo, setUseGalileo] = useState(""); // Ubah nama state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const provinces = useSelector((state) => state.administrator.provinces); // Ambil dari redux
  const costs = useSelector((state) => state.constractionCost.costs);
  const inflasiList = useSelector((state) => state.administrator.inflasi);

  // Auto set kategori FSRU & LNGC berdasarkan volume
  React.useEffect(() => {
    if (jenis === "FSRU" && volume) {
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
    } else if ((jenis === "LNG Carrier" || jenis === "LNGC") && volume) {
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
    }
    // Jika bukan FSRU/LNGC, jangan auto set kategori
  }, [jenis, volume]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gabungkan satuan ke kategori jika kategori berupa angka saja
    let kategoriFinal = kategori;
    const satuan = satuanByJenis[jenis] || "";
    if (
      kategori &&
      satuan &&
      !kategori.toLowerCase().includes(satuan.toLowerCase())
    ) {
      // Jika kategori hanya angka, tambahkan satuan
      if (/^\d+(\.\d+)?$/.test(kategori.trim())) {
        kategoriFinal = `${kategori.trim()} ${satuan}`;
      }
    }
    const newProject = {
      id: Date.now(), // Auto generate project id
      name,
      jenis,
      kategori: kategoriFinal,
      lokasi,
      tahun: Number(tahun),
      levelAACE,
      harga: Number(harga),
      useGalileo,
      volume: Number(volume),
    };
    onCreate(newProject);

    // --- AUTO FILL DETAIL CONSTRUCTION JIKA ADA DI COST DB ---
    // Cari data yang cocok di constractionCost (jenis & volume)
    const summaryJenis = (() => {
      if (jenis.toLowerCase().includes("fsru")) return "FSRU";
      if (jenis.toLowerCase().includes("plant")) return "LNG Plant";
      if (jenis.toLowerCase().includes("carrier")) return "LNGC";
      return jenis;
    })();
    // Cari cost yang cocok (jenis & volume)
    const matchedCosts = costs.filter(
      (item) =>
        String(item.tipe).toLowerCase() ===
          String(summaryJenis).toLowerCase() &&
        Number(item.volume) === Number(volume)
    );
    if (matchedCosts.length > 0) {
      // Penyesuaian harga satuan (tahun, lokasi, inflasi)
      const inflasiProject = (() => {
        const inf = inflasiList?.find((i) => Number(i.year) === Number(tahun));
        return inf ? inf.value : 5.0;
      })();
      const getCCI = (nama) => {
        const prov = provinces.find((p) => p.name === nama);
        return prov ? prov.cci : 100;
      };
      const cciBanjarmasin = (() => {
        const prov = provinces.find(
          (p) => p.name.toLowerCase().includes("banjar") && p.cci === 100.7
        );
        return prov ? prov.cci : 100;
      })();
      const items = matchedCosts.map((row) => {
        const tahunItem = row.tahun || tahun;
        const lokasiItem = row.lokasi || lokasi;
        const hargaSatuanItem = row.hargaSatuan || row.harga || 0;
        const n = Number(tahun) - Number(tahunItem);
        const r = Number(inflasiProject) / 100;
        let hargaTahunProject = hargaSatuanItem;
        if (n > 0) {
          hargaTahunProject = hargaSatuanItem * Math.pow(1 + r, n);
        }
        const cciItem = getCCI(lokasiItem);
        let hargaBanjarmasin = hargaTahunProject * (cciBanjarmasin / cciItem);
        const cciProject = getCCI(lokasi);
        let hargaLokasiProject = hargaBanjarmasin * (cciProject / 100);
        return {
          ...row,
          hargaSatuan: Math.round(hargaLokasiProject),
          totalHarga: (row.qty || 1) * Math.round(hargaLokasiProject),
          tahun: Number(tahun),
          lokasi,
          proyek: name,
          projectId: newProject.id, // Pastikan projectId ikut
        };
      });
      dispatch(setItems(items));
    } else {
      dispatch(setItems([])); // Kosongkan jika tidak ada
    }

    onClose();
    // reset form
    setName("");
    setJenis("Onshore LNG Plant");
    setKategori("");
    setLokasi("");
    setTahun(new Date().getFullYear());
    setLevelAACE("Level 4");
    setHarga("");
    setUseGalileo("");
    setVolume("");
    // redirect ke detail construction cost
    navigate(`/project/${newProject.id}/detail-construction`);
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
                  Jenis
                </label>
                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
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
                    {satuanByJenis[jenis] || "-"}
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
                  readOnly={jenis === "FSRU" && volume}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Lokasi
                </label>
                {/* Dropdown lokasi dari administrator slice */}
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
                  // value={inflasi}
                  // onChange={e => setTahun(e.target.value)}
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
                Add Project
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
