/**
 * Universal safe clipboard helper for Android Chrome, iOS Safari,
 * in-app WebViews, and non-HTTPS local network origins.
 */
export async function copyTextSafely(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below when Clipboard API is blocked in WebViews / HTTP / Safari gesture restrictions
  }

  try {
    if (typeof document === 'undefined') return false;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    // fontSize >= 16px prevents iOS Safari auto-zoom during focus/select fallback
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    textarea.style.fontSize = '16px';
    document.body.appendChild(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}
