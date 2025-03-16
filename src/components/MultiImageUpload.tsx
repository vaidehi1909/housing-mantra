"use client";

import React, {
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  DragEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload } from "lucide-react";

export interface ImageWithMeta {
  file?: File;
  fileData?: string; // base64 string
  fileType?: string; // mime type
  url?: string;
  previewUrl: string;
  isPrimary: boolean;
  description: string;
}

interface MultiImageUploadProps {
  onImagesChange?: (images: ImageWithMeta[]) => void;
  initialImages?: ImageWithMeta[];
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onImagesChange,
  initialImages = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageWithMeta[]>(initialImages);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      addFiles(Array.from(files));
    }
  };

  const addFiles = async (files: File[]) => {
    const newImages: ImageWithMeta[] = await Promise.all(
      files.map(async (file) => ({
        file,
        fileData: await convertFileToBase64(file),
        fileType: file.type,
        previewUrl: URL.createObjectURL(file),
        isPrimary: false,
        description: "",
      }))
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (previewUrl: string) => {
    setImages((prevImages) =>
      prevImages.filter((img) => img.previewUrl !== previewUrl)
    );
    if (primaryImage === previewUrl) {
      setPrimaryImage(null);
    }
  };

  const handleSetPrimary = (previewUrl: string) => {
    setImages((prevImages) =>
      prevImages.map((img) => ({
        ...img,
        isPrimary: img.previewUrl === previewUrl,
      }))
    );
    setPrimaryImage(previewUrl);
  };

  const handleDescriptionChange = (previewUrl: string, description: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.previewUrl === previewUrl ? { ...img, description } : img
      )
    );
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAddImageClick}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            Click or drag images here to upload
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.previewUrl || image.url}
            className="relative border rounded-lg p-2 shadow-sm"
          >
            <img
              src={image.previewUrl || image.url}
              alt={image.description || "Project image"}
              className="w-full h-32 object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full shadow-md"
              onClick={() => handleRemoveImage(image.previewUrl)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mt-2 space-y-2">
              <Input
                type="text"
                placeholder="Description"
                value={image.description}
                onChange={(e) =>
                  handleDescriptionChange(image.previewUrl, e.target.value)
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`primary-${image.previewUrl}`}
                  checked={image.isPrimary}
                  onCheckedChange={() => handleSetPrimary(image.previewUrl)}
                />
                <label
                  htmlFor={`primary-${image.previewUrl}`}
                  className="text-sm text-gray-600"
                >
                  Set as primary
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
};

export default MultiImageUpload;
