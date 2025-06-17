'use client';

const ENCRYPTION_KEY = 'vertigo-secure-key-2024'; // This should be in an environment variable in production

/**
 * Encrypts a string using AES-GCM
 */
export async function encryptData(data) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(ENCRYPTION_KEY),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
    );

    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(data)
    );

    // Combine salt + iv + encrypted data into a single array
    const resultArray = new Uint8Array([
        ...salt,
        ...iv,
        ...new Uint8Array(encrypted)
    ]);

    // Convert to base64 for URL-safe string
    return btoa(String.fromCharCode(...resultArray));
}

/**
 * Decrypts an encrypted string
 */
export async function decryptData(encryptedString) {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // Convert base64 string back to array
    const dataArray = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));

    // Extract the salt, iv, and encrypted data
    const salt = dataArray.slice(0, 16);
    const iv = dataArray.slice(16, 28);
    const encrypted = dataArray.slice(28);

    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(ENCRYPTION_KEY),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
    );

    return decoder.decode(decrypted);
}

/**
 * Creates a URL with encrypted token
 */
export function createSecureRedirectUrl(subdomain, token) {
    return encryptData(token).then(encryptedToken =>
        `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}//${subdomain}?token=${encodeURIComponent(encryptedToken)}`
    );
}
