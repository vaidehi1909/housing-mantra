"use server";

import { prisma } from "@/lib/prisma";
import { ImageWithMeta } from "@/components/MultiImageUpload";
import { projectFormSchema } from "@/lib/validations/project";
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
  const processedImages: ProcessedImage[] = [];

  for (const img of images) {
    let url = img.url || img.previewUrl;

    // If there's file data, upload it and get the new URL
    if (img.fileData && img.fileType) {
      url = await uploadFile({
        fileData: img.fileData,
        fileType: img.fileType,
        originalName: img.file?.name || "image",
      });
    }

    processedImages.push({
      url,
      description: img.description,
      isPrimary: img.isPrimary,
    });
  }

  return processedImages;
}

export async function createProject(formData: FormData) {
  try {
    // Parse the form data
    const data = Object.fromEntries(formData.entries());
    const images = JSON.parse(data.images as string) as ImageWithMeta[];
    const otherUrls = JSON.parse(data.otherUrls as string);

    // Process and upload images
    const processedImages = await processImages(images);

    // Create the project with images as JSON string
    const project = await prisma.project.create({
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
    const images = JSON.parse(data.images as string) as ImageWithMeta[];
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
