import * as appConfig from "../configs/app";
import * as logConfig from "../configs/log";
import * as winston from "winston";
import { toZonedTime, format as dateFnsFormat } from "date-fns-tz";

const { format } = winston;
const { combine, timestamp } = format;

/**
 * Logger class
 * Responsible for managing application logs
 */
export class Logger {
  /**
   * @var appId string
   */
  public appId: string;

  /**
   * @var queueName string(optinal)
   */
  public queueName?: string;

  /**
   * @var fileLocation string
   */
  public fileLocation: string;

  /**
   * @var logMaxSize string
   */
  public logMaxSize: string;

  /**
   * @var logMaxKeep string
   */
  public logMaxKeep: string;

  /**
   * @var self winston.Logger
   */
  public self: winston.Logger;

  /**
   * Constructor of Logger class
   * @param appId string
   * @param fileLocation string
   * @param logMaxSize string
   * @param logMaxKeep string
   * @param queueName string(optional)
   */
  constructor(
    appId: string,
    fileLocation: string,
    logMaxSize: string,
    logMaxKeep: string,
    queueName?: string
  ) {
    this.appId = appId;
    this.fileLocation = fileLocation;
    this.logMaxSize = logMaxSize;
    this.logMaxKeep = logMaxKeep;
    this.queueName = queueName;
    
    // Instatiate the winston and format logs
    this.self = winston.createLogger({});
    this.self.add(this.formatter());
  }

  private formatter() {
    return new winston.transports.Console({
      level: logConfig.LOG_LEVEL,
      format: combine(
        timestamp({
          format: () => {
            let dtz = toZonedTime(new Date(), appConfig.APP_TIMEZONE);
            return dateFnsFormat(dtz, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
              timeZone: appConfig.APP_TIMEZONE,
            });
          },
        }),
        winston.format.json()
      ),
    })
  }

  /**
   * Get error message
   * @param err any
   * @returns string
   */
  public getErrorMsg(err: any): string {
    return `\nError message: ${err.message}\nError code: ${err.code}\nError stack: ${err.stack}`;
  }

  /**
   * Get the instance of Logger class
   * @returns winston.Logger
   */
  public getInstance(): winston.Logger {
    return this.self;
  }
}
