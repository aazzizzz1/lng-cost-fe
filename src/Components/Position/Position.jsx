import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePosition, setError } from '../../Provider/positionSlice';

const CurrentPosition = () => {
  const dispatch = useDispatch();
  const { latitude, longitude, error } = useSelector((state) => state.position);

  const isValidLatitude = (lat) => lat >= -90 && lat <= 90;
  const isValidLongitude = (lng) => lng >= -180 && lng <= 180;

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, altitude } = pos.coords;
          if (isValidLatitude(latitude) && isValidLongitude(longitude)) {
            dispatch(updatePosition({ latitude, longitude, altitude }));
          } else {
            dispatch(setError('Invalid latitude or longitude'));
          }
        },
        (err) => {
          console.error(err);
          dispatch(setError(err.message));
        },
        {
          enableHighAccuracy: true,
          // timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      dispatch(setError('Geolocation is not supported by this browser.'));
    }
  }, [dispatch]);

  if (error) {
    return <div className='dark:text-white text-xs font-medium leading-tight'>{error}</div>;
  }

  if (latitude === null || longitude === null) {
    return <div className='dark:text-white'>Loading...</div>;
  }

  return (
    <div className="flex flex-col text-left text-xs font-medium leading-tight">
      <p className='text-xs font-medium leading-tight dark:text-white'>
        Latitude: {latitude.toFixed(5)}°
      </p>
      <p className='text-xs font-medium leading-tight dark:text-white'>
        Longitude: {longitude.toFixed(5)}°
      </p>
      {/* <p className='dark:text-white'>
        {altitude ? `Altitude: ${altitude.toFixed(2)} m` : 'Altitude not available'}
      </p> */}
    </div>
  );
};

export default CurrentPosition;
