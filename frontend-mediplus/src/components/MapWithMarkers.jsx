import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";


// ✅ Fix des icônes Leaflet (Vite)
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


const DefaultIcon = L.icon({ iconUrl: marker1x, iconRetinaUrl: marker2x, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;


function FlyTo({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 13, { duration: 0.6 });
    }, [center, map]);
    return null;
}

export default function MapWithMarkers({ center = [5.3456, -4.0237], items = [], onSelect }) {
    return (
        <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                <FlyTo center={center} />
                {items.map((it) => (
                    <Marker key={it.id} position={[it.lat, it.lng]} eventHandlers={{ click: () => onSelect?.(it) }}>
                        <Popup>
                            <div className="text-sm">
                                <div className="font-medium">{it.name}</div>
                                <div className="text-slate-500">{it.specialty}</div>
                                <div className="mt-1">À ~{it.distance_km ?? "-"} km</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}