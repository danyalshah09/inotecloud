/**
 * Token Helper Utility for handling JWT tokens
 */

/**
 * Parse JWT token to extract payload
 * @param {string} token - The JWT token to parse
 * @returns {object|null} The decoded token payload or null if invalid
 */
export const parseToken = (token) => {
  if (!token) return null;

  try {
    // Split the token into its parts
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

/**
 * Check if the current token is valid and not expired
 * @returns {boolean} True if the token is valid, false otherwise
 */
export const isTokenValid = () => {
  const token = localStorage.getItem("auth-token");
  if (!token) return false;

  try {
    const payload = parseToken(token);
    if (!payload) return false;

    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime < expirationTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

/**
 * Get the user ID from the current token
 * @returns {string|null} The user ID or null if not available
 */
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("auth-token");
  if (!token) return null;

  try {
    const payload = parseToken(token);
    if (!payload || !payload.user) return null;
    
    return payload.user.id;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
};

/**
 * Check if a token is about to expire (within the next 5 minutes)
 * @returns {boolean} True if the token is about to expire, false otherwise
 */
export const isTokenAboutToExpire = () => {
  const token = localStorage.getItem("auth-token");
  if (!token) return false;

  try {
    const payload = parseToken(token);
    if (!payload) return false;

    // Check if token expires in less than 5 minutes
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    
    return timeRemaining < 300000; // Less than 5 minutes
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Assume it's about to expire if there's an error
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("user-id");
  localStorage.removeItem("user-name");
};

export default {
  parseToken,
  isTokenValid,
  getUserIdFromToken,
  isTokenAboutToExpire,
  clearAuthData
}; 