import { ConflictException, Injectable } from "@nestjs/common";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject
} from "firebase/storage";
import env from "src/common/env.config";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class ImageService {
  private app: ReturnType<typeof initializeApp>;
  private storage: ReturnType<typeof getStorage>;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    this.app = initializeApp({
      apiKey: env.FIREBASE_API_KEY,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
      appId: env.FIREBASE_APP_ID
    });
    this.storage = getStorage(this.app);
  }

  async __getAllImageUrls() {
    return await this.prisma.image.findMany();
  }

  async uploadImageBlob(file: any) {
    const tempImg = await this.prisma.image.create({ data: {} });

    const url = `/img/${tempImg.id}`;
    const storageRef = ref(this.storage, url);

    const uploadTask = uploadBytesResumable(storageRef, file.buffer);

    try {
      const uploadedUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress
              = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);

            if (snapshot.state === "paused") {
              console.log("Upload is paused");
            } else if (snapshot.state === "running") {
              console.log("Upload is running");
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
              resolve(downloadURL)
            );
          }
        );
      });

      return uploadedUrl;
    } catch (err) {
      await this.prisma.image.delete({ where: tempImg });

      throw new ConflictException(err);
    }
  }

  async deleteImageById(id: string) {
    const url = `/img/${id}`;
    const storageRef = ref(this.storage, url);

    await deleteObject(storageRef);
    await this.prisma.image.delete({ where: { id } });
  }
}
