import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'haul360_access_token';
const REFRESH_TOKEN_KEY = 'haul360_refresh_token';

/**
 * Secure Token Storage Service using Expo SecureStore.
 * Securely persists access and refresh JWT tokens on device keychain / keystore.
 */
export const authStorage = {
  /**
   * Persist access and refresh tokens securely.
   */
  saveTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.warn('SecureStore: Failed to save tokens');
    }
  },

  /**
   * Retrieve the stored access token.
   */
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Retrieve the stored refresh token.
   */
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Clear all stored authentication tokens upon logout or session invalidation.
   */
  clearTokens: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('SecureStore: Failed to clear tokens');
    }
  },

  /**
   * Check if tokens exist in secure storage.
   */
  hasStoredSession: async (): Promise<boolean> => {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      return !!accessToken;
    } catch {
      return false;
    }
  },
};

export default authStorage;
