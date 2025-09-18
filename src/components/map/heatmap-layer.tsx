'use client';

import { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

type HeatmapLayerProps = {
  data: { lat: number; lng: number; weight: number }[];
  options?: google.maps.visualization.HeatmapLayerOptions;
};

export function HeatmapLayer({ data, options }: HeatmapLayerProps) {
  const map = useMap();
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map || !window.google?.maps?.visualization) return;

    const heatmapData = data.map(
      (point) => new google.maps.LatLng(point.lat, point.lng)
    );

    const newHeatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      ...options,
    });

    newHeatmap.setMap(map);
    setHeatmap(newHeatmap);

    return () => {
      newHeatmap.setMap(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, data, options]);


  useEffect(() => {
    if (heatmap && options) {
      heatmap.setOptions(options);
    }
  }, [heatmap, options]);

  return null;
}
