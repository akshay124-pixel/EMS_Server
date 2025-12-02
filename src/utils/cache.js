import NodeCache from 'node-cache';

/**
 * Cache instance for performance optimization
 * TTL: 5 minutes
 * Check period: 10 minutes
 */
export const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 600,
  useClones: false
});

// Cache statistics
export const getCacheStats = () => cache.getStats();
