/**
 * UI.JS
 * Thomas Tin Tin Portfolio - UI Components & Interactions
 * Handles navigation, forms, filters, and general UI functionality
 */

// ========================================
// NAVIGATION CONTROLLER
// ========================================

class NavigationController {
    constructor() {
        this.nav = document.querySelector('.nav-alien');
        this.navToggle = document.getElementById('navToggle');
        this.navLinks = document.getElementById('navLinks');
        this.links = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.setupNavBackground();
    }
    
    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
            document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.navLinks.classList.contains('active')) {
                this.navToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    setupScrollSpy() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target.id);
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => observer.observe(section));
        
        // Also observe hero section
        const hero = document.querySelector('.hero');
        if (hero) observer.observe(hero);
    }
    
    setActiveLink(sectionId) {
        this.links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    setupSmoothScroll() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupNavBackground() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add/remove background opacity based on scroll
            if (currentScroll > 50) {
                this.nav.style.background = 'rgba(10, 10, 26, 0.98)';
                this.nav.style.boxShadow = '0 2px 20px rgba(0, 255, 136, 0.1)';
            } else {
                this.nav.style.background = 'rgba(10, 10, 26, 0.9)';
                this.nav.style.boxShadow = 'none';
            }
            
            // Hide/show nav based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 200) {
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                this.nav.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
}

// ========================================
// PROJECT FILTER
// ========================================

class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        this.init();
    }
    
    init() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });
    }
    
    filter(activeBtn) {
        const filter = activeBtn.getAttribute('data-filter');
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        
        // Filter cards with animation
        this.projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
                card.style.display = 'block';
            } else {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ========================================
// MUSIC PLAYER UI
// ========================================

class MusicPlayerUI {
    constructor() {
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.visualizer = document.getElementById('visualizer');
        this.bars = this.visualizer.querySelectorAll('.bar');
        this.musicCards = document.querySelectorAll('.music-card');
        
        this.isPlaying = false;
        this.currentTrack = 0;
        this.tracks = ['Cosmic Journey', 'UFO Nights', 'Lunar Dreams', 'Stardust'];
        
        this.init();
    }
    
    init() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        this.musicCards.forEach((card, index) => {
            card.addEventListener('click', () => this.selectTrack(index));
        });
    }
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        
        if (this.isPlaying) {
            this.startVisualizer();
        } else {
            this.stopVisualizer();
        }
    }
    
    startVisualizer() {
        this.bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    }
    
    stopVisualizer() {
        this.bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }
    
    prevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.updateTrackDisplay();
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.updateTrackDisplay();
    }
    
    selectTrack(index) {
        this.currentTrack = index;
        this.updateTrackDisplay();
        
        if (!this.isPlaying) {
            this.togglePlay();
        }
        
        // Highlight selected card
        this.musicCards.forEach((card, i) => {
            card.style.border = i === index ? '2px solid var(--primary-color)' : '';
            card.style.transform = i === index ? 'scale(1.05)' : '';
        });
    }
    
    updateTrackDisplay() {
        const trackTitle = document.querySelector('.track-title');
        trackTitle.textContent = `${this.tracks[this.currentTrack]} - Track 0${this.currentTrack + 1}`;
    }
}

// ========================================
// CONTACT FORM HANDLER
// ========================================

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form.querySelector('.submit-btn');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input animations
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.onInputFocus(input));
            input.addEventListener('blur', () => this.onInputBlur(input));
        });
    }
    
    onInputFocus(input) {
        input.parentElement.classList.add('focused');
    }
    
    onInputBlur(input) {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Animate button
        this.submitBtn.innerHTML = '<span>Transmitting...</span> 📡';
        this.submitBtn.disabled = true;
        
        // Simulate form submission
        await this.simulateSubmission();
        
        // Show success
        this.showSuccess();
        
        // Reset form
        setTimeout(() => {
            this.form.reset();
            this.submitBtn.innerHTML = '<span>Send Transmission</span> <span class="btn-rocket">🚀</span>';
            this.submitBtn.disabled = false;
        }, 3000);
    }
    
    simulateSubmission() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    showSuccess() {
        this.submitBtn.innerHTML = '<span>Transmission Sent!</span> ✅';
        this.submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        // Create success particles
        this.createSuccessParticles();
        
        // Show notification
        this.showNotification('Message sent successfully! 🚀');
        
        setTimeout(() => {
            this.submitBtn.style.background = '';
        }, 3000);
    }
    
    createSuccessParticles() {
        const rect = this.submitBtn.getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = ['✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 4)];
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top}px;
                font-size: ${Math.random() * 10 + 15}px;
                pointer-events: none;
                z-index: 9999;
                animation: successParticle 1s ease-out forwards;
                --tx: ${(Math.random() - 0.5) * 200}px;
                --ty: ${-Math.random() * 150 - 50}px;
            `;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            background: linear-gradient(135deg, var(--primary-color), #00cc6a);
            color: var(--bg-dark);
            border-radius: 10px;
            font-weight: bold;
            font-family: 'Space Mono', monospace;
            z-index: 10000;
            animation: slideInRight 0.5s ease forwards;
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// ========================================
// CURSOR EFFECTS
// ========================================

class CursorEffects {
    constructor() {
        // Don't initialize on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return;
        }
        
        this.cursor = this.createCursor();
        this.cursorTrail = [];
        this.trailLength = 10;
        
        this.init();
    }
    
    createCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease;
            mix-blend-mode: difference;
            display: none;
        `;
        document.body.appendChild(cursor);
        return cursor;
    }
    
    init() {
        if (!this.cursor) return;
        
        // Show cursor only on mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.display = 'block';
            this.moveCursor(e);
        });
        
        // Hide on touch
        document.addEventListener('touchstart', () => {
            if (this.cursor) this.cursor.style.display = 'none';
        });
        
        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .music-card, .filter-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.expandCursor());
            el.addEventListener('mouseleave', () => this.shrinkCursor());
        });
    }
    
    moveCursor(e) {
        if (!this.cursor) return;
        this.cursor.style.left = e.clientX - 10 + 'px';
        this.cursor.style.top = e.clientY - 10 + 'px';
    }
    
    expandCursor() {
        if (!this.cursor) return;
        this.cursor.style.transform = 'scale(2)';
        this.cursor.style.background = 'rgba(0, 255, 136, 0.1)';
    }
    
    shrinkCursor() {
        if (!this.cursor) return;
        this.cursor.style.transform = 'scale(1)';
        this.cursor.style.background = 'transparent';
    }
}

// ========================================
// LAZY LOADING
// ========================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px' });
        
        this.images.forEach(img => observer.observe(img));
    }
    
    loadImage(img) {
        img.src = img.getAttribute('data-src');
        img.classList.add('loaded');
    }
}

// ========================================
// THEME MANAGER (For future dark/light mode)
// ========================================

class ThemeManager {
    constructor() {
        this.currentTheme = 'alien';
        this.themes = {
            alien: {
                primary: '#00ff88',
                secondary: '#ff00ff',
                accent: '#00ffff',
                bgDark: '#0a0a1a'
            },
            cosmic: {
                primary: '#8b5cf6',
                secondary: '#ec4899',
                accent: '#06b6d4',
                bgDark: '#0f0f23'
            },
            matrix: {
                primary: '#00ff00',
                secondary: '#00cc00',
                accent: '#00ff88',
                bgDark: '#000000'
            }
        };
        
        // Load saved theme
        this.loadSavedTheme();
    }
    
    loadSavedTheme() {
        const saved = localStorage.getItem('portfolio-theme');
        if (saved && this.themes[saved]) {
            this.setTheme(saved);
        }
    }
    
    setTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        const theme = this.themes[themeName];
        const root = document.documentElement;
        
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--bg-dark', theme.bgDark);
        
        // Update glow variables
        root.style.setProperty('--glow-green', `0 0 20px ${theme.primary}80`);
        
        this.currentTheme = themeName;
        
        // Save preference
        localStorage.setItem('portfolio-theme', themeName);
    }
}

// ========================================
// ADD UI ANIMATIONS CSS
// ========================================

const uiStyles = document.createElement('style');
uiStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes successParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .nav-alien {
        transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .form-group.focused label {
        color: var(--primary-color);
    }
    
    img.loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Hide default cursor on desktop */
    @media (min-width: 769px) {
        body {
            cursor: none;
        }
        
        a, button {
            cursor: none;
        }
    }
    
    /* Show default cursor on mobile */
    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(uiStyles);

// ========================================
// INITIALIZE UI COMPONENTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading overlay after content loads
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 800);
    });
    
    // Fallback: hide loading after 3 seconds max
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 3000);
    
    // Initialize all UI components
    const navigation = new NavigationController();
    const projectFilter = new ProjectFilter();
    const musicPlayer = new MusicPlayerUI();
    const contactForm = new ContactFormHandler();
    const lazyLoader = new LazyLoader();
    const themeManager = new ThemeManager();
    
    // Initialize new interactive components
    const backToTop = new BackToTopButton();
    const quickActions = new QuickActionsBar();
    const themeToggle = new ThemeToggleButton(themeManager);
    const appNewsletter = new AppNewsletterHandler();
    
    // Only initialize cursor effects on desktop
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        const cursorEffects = new CursorEffects();
    }
    
    // Expose theme manager for console access
    window.ThemeManager = themeManager;
    
    console.log(`
    ╔══════════════════════════════════════╗
    ║  👽 Thomas Tin Tin Portfolio v1.1    ║
    ║  ═══════════════════════════════════ ║
    ║  Tech • Music • Art • Innovation     ║
    ║                                      ║
    ║  Try: ThemeManager.setTheme('cosmic')║
    ╚══════════════════════════════════════╝
    `);
});

// ========================================
// BACK TO TOP BUTTON
// ========================================

class BackToTopButton {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// QUICK ACTIONS BAR
// ========================================

class QuickActionsBar {
    constructor() {
        this.bar = document.getElementById('quickActions');
        this.buttons = document.querySelectorAll('.quick-action-btn');
        this.init();
    }
    
    init() {
        if (!this.bar) return;
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 300) {
                this.bar.classList.add('visible');
            } else {
                this.bar.classList.remove('visible');
            }
        }, 100));
        
        // Handle button clicks
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn));
        });
    }
    
    handleAction(btn) {
        const action = btn.getAttribute('data-action');
        
        switch (action) {
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'projects':
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'music':
                document.getElementById('music')?.scrollIntoView({ behavior: 'smooth' });
                // Auto-play music visualizer
                const playBtn = document.getElementById('playBtn');
                if (playBtn && playBtn.textContent === '▶️') {
                    playBtn.click();
                }
                break;
            case 'contact':
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'alien':
                // Trigger alien character interaction
                const alien = document.getElementById('alienCharacter');
                if (alien) {
                    alien.click();
                    alien.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                break;
        }
        
        // Visual feedback
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 300);
    }
}

// ========================================
// THEME TOGGLE BUTTON
// ========================================

class ThemeToggleButton {
    constructor(themeManager) {
        this.button = document.getElementById('themeToggle');
        this.themeManager = themeManager;
        this.themes = ['alien', 'cosmic', 'matrix'];
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        this.button.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex + 1) % this.themes.length;
            const newTheme = this.themes[this.currentIndex];
            this.themeManager.setTheme(newTheme);
            
            // Update button appearance
            this.updateButtonIcon(newTheme);
            
            // Show notification
            this.showThemeNotification(newTheme);
        });
    }
    
    updateButtonIcon(theme) {
        const icons = {
            alien: '👽',
            cosmic: '🌌',
            matrix: '💚'
        };
        this.button.textContent = icons[theme] || '🎨';
    }
    
    showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.textContent = `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
        notification.style.cssText = `
            position: fixed;
            top: 130px;
            right: 20px;
            padding: 10px 20px;
            background: var(--bg-card);
            border: 1px solid var(--primary-color);
            border-radius: 10px;
            color: var(--primary-color);
            font-family: 'Space Mono', monospace;
            font-size: 0.85rem;
            z-index: 1000;
            animation: slideInRight 0.3s ease forwards;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// APP NEWSLETTER HANDLER
// ========================================

class AppNewsletterHandler {
    constructor() {
        this.form = document.getElementById('appNewsletter');
        this.notifyBtn = document.getElementById('notifyBtn');
        this.subscribeBtn = document.getElementById('subscribeBtn');
        this.init();
    }
    
    init() {
        // Notify Me button - scroll to newsletter
        if (this.notifyBtn) {
            this.notifyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const newsletterSection = document.querySelector('.app-newsletter');
                if (newsletterSection) {
                    newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    newsletterSection.querySelector('input')?.focus();
                }
            });
        }
        
        // Newsletter form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Subscribe button click
        if (this.subscribeBtn) {
            this.subscribeBtn.addEventListener('click', () => {
                if (this.form) {
                    this.form.dispatchEvent(new Event('submit'));
                }
            });
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const emailInput = this.form.querySelector('input[type="email"]');
        const email = emailInput?.value.trim();
        
        if (!email || !this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            emailInput?.focus();
            return;
        }
        
        // Simulate subscription
        this.showNotification('🚀 Thanks! You\'ll be notified when CosmicBeats launches!', 'success');
        if (emailInput) emailInput.value = '';
        
        // Celebrate with confetti effect
        this.createConfetti();
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `app-notification ${type}`;
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 77, 77, 0.9)'};
            color: ${type === 'success' ? '#000' : '#fff'};
            border-radius: 10px;
            font-family: 'Space Mono', monospace;
            font-size: 0.9rem;
            z-index: 10000;
            animation: slideDown 0.4s ease forwards;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.4s ease forwards';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
    
    createConfetti() {
        const colors = ['#00ff88', '#ff00ff', '#00d4ff', '#ffdd00'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                z-index: 9999;
                pointer-events: none;
                animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(confettiStyle);

// Export utilities
window.UIUtils = { debounce, throttle };
