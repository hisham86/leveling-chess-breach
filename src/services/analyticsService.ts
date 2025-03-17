
// Simple analytics service to handle Google Analytics events

/**
 * Tracks a page view with Google Analytics
 * @param path The current path being viewed
 */
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-MEASUREMENT_ID', {
      page_path: path
    });
    console.log(`📊 Page view tracked: ${path}`);
  }
};

/**
 * Tracks a custom event with Google Analytics
 * @param eventName Name of the event
 * @param eventParams Additional parameters for the event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
    console.log(`📊 Event tracked: ${eventName}`, eventParams);
  }
};
