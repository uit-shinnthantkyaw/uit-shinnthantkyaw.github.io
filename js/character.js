/**
 * CHARACTER.JS
 * Thomas Tin Tin Portfolio - Alien Character Controller
 * Handles the interactive alien mascot and character animations
 */

// ========================================
// ALIEN CHARACTER CLASS
// ========================================

class AlienCharacter {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.head = this.element.querySelector('.alien-head');
        this.eyes = this.element.querySelectorAll('.alien-eye');
        this.arms = this.element.querySelectorAll('.alien-arm');
        this.antennas = this.element.querySelectorAll('.alien-antenna');
        
        this.state = 'idle';
        this.mood = 'happy';
        this.speechBubble = null;
        
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.messages = [
            "Welcome to my universe! 👋",
            "Exploring code & creativity! 🚀",
            "Let's make something cosmic! ✨",
            "Music is my universal language! 🎵",
            "Tech + Art = Magic! 🪄",
            "Ready to collaborate? 🤝",
            "Click me for a surprise! 🎁",
            "I come in peace... and code! 💻"
        ];
        
        this.init();
    }
    
    init() {
        this.createSpeechBubble();
        this.setupEventListeners();
        this.startIdleAnimation();
        this.startEyeTracking();
    }
    
    createSpeechBubble() {
        this.speechBubble = document.createElement('div');
        this.speechBubble.className = 'alien-speech-bubble';
        this.speechBubble.style.cssText = `
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 15px;
            background: rgba(0, 255, 136, 0.9);
            color: #0a0a1a;
            border-radius: 15px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            font-family: 'Space Mono', monospace;
            font-weight: bold;
            z-index: 100;
        `;
        this.element.appendChild(this.speechBubble);
        
        // Add speech bubble tail
        const tail = document.createElement('div');
        tail.style.cssText = `
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(0, 255, 136, 0.9);
        `;
        this.speechBubble.appendChild(tail);
    }
    
    setupEventListeners() {
        // Mouse tracking for eyes
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Click interaction
        this.element.addEventListener('click', () => this.onClick());
        
        // Hover effects
        this.element.addEventListener('mouseenter', () => this.onHover());
        this.element.addEventListener('mouseleave', () => this.onLeave());
        
        // Scroll reaction
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    startIdleAnimation() {
        // Random blink
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.blink();
            }
        }, 3000);
        
        // Random wave
        setInterval(() => {
            if (Math.random() < 0.2 && this.state === 'idle') {
                this.wave();
            }
        }, 5000);
        
        // Random antenna pulse
        setInterval(() => {
            this.pulseAntennas();
        }, 4000);
    }
    
    startEyeTracking() {
        const track = () => {
            this.trackEyes();
            requestAnimationFrame(track);
        };
        track();
    }
    
    trackEyes() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = this.mouseX - centerX;
        const deltaY = this.mouseY - centerY;
        
        // Limit eye movement
        const maxMove = 5;
        const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX / 50));
        const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY / 50));
        
        this.eyes.forEach(eye => {
            const shine = eye.querySelector('::after') || eye;
            eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
    
    blink() {
        this.eyes.forEach(eye => {
            eye.style.transform = 'scaleY(0.1)';
            setTimeout(() => {
                eye.style.transform = 'scaleY(1)';
            }, 150);
        });
    }
    
    wave() {
        this.state = 'waving';
        this.arms[1].style.animation = 'wave-fast 0.3s ease-in-out 5';
        
        setTimeout(() => {
            this.arms[1].style.animation = '';
            this.state = 'idle';
        }, 1500);
    }
    
    pulseAntennas() {
        this.antennas.forEach(antenna => {
            antenna.style.transform = 'scale(1.2)';
            setTimeout(() => {
                antenna.style.transform = '';
            }, 300);
        });
    }
    
    speak(message) {
        this.speechBubble.textContent = message;
        this.speechBubble.style.opacity = '1';
        this.speechBubble.style.transform = 'translateX(-50%) translateY(-10px)';
        
        setTimeout(() => {
            this.speechBubble.style.opacity = '0';
            this.speechBubble.style.transform = 'translateX(-50%) translateY(0)';
        }, 3000);
    }
    
    onClick() {
        this.state = 'excited';
        
        // Jump animation
        this.element.style.animation = 'jump 0.5s ease';
        
        // Say something
        const randomMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
        this.speak(randomMessage);
        
        // Create particle burst
        this.createParticleBurst();
        
        // Play sound effect (if available)
        this.playSound('click');
        
        setTimeout(() => {
            this.element.style.animation = 'float 3s ease-in-out infinite';
            this.state = 'idle';
        }, 500);
    }
    
    onHover() {
        this.element.style.transform = 'scale(1.1)';
        this.element.style.filter = 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.8))';
        this.speak("Hey there! 👽");
    }
    
    onLeave() {
        this.element.style.transform = '';
        this.element.style.filter = '';
    }
    
    onScroll() {
        const scrollY = window.scrollY;
        
        // Tilt based on scroll direction
        if (this.lastScrollY !== undefined) {
            const direction = scrollY > this.lastScrollY ? 1 : -1;
            this.head.style.transform = `rotate(${direction * 10}deg)`;
            
            setTimeout(() => {
                this.head.style.transform = '';
            }, 300);
        }
        
        this.lastScrollY = scrollY;
    }
    
    createParticleBurst() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 / 10) * i;
            const velocity = 100 + Math.random() * 50;
            
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 10px;
                height: 10px;
                background: ${this.getRandomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: particleBurst 1s ease-out forwards;
                --tx: ${Math.cos(angle) * velocity}px;
                --ty: ${Math.sin(angle) * velocity}px;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }
    
    getRandomColor() {
        const colors = ['#00ff88', '#ff00ff', '#00ffff', '#ffff00', '#ff6b6b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    playSound(type) {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch (type) {
            case 'click':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
                break;
            case 'hover':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                break;
        }
        
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    // Mood system
    setMood(mood) {
        this.mood = mood;
        
        switch (mood) {
            case 'happy':
                this.element.querySelector('.alien-head').style.background = 
                    'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)';
                break;
            case 'excited':
                this.element.querySelector('.alien-head').style.background = 
                    'linear-gradient(180deg, #facc15 0%, #eab308 100%)';
                break;
            case 'curious':
                this.element.querySelector('.alien-head').style.background = 
                    'linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%)';
                break;
            case 'creative':
                this.element.querySelector('.alien-head').style.background = 
                    'linear-gradient(180deg, #c084fc 0%, #a855f7 100%)';
                break;
        }
    }
}

// ========================================
// CHARACTER REACTIONS
// ========================================

class CharacterReactions {
    constructor(character) {
        this.character = character;
        this.setupSectionReactions();
    }
    
    setupSectionReactions() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.reactToSection(entry.target.id);
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    reactToSection(sectionId) {
        switch (sectionId) {
            case 'about':
                this.character.setMood('curious');
                this.character.speak("Learn more about me! 📖");
                break;
            case 'skills':
                this.character.setMood('excited');
                this.character.speak("Check out my skills! 💪");
                break;
            case 'projects':
                this.character.setMood('creative');
                this.character.speak("My cosmic creations! 🌌");
                break;
            case 'music':
                this.character.setMood('happy');
                this.character.speak("Let's jam! 🎵");
                break;
            case 'contact':
                this.character.setMood('excited');
                this.character.speak("Let's connect! 📡");
                break;
            default:
                this.character.setMood('happy');
        }
    }
}

// ========================================
// MINI ALIENS (FOR PROJECT CARDS)
// ========================================

class MiniAliens {
    constructor() {
        this.init();
    }
    
    init() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.spawnMiniAlien(e.target));
        });
    }
    
    spawnMiniAlien(card) {
        const miniAlien = document.createElement('div');
        miniAlien.innerHTML = '👾';
        miniAlien.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            top: -10px;
            right: -10px;
            animation: miniAlienPop 0.5s ease forwards;
            z-index: 10;
        `;
        
        card.style.position = 'relative';
        card.appendChild(miniAlien);
        
        setTimeout(() => miniAlien.remove(), 2000);
    }
}

// ========================================
// ADD CUSTOM CSS ANIMATIONS
// ========================================

const characterStyles = document.createElement('style');
characterStyles.textContent = `
    @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-30px); }
    }
    
    @keyframes wave-fast {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-30deg); }
        75% { transform: rotate(30deg); }
    }
    
    @keyframes particleBurst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes miniAlienPop {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(360deg);
            opacity: 0;
        }
    }
    
    .alien-character {
        transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .alien-head {
        transition: transform 0.3s ease, background 0.5s ease;
    }
    
    .alien-eye {
        transition: transform 0.1s ease;
    }
`;
document.head.appendChild(characterStyles);

// ========================================
// INITIALIZE CHARACTER
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const alienCharacter = new AlienCharacter('alienCharacter');
    const reactions = new CharacterReactions(alienCharacter);
    const miniAliens = new MiniAliens();
    
    // Expose to global for debugging
    window.AlienCharacter = alienCharacter;
});
