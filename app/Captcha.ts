class Captcha implements ICaptcha {
  private imageBuffer: Buffer;
  private text: string;
  constructor(buffer: Buffer);
  constructor(arrayBuffer: ArrayBuffer);
  constructor(bufferOrArrayBuffer: Buffer | ArrayBuffer) {
    if (bufferOrArrayBuffer instanceof Buffer) {
      this.imageBuffer = bufferOrArrayBuffer;
    } else if (bufferOrArrayBuffer instanceof ArrayBuffer) {
      this.imageBuffer = Buffer.from(bufferOrArrayBuffer);
    }
  }

  getText(): string {
    return this.text;
  }

  getImageBuffer(): Buffer {
    return this.imageBuffer;
  }
}

export default Captcha;
