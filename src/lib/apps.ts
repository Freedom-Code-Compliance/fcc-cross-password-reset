/**
 * Map of known FCC app codes to their production login URLs.
 * After a successful password reset the user is redirected back
 * to whichever app initiated the reset request.
 */
export const APP_LOGIN_URLS: Record<string, string> = {
  fccPRO: 'https://fccpro.netlify.app/login',
  fccOPS: 'https://fccops.netlify.app/login',
  fccCRM: 'https://fcccrm.netlify.app/login',
  myfcc: 'https://myfcc.freedomcodecompliance.com/login',
  fccapply: 'https://fccapply.netlify.app/login',
  fccChat: 'https://fccchat.netlify.app/login',
  executive: 'https://executive.freedomcodecompliance.com/login',
};

/** Friendly display names for each app */
export const APP_NAMES: Record<string, string> = {
  fccPRO: 'FCC Pro',
  fccOPS: 'FCC Operations',
  fccCRM: 'FCC CRM',
  myfcc: 'myFCC',
  fccapply: 'FCC Apply',
  fccChat: 'FCC Chat',
  executive: 'Executive Portal',
};

/**
 * Get the login URL for an app code.
 * Prefers an explicit returnUrl (sent by the requesting app so it
 * works across dev/staging/production), falls back to the hardcoded
 * production URLs, then to fccOPS as a last resort.
 */
export function getLoginUrl(appCode: string | null, returnUrl?: string | null): string {
  if (returnUrl) {
    return returnUrl;
  }
  if (appCode && APP_LOGIN_URLS[appCode]) {
    return APP_LOGIN_URLS[appCode];
  }
  return APP_LOGIN_URLS.fccOPS;
}

/**
 * Get the display name for an app code.
 */
export function getAppName(appCode: string | null): string {
  if (appCode && APP_NAMES[appCode]) {
    return APP_NAMES[appCode];
  }
  return 'FCC';
}
