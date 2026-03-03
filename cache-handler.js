// Custom cache handler for ISR and fetch cache
// This enables advanced caching strategies for LotusDharma

class CustomCacheHandler {
  constructor(options = {}) {
    this.options = {
      maxMemoryCacheSize: 100, // Max items in memory cache
      revalidateToken: process.env.CACHE_REVALIDATE_TOKEN,
      ...options,
    };

    // In-memory cache for development/fallback
    this.memoryCache = new Map();
  }

  async get(key) {
    // Try Redis first (if available), then memory cache
    try {
      // Redis implementation would go here
      // const redisValue = await redis.get(key);

      // Fallback to memory cache
      const memoryValue = this.memoryCache.get(key);
      if (memoryValue) {
        return {
          value: memoryValue,
          lastModified: Date.now(),
        };
      }
    } catch (error) {
      console.warn('Cache get error:', error);
    }

    return null;
  }

  async set(key, data, { revalidate, tags } = {}) {
    try {
      const cacheData = {
        value: data,
        lastModified: Date.now(),
        revalidate,
        tags: tags || [],
      };

      // Store in Redis (if available)
      // await redis.set(key, JSON.stringify(cacheData), 'EX', revalidate || 3600);

      // Store in memory cache as fallback
      this.memoryCache.set(key, cacheData);

      // Maintain memory cache size limit
      if (this.memoryCache.size > this.options.maxMemoryCacheSize) {
        const firstKey = this.memoryCache.keys().next().value;
        this.memoryCache.delete(firstKey);
      }
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  async revalidateTag(tag) {
    try {
      // In a real implementation, you'd track which keys have which tags
      // and invalidate them. For now, this is a placeholder.

      console.log(`Revalidating cache entries with tag: ${tag}`);

      // Clear memory cache entries that might match this tag
      // In production, you'd query Redis for keys with this tag

      // Example: Clear teachings cache when teachings tag is invalidated
      if (tag === 'teachings') {
        for (const [key, value] of this.memoryCache.entries()) {
          if (key.includes('teachings') || (value.tags && value.tags.includes('teachings'))) {
            this.memoryCache.delete(key);
          }
        }
      }
    } catch (error) {
      console.warn('Cache revalidateTag error:', error);
    }
  }

  async revalidatePath(path) {
    try {
      console.log(`Revalidating cache for path: ${path}`);

      // Find and remove cache entries for this path
      for (const [key, value] of this.memoryCache.entries()) {
        if (key.includes(path)) {
          this.memoryCache.delete(key);
        }
      }
    } catch (error) {
      console.warn('Cache revalidatePath error:', error);
    }
  }
}

module.exports = CustomCacheHandler;