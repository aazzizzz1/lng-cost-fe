import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateInflasi } from '../../Provider/administratorSlice'

const AdministratorInflasi = () => {
  const inflasi = useSelector(state => state.administrator.inflasi)
  const dispatch = useDispatch()
  const currentYear = new Date().getFullYear()
  const current = inflasi.find(i => i.year === currentYear) || { year: currentYear, value: 0 }

  const handleChange = (value) => {
    const val = parseFloat(value)
    if (!isNaN(val)) {
      dispatch(updateInflasi({ year: currentYear, value: val }))
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border px-2 py-1">Tahun</th>
            <th className="border px-2 py-1">Inflasi (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">{currentYear}</td>
            <td className="border px-2 py-1">
              <input
                type="number"
                className="w-24 px-1 py-0.5 border rounded"
                value={current.value}
                onChange={e => handleChange(e.target.value)}
                step="0.01"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default AdministratorInflasi