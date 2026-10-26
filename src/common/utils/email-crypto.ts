import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export function loadEmailJobKey( rawBase64: string | undefined = process.env.EMAIL_JOB_ENCRYPTION_KEY,): Buffer {
    if (!rawBase64) {
        throw new Error('EMAIL_JOB_ENCRYPTION_KEY undefined');
    }

    const key = Buffer.from(rawBase64, 'base64');
    if (key.length !== KEY_LENGTH) {
        throw new Error(
            `EMAIL_JOB_ENCRYPTION_KEY must have 32 bytes in base64; it received ${key.length} byte(s)`
            )
    }
    return key;
}

let cachedKey: Buffer | null = null;

function getKey(): Buffer {
    if(!cachedKey) {
        cachedKey = loadEmailJobKey();
    }
    return cachedKey;
}

export function encryptSecret(plaintext: string, key: Buffer = getKey()): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const ciphertext = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
}

export function decryptSecret(payload: string, key: Buffer = getKey()): string {
    const data = Buffer.from(payload, 'base64');
    if (data.length < IV_LENGTH + AUTH_TAG_LENGTH) {
        throw new Error('Invalid ciphered payload');
    }

    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
        'utf8'
    )
}