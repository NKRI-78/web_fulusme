import crypto from "crypto";

const SECRET_KEY = process.env.AUTH_SECRET!;

if (!SECRET_KEY) {
  throw new Error("AUTH_SECRET is not defined");
}

function getKey() {
  return crypto.createHash("sha256").update(SECRET_KEY).digest();
}

export function encrypt(data: object): string {
  const iv = crypto.randomBytes(12);
  const key = getKey();

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt<T = any>(encrypted: string): T {
  const buffer = Buffer.from(encrypted, "base64");

  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const content = buffer.subarray(28);

  const key = getKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);

  return JSON.parse(decrypted.toString());
}
