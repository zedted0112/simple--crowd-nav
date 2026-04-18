/**
 * Geographic and Mathematical Utilities
 */

/**
 * Calculate Euclidean distance between two 2D points.
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @returns {number}
 */
export const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Normalize a value between 0 and 1 based on a maximum.
 * @param {number} value 
 * @param {number} max 
 * @returns {number}
 */
export const normalize = (value, max) => {
  if (max === 0) return 0;
  return value / max;
};

/**
 * Format seconds into a human-readable minute string.
 * @param {number} seconds 
 * @returns {string}
 */
export const formatMinutes = (seconds) => {
  const mins = Math.round(seconds / 60);
  return `${mins} min${mins !== 1 ? 's' : ''}`;
};
