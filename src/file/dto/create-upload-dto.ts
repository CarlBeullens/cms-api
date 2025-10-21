export class CreateUploadDto {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
}