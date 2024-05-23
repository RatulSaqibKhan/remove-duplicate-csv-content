import fs from "fs";
import * as Minio from "minio";
import { LoggerService } from "./LoggerService";
import { MinioClient } from "../utils/MinioClient";
import { BucketList } from "../interfaces/minio/BucketList";
import { ObjectListInterface } from "../interfaces/minio/ObjectListInterface";

export class MinioService {
  /**
   * Minio Client
   * @var client
   */
  private client: Minio.Client;

  /**
   * List of all buckets
   * @var buckets
   */
  private buckets: BucketList[];

  /**
   * Meta data of an object
   * @var objectMetaData
   */
  private objectMetaData: any;

  /**
   * @var listObjectStream
   */
  private listObjectStream: any;

  /**
   * List of objects in a bucket
   * @var objectList
   */
  private objectList: ObjectListInterface[];

  /**
   * @var loggerService
   */
  private loggerService: LoggerService;

  constructor(loggerService: LoggerService) {
    this.loggerService = loggerService;
  }

  /**
   * Connect to minio
   * @returns
   */
  public connect(): this {
    this.client = new MinioClient().getClient();
    return this;
  }

  /**
   * Get Minio Client
   * @returns
   */
  public getClient(): Minio.Client {
    return this.client;
  }

  /**
   * Get buckets
   * @returns
   */
  public getBuckets(): BucketList[] {
    return this.buckets;
  }

  /**
   * Make a Bucket in a specific region
   * @param bucketName
   * @param region
   * @returns
   */
  public async makeBucket(bucketName: string, region: string): Promise<void> {
    return await this.client.makeBucket(bucketName, region);
  }

  /**
   * Check if bucket exists
   * @param bucketName
   * @returns
   */
  public async checkBucketExists(bucketName: string): Promise<boolean> {
    return await this.client.bucketExists(bucketName);
  }

  /**
   * Upload a file using fileStream
   * @param bucketName
   * @param destObjectName
   * @param fileStream
   * @param stats
   * @returns
   */
  public async objectUploadStreaming(
    bucketName: string,
    destObjectName: string,
    fileStream: fs.ReadStream,
    stats: fs.Stats
  ): Promise<Minio.UploadedObjectInfo> {
    return await this.client.putObject(
      bucketName,
      destObjectName,
      fileStream,
      stats.size
    );
  }

  /**
   * Upload a file content
   * @param bucketName
   * @param destObjectName
   * @param localFilePath
   * @param metaData
   * @returns
   */
  public async objectUpload(
    bucketName: string,
    destObjectName: string,
    localFilePath: string
  ): Promise<Minio.UploadedObjectInfo> {
    return await this.client.fPutObject(
      bucketName,
      destObjectName,
      localFilePath
    );
  }

  /**
   * Delete object in a bucket
   * @param bucketName
   * @param objectName
   * @returns
   */
  public async deleteObject(
    bucketName: string,
    objectName: string
  ): Promise<void> {
    const processName = "s3_delete_object";
    return await this.client.removeObject(bucketName, objectName);
  }

  /**
   * Get Object Meta Data
   * @returns
   */
  public getObjectMetaData(): any {
    return this.objectMetaData;
  }

  /**
   * Set Object Meta Data
   * @param bucketName
   * @param objectName
   * @returns
   */
  public async setObjectMetaData(
    bucketName: string,
    objectName: string
  ): Promise<Minio.BucketItemStat> {
    return await this.client.statObject(bucketName, objectName);
  }

  /**
   * Copy Object in a bucket
   * @param etag
   * @param bucketName
   * @param newObjectName
   * @param srcObjectName
   * @returns
   */
  public copyObject(
    etag: string,
    bucketName: string,
    newObjectName: string,
    srcObjectName: string
  ): Promise<string> {
    const processName = "s3_copy_object";
    return new Promise((resolve, reject) => {
      let conds = new Minio.CopyConditions();
      conds.setMatchETag(etag);
      this.client.copyObject(
        bucketName,
        newObjectName,
        srcObjectName,
        conds,
        (err: any, data: any) => {
          if (err) {
            this.loggerService.generateErrorLog(processName, err);
            reject(err.message);
          }
          const successMessage = `Successfully copied the object! etag = ${data.etag} lastModified = ${data.lastModified}`;
          this.loggerService.generateSuccessLog(processName, successMessage);
          resolve(successMessage);
        }
      );
    });
  }

  /**
   * Get list of objects
   * @returns
   */
  public getObjectList(): Promise<ObjectListInterface[]> {
    return new Promise((resolve, reject): Promise<ObjectListInterface[]> => {
      return this.listObjectStream.on("end", (obj: any) => {
        const processName = "s3_list_objects";
        const successMessage = `Successfully listed all objects!`;
        this.loggerService.generateSuccessLog(processName, successMessage);

        return resolve(this.objectList);
      });
    });
  }

  /**
   * Set List of objects
   * @param bucketName
   * @param prefix
   * @param recursive
   * @returns
   */
  public setObjectList(
    bucketName: string,
    prefix: string,
    recursive: boolean = true
  ): this {
    const processName = "s3_list_objects";

    this.objectList = [];

    this.listObjectStream = this.client.listObjects(
      bucketName,
      prefix,
      recursive
    );

    this.listObjectStream.on("data", (obj: ObjectListInterface) => {
      this.objectList.push(obj);
    });

    this.listObjectStream.on("error", (err: any) => {
      this.loggerService.generateErrorLog(processName, err);
    });

    return this;
  }
}
