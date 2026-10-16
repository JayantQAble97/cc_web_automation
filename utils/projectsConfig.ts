// Single source of truth for product/client/environment -> baseUrl + testDir,
// read from cc.config.yaml (project root). Add a new client or environment
// there — no code changes needed in playwright.config.ts.

import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

type ClientEnvConfig = { baseUrl: string };

type ProjectConfig = {
  testDir: string;
  clients: Record<string, Record<string, ClientEnvConfig>>;
};

type ProjectsConfig = {
  projects: Record<string, ProjectConfig>;
};

function loadProjectsConfig(): ProjectsConfig {
  const configPath = path.resolve(__dirname, '../cc.config.yaml');
  return YAML.parse(fs.readFileSync(configPath, 'utf8'));
}

const PROJECTS_CONFIG = loadProjectsConfig();

export function getProjectConfig(product: string): ProjectConfig {
  const projectConfig = PROJECTS_CONFIG.projects[product];
  if (!projectConfig) {
    throw new Error(`Unknown PRODUCT "${product}" — add it under "projects" in cc.config.yaml.`);
  }
  return projectConfig;
}

export function getBaseUrl(product: string, client: string, environment: string): string {
  const projectConfig = getProjectConfig(product);
  const clientConfig = projectConfig.clients[client];
  if (!clientConfig) {
    throw new Error(
      `Invalid CLIENT "${client}" for product "${product}" — add it under projects.${product}.clients in cc.config.yaml.`
    );
  }
  const envConfig = clientConfig[environment] || clientConfig.QA;
  if (!envConfig) {
    throw new Error(
      `No config for environment "${environment}" (or QA fallback) under projects.${product}.clients.${client} in cc.config.yaml.`
    );
  }
  return envConfig.baseUrl;
}
