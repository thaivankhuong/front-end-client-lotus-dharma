import MapUsingAPIContainer from "@/components/Map/MapUsingAPIContainer";
import DebugPanel from "@/components/Map/DebugPanel";

export default function Home() {
  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Chào mừng đến với LotusDharma</h1>
        <p className="text-gray-600 mb-4">
          Ứng dụng Phật giáo với bản đồ tương tác Việt Nam.
        </p>
      </div>
      <MapUsingAPIContainer />
      <DebugPanel />
    </div>
  );
}
