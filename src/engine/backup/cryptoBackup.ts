import { BrahmaPathBackupPayload } from '../../types/iks';
import { createBackupPayload, restoreBackupPayload, isValidBackupPayload } from './jsonBackup';

/**
 * Envelope structure for the password-protected encrypted vault.
 */
interface EncryptedVaultContainer {
  encrypted: true;
  version: string;
  salt: string; // Base64
  iv: string; // Base64
  ciphertext: string; // Base64
}

/**
 * Converts an ArrayBuffer or Uint8Array to a Base64 string.
 */
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string to a Uint8Array.
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-GCM 256-bit encryption key from a user password and salt
 * using PBKDF2 with 100,000 iterations of SHA-256 via the native Web Crypto API.
 */
async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const textEncoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts the entire BrahmaPath state using AES-GCM-256 and initiates a download
 * of the encrypted vault file (brahmapath-vault.bplock).
 */
export async function exportEncryptedBackup(password: string): Promise<void> {
  if (!password || password.trim().length === 0) {
    throw new Error('A valid password is required to encrypt the vault.');
  }

  const payload = createBackupPayload();
  const rawJson = JSON.stringify(payload);
  const textEncoder = new TextEncoder();
  const encodedData = textEncoder.encode(rawJson);

  // Generate cryptographic salt (16 bytes) and initialization vector (12 bytes for AES-GCM)
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveAesKey(password, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData
  );

  const container: EncryptedVaultContainer = {
    encrypted: true,
    version: payload.version,
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(encryptedBuffer),
  };

  const blob = new Blob([JSON.stringify(container, null, 2)], {
    type: 'application/octet-stream',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'brahmapath-vault.bplock';
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Decrypts an uploaded .bplock file using the supplied password, validates the payload,
 * and restores the complete state back into local storage.
 */
export async function importEncryptedBackup(
  file: File,
  password: string
): Promise<{ success: boolean; message: string; payload?: BrahmaPathBackupPayload }> {
  try {
    if (!password || password.trim().length === 0) {
      return { success: false, message: 'Please provide a decryption password.' };
    }

    const text = await file.text();
    let container: EncryptedVaultContainer;

    try {
      container = JSON.parse(text) as EncryptedVaultContainer;
    } catch {
      return { success: false, message: 'Invalid file format: not a valid BrahmaPath vault.' };
    }

    if (!container.encrypted || !container.salt || !container.iv || !container.ciphertext) {
      return { success: false, message: 'Corrupted vault file structure.' };
    }

    const salt = base64ToUint8Array(container.salt);
    const iv = base64ToUint8Array(container.iv);
    const ciphertext = base64ToUint8Array(container.ciphertext);

    const key = await deriveAesKey(password, salt);

    let decryptedBuffer: ArrayBuffer;
    try {
      decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        ciphertext
      );
    } catch {
      return { success: false, message: 'Decryption failed: Incorrect password or altered file.' };
    }

    const textDecoder = new TextDecoder();
    const decryptedJson = textDecoder.decode(decryptedBuffer);
    const payload = JSON.parse(decryptedJson) as unknown;

    if (!isValidBackupPayload(payload)) {
      return { success: false, message: 'Decrypted data does not match BrahmaPath schema.' };
    }

    const restored = restoreBackupPayload(payload);
    if (!restored) {
      return { success: false, message: 'Decrypted successfully, but failed writing to storage.' };
    }

    return {
      success: true,
      message: 'Encrypted vault successfully decrypted and restored.',
      payload,
    };
  } catch (error) {
    return {
      success: false,
      message: `Vault import failed: ${(error as Error).message}`,
    };
  }
}
