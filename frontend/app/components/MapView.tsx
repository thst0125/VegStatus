"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

type TrafficEvent = {
  id: number;
  metadata: { type: { navn: string } };
  lokasjon: { geometri: { wkt: string } };
};

export default function MapView() {
  const [events, setEvents] = useState<TrafficEvent[]>([]);

  useEffect(() => {
    fetch("/api/traffic")
      .then((res) => res.json())
      .then((data) => setEvents(data.objekter || []))
      .catch(console.error);
  }, []);

  // Parse WKT "POINT(lon lat)" → [lat, lon]
  const parseCoords = (wkt: string): [number, number] | null => {
    const match = wkt.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
    return match ? [parseFloat(match[2]), parseFloat(match[1])] : null;
  };

  // Custom marker icon (fikser “missing icon”)
  const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    iconSize: [25, 41],
    shadowSize: [41, 41],
  });

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 h-[500px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[60.472, 8.4689]} // midten av Norge
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        {events.map((e) => {
          const coords = parseCoords(e.lokasjon?.geometri?.wkt || "");
          if (!coords) return null;
          return (
            <Marker key={e.id} position={coords} icon={icon}>
              <Popup>
                <b>{e.metadata?.type?.navn}</b>
                <br />
                ID: {e.id}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
