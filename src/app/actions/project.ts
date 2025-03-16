"use server";

import { prisma } from "@/lib/prisma";
import { ImageWithMeta } from "@/components/MultiImageUpload";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/uploadFile";
import path from "path";
import fs from "fs";

interface ProcessedImage {
  url: string;
  description: string;
  isPrimary: boolean;
}

async function processImages(
  images: ImageWithMeta[]
): Promise<ProcessedImage[]> {
  const uploadPromises = images.map(async (img) => {
    let url = img.url || img.previewUrl;

    if (img.file) {
      // Changed this line, now we check for file.
      url = await uploadFile({
        file: img.file, // changed to only pass the file
        originalName: img.file.name,
      });
    }

    return {
      url,
      description: img.description,
      isPrimary: img.isPrimary,
    };
  });

  const resolvedImages: ProcessedImage[] = await Promise.all(uploadPromises);
  return resolvedImages;
}

function getIndexFromImageString(str: string) {
  const regex = /\[(\d+)\]/; // Matches [number]
  const match = str.match(regex);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

function getImageFormData(data: FormData): ImageWithMeta[] {
  const newImages: ImageWithMeta[] = [];
  const existingImages: ImageWithMeta[] = [];

  // Separate new and existing images
  const formKeys = Array.from(data.keys());
  for (const key of formKeys) {
    if (key.startsWith("newImages[")) {
      const index = getIndexFromImageString(key);
      if (index == null) continue;
      if (!newImages[index]) {
        newImages[index] = {
          previewUrl: "",
          isPrimary: false,
          description: "",
        };
      }
      if (key.endsWith("[description]")) {
        newImages[index].description = data.get(key) as string;
      } else if (key.endsWith("[isPrimary]")) {
        newImages[index].isPrimary = data.get(key) === "true";
      }
    } else if (key.startsWith("existingImages[")) {
      const index = getIndexFromImageString(key);
      if (index == null) continue;
      if (!existingImages[index]) {
        existingImages[index] = {
          previewUrl: "",
          isPrimary: false,
          description: "",
          url: "",
        };
      }
      if (key.endsWith("[description]")) {
        existingImages[index].description = data.get(key) as string;
      } else if (key.endsWith("[isPrimary]")) {
        existingImages[index].isPrimary = data.get(key) === "true";
      } else if (key.endsWith("[url]")) {
        existingImages[index].url = data.get(key) as string;
      }
    }
  }

  // Handle uploaded files
  const fileKeys = formKeys.filter(
    (key) =>
      key.startsWith("newImages[") &&
      !key.endsWith("[description]") &&
      !key.endsWith("[isPrimary]")
  );
  for (const key of fileKeys) {
    const index = getIndexFromImageString(key);
    if (index == null) continue;
    newImages[index].file = data.get(key) as File;
  }

  return [...existingImages, ...newImages];
}

export async function createProject(formData: FormData) {
  try {
    // Parse the form data
    const data = Object.fromEntries(formData.entries());

    const allImages = getImageFormData(formData);

    // Process and upload images
    const processedImages = await processImages(allImages);
    const otherUrls = JSON.parse(data.otherUrls as string);

    // Create the project with images as JSON string
    await prisma.project.create({
      data: {
        title: data.title as string,
        description: data.description as string,
        location: data.location as string,
        price: data.price as string,
        propertyType: data.propertyType as string,
        status: "Active",
        amenities: data.amenities as string,
        isReraRegistered: data.isReraRegistered === "true",
        reraNumbers: data.reraNumbers as string,
        landmark: data.landmark as string,
        landmarkDistance: data.landmarkDistance as string,
        latitude: data.latitude as string,
        longitude: data.longitude as string,
        images: JSON.stringify(processedImages),
        otherUrls: JSON.stringify(otherUrls),
      },
    });

    // Revalidate the projects page
    revalidatePath("/projects");

    return { success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const images = getImageFormData(formData);
    const otherUrls = JSON.parse(data.otherUrls as string);

    // Process and upload images
    const processedImages = await processImages(images);

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title as string,
        description: data.description as string,
        location: data.location as string,
        price: data.price as string,
        propertyType: data.propertyType as string,
        status: data.status as string,
        amenities: data.amenities as string,
        isReraRegistered: data.isReraRegistered === "true",
        reraNumbers: data.reraNumbers as string,
        landmark: data.landmark as string,
        landmarkDistance: data.landmarkDistance as string,
        latitude: data.latitude as string,
        longitude: data.longitude as string,
        images: JSON.stringify(processedImages),
        otherUrls: JSON.stringify(otherUrls),
      },
    });

    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    // Get the project to delete its images
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (project?.images) {
      const images = JSON.parse(project.images) as ProcessedImage[];

      // Delete image files from public folder
      for (const img of images) {
        if (img.url.startsWith("/uploads/")) {
          const filepath = path.join(process.cwd(), "public", img.url);
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        }
      }
    }

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
