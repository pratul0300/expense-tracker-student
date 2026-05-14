/**
 * Turn axios / HTTP errors into short, human-facing sentences (no jargon).
 */
export function readableApiError(error) {
  if (!error?.response) {
    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
      return "We can't reach the server right now. Check your connection, wait a minute, and try again.";
    }
    return error?.message || 'Something went wrong. Please try again.';
  }

  const { status, data } = error.response;

  if (data == null) {
    if (status === 404) return 'That expense could not be found.';
    if (status >= 500) return 'The server is having trouble. Please try again in a little while.';
    return 'Your request did not work. Please try again.';
  }

  if (typeof data === 'string') return data.trim() || readableStatusFallback(status);

  if (typeof data.detail === 'string' && data.detail.trim()) return data.detail.trim();
  if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof data.title === 'string' && data.title.trim()) return data.title.trim();

  if (Array.isArray(data.errors)) {
    const parts = data.errors
      .map((e) => (typeof e === 'string' ? e : e?.defaultMessage || e?.message))
      .filter(Boolean);
    if (parts.length) return parts.join(' ');
  }

  if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const parts = Object.values(data.errors)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .map((v) => (typeof v === 'string' ? v : v?.defaultMessage || v?.message || String(v)))
      .filter(Boolean);
    if (parts.length) return parts.join(' ');
  }

  return readableStatusFallback(status);
}

function readableStatusFallback(status) {
  if (status >= 500) return 'The server is having trouble. Please try again later.';
  if (status === 403 || status === 401) return 'You are not allowed to do that.';
  return 'Please check what you entered and try again.';
}
