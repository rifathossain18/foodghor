
export const resolveImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;          // base64 uploads
  if (url.startsWith('blob:')) return url;          // blob URLs
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }
  return url;
};