// Minimal redis shim for builds. Replace with real redis client when needed.
export const redisClient = {
	async get(_k: string) {
		return null
	},
	async set(_k: string, _v: string) {
		return
	},
}
