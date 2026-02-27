import L from 'leaflet';

// Fix Leaflet icon issue in Next.js
export function fixLeafletIcons() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

// Color mapping by region - màu nhạt, neutral giống sapnhap.bando.com.vn
export function getRegionColor(region: string): string {
    const colors: Record<string, string> = {
        'Đồng bằng sông Hồng': '#fef3c7',      // Light yellow
        'Đông Nam Bộ': '#fce7f3',              // Light pink
        'Miền Trung': '#dbeafe',               // Light blue
        'Tây Nguyên': '#f3e8ff',               // Light purple
        'Đồng bằng sông Cửu Long': '#d1fae5', // Light green
        'Miền Bắc': '#e0f2fe',                 // Light sky
    };
    return colors[region] || '#f3f4f6'; // Very light gray default
}

// Style for provinces - giống sapnhap.bando.com.vn
export function getProvinceStyle(feature: any, isSelected: boolean = false) {
    return {
        fillColor: getRegionColor(feature.properties.region),
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        color: isSelected ? '#dc2626' : '#991b1b', // Red borders
        dashArray: '',
        fillOpacity: isSelected ? 0.8 : 0.6,
    };
}

// Style for communes - giống sapnhap.bando.com.vn
export function getCommuneStyle() {
    return {
        fillColor: '#c084fc',  // Purple/pink fill như sapnhap
        weight: 2.5,           // Border dày hơn để rõ
        opacity: 1,
        color: '#fbbf24',      // Vàng cam nổi bật như sapnhap
        fillOpacity: 0.6,
    };
}

// Highlight style on hover
export function getHighlightStyle() {
    return {
        weight: 3,
        color: '#ff7800',
        dashArray: '',
        fillOpacity: 0.7,
    };
}

