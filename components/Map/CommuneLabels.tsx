'use client';

import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import type { GeoJsonObject } from 'geojson';

interface CommuneLabelsProps {
  communesGeoJSON: GeoJsonObject | null;
}

export default function CommuneLabels({ communesGeoJSON }: CommuneLabelsProps) {
  const map = useMap();
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => {
      setCurrentZoom(map.getZoom());
    };

    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map]);

  useEffect(() => {
    // Clear old markers
    markers.forEach(marker => marker.remove());

    // Only show labels when zoom >= 9 (similar to sapnhap)
    if (!communesGeoJSON || currentZoom < 9) {
      setMarkers([]);
      return;
    }

    const newMarkers: L.Marker[] = [];
    const geojson = communesGeoJSON as any;

    if (geojson.features) {
      geojson.features.forEach((feature: any) => {
        const name = feature.properties?.name;
        if (!name || !feature.geometry) return;

        try {
          // Calculate centroid
          let center: [number, number] | null = null;

          if (feature.geometry.type === 'Polygon') {
            const coords = feature.geometry.coordinates[0];
            if (coords && coords.length > 0) {
              const lats = coords.map((c: number[]) => c[1]);
              const lngs = coords.map((c: number[]) => c[0]);
              center = [
                lats.reduce((a: number, b: number) => a + b) / lats.length,
                lngs.reduce((a: number, b: number) => a + b) / lngs.length
              ];
            }
          } else if (feature.geometry.type === 'MultiPolygon') {
            const firstPolygon = feature.geometry.coordinates[0][0];
            if (firstPolygon && firstPolygon.length > 0) {
              const lats = firstPolygon.map((c: number[]) => c[1]);
              const lngs = firstPolygon.map((c: number[]) => c[0]);
              center = [
                lats.reduce((a: number, b: number) => a + b) / lats.length,
                lngs.reduce((a: number, b: number) => a + b) / lngs.length
              ];
            }
          }

          if (center) {
            const marker = L.marker([center[0], center[1]], {
              icon: L.divIcon({
                className: 'commune-label',
                html: `<div style="
                  font-size: 11px;
                  font-weight: 600;
                  color: white;
                  text-shadow: 
                    -1px -1px 0 #000,
                    1px -1px 0 #000,
                    -1px 1px 0 #000,
                    1px 1px 0 #000,
                    0 0 3px #000;
                  white-space: nowrap;
                  pointer-events: none;
                  text-align: center;
                ">${name}</div>`,
                iconSize: [100, 20],
                iconAnchor: [50, 10]
              }),
              interactive: false
            });

            marker.addTo(map);
            newMarkers.push(marker);
          }
        } catch (err) {
          // Skip communes with invalid geometry
        }
      });
    }

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [communesGeoJSON, currentZoom, map]);

  return null;
}

