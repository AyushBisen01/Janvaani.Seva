
'use client';
import * as React from 'react';
import { MapProvider } from "@/components/map/map-provider";
import { InteractiveMap } from "@/components/map/interactive-map";
import { AppContext } from '../layout';

export default function MapPage() {
    const context = React.useContext(AppContext);

    if (!context) {
        return null;
    }

    const { issues } = context;

    return (
        <div className="h-[calc(100vh-10rem)] w-full -m-4 md:-m-6 lg:-m-8">
            <MapProvider>
                <InteractiveMap issues={issues} />
            </MapProvider>
        </div>
    );
}
