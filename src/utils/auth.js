'use client';

import { AUTH_ENDPOINTS, AUTH_TOKEN_KEY, AUTH_USER_KEY, API_CONFIG, MAIN_APP_DOMAIN } from '../config/api';
import { safeLocalStorage } from './tokenHandler';

/**
 * Performs API logout and cleans up local storage
 */
export async function logoutFromAPI(token) {
    try {
        await fetch(AUTH_ENDPOINTS.LOGOUT, {
            method: 'POST',
            headers: API_CONFIG.withAuth(token),
        });
    } catch (error) {
        console.error('Logout API error:', error);
    }
}

/**
 * Clears all auth-related data from local storage
 */
export function clearAuthStorage() {
    const storage = safeLocalStorage();
    storage.removeItem(AUTH_TOKEN_KEY);
    storage.removeItem(AUTH_USER_KEY);
}

/**
 * Performs complete logout from subdomain
 * - Calls logout API
 * - Clears local storage
 * - Redirects to main login app with logout signal
 */
export async function logoutFromSubdomain() {
    try {
        const storage = safeLocalStorage();
        const token = storage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            await logoutFromAPI(token);
        }
        clearAuthStorage();
        
        // Redirect to main login app with logout parameter
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
        window.location.href = `${protocol}//${MAIN_APP_DOMAIN}?logout=true`;
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear storage and redirect even if API call fails
        clearAuthStorage();
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
        window.location.href = `${protocol}//${MAIN_APP_DOMAIN}?logout=true`;
    }
}

/**
 * Check if the current URL indicates a logout redirect
 */
export function isLogoutRedirect() {
    if (typeof window === 'undefined') {
        return false;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get('logout') === 'true';
}

/**
 * Handle logout redirect in main login app
 * Clears local storage if logout parameter is present
 */
export function handleLogoutRedirect() {
    if (isLogoutRedirect()) {
        clearAuthStorage();
        // Clean up the URL by removing the logout parameter
        if (typeof window !== 'undefined') {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }
}

/**
 * Example usage in Next.js component:
 * 
 * import { useRouter } from 'next/router';
 * 
 * export default function LogoutButton() {
 *   const router = useRouter();
 * 
 *   const handleLogout = async () => {
 *     await logoutFromSubdomain();
 *     // The logoutFromSubdomain function will handle the redirect
 *   };
 * 
 *   return (
 *     <button onClick={handleLogout}>
 *       Logout
 *     </button>
 *   );
 * }
 */

/**
 * HOC to wrap pages that require authentication
 */
export function withAuth(WrappedComponent) {
    return function AuthComponent(props) {
        if (typeof window === 'undefined') {
            return null; // Return null during SSR
        }

        const storage = safeLocalStorage();
        const token = storage.getItem(AUTH_TOKEN_KEY);

        useEffect(() => {
            if (!token) {
                // Redirect to login if no token is found
                const protocol = window.location.protocol;
                window.location.href = `${protocol}//${MAIN_APP_DOMAIN}`;
            }
        }, [token]);

        if (!token) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
