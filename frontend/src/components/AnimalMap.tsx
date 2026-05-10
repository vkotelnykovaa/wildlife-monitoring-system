"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import { GPSData } from "@/types/animal";

interface AnimalMapProps {
  points: GPSData[];
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function AnimalMap({ points }: AnimalMapProps) {
  if (points.length === 0) {
    return <p>Немає GPS-даних для цієї тварини.</p>;
  }

  const route = points.map((point) => [point.latitude, point.longitude] as [number, number]);
  const firstPoint = route[0];

  return (
    <MapContainer
      center={firstPoint}
      zoom={10}
      style={{ height: "500px", width: "100%", marginTop: "20px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline positions={route} />

      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={markerIcon}
        >
          <Popup>
            {point.latitude}, {point.longitude}
            <br />
            {point.timestamp}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}