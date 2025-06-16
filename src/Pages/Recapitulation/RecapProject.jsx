import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import RecapModal from "./RecapModal";

const formatCurrency = (value) =>
  value ? `Rp${Number(value).toLocaleString()}` : "";

const kelompokList = [
  "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN",
  "SUPPORTING WORK",
  "PENYEDIAAN MATERIAL",
  "PEKERJAAN PEMASANGAN DAN PENGUJIAN",
  "PEKERJAAN KHUSUS/FINISHING",
  "PEKERJAAN DOKUMENTASI",
  "PEKERJAAN COMMISSIONING & TRIAL OPERATION",
];

const getUniqueItems = (costs, selectedProjects) => {
  const items = [];
  selectedProjects.forEach((project) => {
    costs
      .filter((c) => c.proyek === project.name)
      .forEach((c) => {
        const key = (c.kelompok || "") + "|" + (c.kode || "") + "|" + c.uraian;
        if (!items.find((i) => i.key === key)) {
          items.push({
            key,
            kelompok: c.kelompok,
            kode: c.kode || "",
            uraian: c.uraian,
          });
        }
      });
  });
  // Urutkan: kelompok, kode (jika ada), lalu uraian
  items.sort((a, b) => {
    if (a.kelompok !== b.kelompok) return a.kelompok.localeCompare(b.kelompok);
    if (a.kode && b.kode)
      return a.kode.localeCompare(b.kode, undefined, { numeric: true });
    if (a.kode) return -1;
    if (b.kode) return 1;
    return a.uraian.localeCompare(b.uraian);
  });
  return items;
};

const RecapProject = () => {
  const [rekapTitle, setRekapTitle] = useState(
    "Rekapitulasi Perbandingan Project"
  );
  const projects = useSelector((state) => state.projects.projects);
  const costs = useSelector((state) => state.constractionCost.costs);

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // selectedProjects harus sebelum columns
  const selectedProjects = useMemo(
    () => projects.filter((p) => selectedIds.includes(p.id)),
    [projects, selectedIds]
  );
  const availableProjects = projects.filter((p) => !selectedIds.includes(p.id));

  // Kolom tabel harus didefinisikan setelah selectedProjects
  const columns = [
    { key: "no", label: "No", className: "text-center", width: 50 },
    { key: "kode", label: "Kode", width: 80 },
    { key: "uraian", label: "Uraian", width: 220 },
    ...selectedProjects.flatMap((p) => [
      {
        key: `usd_${p.id}`,
        label: `${p.name} (USD)`,
        className: "text-right",
        width: 100,
      },
      {
        key: `idr_${p.id}`,
        label: `${p.name} (IDR)`,
        className: "text-right",
        width: 120,
      },
    ]),
  ];

  // Ambil semua item pekerjaan unik (berdasarkan kode+uraian) dari semua project terpilih
  const uniqueItems = useMemo(
    () => getUniqueItems(costs, selectedProjects),
    [costs, selectedProjects]
  );

  // Buat mapping: { [projectName]: { [itemKey]: costObj } }
  const projectCostMap = useMemo(() => {
    const map = {};
    selectedProjects.forEach((project) => {
      map[project.name] = {};
      costs
        .filter((c) => c.proyek === project.name)
        .forEach((c) => {
          const key =
            (c.kelompok || "") + "|" + (c.kode || "") + "|" + c.uraian;
          map[project.name][key] = c;
        });
    });
    return map;
  }, [costs, selectedProjects]);

  // Summary per project
  const projectSummaries = selectedProjects.map((project) => {
    const projectCosts = costs.filter((item) => item.proyek === project.name);
    const totalHargaPekerjaan = projectCosts.reduce(
      (sum, item) => sum + (item.totalHarga || 0),
      0
    );
    const ppn = totalHargaPekerjaan * 0.11;
    const asuransi = totalHargaPekerjaan * 0.0025;
    const totalPerkiraan = totalHargaPekerjaan + ppn + asuransi;
    return {
      ...project,
      totalHargaPekerjaan,
      ppn,
      asuransi,
      totalPerkiraan,
    };
  });

  // Export ke Excel (TSV)
  const handleExportExcel = () => {
    let rows = [];
    // Judul Rekap di baris pertama
    rows.push([rekapTitle]);
    // Header
    rows.push([
      "No.",
      "Kode",
      "Item Pekerjaan",
      ...selectedProjects.flatMap((p) => [
        p.name + " (USD)",
        p.name + " (IDR)",
      ]),
    ]);
    // Data
    let no = 1;
    kelompokList.forEach((kelompok) => {
      // Kelompok header row
      rows.push([
        "",
        "",
        kelompok,
        ...Array(selectedProjects.length * 2).fill(""),
      ]);
      // Items for this kelompok
      uniqueItems
        .filter((item) => item.kelompok === kelompok)
        .forEach((item) => {
          rows.push([
            no++,
            item.kode,
            item.uraian,
            ...selectedProjects.flatMap((p) => {
              const cost =
                projectCostMap[p.name][
                  item.kelompok + "|" + item.kode + "|" + item.uraian
                ];
              return [
                cost && cost.usd ? cost.usd : "",
                cost ? cost.totalHarga : "",
              ];
            }),
          ]);
        });
    });
    // Total, PPN, Grand Total
    rows.push([
      "",
      "",
      "TOTAL",
      ...projectSummaries.flatMap((p) => ["", p.totalHargaPekerjaan]),
    ]);
    rows.push([
      "",
      "",
      "PPN 11%",
      ...projectSummaries.flatMap((p) => ["", p.ppn]),
    ]);
    rows.push([
      "",
      "",
      "GRAND TOTAL TERMASUK PPN",
      ...projectSummaries.flatMap((p) => ["", p.totalPerkiraan]),
    ]);
    // Convert to TSV
    const tsv = rows.map((row) => row.join("\t")).join("\n");
    const blob = new Blob([tsv], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rekapTitle.replace(/\s+/g, "_")}.xls`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Handler tambah dari modal (multi-select)
  const handleAddFromModal = (projectIds) => {
    setSelectedIds((prev) => [
      ...prev,
      ...projectIds.filter((id) => !prev.includes(id)),
    ]);
    setModalOpen(false);
  };

  // Table rows for main rekap table (with kelompok row merged)
  const tableRows = useMemo(() => {
    let rows = [];
    let no = 1;
    kelompokList.forEach((kelompok) => {
      // Kelompok header row (merged)
      rows.push({
        isKelompok: true,
        kelompok,
        colSpan: columns.length,
      });
      // Items for this kelompok
      uniqueItems
        .filter((item) => item.kelompok === kelompok)
        .forEach((item) => {
          const row = {
            no: no++,
            kode: item.kode,
            uraian: item.uraian,
          };
          selectedProjects.forEach((p) => {
            const cost =
              projectCostMap[p.name][
                item.kelompok + "|" + item.kode + "|" + item.uraian
              ];
            row[`usd_${p.id}`] = cost && cost.usd ? cost.usd : "";
            row[`idr_${p.id}`] = cost ? cost.totalHarga : "";
          });
          rows.push(row);
        });
    });
    return rows;
  }, [uniqueItems, selectedProjects, projectCostMap, columns.length]);

  return (
    <div className="p-4">
      {/* Header: Judul di kiri, tombol di kanan */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-lg font-bold text-gray-900 dark:text-white mb-2">
            Judul Rekapitulasi
          </label>
          <input
            type="text"
            value={rekapTitle}
            onChange={(e) => setRekapTitle(e.target.value)}
            className="w-full max-w-lg border rounded px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="flex flex-row gap-2 items-end md:items-center">
          <button
            type="button"
            className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded font-semibold"
            onClick={() => setModalOpen(true)}
          >
            Tambah Project ke Rekap
          </button>
          <button
            type="button"
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-semibold"
            onClick={handleExportExcel}
            disabled={selectedProjects.length === 0}
          >
            Export ke Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 rounded mb-8">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 border dark:border-gray-700 text-gray-900 dark:text-white ${
                    col.className || ""
                  }`}
                  style={col.width ? { minWidth: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-400 dark:text-gray-500"
                >
                  Pilih project untuk menampilkan rekapitulasi.
                </td>
              </tr>
            )}
            {selectedProjects.length > 0 && tableRows.map((row, idx) =>
              row.isKelompok ? (
                <tr key={`kelompok-${row.kelompok}-${idx}`}>
                  <td
                    colSpan={row.colSpan}
                    className="bg-primary-100 dark:bg-primary-900 font-bold text-left text-base border-b border-gray-300 dark:border-gray-700 py-2 pl-2 uppercase"
                  >
                    {row.kelompok}
                  </td>
                </tr>
              ) : (
                <tr key={idx} className="border-b dark:border-gray-700">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2 border dark:border-gray-700 ${
                        col.className || ""
                      }`}
                    >
                      {col.key.startsWith("idr_") || col.key.startsWith("usd_")
                        ? row[col.key]
                          ? formatCurrency(row[col.key])
                          : "-"
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              )
            )}
            {/* TOTAL row */}
            <tr className="bg-yellow-100 dark:bg-yellow-900 font-bold">
              <td
                className="px-3 py-2 border dark:border-gray-700 text-center"
                colSpan={3}
              >
                TOTAL
              </td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    -
                  </td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    {formatCurrency(p.totalHargaPekerjaan)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
            {/* PPN row */}
            <tr className="bg-yellow-50 dark:bg-yellow-800 font-semibold">
              <td
                className="px-3 py-2 border dark:border-gray-700 text-center"
                colSpan={3}
              >
                PPN 11%
              </td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    -
                  </td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    {formatCurrency(p.ppn)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
            {/* GRAND TOTAL row */}
            <tr className="bg-yellow-200 dark:bg-yellow-700 font-bold">
              <td
                className="px-3 py-2 border dark:border-gray-700 text-center"
                colSpan={3}
              >
                GRAND TOTAL TERMASUK PPN
              </td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    -
                  </td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    {formatCurrency(p.totalPerkiraan)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <RecapModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projects={availableProjects}
        onAdd={handleAddFromModal}
      />
    </div>
  );
};

export default RecapProject;
