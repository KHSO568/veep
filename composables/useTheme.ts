export const useTheme = () => {
  const isDark = useState('theme', () => false);

  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      updateClass();
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (process.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
      updateClass();
    }
  };

  const updateClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    isDark,
    initTheme,
    toggleTheme
  };
};
