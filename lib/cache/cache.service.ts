// Minimal cache service shim for development/build.
// Replace with a real cache (redis client) in production.

interface CacheService {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>
  del(key: string): Promise<void>
  remember<T>(key: string, ttl: number, callback: () => Promise<T> | T): Promise<T>
}

export const cacheService: CacheService = {
  async get<T>(_key: string): Promise<T | null> {
    return null
  },

  async set(_key: string, _value: unknown, _ttlSeconds?: number): Promise<void> {
    return
  },

  async del(_key: string): Promise<void> {
    return
  },

  /**
   * Remember pattern: Get from cache or execute callback and cache result
   * In this shim implementation, we skip caching and just execute callback
   */
  async remember<T>(
    _key: string,
    _ttlSeconds: number,
    callback: () => Promise<T> | T
  ): Promise<T> {
    return Promise.resolve(callback())
  },
}
