import { describe, expect, it } from 'vitest';
import { isInAppBrowser } from '../../src/services/inAppBrowser';

const inApp = {
  'Messenger (iOS)':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/470.0.0.37.109;FBBV/618352553]',
  'Facebook (Android)':
    'Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/AP2A.240805.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/477.0.0.49.83;]',
  'Instagram (iOS)':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 342.0.0.33.100 (iPhone15,2; iOS 17_5; pl_PL; pl; scale=3.00; 1179x2556)',
  'TikTok (Android)':
    'Mozilla/5.0 (Linux; Android 13; SM-A536B Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.134 Mobile Safari/537.36 musical_ly_2023508030 BytedanceWebview/d8a21c6',
  'Android web view':
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240805.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36',
};

const browsers = {
  'Chrome (Android)':
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
  'Samsung Internet':
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
  'Safari (iOS)':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  'Chrome (iOS)':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/127.0.6533.107 Mobile/15E148 Safari/604.1',
  'Chrome (Windows)':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Firefox (Windows)':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
};

describe('isInAppBrowser', () => {
  it.each(Object.entries(inApp))('recognises %s', (_, userAgent) => {
    expect(isInAppBrowser(userAgent)).toBe(true);
  });

  it.each(Object.entries(browsers))('leaves %s alone', (_, userAgent) => {
    expect(isInAppBrowser(userAgent)).toBe(false);
  });
});
