import util from "util";
import { LOCAL_TMP_DIR } from "./configs/local";
import { SFTP_DIRNAME } from "./configs/sftp";
import { LoggerService } from "./services/LoggerService";
import { SftpService } from "./services/SftpService";
import { createWriteStream, unlinkSync } from "fs";
import { exec } from "child_process";
import { MinioService } from "./services/MinioService";
import {
  MINIO_UPLOAD_BUCKET_NAME,
  MINIO_UPLOAD_BUCKET_PREFIX,
} from "./configs/minio";

const execPromisify = util.promisify(exec);
const remoteSftpFilePath: string = `${SFTP_DIRNAME}/demo/demo.csv`;
const localFileName: string = `demo.csv`;
const localSftpFilePath: string = `${LOCAL_TMP_DIR}/${localFileName}`;
const localDedupedFileName: string = `demo_deduped.csv`;
const localDedupedFilePath: string = `${LOCAL_TMP_DIR}/${localDedupedFileName}`;

(async () => {
  const processName = "full-process";
  const loggerService = new LoggerService();
  try {
    const sftpService = new SftpService(loggerService).connect();
    const sftpClient = await sftpService.getClient();

    let localFile = createWriteStream(localSftpFilePath);

    await sftpService.getFile(sftpClient, remoteSftpFilePath, localFile);
    await sftpService.closeConnection(sftpClient);
    
    const { stdout } = await execPromisify(
      `dedupe-csv file="${localSftpFilePath}"`,
      {
        encoding: "utf-8",
      }
    );

    loggerService.generateSuccessLog(processName, stdout);

    const minioService = new MinioService(loggerService).connect();
    const destObjectName = `${MINIO_UPLOAD_BUCKET_PREFIX}/${localDedupedFileName}`;
    const upoadObjInfo = await minioService.objectUpload(
      MINIO_UPLOAD_BUCKET_NAME,
      destObjectName,
      localDedupedFilePath
    );

    loggerService.generateSuccessLog(processName, "Minio uploaded successfully", {
      upoadObjInfo,
    });

    unlinkSync(localSftpFilePath);
    unlinkSync(localDedupedFilePath);

  } catch (err) {
    loggerService.generateErrorLog(processName, err);
  }
})();
