import { MultiStrategyCache } from "./utils/cache";

// Simulated expensive API call
async function fetchFromAPI(endpoint) {
  console.log(`🌐 Fetching ${endpoint}...`);
  // Simulate network latency
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 500),
  );
  // Dummy data
  return {
    data: `Response from ${endpoint} at ${new Date().toISOString()}`,
    timestamp: Date.now(),
  };
}

// Create the cache
const apiCache = new MultiStrategyCache({
  maxSize: 500,
  defaultTTL: 30000, // 30 seconds
  persistPath: "./cache/api-cache.json",
  autoSaveInterval: 10000, // save every 10 seconds
});

// Initialize (restore from disk)
apiCache.init().then(() => console.log("Cache restored"));

// Cached API wrapper
async function cachedFetch(endpoint) {
  const cached = await apiCache.get(endpoint);
  if (cached) {
    console.log(`💾 Cache HIT for ${endpoint}`);
    return cached;
  }

  console.log(`💾 Cache MISS for ${endpoint}`);
  const freshData = await fetchFromAPI(endpoint);
  await apiCache.set(endpoint, freshData);
  return freshData;
}

// Usage example
(async () => {
  // First call – miss, fetches
  console.log(await cachedFetch("/users"));
  // Second call (within 30s) – hit
  console.log(await cachedFetch("/users"));

  // Wait 35 seconds for TTL to expire
  await new Promise((r) => setTimeout(r, 35000));
  // Now it's expired, fetches again
  console.log(await cachedFetch("/users"));

  // Graceful shutdown
  await apiCache.destroy();
})();
