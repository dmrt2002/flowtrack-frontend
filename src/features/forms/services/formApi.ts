/**
 * Form API Service
 * Handles communication with the public form endpoints
 */

import {
  PublicFormSchema,
  FormSubmission,
  FormSubmissionResponse,
  FormValidationError,
} from '../types/public-form';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch public form schema by workspace slug
 */
export async function getPublicForm(
  workspaceSlug: string
): Promise<PublicFormSchema> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/forms/public/${workspaceSlug}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache form schema
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Form not found');
    }
    throw new Error('Failed to load form');
  }

  return response.json();
}

/**
 * Submit form data
 */
export async function submitPublicForm(
  workspaceSlug: string,
  submission: FormSubmission
): Promise<FormSubmissionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/forms/public/${workspaceSlug}/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    // Handle validation errors
    if (response.status === 400 && data.errors) {
      throw new FormValidationError(data.errors);
    }
    throw new Error(data.message || 'Failed to submit form');
  }

  return data;
}

/**
 * Track form view for analytics
 */
export async function trackFormView(
  workspaceSlug: string,
  utk?: string
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/v1/forms/public/${workspaceSlug}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ utk }),
    });
  } catch (error) {
    // Silently fail analytics tracking
    console.debug('Failed to track form view:', error);
  }
}

/**
 * Custom error class for form validation errors
 */
export class FormValidationError extends Error {
  errors: Array<{ field: string; message: string; code: string }>;

  constructor(errors: Array<{ field: string; message: string; code: string }>) {
    super('Form validation failed');
    this.name = 'FormValidationError';
    this.errors = errors;
  }
}

/**
 * Get UTM parameters from URL
 */
export function getUTMParams(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
} {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
  };
}

/**
 * Get or create visitor tracking key (UTK)
 */
export function getOrCreateUTK(): string {
  if (typeof window === 'undefined') return '';

  const cookieName = 'flowtrack_utk';
  const existingUTK = getCookie(cookieName);

  if (existingUTK) {
    return existingUTK;
  }

  // Generate new UTK
  const newUTK = `utk_${Math.random().toString(36).substr(2, 9)}${Date.now()}`;
  setCookie(cookieName, newUTK, 365);

  return newUTK;
}

/**
 * Get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

/**
 * Set cookie
 */
function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;

  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
}
