'use client';

import { useMemo } from 'react';
import { Map, HeatmapLayer } from '@vis.gl/react-google-maps';
import { issues } from '@/lib/data';

export function IssueMapOverview() {
  const heatmapData = useMemo(() => {
    return issues.map((issue) => ({
      lat: issue.location.lat,
      lng: issue.location.lng,
      weight: 1,
    }));
  }, []);

  return (
    <div
      className="h-[400px] w-full overflow-hidden rounded-lg border"
      data-ai-hint="map overview"
    >
      <Map
        defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
        defaultZoom={11}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={'a2a2153c3143f605'}
      >
        <HeatmapLayer data={heatmapData} />
      </Map>
    </div>
  );
}
