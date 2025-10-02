// ========================================
// AntChill - Anime Effects & Particles
// Advanced visual effects for gaming website
// ========================================

class AnimeEffects {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createCanvas();
        this.bindEvents();
        this.createParticles();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'anime-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.7';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
            
            // Remove dead particles
            if (particle.isDead()) {
                this.particles.splice(index, 1);
                this.particles.push(new Particle(this.canvas.width, this.canvas.height));
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
        this.colors = [
            'rgba(99, 102, 241, 0.8)',   // Purple
            'rgba(236, 72, 153, 0.8)',   // Pink
            'rgba(6, 182, 212, 0.8)',    // Cyan
            'rgba(245, 158, 11, 0.8)',   // Gold
            'rgba(139, 92, 246, 0.8)',   // Violet
        ];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    update(mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.vx += (dx / distance) * force * 0.5;
            this.vy += (dy / distance) * force * 0.5;
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Boundary collision
        if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -0.8;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -0.8;
        
        // Keep in bounds
        this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        
        // Update life
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Floating Text Effect
class FloatingText {
    constructor(text, x, y, color = '#ffffff') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.originalY = y;
        this.color = color;
        this.opacity = 1;
        this.scale = 0;
        this.life = 1;
        this.element = this.createElement();
        this.animate();
    }

    createElement() {
        const element = document.createElement('div');
        element.textContent = this.text;
        element.style.position = 'fixed';
        element.style.left = this.x + 'px';
        element.style.top = this.y + 'px';
        element.style.color = this.color;
        element.style.fontSize = '24px';
        element.style.fontWeight = 'bold';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '9999';
        element.style.transform = 'translate(-50%, -50%) scale(0)';
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.textShadow = '0 0 20px currentColor';
        
        document.body.appendChild(element);
        return element;
    }

    animate() {
        // Scale in
        setTimeout(() => {
            this.element.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 50);

        // Float up and fade out
        setTimeout(() => {
            this.element.style.transform = 'translate(-50%, -50%) scale(1) translateY(-50px)';
            this.element.style.opacity = '0';
        }, 800);

        // Remove element
        setTimeout(() => {
            this.element.remove();
        }, 1500);
    }
}

// Ripple Effect
class RippleEffect {
    static create(x, y, color = 'rgba(99, 102, 241, 0.3)') {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = color;
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9998';
        ripple.style.animation = 'rippleExpand 0.6s ease-out forwards';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Glitch Effect
class GlitchEffect {
    static apply(element, duration = 1000) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let glitchInterval;
        
        const glitch = () => {
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            element.textContent = glitchedText;
        };
        
        glitchInterval = setInterval(glitch, 50);
        
        setTimeout(() => {
            clearInterval(glitchInterval);
            element.textContent = originalText;
        }, duration);
    }
}

// Parallax Controller
class ParallaxController {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.findElements();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.update());
        window.addEventListener('mousemove', (e) => this.updateMouse(e));
    }

    findElements() {
        // Find elements with parallax data attributes
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            this.elements.push({ element, speed });
        });
    }

    update() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(({ element, speed }) => {
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateMouse(e) {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        document.querySelectorAll('[data-mouse-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.mouseParallax) || 0.1;
            const x = mouseX * speed * 50;
            const y = mouseY * speed * 50;
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        this.init();
    }

    init() {
        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger effect for child elements
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize anime effects
    const animeEffects = new AnimeEffects();
    const parallaxController = new ParallaxController();
    const animationObserver = new AnimationObserver();
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            RippleEffect.create(x, y);
        });
    });
    
    // Add floating text effect to special elements
    document.querySelectorAll('[data-float-text]').forEach(element => {
        element.addEventListener('click', (e) => {
            const text = element.dataset.floatText;
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            new FloatingText(text, x, y, '#f59e0b');
        });
    });
    
    // Add glitch effect to title on hover
    const heroTitle = document.querySelector('.hero-title .title-line');
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', () => {
            GlitchEffect.apply(heroTitle, 500);
        });
    }
    
    // Performance optimization
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Throttle scroll events
    window.addEventListener('scroll', () => {
        requestTick();
    });
});

// Add CSS for animations
const animationStyles = `
    @keyframes rippleExpand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .stagger-child {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .stagger-child.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    [data-mouse-parallax] {
        transition: transform 0.1s ease-out;
    }
    
    [data-parallax] {
        will-change: transform;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
