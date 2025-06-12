import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { HotTable } from '@handsontable/react-wrapper'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/styles/handsontable.css'
import 'handsontable/styles/ht-theme-main.css'

// register Handsontable's modules
registerAllModules()

// Custom currency renderer for Handsontable
function currencyRenderer(instance, td, row, col, prop, value, cellProperties) {
  const v = typeof value === 'number' ? value : Number(value);
  td.innerText = isNaN(v) ? '' : 'Rp' + v.toLocaleString();
  td.className = 'htRight';
}

const columns = [
  { data: 'no', type: 'numeric', readOnly: true, width: 50 },
  { data: 'uraian', width: 200 },
  { data: 'satuan', width: 70 },
  { data: 'qty', type: 'numeric', width: 60 },
  { data: 'hargaSatuan', type: 'numeric', width: 120, renderer: currencyRenderer },
  { data: 'totalHarga', type: 'numeric', width: 120, renderer: currencyRenderer },
  { data: 'aaceClass', width: 80 },
  { data: 'accuracy', width: 90 },
  { data: 'kelompok', width: 120 },
  { data: 'tahun', width: 70 },
  { data: 'infrastruktur', width: 120 },
  { data: 'volume', width: 80 },
  { data: 'satuanVolume', width: 100 },
  { data: 'kapasitasRegasifikasi', width: 120 },
  { data: 'satuanKapasitas', width: 110 },
  { data: 'proyek', width: 120 },
  { data: 'lokasi', width: 100 },
  { data: 'tipe', width: 80 },
];

const ConstractionCostTable = () => {
  const { costs, filterJenis } = useSelector((state) => state.constractionCost);
  const hotRef = useRef(null);

  const filteredCosts = filterJenis
    ? costs.filter((item) => item.tipe === filterJenis)
    : costs;

  // Prepare data for Handsontable
  const initialHotData = filteredCosts.map((item, idx) => ({
    no: idx + 1,
    uraian: item.uraian,
    satuan: item.satuan,
    qty: item.qty,
    hargaSatuan: item.hargaSatuan,
    totalHarga: item.totalHarga,
    aaceClass: item.aaceClass,
    accuracy: `${item.accuracyLow}% ~ ${item.accuracyHigh}%`,
    kelompok: item.kelompok,
    tahun: item.tahun,
    infrastruktur: item.infrastruktur,
    volume: item.volume,
    satuanVolume: item.satuanVolume,
    kapasitasRegasifikasi: item.kapasitasRegasifikasi,
    satuanKapasitas: item.satuanKapasitas,
    proyek: item.proyek,
    lokasi: item.lokasi,
    tipe: item.tipe,
  }));

  // State for table data and summary
  const [hotData, setHotData] = useState(initialHotData);
  const [summary, setSummary] = useState({
    totalHargaPekerjaan: 0,
    ppn: 0,
    asuransi: 0,
    totalPerkiraan: 0,
  });

  // Calculate summary
  const recalculateSummary = (data) => {
    const totalHargaPekerjaan = data.reduce((sum, item) => sum + (Number(item.totalHarga) || 0), 0);
    const ppn = totalHargaPekerjaan * 0.11;
    const asuransi = totalHargaPekerjaan * 0.0025;
    const totalPerkiraan = totalHargaPekerjaan + ppn + asuransi;
    setSummary({
      totalHargaPekerjaan,
      ppn,
      asuransi,
      totalPerkiraan,
    });
  };

  // Initial calculation
  useEffect(() => {
    setHotData(initialHotData);
    recalculateSummary(initialHotData);
    // eslint-disable-next-line
  }, [filterJenis, costs]);

  // Update totalHarga otomatis jika hargaSatuan atau qty diubah
  const afterChange = (changes, source) => {
    if (!changes) return;
    if (source === 'loadData') return;
    const hot = hotRef.current.hotInstance;
    let newData = hot.getSourceData().map(row => ({ ...row }));
    let changed = false;
    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (prop === 'hargaSatuan' || prop === 'qty') {
        const hargaSatuan = Number(hot.getDataAtRowProp(row, 'hargaSatuan')) || 0;
        const qty = Number(hot.getDataAtRowProp(row, 'qty')) || 0;
        const totalHarga = hargaSatuan * qty;
        hot.setDataAtRowProp(row, 'totalHarga', totalHarga, 'auto');
        newData[row].totalHarga = totalHarga;
        changed = true;
      }
    });
    // If any changes, update state and summary
    if (changed) {
      setHotData(newData);
      recalculateSummary(newData);
    } else {
      // recalculate summary in case of direct edit to totalHarga (shouldn't happen, but safe)
      setHotData(newData);
      recalculateSummary(newData);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-base dark:text-white">Construction Cost Overview</h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 overflow-x-auto">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-sm bg-white dark:bg-gray-900">
              <HotTable
                className="htMiddle"
                ref={hotRef}
                data={hotData}
                colHeaders={[
                  'No', 'Uraian', 'Satuan', 'Qty', 'Harga Satuan', 'Total Harga', 'AACE Class', 'Accuracy %',
                  'Kelompok', 'Tahun', 'Infrastruktur', 'Volume', 'Satuan Volume', 'Kapasitas Regasifikasi',
                  'Satuan Kapasitas', 'Proyek', 'Lokasi', 'Tipe'
                ]}
                columns={columns}
                width="100%"
                height="auto"
                stretchH="all"
                licenseKey="non-commercial-and-evaluation"
                manualColumnResize={true}
                manualRowResize={true}
                rowHeaders={false}
                autoWrapRow={true}
                autoWrapCol={true}
                renderAllRows={false}
                afterChange={afterChange}
                cells={(row, col) => {
                  if (col === 0 || col === 5) return { readOnly: true };
                  return {};
                }}
              />
            </div>
            {filteredCosts.length === 0 && (
              <div className="text-center py-4 text-gray-400 dark:text-gray-500">
                Tidak ada data.
              </div>
            )}
          </div>
          <div className="w-full md:w-80 md:min-w-[320px] md:max-w-xs p-4 bg-gray-100 dark:bg-gray-700 mt-2 md:mt-0 md:ml-4 rounded h-fit self-start">
            <div className="flex flex-col gap-1 text-sm text-gray-900 dark:text-white">
              <div>
                <span className="font-semibold">Total Harga Pekerjaan (A+B+C+D+E+F): </span>
                Rp{summary.totalHargaPekerjaan.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">PPN 11% (11% x G): </span>
                Rp{summary.ppn.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Asuransi (2,5‰ x G): </span>
                Rp{summary.asuransi.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Total Perkiraan Harga Pekerjaan (G+H+I): </span>
                Rp{summary.totalPerkiraan.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        .htCore th, .htCore td {
          font-size: 0.95rem;
          padding: 0.5rem 0.75rem;
        }
        .htCore th {
          font-weight: 600;
          background-color: #f3f4f6;
        }
        .dark .htCore th {
          background-color: #374151 !important;
          color: #e5e7eb !important;
        }
        .htCore td {
          font-weight: 400;
          color: #111827;
        }
        .dark .htCore td {
          color: #fff !important;
          background-color: #111827 !important; /* gray-900 */
        }
        .ht_master .htCore {
          border-radius: 0.5rem;
        }
        .htCore tr:nth-child(even) td {
          background-color: #f9fafb;
        }
        .dark .htCore tr:nth-child(even) td {
          background-color: #1f2937 !important; /* gray-800 */
        }
        .htCore tr:hover td {
          background-color: #e0e7ef;
        }
        .dark .htCore tr:hover td {
          background-color: #374151 !important; /* gray-700 */
        }
        `}
      </style>
    </section>
  )
}

export default ConstractionCostTable