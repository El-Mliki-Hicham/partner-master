# Next.js Authentication Utilities

This package provides authentication utilities for handling secure token-based authentication between subdomains in a Next.js application.

## Installation

1. Copy the following files to your Next.js project:

```
├── config/
│   └── api.js
├── utils/
│   ├── auth.js
│   ├── crypto.js
│   └── tokenHandler.js
└── components/
    └── AuthProvider.js
```

2. Add the environment variable in your `.env.local`:

```env
NEXT_PUBLIC_MAIN_APP_DOMAIN=service.com
```

## Setup

1. Wrap your application with the AuthProvider in `pages/_app.js`:

```javascript
import AuthProvider from '../components/AuthProvider';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

2. Update the API configuration in `api.js`:

```javascript
const BASE_URL = 'your-api-url';  // Update this
```

## Usage

### Protected Pages

Create protected pages using the withAuth HOC:

```javascript
// pages/dashboard.js
import { withAuth } from '../utils/auth';

function DashboardPage() {
  return <div>Protected Dashboard Content</div>;
}

export default withAuth(DashboardPage);
```

### Logout Button

Add logout functionality to any component:

```javascript
export default function LogoutButton() {
  const handleLogout = () => {
    window.logoutFromSubdomain();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
```

## How It Works

1. When a user logs in from the main application:
   - The token is encrypted using AES-GCM
   - User is redirected to the appropriate subdomain with the encrypted token in URL

2. In the subdomain application:
   - AuthProvider automatically initializes on page load
   - Decrypts token from URL if present
   - Stores decrypted token in localStorage
   - Handles logout synchronization across subdomains

3. When user logs out:
   - Clears local storage in current subdomain
   - Makes logout API call
   - Redirects to main login app with logout parameter
   - Main app detects logout parameter and clears its storage

## Security Notes

1. The encryption key should be stored in environment variables in production:
```javascript
// utils/crypto.js
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
```

2. All authentication-related code uses the 'use client' directive for Next.js 13+ compatibility

3. SSR-safe checks are implemented for all window/localStorage access

## API Configuration

Update the API endpoints in `config/api.js`:

```javascript
export const AUTH_ENDPOINTS = {
    LOGIN: `${BASE_URL}/login`,
    LOGOUT: `${BASE_URL}/logout`,
};
```

## Subdomain Configuration

Update the subdomain configuration in `config/api.js`:

```javascript
export const ROLE_SUBDOMAINS = {
    admin: 'admin.yourdomain.com',
    agent: 'agent.yourdomain.com',
    // ... add your subdomains
};
