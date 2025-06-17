'use client';

import { useEffect, useState } from 'react';
import { getDecryptedTokenFromUrl } from '../utils/tokenHandler';
import { handleLogoutRedirect, clearAuthStorage } from '../utils/auth';
import { AUTH_TOKEN_KEY } from '../config/api';
import { authService } from '@/api/auth';

/**
 * AuthProvider component for Next.js applications
 * Handles auth token initialization and logout functionality
 */
export default function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            // Handle logout redirect first
            handleLogoutRedirect();

            // Try to get token from URL
            const token = await getDecryptedTokenFromUrl();
            
            if (token) {
                // Store the decrypted token
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                setLoading(false);
            } else {
                // Check if we already have a token in storage
                const existingToken = localStorage.getItem(AUTH_TOKEN_KEY);
                if (!existingToken) {
                    
                    setError('No valid authentication token found');
                    authService.login();
                    // You might want to redirect to login here
                    // window.location.href = 'https://login.vertigo.com';
                } else {
                    setLoading(false);
                }
            }
        } catch (err) {
            setError('Failed to initialize authentication');
            console.error('Auth initialization error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Initializing application...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Make logout function available globally
    if (typeof window !== 'undefined') {
        window.logoutFromSubdomain = async () => {
            clearAuthStorage();
            window.location.href = `${window.location.protocol}//${process.env.NEXT_PUBLIC_MAIN_APP_DOMAIN}?logout=true`;
        };
    }

    return children;
}

/**
 * Usage in your Next.js app:
 * 
 * // pages/_app.js
 * import AuthProvider from '../components/AuthProvider';
 * 
 * export default function MyApp({ Component, pageProps }) {
 *   return (
 *     <AuthProvider>
 *       <Component {...pageProps} />
 *     </AuthProvider>
 *   );
 * }
 * 
 * // Then in any component that needs to handle logout:
 * export default function LogoutButton() {
 *   const handleLogout = () => {
 *     window.logoutFromSubdomain();
 *   };
 * 
 *   return (
 *     <button
 *       onClick={handleLogout}
 *       className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
 *     >
 *       Logout
 *     </button>
 *   );
 * }
 */
