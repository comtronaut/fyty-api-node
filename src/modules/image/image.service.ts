import { Injectable } from "@nestjs/common";
import axios from "axios";
import { compact } from "lodash";
import { Nilable, Nullable } from "tsdef";
import { z } from "zod";

@Injectable()
export class ImageService {
  compareUrls(imageUrl: [Nilable<string>, Nilable<string>][]): string[] {
    return imageUrl.flatMap(([ oldUrl, newUrl ]) => {
      return oldUrl && newUrl && oldUrl !== newUrl
        ? compact([ this.extractCuidFromUrl(oldUrl) ])
        : [];
    });
  }

  extractCuidFromUrl(url: string): Nullable<string> {
    const slices = url.split("/");
    const part = slices[slices.length - 1];

    return part && z.string().cuid().safeParse(part).success ? part : null;
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
