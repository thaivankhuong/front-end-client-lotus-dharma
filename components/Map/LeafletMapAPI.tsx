'use client';

import React from 'react';
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

import { API_BASE_URL } from '@/lib/config/env';

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
                    name: commune.name, // Display name (original name)
                    nameNew: commune.nameNew, // New name after merger (if any)
                    type: commune.type,
                    provinceId: commune.provinceId,
                    areaKm2: commune.areaKm2,
                    population: commune.population,
                }
            };
        }).filter(Boolean) as Feature[]
    };
}

export default function LeafletMapAPI() {
    console.log('🗺️ Map mounted - LeafletMapAPI component initialized');

    const [provinces, setProvinces] = useState<FeatureCollection | null>(null);
    const [communes, setCommunes] = useState<FeatureCollection | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Track currently highlighted layer to reset it when hovering over another
    const highlightedLayerRef = useRef<L.Layer | null>(null);
    const highlightedCommuneLayerRef = useRef<L.Layer | null>(null);

    // Layer control state
    const [layers, setLayers] = useState<LayerControlState>({
        showProvinces: true,
        showCommunes: true,
        basemap: 'terrain'
    });

    // Opacity control state - Default 0.3
    const [opacity, setOpacity] = useState(0.3);

    // Load provinces on mount from API
    useEffect(() => {
        fixLeafletIcons(); // Fix icons on mount
        const fetchProvinces = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('🚀 API call started - Fetching provinces from:', `${API_BASE_URL}/provinces?IncludeGeometry=true`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                const response = await fetch(`${API_BASE_URL}/provinces?IncludeGeometry=true`, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                clearTimeout(timeoutId);

                console.log('📡 Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data: ProvinceAPIResponse[] = await response.json();
                console.log(`✅ Loaded ${data.length} provinces from API`, data[0]);

                const geoJSON = convertProvinceToGeoJSON(data);
                setProvinces(geoJSON);
                setLoading(false);
            } catch (err) {
                console.error('❌ Error loading provinces from API:', err);

                if (err instanceof Error && err.name === 'AbortError') {
                    setError('Request timeout - API may not be accessible');
                } else {
                    setError(err.message);
                }

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

                // Reset previously highlighted layer if it exists
                if (highlightedLayerRef.current && highlightedLayerRef.current !== target) {
                    const prevLayer = highlightedLayerRef.current as any;
                    const prevFeature = prevLayer.feature;
                    const prevProps = prevFeature?.properties;
                    const isPrevSelected = prevProps?.code === selectedProvince;
                    const hasCommunes = communes && communes.features.length > 0;
                    const prevBaseStyle = getProvinceStyle(prevFeature, isPrevSelected);

                    // Reset previous layer to its original style
                    if (isPrevSelected && hasCommunes) {
                        prevLayer.setStyle({
                            ...prevBaseStyle,
                            fillOpacity: 0.05,
                            weight: 3,
                            color: '#dc2626',
                            opacity: 1,
                        });
                    } else if (hasCommunes && !isPrevSelected) {
                        prevLayer.setStyle({
                            ...prevBaseStyle,
                            fillOpacity: 0,
                            weight: 2,
                            opacity: 1,
                        });
                    } else {
                        prevLayer.setStyle({
                            ...prevBaseStyle,
                            fillOpacity: prevBaseStyle.fillOpacity! * opacity,
                        });
                    }
                }

                // Highlight current layer
                target.setStyle(getHighlightStyle());
                target.bringToFront();

                // Store reference to currently highlighted layer
                highlightedLayerRef.current = target;
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

                // Clear reference if this was the highlighted layer
                if (highlightedLayerRef.current === target) {
                    highlightedLayerRef.current = null;
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

                    // Zoom to province bounds with deeper zoom to see communes clearly
                    const bounds = e.target.getBounds();
                    e.target._map.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 10  // Zoom sâu hơn để thấy rõ các xã
                    });
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

                // Reset previously highlighted commune if it exists
                if (highlightedCommuneLayerRef.current && highlightedCommuneLayerRef.current !== target) {
                    const prevLayer = highlightedCommuneLayerRef.current as any;
                    const baseStyle = getCommuneStyle();
                    prevLayer.setStyle({
                        ...baseStyle,
                        fillOpacity: baseStyle.fillOpacity! * opacity,
                    });
                }

                // Highlight current commune
                target.setStyle({
                    weight: 3.5,
                    color: '#fbbf24',  // Vàng highlight
                    fillOpacity: 0.8,
                });
                target.bringToFront(); // Đưa lên trên cùng khi hover

                // Store reference to currently highlighted commune
                highlightedCommuneLayerRef.current = target;
            },
            mouseout: (e: L.LeafletMouseEvent) => {
                const target = e.target;
                // Reset về style ban đầu với opacity đúng
                const baseStyle = getCommuneStyle();
                target.setStyle({
                    ...baseStyle,
                    fillOpacity: baseStyle.fillOpacity! * opacity, // Apply opacity slider
                });

                // Clear reference if this was the highlighted commune
                if (highlightedCommuneLayerRef.current === target) {
                    highlightedCommuneLayerRef.current = null;
                }
            },
        });

        // Tooltip for commune - Beautiful modern design
        const formatNumber = (num: number | undefined) => {
            if (!num) return 'N/A';
            return num.toLocaleString('vi-VN');
        };

        const tooltipContent = `
      <div class="font-sans bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
        <div class="flex items-start gap-2 mb-2">
          <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-bold text-sm text-gray-900 leading-tight">${props.name || 'N/A'}</div>
            <div class="text-xs text-purple-600 mt-0.5">${props.type || ''}</div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-2 space-y-1.5">
          <div class="flex items-center gap-2 text-xs">
            <svg class="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
            <span class="text-gray-600">Diện tích:</span>
            <span class="font-semibold text-gray-900">${formatNumber(props.areaKm2)} km²</span>
          </div>
          
          <div class="flex items-center gap-2 text-xs">
            <svg class="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="text-gray-600">Dân số:</span>
            <span class="font-semibold text-gray-900">${formatNumber(props.population)}</span>
          </div>
        </div>
      </div>
    `;

        layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            className: 'custom-tooltip-commune',
            direction: 'top',
            offset: [0, -10]
        });
    };

    // Use a unique ID for each instance to prevent "Map container is already initialized"
    const [mapId] = useState(() => `leaflet-map-${Math.random().toString(36).substring(2, 9)}`);

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
                id={mapId}
                key={mapId}
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
