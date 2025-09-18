import { MapProvider } from "@/components/map/map-provider";
import { InteractiveMap } from "@/components/map/interactive-map";

export default function MapPage() {
    return (
        <div className="h-[calc(100vh-10rem)] w-full -m-4 md:-m-6 lg:-m-8">
            <MapProvider>
                <InteractiveMap />
            </MapProvider>
        </div>
    );
}
