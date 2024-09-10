import React, { useEffect, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ShipIcon from '../../Assets/Images/ShipLocationLogo.png';
import MarkerIcon from '../../Assets/Images/MarkerLocationLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import { addWaypoint } from '../../Provider/simulatorSlice';

const OpenSeaMap = () => {
  const dispatch = useDispatch();
  // const currentLocation = useSelector((state) => state.position);
  // const currentLocation = { latitude: 47.376888, longitude: 8.541694 }; // Default location
  const currentLocation = useMemo(() => ({
    latitude: 47.376888, longitude: 8.541694
  }), []); // No dependencies, so it will be created only once

  const waypoints = useSelector((state) => state.simulator.waypoints);
  const [positionError, setPositionError] = useState(null);

  const isValidLatitude = (lat) => lat >= -90 && lat <= 90;
  const isValidLongitude = (lng) => lng >= -180 && lng <= 180;

  useEffect(() => {
    const initializeMap = () => {
      console.log('Initializing map...');

      if (!document.getElementById('map')) {
        console.error('Map element not found');
        return;
      }

      const map = L.map('map').setView([currentLocation.latitude, currentLocation.longitude], 13);

      // Define base layers
      const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

      const offlineMapLayer = L.tileLayer('http://192.168.167.27:8080/styles/basic-preview/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://192.168.167.27:8080/styles/basic-preview/#6.82/47.242/9.609">OfflineMap</a> contributors'
      });

      // Set default base layer
      openStreetMapLayer.addTo(map);

      const baseLayers = {
        'OpenStreetMap': openStreetMapLayer,
        'OfflineMap': offlineMapLayer,
      };

      const seamarksLayer = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openseamap.org">OpenSeaMap</a> contributors',
        layers: 'seamarks'
      });

      const compassRose = L.tileLayer('https://tiles.openseamap.org/compassrose/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openseamap.org">OpenSeaMap</a> contributors',
        layers: 'compassrose',
        zIndex: 1000
      });

      const overlays = {
        'Sea Marks': seamarksLayer.addTo(map),
        'Compass Rose': compassRose.addTo(map)
      };

      L.control.layers(baseLayers, overlays).addTo(map);

      // Add existing waypoints to the map
      waypoints.forEach((waypoint) => {
        L.marker([waypoint.latitude, waypoint.longitude], {
          icon: L.icon({
            iconUrl: MarkerIcon,
            iconSize: [41, 41],
            iconAnchor: [21, 41],
            popupAnchor: [1, -34],
          }),
        })
          .addTo(map)
          .bindPopup(`Latitude: ${waypoint.latitude}<br>Longitude: ${waypoint.longitude}`)
          .openPopup();
      });

      // Event listener for map clicks to add new waypoints
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
          console.error('Invalid latitude or longitude');
          setPositionError('Invalid latitude or longitude');
          return;
        }
        setPositionError(null); // Reset position error if valid

        // Dispatch action to add the new waypoint to the Redux store
        dispatch(addWaypoint({ latitude: lat, longitude: lng }));

        // Add the new marker to the map
        const newMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: MarkerIcon,
            iconSize: [41, 41],
            iconAnchor: [21, 41],
            popupAnchor: [1, -34],
          }),
        }).addTo(map);
        newMarker.bindPopup(`Latitude: ${lat}<br>Longitude: ${lng}`).openPopup();
      });

      console.log('Map initialized');

      return map;
    };

    const map = initializeMap();

    if (currentLocation) {
      const marker = L.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: L.icon({
          iconUrl: ShipIcon,
          iconSize: [41, 41],
          iconAnchor: [21, 41],
          popupAnchor: [1, -34],
        }),
      })
        .addTo(map);
      marker.bindPopup('You are here').openPopup();
      map.setView([currentLocation.latitude, currentLocation.longitude], 13);
    } else {
      console.error('Map initialization failed');
    }

    // Clean up on component unmount
    return () => {
      if (map) map.remove();
    };
  }, [dispatch, currentLocation, waypoints]);

  useEffect(() => {
    if (positionError) {
      alert(positionError);
    }
  }, [positionError]);

  if (!currentLocation) {
    return <div className="dark:text-white">Loading map...</div>;
  }

  return (
      <div id="map" className='z-0 h-full sm:h-96'></div>
  );
};

export default OpenSeaMap;
