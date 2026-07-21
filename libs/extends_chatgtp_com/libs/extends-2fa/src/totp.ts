import { createHmac } from "node:crypto";

export default class Totp {
  private secret = Buffer.alloc(0);
  private digits = 6;
  private period = 30;
  private algorithm = "sha1";

  config(secretOrUri: string) {
    const value = secretOrUri.trim();
    let secret = value;

    if (value.startsWith("otpauth://")) {
      const uri = new URL(value);
      if (uri.hostname !== "totp") throw new Error("2fa-totp-uri-invalid");
      secret = uri.searchParams.get("secret") || "";
      this.digits = Number(uri.searchParams.get("digits") || 6);
      this.period = Number(uri.searchParams.get("period") || 30);
      this.algorithm = (uri.searchParams.get("algorithm") || "SHA1").toLowerCase();
    } else {
      this.digits = 6;
      this.period = 30;
      this.algorithm = "sha1";
    }

    if (![6, 7, 8].includes(this.digits) || !Number.isInteger(this.period) || this.period <= 0) {
      throw new Error("2fa-totp-config-invalid");
    }
    if (!["sha1", "sha256", "sha512"].includes(this.algorithm)) {
      throw new Error("2fa-totp-algorithm-invalid");
    }

    const normalizedSecret = secret.toUpperCase().replace(/[\s=-]/g, "");
    if (!normalizedSecret || /[^A-Z2-7]/.test(normalizedSecret)) {
      throw new Error("2fa-totp-secret-invalid");
    }

    let bits = "";
    for (const character of normalizedSecret) {
      bits += "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(character).toString(2).padStart(5, "0");
    }
    const bytes = bits.match(/.{8}/g)?.map((byte) => Number.parseInt(byte, 2)) || [];
    if (!bytes.length) throw new Error("2fa-totp-secret-invalid");
    this.secret = Buffer.from(bytes);
    return this;
  }

  use(now = Date.now()) {
    if (!this.secret.length) throw new Error("2fa-totp-not-configured");

    const counter = Math.floor(now / 1000 / this.period);
    const message = Buffer.alloc(8);
    message.writeBigUInt64BE(BigInt(counter));
    const digest = createHmac(this.algorithm, this.secret).update(message).digest();
    const offset = digest[digest.length - 1] & 15;
    const binary = (
      ((digest[offset] & 127) << 24)
      | ((digest[offset + 1] & 255) << 16)
      | ((digest[offset + 2] & 255) << 8)
      | (digest[offset + 3] & 255)
    ) >>> 0;
    return String(binary % (10 ** this.digits)).padStart(this.digits, "0");
  }
}
