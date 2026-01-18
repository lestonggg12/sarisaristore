// static/js/dark-mode.js
(function() {
    'use strict';
    
    // 1. Initial Apply (Prevents white flash)
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body?.classList.add('dark-mode');
    }

    // 2. Global Toggle Function (Called by Settings)
    window.toggleDarkMode = function() {
        const isDark = document.body.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('dark-mode');
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        console.log(`🌓 Theme switched to: ${theme}`);
        return isDark;
    };

    console.log('✓ Dark mode engine initialized (No floating moon)');
})();