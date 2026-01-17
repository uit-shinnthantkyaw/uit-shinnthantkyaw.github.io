/**
 * ANIMATIONS.JS
 * Thomas Tin Tin Portfolio - Alien Artistic Animations
 * Handles all canvas animations, particles, and visual effects
 */

// ========================================
// CANVAS STARFIELD ANIMATION
// ========================================

class StarfieldAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.nebulas = [];
        this.shootingStars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createStars(200);
        this.createNebulas(5);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Trigger shooting star on click
        document.addEventListener('click', (e) => {
            this.createShootingStar(e.clientX, e.clientY);
        });
    }
    
    createStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: this.getRandomStarColor()
            });
        }
    }
    
    getRandomStarColor() {
        const colors = [
            '#ffffff', // White
            '#00ff88', // Green (primary)
            '#ff00ff', // Magenta
            '#00ffff', // Cyan
            '#ffff00', // Yellow
            '#ff6b6b'  // Coral
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    createNebulas(count) {
        const colors = [
            'rgba(0, 255, 136, 0.03)',
            'rgba(255, 0, 255, 0.03)',
            'rgba(0, 255, 255, 0.03)'
        ];
        
        for (let i = 0; i < count; i++) {
            this.nebulas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 300 + 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                drift: {
                    x: (Math.random() - 0.5) * 0.2,
                    y: (Math.random() - 0.5) * 0.2
                }
            });
        }
    }
    
    createShootingStar(x, y) {
        this.shootingStars.push({
            x: x || Math.random() * this.canvas.width,
            y: y || 0,
            length: Math.random() * 100 + 50,
            speed: Math.random() * 10 + 15,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
            opacity: 1,
            trail: []
        });
    }
    
    drawStar(star, time) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = (star.opacity + twinkle * 0.3);
        
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = star.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
        this.ctx.fill();
        
        // Add glow effect for larger stars
        if (star.radius > 1.5) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.radius * 3
            );
            gradient.addColorStop(0, star.color.replace(')', `, ${opacity * 0.5})`).replace('rgb', 'rgba'));
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }
    
    drawNebula(nebula) {
        // Move nebula slightly based on mouse
        const dx = (this.mouseX - this.canvas.width / 2) * 0.01;
        const dy = (this.mouseY - this.canvas.height / 2) * 0.01;
        
        nebula.x += nebula.drift.x + dx * 0.1;
        nebula.y += nebula.drift.y + dy * 0.1;
        
        // Wrap around screen
        if (nebula.x < -nebula.radius) nebula.x = this.canvas.width + nebula.radius;
        if (nebula.x > this.canvas.width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = this.canvas.height + nebula.radius;
        if (nebula.y > this.canvas.height + nebula.radius) nebula.y = -nebula.radius;
        
        const gradient = this.ctx.createRadialGradient(
            nebula.x, nebula.y, 0,
            nebula.x, nebula.y, nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
            nebula.x - nebula.radius,
            nebula.y - nebula.radius,
            nebula.radius * 2,
            nebula.radius * 2
        );
    }
    
    drawShootingStar(star) {
        if (star.opacity <= 0) return;
        
        const endX = star.x + Math.cos(star.angle) * star.length;
        const endY = star.y + Math.sin(star.angle) * star.length;
        
        const gradient = this.ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.beginPath();
        this.ctx.moveTo(star.x, star.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.02;
    }
    
    animate() {
        const time = Date.now() * 0.001;
        
        // Clear canvas with slight fade for trail effect
        this.ctx.fillStyle = 'rgba(5, 5, 16, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw nebulas
        this.nebulas.forEach(nebula => this.drawNebula(nebula));
        
        // Draw stars
        this.stars.forEach(star => this.drawStar(star, time));
        
        // Draw shooting stars
        this.shootingStars.forEach(star => this.drawShootingStar(star));
        
        // Clean up faded shooting stars
        this.shootingStars = this.shootingStars.filter(star => star.opacity > 0);
        
        // Randomly create shooting stars
        if (Math.random() < 0.003) {
            this.createShootingStar();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// FLOATING PARTICLES
// ========================================

class FloatingParticles {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.particleCount = 30;
        
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 10 + 5;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            top: ${startY}%;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
}

// Add particle animation CSS dynamically
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translate(50px, -30px) scale(1.2);
            opacity: 0.6;
        }
        50% {
            transform: translate(-30px, -60px) scale(0.8);
            opacity: 0.4;
        }
        75% {
            transform: translate(20px, -20px) scale(1.1);
            opacity: 0.5;
        }
    }
`;
document.head.appendChild(particleStyle);

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }
    
    init() {
        // Add elements to watch
        this.addElements('.artistic-note', 'fadeInLeft');
        this.addElements('.project-card', 'fadeInUp');
        this.addElements('.skill-category', 'fadeInUp');
        this.addElements('.music-card', 'fadeInUp');
        this.addElements('.stat-item', 'scaleIn');
        
        // Set up intersection observer
        this.setupObserver();
    }
    
    addElements(selector, animationType) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            this.animatedElements.push({ element: el, type: animationType });
        });
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.animatedElements.forEach(item => {
            observer.observe(item.element);
        });
    }
    
    animateElement(element) {
        const item = this.animatedElements.find(i => i.element === element);
        if (!item) return;
        
        switch (item.type) {
            case 'fadeInUp':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'fadeInLeft':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'scaleIn':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
            default:
                element.style.opacity = '1';
        }
    }
}

// ========================================
// TYPEWRITER EFFECT
// ========================================

class TypewriterEffect {
    constructor(elementId, phrases) {
        this.element = document.getElementById(elementId);
        this.phrases = phrases;
        this.currentPhrase = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.pauseDuration = 2000;
        
        this.type();
    }
    
    type() {
        const phrase = this.phrases[this.currentPhrase];
        
        if (this.isDeleting) {
            this.currentChar--;
        } else {
            this.currentChar++;
        }
        
        this.element.textContent = phrase.substring(0, this.currentChar);
        
        let timeout = this.typingSpeed;
        
        if (!this.isDeleting && this.currentChar === phrase.length) {
            timeout = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            timeout = 500;
        } else if (this.isDeleting) {
            timeout = 50;
        }
        
        setTimeout(() => this.type(), timeout);
    }
}

// ========================================
// COUNTER ANIMATION
// ========================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        this.setupObserver();
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = Date.now();
        
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.floor(start + (target - start) * easeOutQuart);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ========================================
// INITIALIZE ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize starfield
    const starfield = new StarfieldAnimation('alienCanvas');
    
    // Initialize floating particles
    const particles = new FloatingParticles('particles');
    
    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();
    
    // Initialize typewriter
    const typewriter = new TypewriterEffect('typewriterText', [
        'Tech Entrepreneur 🚀',
        'Music Producer 🎵',
        'Digital Artist 🎨',
        'Creative Innovator ✨',
        'Code & Sound Designer 💻',
        'Building the Future 🌌'
    ]);
    
    // Initialize counter animations
    const counters = new CounterAnimation();
    
    // Set skill levels
    document.querySelectorAll('.skill-planet').forEach(planet => {
        const skillLevel = planet.getAttribute('data-skill');
        planet.style.setProperty('--skill-level', skillLevel);
    });
});

// Export for use in other modules
window.AlienAnimations = {
    StarfieldAnimation,
    FloatingParticles,
    ScrollAnimations,
    TypewriterEffect,
    CounterAnimation
};
