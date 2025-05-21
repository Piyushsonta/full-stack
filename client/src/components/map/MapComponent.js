import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for marker icons in React with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view based on props
const UpdateMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ markers, center, onClick }) => {
  const [position, setPosition] = useState(center || [51.505, -0.09]);
  
  useEffect(() => {
    if (center) {
      setPosition(center);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [center]);

  return (
    <div className="map-container">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        onClick={onClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <UpdateMapView center={position} />
        
        {markers && markers
          .filter(marker => marker.location && Array.isArray(marker.location.coordinates) && marker.location.coordinates.length === 2)
          .map((marker, idx) => (
            <Marker 
              key={idx} 
              position={[marker.location.coordinates[1], marker.location.coordinates[0]]}
              eventHandlers={{
                click: () => marker.onClick && marker.onClick(marker)
              }}
            >
              <Popup>
                {marker.popupContent}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 