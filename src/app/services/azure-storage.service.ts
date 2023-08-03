import { ErrorHandler, Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root',
})
export class AzureStorageService {
  accountName = 'squabblestorageaccount';
  imageName = 'images';
  fileName = 'files';
  sas =
    '?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-01-01T00:00:00Z&st=2021-01-01T00:00:00Z&spr=https,http&sig=C0%2F6DrzdIOeUUsecDg5FSWaZ1kjJ70hpxGmvAvc8P94%3D';

  constructor() {}

  // images
  public async uploadFile(content: Blob, name: string, handler: () => void) {
    const timestamp = Math.round(Date.now() / 1000);
    let fName: string = timestamp + '_' + name;
    let AvatarUrl: string = this.uploadBlob(
      content,
      fName,
      await this.imageClient(),
      handler
    );
    return AvatarUrl;
  }

  public listFiles(): Promise<string[]> {
    return this.listBlobs(this.fileClient());
  }

  public downloadFile(name: string, handler: (blob: Blob) => void) {
    this.downloadBlob(name, this.fileClient(), handler);
  }

  public deleteFile(name: string, handler: () => void) {
    this.deleteBlob(name, this.fileClient(), handler);
  }

  //blobbyyy
  private uploadBlob(
    content: Blob,
    name: string,
    client: ContainerClient,
    handler: () => void
  ) {
    let blockBlobClient = client.getBlockBlobClient(name);
    blockBlobClient
      .uploadData(content, {
        blobHTTPHeaders: { blobContentType: content.type },
      })
      .then(() => handler());
    return blockBlobClient.url;
  }

  private async listBlobs(client: ContainerClient): Promise<string[]> {
    let result: string[] = [];

    let blobs = client.listBlobsFlat();
    for await (const blob of blobs) {
      result.push(blob.name);
    }

    return result;
  }

  private downloadBlob(
    name: string,
    client: ContainerClient,
    handler: (blob: Blob) => void
  ) {
    const blobClient = client.getBlobClient(name);
    blobClient.download().then((resp) => {
      resp.blobBody?.then((blob) => {
        handler(blob);
      });
    });
  }

  private deleteBlob(
    name: string,
    client: ContainerClient,
    handler: () => void
  ) {
    client.deleteBlob(name).then(() => {
      handler();
    });
  }

  private imageClient(): ContainerClient {
    return new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net?${this.sas}`
    ).getContainerClient(this.imageName);
  }

  private fileClient(): ContainerClient {
    const client = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net?${this.sas}`
    );
    return client.getContainerClient(this.fileName);
  }
}
