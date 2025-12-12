'use client';

interface OpacityControlProps {
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export default function OpacityControl({ opacity, onOpacityChange }: OpacityControlProps) {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 px-6 py-3 rounded-full shadow-lg">
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-800 whitespace-nowrap">
          Độ phủ màu nền:
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-48 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            background: `linear-gradient(to right, white 0%, rgba(147, 51, 234, 0.3) ${opacity * 100}%)`
          }}
        />
        <span className="text-sm font-bold text-gray-800 min-w-[3rem] text-right">
          {opacity.toFixed(2)}
        </span>
      </div>
    </div>
  );
}




