const DEFAULT_ORIGINS = ["http://localhost:8100/*", "http://localhost:3003/*", "http://127.0.0.1:8100/*", "http://127.0.0.1:3003/*"];

const STORAGE_KEY = "neofeeder_cors_config";

const api = typeof chrome !== "undefined" ? chrome : browser;
const storage = api.storage;
const dns = api.declarativeNetRequest;
const runtime = api.runtime;

let isEnabled = true;

async function getOrigins() {
  const config = await storage.local.get(STORAGE_KEY);
  const storedConfig = config[STORAGE_KEY] || {};
  isEnabled = storedConfig.enabled !== false;
  return storedConfig.origins || DEFAULT_ORIGINS;
}

function createRules(origins) {
  return origins
    .filter((origin) => origin && origin.length > 3)
    .map((origin, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
          { header: "Access-Control-Allow-Methods", operation: "set", value: "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD" },
          { header: "Access-Control-Allow-Headers", operation: "set", value: "*" },
          { header: "Access-Control-Expose-Headers", operation: "set", value: "*" },
          { header: "Access-Control-Allow-Credentials", operation: "set", value: "true" },
        ],
      },
      condition: {
        urlFilter: origin,
        resourceTypes: ["xmlhttprequest", "main_frame", "sub_frame"],
      },
    }));
}

async function updateRules() {
  try {
    const origins = await getOrigins();
    const currentRules = await dns.getDynamicRules();

    if (!isEnabled) {
      await dns.updateDynamicRules({ removeRuleIds: currentRules.map((r) => r.id) });
      return;
    }

    const rules = createRules(origins);

    await dns.updateDynamicRules({
      removeRuleIds: currentRules.map((r) => r.id),
      addRules: rules,
    });
  } catch (error) {
    console.error("[CORS Bridge] Error:", error);
  }
}

async function init() {
  const config = await storage.local.get(STORAGE_KEY);
  if (!config[STORAGE_KEY]) {
    await storage.local.set({ [STORAGE_KEY]: { origins: DEFAULT_ORIGINS, enabled: true } });
  }
  await updateRules();
}

storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "local" && changes[STORAGE_KEY]) {
    await updateRules();
  }
});

runtime.onInstalled.addListener(async () => {
  await init();
});

runtime.onStartup.addListener(async () => {
  await updateRules();
});

init();
