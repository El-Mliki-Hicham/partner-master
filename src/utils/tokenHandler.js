'use client';

import { decryptData } from './crypto';

/**
 * Gets and decrypts token from URL
 * Use this in your subdomain application to retrieve the token
 */
export async function getDecryptedTokenFromUrl() {
    if (typeof window === 'undefined') {
        return null; // Return null during server-side rendering
    }

    try {
        // Get the URL parameters
        const params = new URLSearchParams(window.location.search);
        
        const encryptedToken = params.get('token');
     
        
        if (!encryptedToken) {
            return null;
        }
        
        console.log("Encrypted token from URL:", encryptedToken);

        const decryptedToken = await decryptData(encryptedToken);
        
        console.log('Decrypted token:', decryptedToken);

        
        console.log('decryptedToken token:', decryptedToken);
        return decryptedToken;

    } catch (error) {
        console.error('Error decrypting token:', error);
        return null;
    }
}

/**
 * Example usage in your Next.js page:
 * 
 * import { useEffect } from 'react';
 * import { useRouter } from 'next/router';
 * 
 * export default function DashboardPage() {
 *   const router = useRouter();
 * 
 *   useEffect(() => {
 *     async function initAuth() {
 *       const token = await getDecryptedTokenFromUrl();
 *       if (token) {
 *         // Store the token in localStorage or state management
 *         localStorage.setItem('auth_token', token);
 *         // Initialize your app with the token
 *       } else {
 *         // Redirect to login page if no valid token
 *         router.push('/login');
 *       }
 *     }
 *     initAuth();
 *   }, [router]);
 * 
 *   return <YourComponent />;
 * }
 */

/**
 * Utility function to extract just the encrypted token from URL
 * Useful for debugging or manual token extraction
 */
export function getEncryptedTokenFromUrl() {
    if (typeof window === 'undefined') {
        return null;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

/**
 * Safely access localStorage with SSR check
 */
export function safeLocalStorage() {
    if (typeof window !== 'undefined') {
        return window.localStorage;
    }
    // Return a dummy storage for SSR
    return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
    };
}
