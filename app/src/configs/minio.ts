export const MINIO_HOST: string = process.env.MINIO_HOST
export const MINIO_PORT: number = parseInt(process.env.MINIO_PORT, 10);
export const MINIO_USE_SSL: boolean = (process.env.MINIO_USE_SSL || 'false') === 'true';
export const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY
export const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY
export const MINIO_UPLOAD_BUCKET_NAME: string = process.env.MINIO_UPLOAD_BUCKET_NAME
export const MINIO_UPLOAD_BUCKET_PREFIX: string = process.env.MINIO_UPLOAD_BUCKET_PREFIX