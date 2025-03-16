"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  latitude: string;
  longitude: string;
  onLatitudeChange?: (value: string) => void;
  onLongitudeChange?: (value: string) => void;
  onSave?: (lat: string, long: string) => void;
}

function LocationMarker({
  position,
  setPosition,
}: {
  position: L.LatLng;
  setPosition: (pos: L.LatLng) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.on("click", (e: L.LeafletMouseEvent) => {
      setPosition(e.latlng);
    });
  }, [map, setPosition]);

  return <Marker position={position} icon={icon} />;
}

export default function MapPicker({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  onSave,
}: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng>(
      L.latLng(
        parseFloat(latitude || "18.5204") || 18.5204,
        parseFloat(longitude || "73.8567") || 73.8567
      )
    );

  const handleSave = () => {
    onLatitudeChange?.(position.lat.toString());
    onLongitudeChange?.(position.lng.toString());
    onSave?.(position.lat.toString(), position.lng.toString());
  };


  return (
    <div className="space-y-4">
      <div className="relative h-[400px] w-full rounded-md overflow-hidden">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
        <div className="absolute bottom-4 left-4 z-[400] bg-white p-2 rounded-md shadow-md">
          <p className="text-sm">
            Latitude: {position.lat.toFixed(6)}
            <br />
            Longitude: {position.lng.toFixed(6)}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Location</Button>
      </div>
    </div>
  );
}
