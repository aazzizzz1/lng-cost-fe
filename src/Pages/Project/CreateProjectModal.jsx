import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [jenis, setJenis] = useState("LNG Plant");
  const [kategori, setKategori] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [levelAACE, setLevelAACE] = useState("Level 4");
  const [harga, setHarga] = useState("");
  const [useGalileo, setUseGalileo] = useState(""); // Ubah nama state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      name,
      jenis,
      kategori,
      lokasi,
      tahun: Number(tahun),
      levelAACE,
      harga: Number(harga),
      useGalileo, // Properti baru dengan nama benar
    };
    onCreate(newProject);
    onClose();
    // reset form
    setName("");
    setJenis("LNG Plant");
    setKategori("");
    setLokasi("");
    setTahun(new Date().getFullYear());
    setLevelAACE("Level 4");
    setHarga("");
    setUseGalileo(""); // Reset juga
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
            <div className="grid gap-4 grid-cols-3 sm:grid-cols-2 sm:gap-6 w-full">
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nama Project
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  onChange={e => setJenis(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="LNG Plant">Onshore LNG Plant</option>
                  <option value="LNG Plant">Offshore LNG Plant</option>
                  <option value="Transportation">LNG Carier</option>
                  <option value="Transportation">Barge LNG</option>
                  <option value="Transportation">LNG Trucking</option>
                  <option value="Terminal">FSRU</option> 
                  <option value="Terminal">ORF</option>
                  <option value="Terminal">OTS</option>
                  <option value="Terminal">ORU</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Kategori
                </label>
                <input
                  type="text"
                  value={kategori}
                  onChange={e => setKategori(e.target.value)}
                  placeholder="Kategori"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Lokasi
                </label>
                <select
                  value={lokasi}
                  onChange={e => setLokasi(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="">Pilih Lokasi</option>
                  <option value="Lampung">Lampung</option>
                  <option value="Papua">Papua</option>
                  <option value="Biak">Biak</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="Sulawesi">Sulawesi</option>
                  <option value="Kepulauan Riau">Kepulauan Riau</option>
                  {/* Tambahkan lokasi lain jika perlu */}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tahun
                </label>
                <input
                  type="number"
                  value={tahun}
                  onChange={e => setTahun(e.target.value)}
                  placeholder="Tahun"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Level AACE
                </label>
                <select
                  value={levelAACE}
                  onChange={e => setLevelAACE(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="Level 1">Level 1</option>
                  <option value="Level 2">Level 2</option>
                  <option value="Level 3">Level 3</option>
                  <option value="Level 4">Level 4</option>
                  <option value="Level 5">Level 5</option>
                </select>
              </div>
              {/* Tambahan dropdown perhitungan Galileo */}
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
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Harga
                </label>
                <input
                  type="number"
                  value={harga}
                  onChange={e => setHarga(e.target.value)}
                  placeholder="Harga"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
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