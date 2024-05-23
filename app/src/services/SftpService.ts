import { LoggerService } from "./LoggerService";
import { SftpClient } from "../utils/SftpClient";
import sftp from "ssh2-sftp-client";

export class SftpService {
  /**
   * @var sftpClient
   */
  private sftpClient: Promise<sftp>;

  /**
   * @var loggerService
   */
  private loggerService: LoggerService;

  constructor(loggerService: LoggerService) {
    this.loggerService = loggerService;
  }

  /**
   * Connect the SFTP
   * @returns this
   */
  public connect(): this {
    const processName = "sftp_connection";
    let message = "";
    try {
      this.sftpClient = new SftpClient().connect();
      this.sftpClient
        .then(() => {
          message = "SFTP Connected";
          this.loggerService.generateSuccessLog(processName, message);
        })
        .catch((err) => {
          message = err.message;
          this.loggerService.generateErrorLog(processName, message);
        });
    } catch (err) {
      message = err.message;
      this.loggerService.generateErrorLog(processName, message);
    }

    return this;
  }

  /**
   * Getter for sftpClient
   * @returns Promise<sftp>
   */
  public getClient(): Promise<sftp> {
    return this.sftpClient;
  }

  /**
   * Close SFTP connection
   * @param sftp sftp
   * @returns 
   */
  public async closeConnection(sftp: sftp): Promise<void> {
    return await sftp.end();
  }

  /**
   * Upload file in SFTP
   * @param sftp sftp
   * @param localFilePath string
   * @param remoteFilePath string
   * @returns Promise<string>
   */
  public async putFile(
    sftp: sftp,
    localFilePath: string,
    remoteFilePath: string
  ): Promise<string> {
    return await sftp.put(localFilePath, remoteFilePath);
  }

  /**
   * Rename/Move a file in SFTP
   * @param sftp sftp
   * @param remoteSourcePath string
   * @param remoteDestPath string
   * @returns Promise<string>
   */
  public async renameFile(
    sftp: sftp,
    remoteSourcePath: string,
    remoteDestPath: string
  ): Promise<string> {
    return await sftp.rename(remoteSourcePath, remoteDestPath);
  }

  /**
   * Delete a file in SFTP
   * @param sftp 
   * @param remoteSourcePath 
   * @returns Promise<string>
   */
  public async deleteFile(
    sftp: sftp,
    remoteSourcePath: string
  ): Promise<string> {
    return await sftp.delete(remoteSourcePath);
  }

  /**
   * Get File list in a SFTP directory
   * @param sftp 
   * @param remoteFilePath 
   * @returns Promise<sftp.FileInfo[]>
   */
  public async getFiles(
    sftp: sftp,
    remoteFilePath: string
  ): Promise<sftp.FileInfo[]> {
    return await sftp.list(remoteFilePath);
  }

  /**
   * Get file from SFTP
   * @param sftp 
   * @param remoteFilePath 
   * @param dst 
   * @returns 
   */
  public async getFile(
    sftp: sftp,
    remoteFilePath: string,
    dst: string | NodeJS.WritableStream
  ): Promise<string | NodeJS.WritableStream | Buffer> {
    return await sftp.get(remoteFilePath, dst);
  }

  /**
   * Make a directory in SFTP
   * @param sftp 
   * @param remoteDirPath 
   * @returns Promise<string>
   */
  public async makeDirectory(
    sftp: sftp,
    remoteDirPath: string
  ): Promise<string> {
    return await sftp.mkdir(remoteDirPath);
  }
}
