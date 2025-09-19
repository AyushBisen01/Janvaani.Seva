
'use client';

import { useMemo } from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { HeatmapLayer } from '../map/heatmap-layer';
import type { Issue } from '@/lib/types';


export function IssueMapOverview({issues}: {issues: Issue[]}) {
  const heatmapData = useMemo(() => {
    return issues.map((issue) => ({
      lat: issue.location.lat,
      lng: issue.location.lng,
      weight: 1,
    }));
  }, [issues]);

  const center = useMemo(() => {
    if (issues.length === 0) {
      return { lat: 21.1463
        , lng: 79.0849
      }; // Centered on Maharashtra, India
    }
    const { lat, lng } = issues.reduce(
      (acc, issue) => {
        acc.lat += issue.location.lat;
        acc.lng += issue.location.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    return { lat: lat / issues.length, lng: lng / issues.length };
  }, [issues]);

  return (
    <div
      className="h-[400px] w-full overflow-hidden rounded-lg border"
      data-ai-hint="map overview"
    >
      <Map
        center={center}
        defaultZoom={issues.length === 1 ? 15 : 7}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={'a2a2153c3143f605'}
      >
        <HeatmapLayer data={heatmapData} />
      </Map>
    </div>
  );
}
