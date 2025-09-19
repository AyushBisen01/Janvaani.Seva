
'use client';

import { useMemo } from 'react';
import { Map, Circle } from '@vis.gl/react-google-maps';
import type { Issue } from '@/lib/types';

// Helper to group issues that are close to each other
function clusterIssues(issues: Issue[], distance: number) {
  const clusters: { lat: number; lng: number; count: number; issues: Issue[] }[] = [];

  issues.forEach(issue => {
    let found = false;
    for (const cluster of clusters) {
      const d = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(issue.location),
        new google.maps.LatLng(cluster)
      );
      if (d < distance) {
        cluster.lat = (cluster.lat * cluster.count + issue.location.lat) / (cluster.count + 1);
        cluster.lng = (cluster.lng * cluster.count + issue.location.lng) / (cluster.count + 1);
        cluster.count++;
        cluster.issues.push(issue);
        found = true;
        break;
      }
    }
    if (!found) {
      clusters.push({ ...issue.location, count: 1, issues: [issue] });
    }
  });

  return clusters;
}


export function IssueMapOverview({issues}: {issues: Issue[]}) {

  const issueClusters = useMemo(() => {
     if (typeof window === 'undefined' || !window.google?.maps?.geometry) {
      return [];
    }
    // Cluster issues within a 5km radius
    return clusterIssues(issues, 5000); 
  }, [issues]);


  const center = useMemo(() => {
    if (issues.length === 0) {
      return { lat: 19.7515, lng: 75.7139 }; // Centered on Maharashtra, India
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
        {issueClusters.map((cluster, index) => (
            <Circle
                key={index}
                center={{lat: cluster.lat, lng: cluster.lng}}
                radius={500 + cluster.count * 200} // Radius grows with issue count
                strokeColor={'hsl(var(--destructive))'}
                strokeOpacity={0.8}
                strokeWeight={2}
                fillColor={'hsl(var(--destructive))'}
                fillOpacity={0.35}
            />
        ))}
      </Map>
    </div>
  );
}

