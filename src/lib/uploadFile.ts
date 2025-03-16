import fs from "fs";
import path from "path";

interface FileData {
  fileData: string; // base64 string
  fileType: string;
  originalName: string;
}

export async function uploadFile(fileData: FileData): Promise<string> {
  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = fileData.fileData.replace(/^data:image\/\w+;base64,/, "");

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, "base64");

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique filename with proper extension
  const extension = fileData.fileType.split("/")[1] || "jpg";
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}.${extension}`;
  const filepath = path.join(uploadDir, filename);

  // Write file to disk
  fs.writeFileSync(filepath, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}
