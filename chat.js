document.addEventListener('DOMContentLoaded', function() {

    // --- Theme Toggle --- //
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        if (currentTheme === 'light-mode') {
            document.body.classList.add('light-mode');
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        let theme = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
        localStorage.setItem('theme', theme);
    });

    // --- Mobile Menu --- //
    const menu = document.querySelector('#menu-bars');
    const navbar = document.querySelector('.nav');

    if (menu && navbar) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        }
    }
});
