"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import MapPicker from "./MapPicker";
import { Map } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { strict } from "assert";

interface MapCoordinatesProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
}

export function MapCoordinates({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
}: MapCoordinatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLatitude, setTempLatitude] = useState(latitude);
  const [tempLongitude, setTempLongitude] = useState(longitude);

  const handleSave = (lat: string, long: string) => {
    onLatitudeChange(lat);
    onLongitudeChange(long);
    setIsOpen(false);
  };

  //   const getCurrentLocation = () => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           onLatitudeChange(position.coords.latitude.toString());
  //           onLongitudeChange(position.coords.longitude.toString());
  //         },
  //         (error) => {
  //           console.error("Error getting location:", error);
  //         }
  //       );
  //     }
  //   };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <Input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => onLatitudeChange(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => onLongitudeChange(e.target.value)}
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Map className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Pick Location</DialogTitle>
            </DialogHeader>
            <MapPicker
              latitude={tempLatitude}
              longitude={tempLongitude}
              onLatitudeChange={setTempLatitude}
              onLongitudeChange={setTempLongitude}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
