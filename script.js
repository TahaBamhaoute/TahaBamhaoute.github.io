// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || this.getSystemTheme();
        this.init();
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.documentElement.className = this.theme; // Alternative class for compatibility
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

    setActiveLink() {
        // For multi-page navigation, we'll set active based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
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

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i data-lucide="loader-2"></i> Envoi en cours...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.showMessage('Message envoyé avec succès! Je vous répondrai bientôt.', 'success');
                this.form.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            this.showMessage('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Re-initialize Lucide icons for the restored button
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }

    showMessage(message, type = 'info') {
        // Remove any existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
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
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
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

// Vortex background animation for #home (only on index page)
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

        // Initialize vortex background only on home page
        if (document.getElementById('vortex-bg')) {
            vortexBackground();
        }
        
        // Add loading class removal
        this.removeLoadingState();
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

// Alternative initialization for immediate DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Theme toggle functionality (backup implementation)
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = root.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            root.className = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    root.setAttribute('data-theme', savedTheme);
    root.className = savedTheme;
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