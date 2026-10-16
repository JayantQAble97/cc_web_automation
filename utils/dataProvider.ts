const PROJECT = process.env.PROJECT || "";
const PRODUCT = PROJECT.split("-")[0]?.toLowerCase() || "tripstacc";
const ENVIRONMENT =
  process.env.ENV?.toUpperCase() ||
  PROJECT.split("-")[2]?.toUpperCase() ||
  "QA";

// Map lowercase product name to actual camelCase filename
const PATH_MAP: Record<string, string> = {
  tripstacc: "../TripStacc/testData/tripStacc.json",
  shopstacc: "../ShopStacc/testData/shopStacc.json",
};

let testData: any;

try {
  const dataPath = PATH_MAP[PRODUCT];
  if (!dataPath) throw new Error();
  testData = require(dataPath);
} catch {
  throw new Error(`❌ JSON not found for product: ${PRODUCT}`);
}

// ✅ Normalize client name (case-insensitive match)
const RAW_CLIENT = process.env.CLIENT || "BOB";

// ✅ Find matching key dynamically (important for future clients)
const CLIENT_KEY = Object.keys(testData).find(
  (key) => key.toLowerCase() === RAW_CLIENT.toLowerCase(),
);

if (!CLIENT_KEY || CLIENT_KEY === "common") {
  throw new Error(
    `❌ Invalid CLIENT: "${RAW_CLIENT}". Available: ${Object.keys(testData)
      .filter((k) => k !== "common")
      .join(", ")}`,
  );
}

// ✅ Deep merge utility
function deepMerge(target: any, source: any): any {
  const output = { ...target };

  if (source) {
    Object.keys(source).forEach((key) => {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

function stripEnvironmentSections(data: any): any {
  if (!data || typeof data !== "object") return data;

  const cleanData: any = {};
  Object.keys(data).forEach((key) => {
    if (["QA", "UAT", "PROD"].includes(key.toUpperCase())) return;
    cleanData[key] = data[key];
  });
  return cleanData;
}

const commonBase = stripEnvironmentSections(testData.common || {});
const commonEnv = testData.common?.[ENVIRONMENT] || {};
const clientBase = stripEnvironmentSections(testData[CLIENT_KEY] || {});
const clientEnv = testData[CLIENT_KEY]?.[ENVIRONMENT] || {};

export const Data = deepMerge(
  deepMerge(commonBase, commonEnv),
  deepMerge(clientBase, clientEnv),
);
