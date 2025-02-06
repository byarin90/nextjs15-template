// This script runs before the React app loads
export const darkModeScript = `
  (function() {
    try {
      const isDarkMode = localStorage.getItem('dark') === 'true';
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Dark mode initialization failed:', e);
    }
  })()
`;
