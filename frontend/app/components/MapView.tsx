"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type TrafficObject = {
  id: number;
  navn: string;
  type?: string;
  sted: string;
  lat?: number | null;
  lng?: number | null;
};

export default function MapView() {
  const [trafficData, setTrafficData] = useState<TrafficObject[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:4000/api/traffic");
      const data = await res.json();
      setTrafficData(data.objekter || []);
    })();
  }, []);

  return (
    <div className="flex justify-center mb-8">
      <div className="h-[600px] w-[900px] rounded-lg overflow-hidden shadow-lg border border-gray-300">
        <MapContainer
          center={[60.472, 8.4689]}
          zoom={6}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {trafficData.map(
            (o) =>
              typeof o.lat === "number" &&
              typeof o.lng === "number" && (
                <Marker key={o.id} position={[o.lat, o.lng]}>
                  <Popup>
                    <strong>{o.type || o.navn}</strong>
                    <br />
                    {o.sted}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}
