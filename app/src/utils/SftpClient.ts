import sftp from "ssh2-sftp-client";
import * as sftpConfig from "../configs/sftp";

export class SftpClient {
  /**
   * @var sftpClient sftp
   */
  public sftpClient: sftp;

  /**
   * Connect to SFTP
   * @returns Promise<sftp>
   */
  public async connect(): Promise<sftp> {
      this.sftpClient = new sftp();
      
      await this.sftpClient.connect({
        host: sftpConfig.SFTP_HOST,
        port: Number(sftpConfig.SFTP_PORT),
        username: sftpConfig.SFTP_USER,
        password: sftpConfig.SFTP_PASSWORD,
        readyTimeout: Number(sftpConfig.SFTP_READY_TIMEOUT), // ms
        retries: Number(sftpConfig.SFTP_RETRY_COUNT), // integer. Number of times to retry connecting
        retry_factor: 2, // integer. Time factor used to calculate time between retries
        retry_minTimeout: 2000, // integer. Minimum timeout between attempts (ms)
      });
  
      return this.sftpClient;
  }

}
