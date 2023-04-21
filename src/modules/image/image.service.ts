import { Injectable } from "@nestjs/common";
import axios from "axios";
import { Nilable, Nullable } from "tsdef";

@Injectable()
export class ImageService {
  private readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  compareUrls(imageUrl: [Nilable<string>, Nilable<string>][]): string[] {
    return imageUrl.flatMap(([ oldUrl, newUrl ]) => {
      return oldUrl && newUrl && oldUrl !== newUrl
        ? [ this.extractUuidFromUrl(oldUrl) ].filter(Boolean) as string[]
        : [];
    });
  }

  private extractUuidFromUrl(url: string): Nullable<string> {
    const slices = url.split("/");
    const part = slices[slices.length - 1];

    if (part && this.uuidRegex.test(part)) {
      return part;
    } else {
      return null;
    }
  }

  async deleteImageByIds(ids: string[]): Promise<void> {
    try {
      await axios.delete("https://media.fyty-esport.com/images", {
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          ids
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }
}
