// Lightweight Web Crypto API wrapper for AES-GCM encryption/decryption (hardware-accelerated, zero-dependency)
const SECRET_KEY_SEED = "apec-safety-vault-key-development-2026"; // Secure salt base

async function getKey() {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY_SEED),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("apec-salt-99-secured"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a cleartext string using AES-GCM 256-bit encryption.
 * @param {string} text Cleartext message
 * @returns {Promise<string>} Base64 encoded ciphertext containing IV + payload
 */
export async function encryptText(text) {
  try {
    if (!text) return "";
    const key = await getKey();
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Cryptographically secure 12-byte IV
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(text)
    );
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    // Convert to Base64 string for safe storage in Firebase/localStorage
    return btoa(String.fromCharCode.apply(null, combined));
  } catch (e) {
    console.error("Encryption failure:", e);
    return text;
  }
}

/**
 * Decrypts an AES-GCM 256-bit encrypted Base64 payload.
 * @param {string} ciphertext Base64 encoded IV + payload
 * @returns {Promise<string>} Cleartext string
 */
export async function decryptText(ciphertext) {
  try {
    if (!ciphertext) return "";
    const key = await getKey();
    const combined = new Uint8Array(
      atob(ciphertext)
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("Decryption failure:", e);
    return ciphertext;
  }
}
