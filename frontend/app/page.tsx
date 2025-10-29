import MapViewWrapper from "./components/MapViewWrapper";
import TrafficList from "./components/TrafficList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#444F55]">
        VegStatus – Trafikkmeldinger i sanntid
      </h1>
      <MapViewWrapper />
      <div className="max-w-6xl mx-auto">
        <TrafficList />
      </div>
    </main>
  );
}
