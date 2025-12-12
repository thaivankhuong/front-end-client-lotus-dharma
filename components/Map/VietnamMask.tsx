'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * VietnamMask Component
 * Creates an inverse polygon mask that covers everything outside Vietnam's borders
 * This hides labels and features from neighboring countries
 */
export default function VietnamMask({ vietnamGeoJSON }: { vietnamGeoJSON: any }) {
  const map = useMap();

  useEffect(() => {
    if (!vietnamGeoJSON || !map) return;

    // Create world bounds (covering entire world)
    const worldBounds: [number, number][] = [
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180],
      [90, -180], // Close the loop
    ];

    // Extract all Vietnam coordinates (to create holes in the world polygon)
    const vietnamHoles: [number, number][][][] = [];

    vietnamGeoJSON.features.forEach((feature: any) => {
      if (feature.geometry.type === 'Polygon') {
        // Reverse coordinates from [lng, lat] to [lat, lng] and reverse order for holes
        const coords = feature.geometry.coordinates[0]
          .map((coord: number[]) => [coord[1], coord[0]] as [number, number])
          .reverse();
        vietnamHoles.push([coords]);
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon: number[][][]) => {
          const coords = polygon[0]
            .map((coord: number[]) => [coord[1], coord[0]] as [number, number])
            .reverse();
          vietnamHoles.push([coords]);
        });
      }
    });

    // Create inverse polygon: world with Vietnam-shaped holes
    const maskLayer = L.polygon([worldBounds, ...vietnamHoles.flat()], {
      color: 'transparent',
      fillColor: '#f8fafc', // Light gray/white to cover outside areas
      fillOpacity: 0.85,
      weight: 0,
      interactive: false, // Don't capture mouse events
    }).addTo(map);

    // Clean up on unmount
    return () => {
      map.removeLayer(maskLayer);
    };
  }, [map, vietnamGeoJSON]);

  return null;
}




