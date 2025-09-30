import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import RecapModal from "./RecapModal";
import { fetchProjectDetailCache } from "../../Provider/Project/ProjectSlice";

const formatCurrency = (value) =>
  value === 0
    ? "Rp0"
    : value
    ? `Rp${Number(value).toLocaleString()}`
    : "";

const RecapProject = () => {
  const [rekapTitle, setRekapTitle] = useState(
    "Rekapitulasi Perbandingan Project"
  );
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const detailCache = useSelector((state) => state.projects.detailCache);

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // selected projects
  const selectedProjects = useMemo(
    () => projects.filter((p) => selectedIds.includes(p.id)),
    [projects, selectedIds]
  );

  // fetch missing project details whenever selection changes
  useEffect(() => {
    selectedIds.forEach((id) => {
      if (!detailCache[id]) dispatch(fetchProjectDetailCache(id));
    });
  }, [selectedIds, detailCache, dispatch]);

  // aggregated costs from cached details (augment with proyek=name)
  const aggregatedCosts = useMemo(() => {
    return selectedProjects.flatMap((p) => {
      const d = detailCache[p.id];
      return (d?.constructionCosts || []).map((cc) => ({
        ...cc,
        proyek: p.name,
      }));
    });
  }, [detailCache, selectedProjects]);

  // Kolom tabel
  const columns = [
    { key: "no", label: "No", className: "text-center", width: 50 },
    { key: "kode", label: "Kode", width: 100 },
    { key: "uraian", label: "Uraian", width: 260 },
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
        width: 140,
      },
    ]),
  ];

  // Build hierarchical grouped data: kelompok -> kelompokDetail -> unique items
  const groupedData = useMemo(() => {
    const structure = {};
    selectedProjects.forEach((project) => {
      aggregatedCosts
        .filter((c) => c.proyek === project.name)
        .forEach((c) => {
          const g = c.kelompok || "Lainnya";
          const sg = c.kelompokDetail || "Lainnya";
          if (!structure[g]) structure[g] = { subgroups: {}, order: [] };
          if (!structure[g].subgroups[sg]) {
            structure[g].subgroups[sg] = { items: [], keySet: new Set() };
            structure[g].order.push(sg);
          }
          const key = `${g}|${sg}|${c.workcode || c.kode || ""}|${c.uraian}`;
          if (!structure[g].subgroups[sg].keySet.has(key)) {
            structure[g].subgroups[sg].items.push({
              key,
              kelompok: g,
              kelompokDetail: sg,
              kode: c.workcode || c.kode || "",
              uraian: c.uraian,
            });
            structure[g].subgroups[sg].keySet.add(key);
          }
        });
    });

    // Sort groups, subgroups, and items
    return Object.entries(structure)
      .map(([groupName, gObj]) => {
        const subgroups = gObj.order
          .slice()
          .sort((a, b) => a.localeCompare(b))
          .map((sgName) => {
            const sgObj = gObj.subgroups[sgName];
            sgObj.items.sort((a, b) => {
              if (a.kode && b.kode) {
                const lc = a.kode.localeCompare(b.kode, undefined, {
                  numeric: true,
                });
                if (lc !== 0) return lc;
              } else if (a.kode) return -1;
              else if (b.kode) return 1;
              return a.uraian.localeCompare(b.uraian);
            });
            return { name: sgName, ...sgObj };
          });
        return { group: groupName, subgroups };
      })
      .sort((a, b) => a.group.localeCompare(b.group));
  }, [aggregatedCosts, selectedProjects]);

  const projectCostMap = useMemo(() => {
    const map = {};
    selectedProjects.forEach((project) => {
      map[project.name] = {};
      aggregatedCosts
        .filter((c) => c.proyek === project.name)
        .forEach((c) => {
          const key = `${c.kelompok || ""}|${c.kelompokDetail || ""}|${c.workcode || c.kode || ""}|${c.uraian}`;
          map[project.name][key] = c;
        });
    });
    return map;
  }, [aggregatedCosts, selectedProjects]);

  // UPDATED: wrap in useCallback to stabilize reference
  const sumFor = useCallback(
    (projectName, group, subgroup) => {
      return aggregatedCosts
        .filter(
          (c) =>
            c.proyek === projectName &&
            (group ? c.kelompok === group : true) &&
            (subgroup ? c.kelompokDetail === subgroup : true)
        )
        .reduce((s, c) => s + (c.totalHarga || 0), 0);
    },
    [aggregatedCosts]
  );

  const projectSummaries = selectedProjects.map((project) => {
    const projectCosts = aggregatedCosts.filter((item) => item.proyek === project.name);
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

  // Table rows (hierarchical)
  const tableRows = useMemo(() => {
    let rows = [];
    let runningNo = 1;

    groupedData.forEach((g) => {
      // Group header
      rows.push({
        isGroup: true,
        label: g.group,
        colSpan: columns.length,
      });

      g.subgroups.forEach((sg) => {
        // Subgroup header
        rows.push({
          isSubgroup: true,
          subgroup: sg.name,
          colSpan: columns.length,
        });

        // Items
        sg.items.forEach((item) => {
          const row = {
            no: runningNo++,
            kode: item.kode,
            uraian: item.uraian,
          };
          selectedProjects.forEach((p) => {
            const cost =
              projectCostMap[p.name][
                `${item.kelompok}|${item.kelompokDetail}|${item.kode}|${item.uraian}`
              ];
            row[`usd_${p.id}`] = cost && cost.usd ? cost.usd : "";
            row[`idr_${p.id}`] = cost ? cost.totalHarga : "";
          });
          rows.push(row);
        });

        // Subgroup subtotal
        const subtotalRow = {
          isSubtotal: true,
          label: `Subtotal ${sg.name}`,
        };
        selectedProjects.forEach((p) => {
          subtotalRow[`usd_${p.id}`] = ""; // no subtotal USD
          subtotalRow[`idr_${p.id}`] = sumFor(p.name, g.group, sg.name);
        });
        rows.push(subtotalRow);
      });

      // Group total
      const groupTotalRow = {
        isGroupTotal: true,
        label: `Total ${g.group}`,
      };
      selectedProjects.forEach((p) => {
        groupTotalRow[`usd_${p.id}`] = "";
        groupTotalRow[`idr_${p.id}`] = sumFor(p.name, g.group);
      });
      rows.push(groupTotalRow);
    });

    return rows;
  }, [groupedData, selectedProjects, projectCostMap, columns.length, sumFor]);

  // Export (hierarchical with subtotals)
  const handleExportExcel = () => {
    let rows = [];
    rows.push([rekapTitle]);
    rows.push([
      "No.",
      "Kode",
      "Item Pekerjaan",
      ...selectedProjects.flatMap((p) => [
        p.name + " (USD)",
        p.name + " (IDR)",
      ]),
    ]);

    let no = 1;
    groupedData.forEach((g) => {
      // Group row
      rows.push([
        "",
        "",
        g.group.toUpperCase(),
        ...Array(selectedProjects.length * 2).fill(""),
      ]);
      g.subgroups.forEach((sg) => {
        // Subgroup row
        rows.push([
          "",
          "",
          sg.name,
          ...Array(selectedProjects.length * 2).fill(""),
        ]);
        // Items
        sg.items.forEach((item) => {
          rows.push([
            no++,
            item.kode,
            item.uraian,
            ...selectedProjects.flatMap((p) => {
              const cost =
                projectCostMap[p.name][
                  `${item.kelompok}|${item.kelompokDetail}|${item.kode}|${item.uraian}`
                ];
              return [
                cost && cost.usd ? cost.usd : "",
                cost ? cost.totalHarga : "",
              ];
            }),
          ]);
        });
        // Subgroup subtotal
        rows.push([
          "",
          "",
          `Subtotal ${sg.name}`,
          ...selectedProjects.flatMap((p) => ["", sumFor(p.name, g.group, sg.name)]),
        ]);
      });
      // Group total
      rows.push([
        "",
        "",
        `Total ${g.group}`,
        ...selectedProjects.flatMap((p) => ["", sumFor(p.name, g.group)]),
      ]);
    });

    // Overall totals
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

    const tsv = rows.map((r) => r.join("\t")).join("\n");
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

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
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
            className="w-full max-w-lg border rounded px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700 transition"
          />
        </div>
        <div className="flex flex-row gap-2 items-end md:items-center">
          <button
            type="button"
            className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded font-semibold shadow transition dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={() => setModalOpen(true)}
          >
            Tambah Project ke Rekap
          </button>
          <button
            type="button"
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-semibold shadow transition dark:bg-green-600 dark:hover:bg-green-700"
            onClick={handleExportExcel}
            disabled={selectedProjects.length === 0}
          >
            Export ke Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 rounded mb-8 shadow">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 border dark:border-gray-700 text-gray-900 dark:text-white font-semibold ${col.className || ""}`}
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
            {selectedProjects.length > 0 &&
              tableRows.map((row, idx) => {
                if (row.isGroup)
                  return (
                    <tr key={`g-${idx}`}>
                      <td
                        colSpan={row.colSpan}
                        className="bg-primary-200 dark:bg-primary-900 font-bold text-left border-b border-gray-300 dark:border-gray-700 py-2 pl-2 uppercase text-primary-900 dark:text-primary-100"
                      >
                        {row.label}
                      </td>
                    </tr>
                  );
                if (row.isSubgroup)
                  return (
                    <tr key={`sg-${idx}`}>
                      <td
                        colSpan={row.colSpan}
                        className="bg-primary-50 dark:bg-primary-800 font-semibold text-left border-b border-gray-200 dark:border-gray-600 py-2 pl-4 text-primary-800 dark:text-primary-200"
                      >
                        {row.subgroup}
                      </td>
                    </tr>
                  );
                if (row.isSubtotal)
                  return (
                    <tr key={`st-${idx}`} className="bg-yellow-50 dark:bg-yellow-800 font-semibold">
                      <td colSpan={3} className="px-3 py-2 border dark:border-gray-700 text-right">
                        {row.label}
                      </td>
                      {selectedProjects.map((p) => (
                        <React.Fragment key={`stc-${p.id}-${idx}`}>
                          <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                          <td className="px-3 py-2 border dark:border-gray-700 text-right">
                            {formatCurrency(row[`idr_${p.id}`])}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  );
                if (row.isGroupTotal)
                  return (
                    <tr key={`gt-${idx}`} className="bg-yellow-100 dark:bg-yellow-900 font-bold">
                      <td colSpan={3} className="px-3 py-2 border dark:border-gray-700 text-right">
                        {row.label}
                      </td>
                      {selectedProjects.map((p) => (
                        <React.Fragment key={`gtc-${p.id}-${idx}`}>
                          <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                          <td className="px-3 py-2 border dark:border-gray-700 text-right">
                            {formatCurrency(row[`idr_${p.id}`])}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  );
                return (
                  <tr
                    key={idx}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-3 py-2 border dark:border-gray-700 ${col.className || ""} text-gray-900 dark:text-white`}
                      >
                        {col.key.startsWith("idr_") || col.key.startsWith("usd_")
                          ? row[col.key]
                            ? formatCurrency(row[col.key])
                            : "-"
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}

            {/* Overall TOTAL */}
            <tr className="bg-orange-200 dark:bg-orange-700 font-bold">
              <td className="px-3 py-2 border dark:border-gray-700 text-center" colSpan={3}>
                TOTAL
              </td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    {formatCurrency(p.totalHargaPekerjaan)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
            <tr className="bg-orange-100 dark:bg-orange-600 font-semibold">
              <td className="px-3 py-2 border dark:border-gray-700 text-center" colSpan={3}>
                PPN 11%
              </td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    {formatCurrency(p.ppn)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
            <tr className="bg-orange-300 dark:bg-orange-800 font-bold">
              <td className="px-3 py-2 border dark:border-gray-700 text-center" colSpan={3}>
                GRAND TOTAL TERMASUK PPN
              </td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">
                    {formatCurrency(p.totalPerkiraan)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {/* Modal */}
      <RecapModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedIds={selectedIds}
        onAdd={handleAddFromModal}
      />
    </div>
  );
};

export default RecapProject;
