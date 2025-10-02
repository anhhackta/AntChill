// AntChill Studio - Premium Gaming Website JavaScript
class AntChillStudio {
    constructor() {
        this.isLoaded = false;
        this.isSoundEnabled = true;
        this.currentTheme = 'dark';
        this.cursor = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeLoading();
        this.initializeCursor();
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeAudio();
        this.initializeTheme();
        this.initializeForm();
        console.log('🎮 AntChill Studio initialized!');
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        window.addEventListener('load', () => this.onWindowLoad());
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onDOMReady() {
        this.setupButtonEffects();
        this.setupCardHovers();
    }

    onWindowLoad() {
        this.isLoaded = true;
        setTimeout(() => this.hideLoading(), 1000);
    }

    onScroll() {
        this.updateNavbar();
    }

    onMouseMove(e) {
        this.cursor.x = e.clientX;
        this.cursor.y = e.clientY;
        this.updateCursor();
    }

    // Loading Screen
    initializeLoading() {
        const progressFill = document.getElementById('loadingProgress');
        const percentage = document.getElementById('loadingPercentage');
        const status = document.getElementById('loadingStatus');
        
        let progress = 0;
        const steps = [
            { progress: 25, status: 'Loading assets...' },
            { progress: 50, status: 'Initializing engine...' },
            { progress: 75, status: 'Setting up animations...' },
            { progress: 100, status: 'Ready to play!' }
        ];
        
        let currentStep = 0;
        
        const updateProgress = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                const targetProgress = step.progress;
                
                const animate = () => {
                    if (progress < targetProgress) {
                        progress += Math.random() * 4 + 2;
                        progress = Math.min(progress, targetProgress);
                        
                        if (progressFill) progressFill.style.width = `${progress}%`;
                        if (percentage) percentage.textContent = `${Math.floor(progress)}%`;
                        if (status) status.textContent = step.status;
                        
                        if (progress < targetProgress) {
                            requestAnimationFrame(animate);
                        } else {
                            currentStep++;
                            setTimeout(updateProgress, 600);
                        }
                    }
                };
                animate();
            }
        };
        
        setTimeout(updateProgress, 500);
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.startMainAnimations();
            }, 800);
        }
    }

    startMainAnimations() {
        this.animateCounters();
        this.initializeScrollAnimations();
    }

    // Cursor System
    initializeCursor() {
        if (window.innerWidth <= 768) return;
        
        const follower = document.getElementById('cursorFollower');
        const dot = document.getElementById('cursorDot');
        
        if (follower && dot) {
            this.cursorFollower = follower;
            this.cursorDot = dot;
            this.setupCursorInteractions();
        }
    }

    updateCursor() {
        if (!this.cursorFollower || !this.cursorDot) return;
        
        this.cursorDot.style.left = `${this.cursor.x}px`;
        this.cursorDot.style.top = `${this.cursor.y}px`;
        
        this.cursorFollower.style.left = `${this.cursor.x}px`;
        this.cursorFollower.style.top = `${this.cursor.y}px`;
    }

    setupCursorInteractions() {
        const interactiveElements = document.querySelectorAll('a, button, .game-card, .feature-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.cursorFollower) {
                    this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    this.cursorFollower.style.opacity = '0.6';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (this.cursorFollower) {
                    this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                    this.cursorFollower.style.opacity = '0.3';
                }
            });
        });
    }

    // Navigation
    initializeNavigation() {
        this.setupNavigation();
        this.setupMobileMenu();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href.substring(1));
                    this.updateActiveNavLink(link);
                    this.playSound('click');
                }
            });
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                this.playSound('click');
            });
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateNavbar() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    // Animations
    initializeAnimations() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.feature-card, .game-card, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(element);
        });
    }

    initializeScrollAnimations() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const navLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
                    if (navLink) {
                        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Button Effects
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
                this.playSound('click');
            });
            
            button.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });
        });
        
        const downloadButton = document.getElementById('downloadLauncher');
        if (downloadButton) {
            downloadButton.addEventListener('click', (e) => {
                this.handleDownload(e);
            });
        }
    }

    createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    handleDownload(event) {
        this.showNotification('Đang tải AntChill Launcher...', 'info');
        
        setTimeout(() => {
            this.showNotification('Tải xuống thành công! Kiểm tra thư mục Downloads.', 'success');
        }, 2000);
        
        this.playSound('download');
    }

    // Card Hover Effects
    setupCardHovers() {
        const cards = document.querySelectorAll('.game-card, .feature-card, .contact-method');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Audio System
    initializeAudio() {
        this.audioContext = null;
        this.sounds = new Map();
        this.setupAudioControls();
        this.preloadSounds();
    }

    setupAudioControls() {
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }
    }

    preloadSounds() {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (AudioContext || webkitAudioContext)();
            this.createSounds();
        }
    }

    createSounds() {
        if (!this.audioContext) return;
        
        this.sounds.set('click', this.createTone(800, 0.1, 'square'));
        this.sounds.set('hover', this.createTone(600, 0.05, 'sine'));
        this.sounds.set('download', this.createTone(1000, 0.3, 'triangle'));
    }

    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.audioContext || !this.isSoundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    playSound(soundName) {
        const sound = this.sounds.get(soundName);
        if (sound && this.isSoundEnabled) {
            try {
                sound();
            } catch (error) {
                console.warn('Audio playback failed:', error);
            }
        }
    }

    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        const soundToggle = document.getElementById('soundToggle');
        
        if (soundToggle) {
            const icon = soundToggle.querySelector('i');
            if (icon) {
                icon.className = this.isSoundEnabled ? 'bi bi-volume-up' : 'bi bi-volume-mute';
            }
        }
        
        this.showNotification(
            this.isSoundEnabled ? 'Âm thanh đã bật' : 'Âm thanh đã tắt',
            'info'
        );
    }

    // Theme System
    initializeTheme() {
        const savedTheme = localStorage.getItem('antchill-theme') || 'dark';
        this.setTheme(savedTheme);
        this.setupThemeControls();
    }

    setupThemeControls() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('antchill-theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'bi bi-sun' : 'bi bi-moon-stars';
            }
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.playSound('click');
        
        this.showNotification(
            `Đã chuyển sang theme ${newTheme === 'dark' ? 'tối' : 'sáng'}`,
            'info'
        );
    }

    // Form Handling
    initializeForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        this.showNotification('Đang gửi tin nhắn...', 'info');
        
        setTimeout(() => {
            this.showNotification('Tin nhắn đã được gửi thành công!', 'success');
            form.reset();
            this.playSound('download');
        }, 2000);
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="bi bi-${this.getNotificationIcon(type)}"></i>
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 16px 20px;
            color: white;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        const icon = notification.querySelector('.notification-icon');
        icon.style.color = this.getNotificationColor(type);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 4px;
        `;
        
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b'
        };
        return colors[type] || colors.info;
    }
}

// CSS Injection for Dynamic Styles
const dynamicStyles = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Initialize Application
const antChillStudio = new AntChillStudio();
window.AntChillStudio = antChillStudio;
