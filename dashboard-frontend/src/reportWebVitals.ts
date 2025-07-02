import { getCLS, getFID, getFCP, getLCP, getTTFB, ReportHandler } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: ReportHandler) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}
