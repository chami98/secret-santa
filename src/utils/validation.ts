import { appConfig } from '../config/firebase';

/**
 * Validates if an email belongs to the allowed company domain
 */
export const isValidCompanyEmail = (email: string | null): boolean => {
  if (!email) return false;
  
  const domain = email.split('@')[1];
  return domain === appConfig.allowedDomain;
};

/**
 * Extracts domain from email
 */
export const getDomainFromEmail = (email: string | null): string | null => {
  if (!email) return null;
  return email.split('@')[1] || null;
};

/**
 * Validates email format
 */
export const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

