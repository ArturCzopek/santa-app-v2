import { useTranslation } from 'react-i18next';
import { useNotify } from './useNotify';

const canShare = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

// Sends a ready message with the phone's share sheet, or copies it where
// there is none (most computers) or sharing fails.
export const useShareMessage = () => {
  const { t } = useTranslation();
  const notify = useNotify();

  const copy = async (text: string, copied: string, fallbackUrl: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(copied, 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      notify(t('loginPage.inAppBrowser.copyFailed', { url: fallbackUrl }));
    }
  };

  const share = async (
    title: string,
    text: string,
    copied: string,
    fallbackUrl: string,
  ) => {
    try {
      await navigator.share({ title, text });
    } catch (err) {
      // Closing the share sheet is not an error.
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Failed to share:', err);
      await copy(text, copied, fallbackUrl);
    }
  };

  return { canShare: canShare(), share, copy };
};
