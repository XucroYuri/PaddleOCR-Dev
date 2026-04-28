import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "./config";

/**
 * P4.1: Storage adapter interface
 */
export interface StorageAdapter {
  putObject(key: string, body: Buffer | Uint8Array, contentType?: string): Promise<void>;
  presignedPut(key: string, expiresInSec: number): Promise<string>;
  presignedGet(key: string, expiresInSec: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
}

/**
 * P4.1: Storage error types
 */
export class StorageError extends Error {
  constructor(
    public code: "UPLOAD_FAILED" | "DOWNLOAD_FAILED" | "DELETE_FAILED" | "INVALID_KEY",
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "StorageError";
  }
}

/**
 * P4.1: S3-compatible storage implementation
 * Works with AWS S3, MinIO, Cloudflare R2, etc.
 */
export class S3StorageAdapter implements StorageAdapter {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = config.storage.bucket;

    const endpoint = config.storage.endpoint;
    const isLocalhost = endpoint?.includes("localhost") || endpoint?.includes("127.0.0.1");

    this.client = new S3Client({
      region: config.storage.region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: config.storage.accessKey,
        secretAccessKey: config.storage.secretKey,
      },
      // Force path style for MinIO/local development
      forcePathStyle: isLocalhost,
    });
  }

  async putObject(key: string, body: Buffer | Uint8Array, contentType?: string): Promise<void> {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        })
      );
    } catch (error) {
      throw new StorageError("UPLOAD_FAILED", `Failed to upload object: ${key}`, error);
    }
  }

  async presignedPut(key: string, expiresInSec: number): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return await getSignedUrl(this.client, command, { expiresIn: expiresInSec });
    } catch (error) {
      throw new StorageError("UPLOAD_FAILED", `Failed to generate presigned PUT URL: ${key}`, error);
    }
  }

  async presignedGet(key: string, expiresInSec: number): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return await getSignedUrl(this.client, command, { expiresIn: expiresInSec });
    } catch (error) {
      throw new StorageError("DOWNLOAD_FAILED", `Failed to generate presigned GET URL: ${key}`, error);
    }
  }

  async deleteObject(key: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
    } catch (error) {
      throw new StorageError("DELETE_FAILED", `Failed to delete object: ${key}`, error);
    }
  }
}

// Singleton instance
let storageInstance: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = new S3StorageAdapter();
  }
  return storageInstance;
}

/**
 * P4.3: Object key template helper
 * Format: {sessionId}/{taskId}/{type}/{filename}
 */
export function buildObjectKey(
  sessionId: string,
  taskId: string,
  type: "source" | "output" | "artifact",
  filename: string
): string {
  return `${sessionId}/${taskId}/${type}/${filename}`;
}

/**
 * P4.3: Validates key namespace belongs to session
 */
export function validateKeyNamespace(key: string, sessionId: string): boolean {
  return key.startsWith(`${sessionId}/`);
}
