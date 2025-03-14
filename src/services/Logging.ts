import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

export const logUsageEvent = (
  eventName: string,
  params?: Record<string, any>,
) => {
  logEvent(analytics, eventName, params);
};
