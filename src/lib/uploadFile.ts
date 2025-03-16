import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

interface FileData {
  file: File;
  fileData?: string; // base64 string
  fileType?: string;
  originalName: string;
}

// Configure S3 client
const s3Client: S3Client = new S3Client({
  region: process.env.S3_AWS_REGION ?? "",
  credentials: {
    accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY ?? "",
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
    return `https://${bucketName}.s3.${process.env.S3_AWS_REGION}.amazonaws.com/${s3Key}`; // Construct the URL manually
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export async function uploadFile(imageBody: FileData): Promise<string> {
  const { file } = imageBody;
  const bucketName = process.env.S3_AWS_BUCKET ?? "";

  try {
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const fileType = file.type;
    const extension = fileType.split("/")[1] || "jpg";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const s3Key = `uploads/${uniqueSuffix}.${extension}`;

    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: buffer,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(params));

    return `https://${bucketName}.s3.${process.env.S3_AWS_REGION}.amazonaws.com/${s3Key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}
