export interface ObjectListInterface {
  name: string,
  prefix?: string,
  size: number,
  etag: string,
  versionId?: string,
  isDeleteMarker?: boolean,
  lastModified: Date
}