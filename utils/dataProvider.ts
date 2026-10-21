// Map lowercase product name to actual camelCase filename
const PATH_MAP: Record<string, string> = {
  tripstacc: "../TripStacc/testData/tripStacc.json",
  shopstacc: "../ShopStacc/testData/shopStacc.json",
};

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

// ✅ Resolve merged test data for a product/client/environment.
//
// Each argument falls back to the same env-var-derived defaults the module
// used to compute once at import time (PROJECT/CLIENT/ENV) — so existing
// call sites that just want `Data` (no args) behave exactly as before.
//
// A call site can instead pass explicit (product, client) overrides to get
// the right JSON regardless of what PROJECT/CLIENT happen to be set to in
// the current process — needed because Playwright projects running in the
// same worker process share one `process.env`, so two products/clients
// can't both rely on a single global PROJECT/CLIENT (e.g. when the VS Code
// Playwright extension runs TripStacc and ShopStacc tests together).
export function getData(
  productOverride?: string,
  clientOverride?: string,
  environmentOverride?: string,
): any {
  const PROJECT = process.env.PROJECT || "";
  const product = (
    productOverride ||
    PROJECT.split("-")[0] ||
    "tripstacc"
  ).toLowerCase();

  const environment = (
    environmentOverride ||
    process.env.ENV?.toUpperCase() ||
    PROJECT.split("-")[2]?.toUpperCase() ||
    "QA"
  );

  const rawClient = clientOverride || process.env.CLIENT || "BOB";

  const dataPath = PATH_MAP[product];
  let testData: any;
  try {
    if (!dataPath) throw new Error();
    testData = require(dataPath);
  } catch {
    throw new Error(`❌ JSON not found for product: ${product}`);
  }

  // ✅ Find matching key dynamically (important for future clients)
  const clientKey = Object.keys(testData).find(
    (key) => key.toLowerCase() === rawClient.toLowerCase(),
  );

  if (!clientKey || clientKey === "common") {
    throw new Error(
      `❌ Invalid CLIENT: "${rawClient}" for product "${product}". Available: ${Object.keys(
        testData,
      )
        .filter((k) => k !== "common")
        .join(", ")}`,
    );
  }

  const commonBase = stripEnvironmentSections(testData.common || {});
  const commonEnv = testData.common?.[environment] || {};
  const clientBase = stripEnvironmentSections(testData[clientKey] || {});
  const clientEnv = testData[clientKey]?.[environment] || {};

  return deepMerge(
    deepMerge(commonBase, commonEnv),
    deepMerge(clientBase, clientEnv),
  );
}

// ✅ Default export — same PROJECT/CLIENT/ENV-derived data as before,
// computed once at import time. Existing call sites keep working unchanged.
export const Data = getData();
