// ================================================================
// CWRB - Centralized Hybrid Version & System Architecture
// ================================================================

export const APP_VERSION_NAME = "HYBRID VERSION";
export const APP_BUILD_MODEL = "PHRS CROWD HYBRID MODEL";
export const APP_RELEASE_MODE = "HYBRID RELEASE";

/**
 * Returns the centralized version string for CWRB Application.
 * Guaranteed to return "HYBRID VERSION" without numeric version digits.
 */
export function getAppVersionDisplay(): string {
  return APP_VERSION_NAME;
}

/**
 * Returns the full architecture model string.
 */
export function getAppModelDisplay(): string {
  return APP_BUILD_MODEL;
}
