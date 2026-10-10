const navigation = document.querySelector('.navigation');
const menuToggle = document.querySelector('.menu-toggle');
const navigationLinks = document.querySelector('.navigation-links');
const menuLabel = document.querySelector('.menu-label');
const pageLayout = document.querySelector('.page-layout');

if (navigation && menuToggle && navigationLinks && menuLabel) {
    document.documentElement.classList.add('menu-ready');

    const closeMenu = () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        menuLabel.textContent = 'Menú';
        navigationLinks.classList.remove('is-open');
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
        menuLabel.textContent = isOpen ? 'Menú' : 'Cerrar';
        navigationLinks.classList.toggle('is-open', !isOpen);
    });

    navigationLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            closeMenu();

            if (target && pageLayout) {
                event.preventDefault();
                const left = pageLayout.scrollLeft
                    + target.getBoundingClientRect().left
                    - pageLayout.getBoundingClientRect().left;
                pageLayout.scrollTo({ left, behavior: 'auto' });
                window.history.pushState(null, '', link.getAttribute('href'));
            }
        });
    });

    navigation.querySelector('.brand')?.addEventListener('click', (event) => {
        if (pageLayout) {
            event.preventDefault();
            pageLayout.scrollTo({ left: 0, behavior: 'auto' });
            closeMenu();
            window.history.pushState(null, '', '#inicio');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target)) {
            closeMenu();
        }
    });
}

if (pageLayout) {
    const slides = [...pageLayout.querySelectorAll('.hero, .dashboard-card')];

    pageLayout.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            const currentSlide = Math.round(pageLayout.scrollLeft / pageLayout.clientWidth);
            const direction = Math.sign(event.deltaY);
            const nextSlide = Math.max(0, Math.min(slides.length - 1, currentSlide + direction));
            pageLayout.scrollTo({
                left: slides[nextSlide].offsetLeft,
                behavior: 'auto'
            });
        }
    }, { passive: false });

    pageLayout.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            pageLayout.scrollBy({
                left: event.key === 'ArrowRight' ? pageLayout.clientWidth : -pageLayout.clientWidth,
                behavior: 'auto'
            });
        }
    });
}
