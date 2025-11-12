// Minimal analytics shim for builds.
export const analyticsService = {
  async track(_event: string, _payload?: Record<string, unknown>) {
    // noop
    return
  },
}
