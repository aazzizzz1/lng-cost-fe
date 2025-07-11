import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransportData } from '../../../Provider/HargaSatuan/transportSlice';

const Cobagettransport = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.transport);

  useEffect(() => {
    dispatch(fetchTransportData());
  }, [dispatch]);

  return (
    <div>
      <h1>Transport Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.uraian} - {item.kategori} - {item.tipe}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cobagettransport;