import * as Minio from 'minio';
import * as minioConfig from '../configs/minio'

export class MinioClient {

  /**
   * Minio Client
   * @var client
   */
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
        endPoint: minioConfig.MINIO_HOST,
        port: minioConfig.MINIO_PORT,
        useSSL: minioConfig.MINIO_USE_SSL,
        accessKey: minioConfig.MINIO_ACCESS_KEY,
        secretKey: minioConfig.MINIO_SECRET_KEY
    });
  }

  /**
   * Get client
   * @returns 
   */
  public getClient(): Minio.Client {
    return this.client;
  }
}