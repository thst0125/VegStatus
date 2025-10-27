"use client";
import { useEffect, useState } from "react";

export default function TrafficList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/traffic")
      .then((res) => res.json())
      .then((data) => {
        console.log("API-data:", data);
        setEvents(data.objekter || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Laster trafikkdata...</p>;

  return (
    <div className="grid gap-3 max-w-2xl mx-auto">
      {events.slice(0, 10).map((e) => (
        <div
          key={e.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg text-blue-600">
            {e.metadata?.type?.navn || "Trafikkhendelse"}
          </h2>
          <p className="text-sm text-gray-700">
            ID: {e.id} <br />
            Lokasjon: {e.lokasjon?.geometri?.wkt?.slice(0, 80)}...
          </p>
        </div>
      ))}
    </div>
  );
}
