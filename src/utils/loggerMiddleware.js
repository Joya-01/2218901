export async function logEvent(source, level, route, message) {
  try {
    await fetch("http://20.244.56.144/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source,
        level,
        route,
        message,
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    /* Logging failed: err */
  }
}
