import winston from "winston";
import * as appConfig from "../configs/app";
import * as logConfig from "../configs/log";
import { Logger } from "../utils/Logger";
import { Tag } from "../utils/Tag";

export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = new Logger(
      appConfig.APP_NAME,
      logConfig.LOG_LOCATION,
      logConfig.LOG_MAX_SIZE,
      logConfig.LOG_MAX_KEEP,
      logConfig.LOG_QUEUE_NAME
    ).getInstance();
  }

  /**
   * Generate Success Log
   * @param processName
   * @param message
   */
  public generateSuccessLog(
    processName: string,
    message: string,
    extraInfo?: {}
  ): void {
    this.logger.info({
      processName,
      message,
      tag: Tag.SUCCESS,
      extraInfo,
    });
  }

  /**
   * Generate Error Log
   * @param processName
   * @param err
   */
  public generateErrorLog(processName: string, err: any): void {
    this.logger.error({
      processName,
      error: err,
      message: err.message,
      tag: Tag.ERROR,
    });
  }
}
