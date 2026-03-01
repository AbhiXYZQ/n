export async function trackEvent(eventName, payload = {}) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventName, payload }),
    });
  } catch (error) {
    // no-op for analytics failures
  }
}
