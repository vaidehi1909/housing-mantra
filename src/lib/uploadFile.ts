import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

interface FileData {
  fileData: string; // base64 string
  fileType: string;
  originalName: string;
}

// Configure S3 client
const s3Client: S3Client = new S3Client({
  region: process.env.AWS_REGION ?? "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadBase64ToS3(
  base64DataUrl: string,
  bucketName: string,
  s3Key: string
) {
  try {
    const base64Data = base64DataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const contentTypeMatch = base64DataUrl.match(/data:(image\/\w+);base64,/);
    const contentType = contentTypeMatch
      ? contentTypeMatch[1]
      : "application/octet-stream";

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: contentType,
        ContentEncoding: "base64",
      },
    });

    await upload.done();
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`; // Construct the URL manually
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export async function uploadFile(imageBody: FileData): Promise<string> {
  const { fileData, fileType } = imageBody;
  const bucketName = process.env.AWS_S3_BUCKET ?? "";
  const extension = fileType.split("/")[1] || "jpg";
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const s3Key = `uploads/${uniqueSuffix}.${extension}`;

  const s3Url = await uploadBase64ToS3(fileData, bucketName, s3Key);
  return s3Url;
}
