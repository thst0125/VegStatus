"use client";

import { useEffect, useState } from "react";

type TrafficObject = {
  id: number;
  type?: string;
  navn: string;
  sted: string;
  veg?: string | null;
  beskrivelse?: string | null;
  starttid?: string | null;
  sluttid?: string | null;
};

export default function TrafficList() {
  const [items, setItems] = useState<TrafficObject[]>([]);
  const [source, setSource] = useState<string | null>(null);

  // Henter data fra backend ved lasting av komponenten
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:4000/api/traffic");
      const data = await res.json();
      setItems(data.objekter || []);
      setSource(data.source || null);
    })();
  }, []);

  // Funksjon for å formatere dato/tid til norsk format.
  const fmt = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleString("no-NO") : null;

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
      {/* Advarsel hvis vi bruker fallback-data */}
      {source === "fallback" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-3 mb-5 rounded">
          Viser lokale testdata fordi NVDB-tjenesten er utilgjengelig.
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Trafikkmeldinger
      </h2>

      {/* Hvis ingen hendelser finnes */}
      {items.length === 0 ? (
        <p className="text-gray-600">Ingen hendelser funnet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((o) => (
            <li
              key={o.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-300"
            >
              <p className="font-semibold text-gray-800">{o.type || o.navn}</p>
              <div className="text-sm text-gray-700 mt-1 space-y-0.5">
                <p>{o.sted}</p>
                {o.beskrivelse && <p>{o.beskrivelse}</p>}
                {o.veg && <p>Veg: {o.veg}</p>}
                <div className="flex gap-4">
                  {fmt(o.starttid) && <p>Fra: {fmt(o.starttid)}</p>}
                  {fmt(o.sluttid) && <p>Til: {fmt(o.sluttid)}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
