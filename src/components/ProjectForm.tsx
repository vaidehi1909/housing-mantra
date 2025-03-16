"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiImageUpload from "@/components/MultiImageUpload";
import { AmenitiesSelection } from "@/components/AmenitiesSelection";
import { MapCoordinates } from "@/components/MapCoordinates";
import {
  projectFormSchema,
  type ProjectFormData,
} from "@/lib/validations/project";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Project } from "@/types";
import { ImageWithMeta } from "@/components/MultiImageUpload";
import ImageUrlInput from "@/components/ImageUrlInput";

const landmarkOptions = [
  "Park",
  "School",
  "Hospital",
  "Mall",
  "Metro Station",
  "Bus Stop",
  "Temple",
  "Market",
] as const;

interface ProjectFormProps {
  initialData?: Project | null;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel?: string;
  isNew?: boolean;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  submitLabel = "Create Project",
  isNew = false,
}: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageWithMeta[]>(
    initialData?.images ? JSON.parse(initialData.images) : []
  );
  const [otherUrls, setOtherUrls] = useState<string[]>(
    initialData?.otherUrls ? JSON.parse(initialData.otherUrls) : []
  );
  const [reraNumbers, setReraNumbers] = useState<string[]>(
    initialData?.reraNumbers ? JSON.parse(initialData.reraNumbers) : [""]
  );

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      price: initialData?.price || "",
      propertyType: initialData?.propertyType || "",
      amenities: initialData?.amenities
        ? JSON.parse(initialData.amenities)
        : [],
      isReraRegistered: initialData?.isReraRegistered || false,
      reraNumbers: initialData?.reraNumbers
        ? JSON.parse(initialData.reraNumbers)
        : [],
      landmark: initialData?.landmark || "",
      landmarkDistance: initialData?.landmarkDistance || "",
      latitude: initialData?.latitude || "",
      longitude: initialData?.longitude || "",
      otherUrls: initialData?.otherUrls
        ? JSON.parse(initialData.otherUrls)
        : [],
    },
  });

  const addReraNumber = () => {
    setReraNumbers([...reraNumbers, ""]);
  };

  const removeReraNumber = (index: number) => {
    setReraNumbers(reraNumbers.filter((_, i) => i !== index));
  };

  const updateReraNumber = (index: number, value: string) => {
    const newReraNumbers = [...reraNumbers];
    newReraNumbers[index] = value;
    setReraNumbers(newReraNumbers);
    form.setValue("reraNumbers", newReraNumbers.filter(Boolean));
  };

  async function handleSubmit(data: ProjectFormData) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const allImages = [...images];
      formData.append("images", JSON.stringify(allImages));
      formData.append("otherUrls", JSON.stringify(otherUrls.filter(Boolean)));

      await onSubmit(formData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? `Project Details` : `Update Amenities`}</CardTitle>
        <CardDescription>
          Fill out the details below about this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {isNew && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter project description"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter project location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Range</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter price range" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter property type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AmenitiesSelection
                      selectedAmenities={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Images</FormLabel>
              <MultiImageUpload
                onImagesChange={setImages}
                initialImages={images}
              />
              <ImageUrlInput
                onUrlsChange={(urls) => {
                  setOtherUrls(urls);
                }}
                initialUrls={otherUrls}
                label="Other URLs"
                allowEmpty
              />
            </div>

            <Card className="py-4 pb-0">
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="isReraRegistered"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Is the project RERA registered?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          defaultValue={field.value ? "true" : "false"}
                          className="flex flex-row space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="rera-yes" />
                            <label htmlFor="rera-yes">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="rera-no" />
                            <label htmlFor="rera-no">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {form.watch("isReraRegistered") && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>RERA Number(s)</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addReraNumber}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add another RERA number
                  </Button>
                </div>
                {reraNumbers.map((number, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={number}
                      onChange={(e) => updateReraNumber(index, e.target.value)}
                      placeholder="Enter RERA number"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeReraNumber(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Card className="py-4 pb-0">
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="landmark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Landmark</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a landmark" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {landmarkOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landmarkDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distance</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter distance"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field: latField }) => (
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field: lngField }) => (
                        <FormItem>
                          <FormLabel>Location Coordinates</FormLabel>
                          <FormControl>
                            <MapCoordinates
                              latitude={latField.value ?? ""}
                              longitude={lngField.value ?? ""}
                              onLatitudeChange={latField.onChange}
                              onLongitudeChange={lngField.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
