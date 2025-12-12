'use client';

import { CircleMarker, Tooltip, ImageOverlay, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import type { Feature, Point, Polygon as GeoJSONPolygon } from 'geojson';
import type { LatLngBoundsExpression } from 'leaflet';

export default function MaritimeLayer() {
  const [maritimeFeatures, setMaritimeFeatures] = useState<Feature[]>([]);
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    fetch('/geodata/maritime-features.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setMaritimeFeatures(data.features);
        }
      })
      .catch(err => console.error('Failed to load maritime features:', err));
  }, []);

  // Track zoom level changes
  useEffect(() => {
    const handleZoom = () => {
      setZoom(map.getZoom());
    };
    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map]);

  if (!maritimeFeatures || maritimeFeatures.length === 0) return null;

  // Tính toán kích thước đảo dựa trên zoom level
  const getIslandRadius = () => {
    if (zoom >= 9) return 8;
    if (zoom >= 7) return 6;
    return 4;
  };

  const islandRadius = getIslandRadius();

  return (
    <>
      {maritimeFeatures.map((feature, index) => {
        const props = feature.properties;
        if (!props) return null;

        // Render ImageOverlay với quốc kỳ Việt Nam cho background - tăng opacity
        if (props.type === 'flag_background' && feature.geometry.type === 'Polygon') {
          const geometry = feature.geometry as GeoJSONPolygon;
          const coords = geometry.coordinates[0];
          
          // Tìm bounds từ coordinates
          const lats = coords.map(c => c[1]);
          const lngs = coords.map(c => c[0]);
          const bounds: LatLngBoundsExpression = [
            [Math.min(...lats), Math.min(...lngs)],
            [Math.max(...lats), Math.max(...lngs)]
          ];
          
          return (
            <ImageOverlay
              key={`flag-bg-${index}`}
              url="/vietnam-flag.svg"
              bounds={bounds}
              opacity={0.4}
              zIndex={1}
            />
          );
        }

        // Render label "BIỂN ĐÔNG"
        if (props.type === 'sea_label' && feature.geometry.type === 'Point') {
          const coords = (feature.geometry as Point).coordinates;
          const position: [number, number] = [coords[1], coords[0]];
          
          return (
            <CircleMarker
              key={`sea-label-${index}`}
              center={position}
              radius={0}
              fillOpacity={0}
              opacity={0}
            >
              <Tooltip
                permanent
                direction="center"
                className="sea-label-main"
                offset={[0, 0]}
              >
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  letterSpacing: '0.15em',
                  color: '#1e40af',
                  textShadow: '2px 2px 4px rgba(255,255,255,0.95), -1px -1px 3px rgba(255,255,255,0.95)',
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                }}>
                  {props.name}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        }

        // Render tên quần đảo chính (archipelago)
        if (props.type === 'archipelago' && feature.geometry.type === 'Point') {
          const coords = (feature.geometry as Point).coordinates;
          const position: [number, number] = [coords[1], coords[0]];
          
          return (
            <CircleMarker
              key={`archipelago-${index}`}
              center={position}
              radius={0}
              fillOpacity={0}
              opacity={0}
            >
              <Tooltip
                permanent
                direction="center"
                className="maritime-label-main"
                offset={[0, 0]}
              >
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  color: '#dc2626',
                  textShadow: '2px 2px 4px rgba(255,255,255,0.95), -1px -1px 3px rgba(255,255,255,0.95)',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  padding: '2px 4px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '3px'
                }}>
                  {props.name}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        }

        // Render các đảo nhỏ - làm to hơn, rõ ràng hơn và có icon đảo
        if (props.type === 'island' && feature.geometry.type === 'Point') {
          const coords = (feature.geometry as Point).coordinates;
          const position: [number, number] = [coords[1], coords[0]];
          
          return (
            <CircleMarker
              key={`island-${index}`}
              center={position}
              radius={islandRadius}
              fillColor="#fbbf24"
              fillOpacity={0.95}
              color="#dc2626"
              weight={2.5}
              opacity={1}
            >
              <Tooltip direction="top" offset={[0, -10]} className="island-tooltip">
                <span style={{ fontWeight: '600', fontSize: '11px' }}>{props.name}</span>
              </Tooltip>
            </CircleMarker>
          );
        }

        return null;
      })}
    </>
  );
}
