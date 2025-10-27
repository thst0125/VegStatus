import TrafficList from "./components/TrafficList";
import MapViewWrapper from "./components/MapViewWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        VegStatus – Trafikkmeldinger i sanntid
      </h1>
      <MapViewWrapper />
      <div className="mt-10">
        <TrafficList />
      </div>
    </main>
  );
}
