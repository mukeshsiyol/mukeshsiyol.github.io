document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navLinksContainer = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const themeToggle = document.querySelector('.theme-toggle');
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const progressBar = document.querySelector('.scroll-progress-bar');

    const applyTheme = theme => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(savedTheme || preferredTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const activeTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
        });
    }

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    if (dropdown && dropdownToggle) {
        dropdownToggle.addEventListener('click', () => {
            const isOpen = dropdown.classList.toggle('open');
            dropdownToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });

            if (navLinksContainer) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    const fadeElements = document.querySelectorAll('.project-card, .skill-category, .highlight-item, .contact-link');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    const sections = document.querySelectorAll('section[id]');
    const updateScrollUI = () => {
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 30 ? '0 8px 22px rgba(15, 23, 42, 0.12)' : 'none';
        }

        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }

        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            const isActive = current && link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    };

    window.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();

    const yearNode = document.getElementById('copyright-year');
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }
});
