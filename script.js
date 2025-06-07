// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.navMenu) {
                    this.navMenu.classList.remove('active');
                }
            });
        });

        // Handle scroll for header background
        window.addEventListener('scroll', () => this.handleScroll());

        // Handle navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => this.setActiveLink());
    }

    handleScroll() {
        if (this.header) {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = this.header ? this.header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
    }

    observeElements() {
        const elements = document.querySelectorAll('.project-card, .card, .hero-text, .hero-image, .section-header');
        elements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        this.showMessage('Message envoyé avec succès! Je vous répondrai bientôt.', 'success');
        this.form.reset();
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius)',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out'
        });
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Icon Loader
class IconLoader {
    constructor() {
        this.init();
    }

    init() {
        // Wait for Lucide to load
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            // Retry after a short delay
            setTimeout(() => this.init(), 100);
        }
    }
}

// Main App
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize all components
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.animationManager = new AnimationManager();
        this.formHandler = new FormHandler();
        this.iconLoader = new IconLoader();

        // Add smooth scrolling for all anchor links
        this.initSmoothScrolling();
        
        // Add loading class removal
        this.removeLoadingState();
    }
  // Vortex background animation for #home
function vortexBackground() {
  const canvas = document.getElementById('vortex-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = window.innerWidth;
    const home = document.querySelector('#home');
    canvas.height = home ? home.offsetHeight : window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawVortex(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const arms = 5;
    const particles = 300;
    for (let i = 0; i < particles; i++) {
      const angle = (i / arms) + time * 0.0006;
      const radius = 80 + (i * 2);
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.arc(px, py, 3 + (i % 3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37,99,235,${0.15 + 0.5 * Math.sin(i + time * 0.001)})`;
      ctx.fill();
    }
    requestAnimationFrame(drawVortex);
  }
  requestAnimationFrame(drawVortex);
}

window.addEventListener('DOMContentLoaded', vortexBackground);

// (Le reste de ton code script.js ici, si besoin)

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    removeLoadingState() {
        // Remove any loading states and add loaded class
        document.body.classList.add('loaded');
        
        // Add staggered animation to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize the app
new App();
document.addEventListener('DOMContentLoaded', function () {
    // Init Lucide icons
    if (window.lucide) lucide.createIcons();

    const btn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Détection du thème sauvegardé
    function setTheme(dark) {
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        // Met à jour les icônes
        document.querySelector('.sun-icon').style.display = dark ? 'none' : 'inline';
        document.querySelector('.moon-icon').style.display = dark ? 'inline' : 'none';
    }

    // Clique sur le bouton
    btn.addEventListener('click', function () {
        const isDark = root.classList.contains('dark');
        setTheme(!isDark);
    });

    // Initialisation au chargement
    let theme = localStorage.getItem('theme');
    if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(theme === 'dark');
});
// Add some initial styles for loading states
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .project-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        body.loaded .project-card {
            opacity: 1;
            transform: translateY(0);
        }
        
        .form-message {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, ThemeManager, NavigationManager, AnimationManager, FormHandler };
}