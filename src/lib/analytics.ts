import { analyticsConfig, hasMeasurementId } from './analytics-config';
import { getConsent } from './cookie-consent';

export { analyticsConfig } from './analytics-config';

// Helper function to track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && getConsent().analytics && hasMeasurementId(analyticsConfig.measurementId) && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Helper function to track conversions
export const trackConversion = (conversionName: string, value?: number) => {
  if (typeof window !== 'undefined' && getConsent().analytics && hasMeasurementId(analyticsConfig.measurementId) && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionName,
      value: value,
    });
  }
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
