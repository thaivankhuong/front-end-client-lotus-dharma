'use client';

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import type { FeatureCollection, Feature } from 'geojson';
import L from 'leaflet';
import { getProvinceStyle, getCommuneStyle, getHighlightStyle, fixLeafletIcons } from '@/lib/map-utils';
import MapControls from './MapControls';
import MaritimeLayer from './MaritimeLayer';
import VietnamMask from './VietnamMask';
import ProvinceLabels from './ProvinceLabels';
import CommuneLabels from './CommuneLabels';
import LayerControl, { type LayerControlState } from './LayerControl';
import OpacityControl from './OpacityControl';

// API Base URL - Use Next.js API routes (proxy to backend)
const API_BASE_URL = '/api';

// Interface for Province API response
interface ProvinceAPIResponse {
    geometry: string | any; // Can be stringified JSON or object
    provinceId: string;
    name: string;
    nameNew: string;
    administrativeCenter: string;
    areaKm2: number;
    population: number;
    longitude: number;
    latitude: number;
    beforeMerger: string;
    administrativeUnits: string;
    createdAt: string;
    updatedAt: string;
}

// Interface for Commune API response
interface CommuneAPIResponse {
    geometry: string | any; // Can be stringified JSON or object
    communeId: string;
    name: string;
    provinceId: string;
    nameNew?: string;
    type?: string;
    areaKm2?: number;
    population?: number;
    longitude?: number;
    latitude?: number;
    beforeMerger?: string;
    // Add other commune properties as needed
}

// Helper to parse geometry
const parseGeometry = (geometry: string | any) => {
    if (typeof geometry === 'string') {
        try {
            return JSON.parse(geometry);
        } catch (e) {
            console.error('Failed to parse geometry string:', e);
            return null;
        }
    }
    return geometry;
};

// Convert API response to GeoJSON format
function convertProvinceToGeoJSON(provinces: ProvinceAPIResponse[]): FeatureCollection {
    return {
        type: 'FeatureCollection',
        features: provinces.map(province => {
            const parsedGeometry = parseGeometry(province.geometry);
            if (!parsedGeometry) return null;

            return {
                type: 'Feature',
                geometry: parsedGeometry,
                properties: {
                    code: province.provinceId,
                    name: province.nameNew || province.name,
                    type: 'Tỉnh',
                    region: 'Việt Nam',
                    oldCount: province.beforeMerger ? province.beforeMerger.split(',').length : 1,
                    areaKm2: province.areaKm2,
                    population: province.population,
                    administrativeCenter: province.administrativeCenter,
                    administrativeUnits: province.administrativeUnits,
                }
            };
        }).filter(Boolean) as Feature[]
    };
}

// Convert Commune API response to GeoJSON format
function convertCommuneToGeoJSON(communes: CommuneAPIResponse[]): FeatureCollection {
    return {
        type: 'FeatureCollection',
        features: communes.map(commune => {
            const parsedGeometry = parseGeometry(commune.geometry);
            if (!parsedGeometry) return null;

            return {
                type: 'Feature',
                geometry: parsedGeometry,
                properties: {
                    code: commune.communeId,
                    name: commune.name,
                    name_with_type: commune.nameNew || commune.name, // Use nameNew if available
                    path: `${commune.name}`,
                    type: commune.type,
                    provinceId: commune.provinceId,
                }
            };
        }).filter(Boolean) as Feature[]
    };
}

export default function LeafletMapAPI() {
    const [provinces, setProvinces] = useState<FeatureCollection | null>(null);
    const [communes, setCommunes] = useState<FeatureCollection | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Layer control state
    const [layers, setLayers] = useState<LayerControlState>({
        showProvinces: true,
        showCommunes: true,
        basemap: 'terrain'
    });

    // Opacity control state
    const [opacity, setOpacity] = useState(1.0);

    // Load provinces on mount from API
    useEffect(() => {
        fixLeafletIcons(); // Fix icons on mount
        const fetchProvinces = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE_URL}/provinces?IncludeGeometry=true`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch provinces: ${response.statusText}`);
                }

                const data: ProvinceAPIResponse[] = await response.json();
                console.log(`✅ Loaded ${data.length} provinces from API`);

                const geoJSON = convertProvinceToGeoJSON(data);
                setProvinces(geoJSON);
                setLoading(false);
            } catch (err) {
                console.error('❌ Error loading provinces from API:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchProvinces();
    }, []);

    // Load communes when province selected from API
    useEffect(() => {
        if (selectedProvince) {
            // Xóa communes cũ ngay lập tức khi chuyển tỉnh
            setCommunes(null);

            const fetchCommunes = async () => {
                try {
                    const startTime = performance.now();
                    setLoading(true);
                    setError(null);

                    const response = await fetch(
                        `${API_BASE_URL}/communes?ProvinceId=${selectedProvince}&IncludeGeometry=true`
                    );

                    if (!response.ok) {
                        throw new Error(`Failed to fetch communes for province ${selectedProvince}: ${response.statusText}`);
                    }

                    const data: CommuneAPIResponse[] = await response.json();
                    const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
                    console.log(`⚡ Loaded ${data.length} communes from API in ${loadTime}s`);

                    const geoJSON = convertCommuneToGeoJSON(data);
                    setCommunes(geoJSON);
                    setLoading(false);
                } catch (err) {
                    console.error('❌ Error loading communes from API:', err);
                    setError(err instanceof Error ? err.message : 'Unknown error');
                    setLoading(false);
                }
            };

            fetchCommunes();
        } else {
            setCommunes(null);
        }
    }, [selectedProvince]);

    // Province event handlers
    const onEachProvince = (feature: Feature, layer: L.Layer) => {
        const props = feature.properties as any;

        layer.on({
            mouseover: (e: L.LeafletMouseEvent) => {
                const target = e.target;
                target.setStyle(getHighlightStyle());
                target.bringToFront();
            },
            mouseout: (e: L.LeafletMouseEvent) => {
                const target = e.target;
                const isSelected = props.code === selectedProvince;
                const hasCommunes = communes && communes.features.length > 0;
                const baseStyle = getProvinceStyle(feature, isSelected);

                // Reset về style đúng dựa trên trạng thái hiện tại
                if (isSelected && hasCommunes) {
                    target.setStyle({
                        ...baseStyle,
                        fillOpacity: 0.05,
                        weight: 3,
                        color: '#dc2626',
                        opacity: 1,
                    });
                } else if (hasCommunes && !isSelected) {
                    target.setStyle({
                        ...baseStyle,
                        fillOpacity: 0,
                        weight: 2,
                        opacity: 1,
                    });
                } else {
                    target.setStyle({
                        ...baseStyle,
                        fillOpacity: baseStyle.fillOpacity! * opacity,
                    });
                }
            },
            click: (e: L.LeafletMouseEvent) => {
                const provinceCode = props.code;

                if (selectedProvince === provinceCode) {
                    // Deselect if clicking same province
                    setSelectedProvince(null);
                    e.target._map.setView([16.0, 107.0], 6);
                } else {
                    // Select new province
                    setSelectedProvince(provinceCode);

                    // Zoom to province bounds
                    const bounds = e.target.getBounds();
                    e.target._map.fitBounds(bounds, { padding: [50, 50] });
                }
            },
        });

        // Tooltip
        const tooltipContent = `
      <div class="font-sans">
        <div class="font-bold text-base">${props.name}</div>
        <div class="text-xs text-gray-600 mt-1">${props.type} - ${props.region}</div>
        <div class="text-xs mt-1 text-blue-600">
          ${props.oldCount > 1 ? `Sáp nhập từ ${props.oldCount} tỉnh cũ` : 'Giữ nguyên'}
        </div>
      </div>
    `;

        layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            className: 'custom-tooltip',
        });
    };

    // Commune event handlers
    const onEachCommune = (feature: Feature, layer: L.Layer) => {
        const props = feature.properties as any;

        layer.on({
            mouseover: (e: L.LeafletMouseEvent) => {
                const target = e.target;
                target.setStyle({
                    weight: 3.5,
                    color: '#fbbf24',  // Vàng highlight
                    fillOpacity: 0.8,
                });
                target.bringToFront(); // Đưa lên trên cùng khi hover
            },
            mouseout: (e: L.LeafletMouseEvent) => {
                const target = e.target;
                // Reset về style ban đầu với opacity đúng
                const baseStyle = getCommuneStyle();
                target.setStyle({
                    ...baseStyle,
                    fillOpacity: baseStyle.fillOpacity! * opacity, // Apply opacity slider
                });
            },
        });

        // Tooltip for commune
        const tooltipContent = `
      <div class="text-xs font-sans">
        <div class="font-semibold text-green-700">${props.name_with_type || props.name || 'N/A'}</div>
        <div class="text-gray-600 text-[10px] mt-0.5">${props.path || ''}</div>
      </div>
    `;

        layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            className: 'custom-tooltip',
        });
    };

    return (
        <div className="relative h-screen w-full">
            {loading && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Đang tải dữ liệu từ API...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Lỗi:</span>
                        <span className="text-sm">{error}</span>
                    </div>
                </div>
            )}

            <MapContainer
                center={[16.0, 107.0]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                minZoom={5}
                maxZoom={12}
                maxBounds={[
                    [7.5, 101.5],   // Southwest - Cà Mau, Điện Biên (có buffer)
                    [24.0, 116.0]   // Northeast - Hà Giang, Trường Sa (có buffer)
                ]}
                maxBoundsViscosity={1.0}
            >
                {/* Base tile layers */}
                {layers.basemap === 'terrain' && (
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA'
                        maxZoom={13}
                    />
                )}
                {layers.basemap === 'satellite1' && (
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics'
                        maxZoom={19}
                    />
                )}
                {layers.basemap === 'satellite2' && (
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        attribution='&copy; Google'
                        maxZoom={20}
                    />
                )}

                {/* Maritime features layer - Quần đảo Hoàng Sa, Biển Đông, Quần đảo Trường Sa */}
                <MaritimeLayer />

                {/* Mask layer - Che các khu vực bên ngoài Việt Nam */}
                {provinces && <VietnamMask vietnamGeoJSON={provinces} />}

                {/* Province layer (34 tỉnh) - Luôn hiển thị để giữ đường biên */}
                {provinces && layers.showProvinces && (
                    <GeoJSON
                        key="provinces"
                        data={provinces}
                        style={(feature) => {
                            const provinceCode = (feature?.properties as any)?.code;
                            const isSelected = provinceCode === selectedProvince;
                            const hasCommunes = communes && communes.features.length > 0;

                            const baseStyle = getProvinceStyle(feature!, isSelected);

                            // Nếu đang xem communes của tỉnh này, làm mờ fill, giữ border rõ
                            if (isSelected && hasCommunes) {
                                return {
                                    ...baseStyle,
                                    fillOpacity: 0.05,  // Fill rất nhạt để thấy communes
                                    weight: 3,          // Border đậm hơn
                                    color: '#dc2626',   // Đỏ
                                    opacity: 1,         // Border rõ ràng
                                };
                            }

                            // Các tỉnh khác: giữ border rõ ràng nhưng làm mờ fill
                            if (hasCommunes && !isSelected) {
                                return {
                                    ...baseStyle,
                                    fillOpacity: 0,     // Ẩn hoàn toàn fill
                                    weight: 2,          // Border rõ hơn
                                    opacity: 1,         // Border rõ ràng
                                };
                            }

                            return {
                                ...baseStyle,
                                fillOpacity: baseStyle.fillOpacity! * opacity
                            };
                        }}
                        onEachFeature={onEachProvince}
                        // @ts-ignore - Ensure provinces render on top of basemap
                        pane="overlayPane"
                    />
                )}

                {/* Province labels - Luôn hiển thị tên các tỉnh Việt Nam */}
                {provinces && (
                    <ProvinceLabels
                        provincesGeoJSON={provinces}
                        selectedProvince={selectedProvince}
                    />
                )}

                {/* Commune labels - Hiển thị tên xã khi zoom >= 9 */}
                {communes && communes.features.length > 0 && (
                    <CommuneLabels communesGeoJSON={communes} />
                )}

                {/* Commune layer (show when province selected AND layer enabled) */}
                {communes && communes.features.length > 0 && layers.showCommunes && (
                    <GeoJSON
                        key={`communes-${selectedProvince}`}
                        data={communes}
                        style={() => {
                            const baseStyle = getCommuneStyle();
                            return {
                                ...baseStyle,
                                fillOpacity: baseStyle.fillOpacity! * opacity
                            };
                        }}
                        onEachFeature={onEachCommune}
                        // @ts-ignore - Ensure communes render on top of all basemaps
                        pane="overlayPane"
                    />
                )}

                {/* Map controls */}
                <MapControls
                    onReset={() => setSelectedProvince(null)}
                    selectedProvince={selectedProvince}
                />
            </MapContainer>

            {/* Opacity control */}
            <OpacityControl
                opacity={opacity}
                onOpacityChange={setOpacity}
            />

            {/* Layer control */}
            <LayerControl
                layers={layers}
                onLayerChange={setLayers}
            />

            {/* Info panel */}
            {selectedProvince && (
                <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-xs">
                    <div className="text-sm">
                        <span className="font-semibold">Tỉnh đã chọn:</span> {selectedProvince}
                    </div>
                    <button
                        onClick={() => setSelectedProvince(null)}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                        ← Quay lại xem tất cả tỉnh
                    </button>
                </div>
            )}

            {/* API Source Indicator */}
            <div className="absolute top-4 right-4 z-[1000] bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold">API Mode</span>
                </div>
            </div>
        </div>
    );
}
