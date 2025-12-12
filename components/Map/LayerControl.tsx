'use client';

import { Layers, X } from 'lucide-react';
import { useState } from 'react';

export interface LayerControlState {
  showProvinces: boolean;
  showCommunes: boolean;
  basemap: 'terrain' | 'satellite1' | 'satellite2';
}

interface LayerControlProps {
  layers: LayerControlState;
  onLayerChange: (layers: LayerControlState) => void;
}

export default function LayerControl({ layers, onLayerChange }: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (key: keyof LayerControlState) => {
    onLayerChange({
      ...layers,
      [key]: !layers[key]
    });
  };

  const handleBasemapChange = (basemap: 'terrain' | 'satellite1' | 'satellite2') => {
    onLayerChange({
      ...layers,
      basemap
    });
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        title="Các lớp bản đồ"
      >
        <Layers className="h-5 w-5" />
        <span className="text-sm font-medium">Các lớp bản đồ</span>
      </button>

      {/* Control panel */}
      {isOpen && (
        <div className="absolute top-14 right-0 bg-white rounded-lg shadow-xl w-80 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold">Các lớp bản đồ</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Basemap selection */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Bản đồ nền:</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="basemap"
                    checked={layers.basemap === 'terrain'}
                    onChange={() => handleBasemapChange('terrain')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Địa hình (Terrain)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="basemap"
                    checked={layers.basemap === 'satellite1'}
                    onChange={() => handleBasemapChange('satellite1')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-blue-600">Nền ảnh vệ tinh 1 (tham khảo)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="basemap"
                    checked={layers.basemap === 'satellite2'}
                    onChange={() => handleBasemapChange('satellite2')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-blue-600">Nền ảnh vệ tinh 2 (tham khảo)</span>
                </label>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Layer toggles */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Lớp dữ liệu:</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={layers.showCommunes}
                    onChange={() => handleToggle('showCommunes')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Địa phận cấp xã</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={layers.showProvinces}
                    onChange={() => handleToggle('showProvinces')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Địa phận Thành phố/Tỉnh</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




