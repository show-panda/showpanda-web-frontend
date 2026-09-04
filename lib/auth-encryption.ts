import "server-only";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const MIN_SECRET_LENGTH = 32;

let cachedKey: Buffer | null = null;

function getKey() {
  if (cachedKey) return cachedKey;

  const secret = process.env.AUTH_ENCRYPTION_KEY;

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `AUTH_ENCRYPTION_KEY must be at least ${MIN_SECRET_LENGTH} characters. Generate one with: openssl rand -base64 32`,
    );
  }

  // AES-256 needs exactly 32 bytes, which hashing the secret always gives us.
  cachedKey = crypto.createHash("sha256").update(secret).digest();

  return cachedKey;
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  return [
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

/**
 * Returns `null` instead of throwing. A cookie can always be malformed, forged,
 * or encrypted with a rotated key, and callers should treat every one of those
 * the same way: as "no session".
 */
export function decrypt(value: string) {
  try {
    const [ivPart, authTagPart, payloadPart] = value.split(".");

    if (!ivPart || !authTagPart || !payloadPart) return null;

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getKey(),
      Buffer.from(ivPart, "base64url"),
    );

    decipher.setAuthTag(Buffer.from(authTagPart, "base64url"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(payloadPart, "base64url")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}
