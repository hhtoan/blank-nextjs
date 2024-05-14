import vision from "@google-cloud/vision";
import Logger from "./Logger.class";

export default class CaptchaSolver implements ICaptchaSolver {
  private imageBuffer: Buffer;
  constructor(buffer: Buffer);
  constructor(arrayBuffer: ArrayBuffer);
  constructor(bufferOrArrayBuffer: Buffer | ArrayBuffer) {
    if (bufferOrArrayBuffer instanceof Buffer) {
      this.imageBuffer = bufferOrArrayBuffer;
    } else if (bufferOrArrayBuffer instanceof ArrayBuffer) {
      this.imageBuffer = Buffer.from(bufferOrArrayBuffer);
    }
  }

  async getText(): Promise<string> {
    return await this.getTextFromImage();
  }

  getImageBuffer(): Buffer {
    return this.imageBuffer;
  }

  private async getTextFromImage(): Promise<string> {
    const client = new vision.ImageAnnotatorClient({
      projectId: process.env.GOOGLE_VISION_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_VISION_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_VISION_PRIVATE_KEY,
      },
    });
    await client.initialize();
    const [result] = await client.textDetection(this.imageBuffer);
    const detections = result.textAnnotations;
    const textGoogleVision = detections[0].description;
    return textGoogleVision;
  }
}
