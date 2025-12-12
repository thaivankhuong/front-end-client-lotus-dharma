'use client';

import { useMap } from 'react-leaflet';
import { ZoomIn, ZoomOut, Home, Maximize2 } from 'lucide-react';

interface MapControlsProps {
  onReset?: () => void;
  selectedProvince?: string | null;
}

export default function MapControls({ onReset, selectedProvince }: MapControlsProps) {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleReset = () => {
    map.setView([16.0, 107.0], 6);
    onReset?.();
  };

  const handleFullscreen = () => {
    const mapContainer = map.getContainer();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      mapContainer.requestFullscreen();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        title="Phóng to"
      >
        <ZoomIn className="w-5 h-5 text-gray-700" />
      </button>

      <button
        onClick={handleZoomOut}
        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        title="Thu nhỏ"
      >
        <ZoomOut className="w-5 h-5 text-gray-700" />
      </button>

      <button
        onClick={handleReset}
        className={`bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors ${selectedProvince ? 'ring-2 ring-blue-500' : ''
          }`}
        title="Về trang chủ"
      >
        <Home className="w-5 h-5 text-gray-700" />
      </button>

      <button
        onClick={handleFullscreen}
        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        title="Toàn màn hình"
      >
        <Maximize2 className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}

