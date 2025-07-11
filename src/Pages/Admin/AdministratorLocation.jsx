import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateProvinceCCI } from '../../Provider/administratorSlice'

const AdministratorLocation = () => {
  const provinces = useSelector(state => state.administrator.provinces)
  const dispatch = useDispatch()

  const handleChange = (code, value) => {
    // Pastikan value selalu dikirim ke slice
    const cci = parseFloat(value)
    if (!isNaN(cci)) {
      dispatch(updateProvinceCCI({ code, cci }))
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border px-2 py-1">Kode Provinsi</th>
            <th className="border px-2 py-1">Provinsi</th>
            <th className="border px-2 py-1">IKK/CCI</th>
          </tr>
        </thead>
        <tbody>
          {provinces.map(prov => (
            <tr key={prov.code}>
              <td className="border px-2 py-1">{prov.code}</td>
              <td className="border px-2 py-1">{prov.name}</td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-24 px-1 py-0.5 border rounded"
                  value={prov.cci}
                  onChange={e => handleChange(prov.code, e.target.value)}
                  step="0.01"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdministratorLocation