import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const amenitiesList = [
  "School in vicinity",
  "Adjoining Metro Station",
  "Peaceful vicinity",
  "Near City Center",
  "Safe & Secure Locality",
  "Desperate Sale",
  "Breakthrough Price",
  "Quick Deal",
  "Investment Opportunity",
  "High Rental Yield",
  "Affordable",
  "Reputed Builder",
  "Well Ventilated",
  "Fully Renovated",
  "Vastu Compliant",
  "Spacious",
  "Ample Parking",
  "Free Hold",
  "Gated Society",
  "Tasteful Interior",
  "Prime Location",
  "Luxury Lifestyle",
  "Well Maintained",
  "Plenty of Sunlight",
  "Newly Built",
  "Family",
  "Bachelors",
  "Females Only",
] as const;

export type Amenity = (typeof amenitiesList)[number];

interface AmenitiesSelectionProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

export function AmenitiesSelection({
  selectedAmenities,
  onChange,
}: AmenitiesSelectionProps) {
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onChange(selectedAmenities.filter((a) => a !== amenity));
    } else {
      onChange([...selectedAmenities, amenity]);
    }
  };

  const selectAll = () => {
    onChange([...amenitiesList]);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Amenities</h3>
        <div className="space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {amenitiesList.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={`amenity-${amenity}`}
              checked={selectedAmenities.includes(amenity)}
              onCheckedChange={() => toggleAmenity(amenity)}
            />
            <label
              htmlFor={`amenity-${amenity}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {amenity}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
