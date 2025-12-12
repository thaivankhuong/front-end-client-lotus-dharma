'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';

/**
 * ProvinceLabels Component
 * Adds permanent labels for Vietnamese provinces
 * Labels are only visible at certain zoom levels
 */
export default function ProvinceLabels({ 
  provincesGeoJSON, 
  selectedProvince 
}: { 
  provincesGeoJSON: any;
  selectedProvince: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!provincesGeoJSON || !map) return;

    const labels: L.Marker[] = [];

    // Create permanent labels for each province
    provincesGeoJSON.features.forEach((feature: any) => {
      const props = feature.properties;
      const provinceName = props.name || props.name_vi;
      const provinceCode = props.code;

      if (!provinceName) return;

      try {
        // Calculate centroid of the province using Turf
        const centroid = turf.centroid(feature);
        const [lng, lat] = centroid.geometry.coordinates;

        // Create a custom div icon for the label
        const labelIcon = L.divIcon({
          className: 'province-label-marker',
          html: `
            <div class="province-label-text ${provinceCode === selectedProvince ? 'selected' : ''}">
              ${provinceName}
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        // Create marker at centroid
        const marker = L.marker([lat, lng], {
          icon: labelIcon,
          interactive: false, // Labels don't capture mouse events
        }).addTo(map);

        labels.push(marker);
      } catch (error) {
        console.warn(`Failed to create label for province ${provinceName}:`, error);
      }
    });

    // Clean up on unmount
    return () => {
      labels.forEach(label => map.removeLayer(label));
    };
  }, [map, provincesGeoJSON, selectedProvince]);

  return null;
}




