import * as z from "zod";

export const projectFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must be less than 100 characters"),
  price: z
    .string()
    .min(1, "Price range is required")
    .max(50, "Price range must be less than 50 characters"),
  propertyType: z
    .string()
    .min(2, "Property type must be at least 2 characters")
    .max(50, "Property type must be less than 50 characters"),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  isReraRegistered: z.boolean(),
  reraNumbers: z.array(z.string()).optional(),
  landmark: z
    .string()
    .min(2, "Landmark must be at least 2 characters")
    .optional(),
  landmarkDistance: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  otherUrls: z.array(z.string()).optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
