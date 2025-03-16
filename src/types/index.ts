export interface ProjectImage {
  id: string;
  url: string;
  description: string | null;
  isPrimary: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  propertyType: string;
  status: string;
  amenities: string;
  isReraRegistered: boolean;
  reraNumbers: string | null;
  landmark: string | null;
  landmarkDistance: string | null;
  latitude: string | null;
  longitude: string | null;
  images: string | null;
  otherUrls: string | null;
  createdAt: Date;
  updatedAt: Date;
}
