/** Session debug logger — removed after verification. */
export function glassRuntimeLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
  runId = 'pre-fix',
): void {
  const entry = {
    sessionId: '466e6c',
    location,
    message,
    data,
    hypothesisId,
    runId,
    timestamp: Date.now(),
  };
  if (typeof window !== 'undefined') {
    const w = window as Window & { __glassDebug?: typeof entry[] };
    w.__glassDebug = w.__glassDebug ?? [];
    w.__glassDebug.push(entry);
  }
  if (typeof fetch === 'undefined') return;
  // #region agent log
  fetch('http://127.0.0.1:7911/ingest/b584c84b-01a3-48ce-82b1-2731176e24c8', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '466e6c',
    },
    body: JSON.stringify({
      sessionId: '466e6c',
      location,
      message,
      data,
      hypothesisId,
      runId,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}
