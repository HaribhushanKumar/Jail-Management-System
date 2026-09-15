export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('VITE_API_BASE_URL');
    if (savedUrl && savedUrl.trim() !== '') {
      return savedUrl.trim().replace(/\/+$/, '');
    }
  }
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:8080';
};

export const setApiBaseUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    if (url && url.trim() !== '') {
      localStorage.setItem('VITE_API_BASE_URL', url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem('VITE_API_BASE_URL');
    }
    window.location.reload();
  }
};

export const API_BASE_URL: string = getApiBaseUrl();
