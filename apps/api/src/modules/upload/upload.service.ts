import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private s3Client?: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME || 'fashion-friday-images';
    this.publicUrl = process.env.R2_PUBLIC_URL || '';
    
    const accountId = process.env.R2_ACCOUNT_ID;
    
    if (accountId) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      });
    } else {
      console.warn('R2_ACCOUNT_ID is not defined in environment variables. Uploads will fail.');
    }
  }

  async uploadFile(file: Express.Multer.File, slug?: string, folder?: string): Promise<string> {
    if (!this.s3Client) {
      throw new InternalServerErrorException('Upload service is not configured');
    }

    let processedBuffer = file.buffer;
    let fileExtension = file.originalname.split('.').pop() || 'bin';
    let contentType = file.mimetype;

    // Optimize images to webp automatically
    if (contentType.startsWith('image/')) {
      try {
        const sharp = require('sharp');
        processedBuffer = await sharp(file.buffer)
          .webp({ quality: 80 })
          .toBuffer();
          
        fileExtension = 'webp';
        contentType = 'image/webp';
      } catch (err) {
        console.error('Failed to optimize image with sharp:', err);
        // Fallback to original buffer
      }
    }
    
    // Create a SEO-friendly name based on the slug or the original file name
    let baseName = '';
    if (slug) {
      baseName = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    } else {
      // Fallback to original file name without extension
      const originalWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.')) || file.originalname;
      baseName = originalWithoutExt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    if (!baseName) baseName = 'image';

    // e.g. puffer-jacket-a1b2c3d4.webp
    const randomSuffix = randomUUID().split('-')[0];
    
    // For brands, use exactly the brand name without random suffix
    const fileName = folder === 'brands' 
      ? `${baseName}.${fileExtension}`
      : `${baseName}-${randomSuffix}.${fileExtension}`;
    
    // Construct the final key with an optional folder prefix (e.g. products/puffer-jacket...)
    const fullPath = folder ? `${folder.replace(/^\/+|\/+$/g, '')}/${fileName}` : fileName;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fullPath,
          Body: processedBuffer,
          ContentType: contentType,
        })
      );

      return `${this.publicUrl}/${fullPath}`;
    } catch (error) {
      console.error('Error uploading file to R2:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!this.s3Client) {
      console.warn('Upload service is not configured. Cannot delete file.');
      return false;
    }

    try {
      // The fileUrl will look like https://pub-xxx.r2.dev/products/jacket-a1b2.webp
      // We need to extract the "products/jacket-a1b2.webp" part (the Key)
      if (!fileUrl.startsWith(this.publicUrl)) {
        console.warn(`File URL ${fileUrl} does not match the configured public URL. Skipping deletion.`);
        return false;
      }

      // Remove the public URL prefix and any leading slashes
      const key = fileUrl.substring(this.publicUrl.length).replace(/^\/+/, '');

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        })
      );
      
      return true;
    } catch (error) {
      console.error(`Failed to delete file from R2 (${fileUrl}):`, error);
      return false; // We just return false rather than throwing, so we don't block DB operations
    }
  }
}
