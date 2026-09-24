// Browsers built into social apps (Messenger, Facebook, Instagram, TikTok...)
// and Android web views. Google refuses to sign in inside them
// (error 403: disallowed_useragent), so people have to open the link in
// their regular browser.
const IN_APP_BROWSER =
  /FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Snapchat|musical_ly|BytedanceWebview|TikTok|Line\/|; wv\)/;

export const isInAppBrowser = (userAgent = navigator.userAgent) =>
  IN_APP_BROWSER.test(userAgent);
