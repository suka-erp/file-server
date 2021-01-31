import * as GoogleCloudStorage from "@google-cloud/storage";

const googleCloudConfig = {
  bucketUrl: "suka-erp.appspot.com",
  projectId: "suka-erp",
  keyFilename:
    "/home/chakradhar/Code/Node/suka-erp/packages/@suka-erp-file-upload/suka-erp-firebase-adminsdk-wkaaf-6476b119d8.json",
};

export default class Storage {
  private storageInstance: GoogleCloudStorage.Storage;
  private bucket: GoogleCloudStorage.Bucket;

  constructor() {
    this.storageInstance = new GoogleCloudStorage.Storage({
      projectId: googleCloudConfig.projectId,
      keyFilename: googleCloudConfig.keyFilename,
    });
    this.bucket = this.storageInstance.bucket(googleCloudConfig.bucketUrl);
  }

  /**
   * Upload file to Cloud Storage.
   *
   * @see https://medium.com/@stardusteric/c6ddcf131ceb
   * @param file File to upload.
   */
  async upload(
    file: Express.Multer.File
  ): Promise<{ status: 200 | 400; url?: string | undefined }> {
    return new Promise((resolve, reject) => {
      if (!file) reject("No file found!");

      const fileName = `${file.originalname}`;
      const fileUpload = this.bucket.file(fileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      blobStream.on("error", (err) => {
        reject("Something went wrong when uploading the file!");
      });

      blobStream.on("finish", () => {
        const url = `https://storage.googleapis.com/${this.bucket.name}/${fileUpload.name}`;
        resolve({ status: 200, url });
      });

      blobStream.end(file.buffer);
    });
  }
}
