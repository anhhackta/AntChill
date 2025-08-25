// Audio Management
let isSoundEnabled = true;
let isMusicEnabled = false;

// Theme Management
let currentTheme = 'dark';

// DOM Elements
const loadingScene = document.getElementById('loadingScene');
const themeToggle = document.getElementById('themeToggle');
const soundToggle = document.getElementById('soundToggle');
const hoverSound = document.getElementById('hoverSound');
const clickSound = document.getElementById('clickSound');
const bgMusic = document.getElementById('bgMusic');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeLoading();
    initializeTheme();
    initializeAudio();
    initializeAnimations();
    initializeEventListeners();
});

// Loading Scene
function initializeLoading() {
    // Simulate loading progress
    let progress = 0;
    const progressBar = document.querySelector('.loading-progress');
    const statusText = document.querySelector('.loading-status');
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            statusText.textContent = 'Hoàn tất!';
            
            setTimeout(() => {
                loadingScene.classList.add('hidden');
                document.body.style.overflow = 'visible';
                startPageAnimations();
            }, 500);
        }
        
        progressBar.style.width = progress + '%';
        
        if (progress < 30) {
            statusText.textContent = 'Đang tải tài nguyên...';
        } else if (progress < 60) {
            statusText.textContent = 'Đang khởi tạo...';
        } else if (progress < 90) {
            statusText.textContent = 'Gần xong...';
        }
    }, 100);
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.className = 'fas fa-sun';
        document.body.style.background = '#ffffff';
    } else {
        icon.className = 'fas fa-moon';
        document.body.style.background = '#0a0a0a';
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    playSound('click');
}

// Audio Management
function initializeAudio() {
    // Set initial volume
    hoverSound.volume = 0.3;
    clickSound.volume = 0.5;
    bgMusic.volume = 0.2;
}

function playSound(type) {
    if (!isSoundEnabled) return;
    
    try {
        if (type === 'hover') {
            hoverSound.currentTime = 0;
            hoverSound.play();
        } else if (type === 'click') {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    } catch (error) {
        console.log('Audio playback failed:', error);
    }
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    const icon = soundToggle.querySelector('i');
    
    if (isSoundEnabled) {
        icon.className = 'fas fa-volume-up';
        icon.style.opacity = '1';
    } else {
        icon.className = 'fas fa-volume-mute';
        icon.style.opacity = '0.5';
    }
    
    playSound('click');
}

function toggleMusic() {
    isMusicEnabled = !isMusicEnabled;
    
    if (isMusicEnabled) {
        bgMusic.play().catch(error => {
            console.log('Background music failed to play:', error);
        });
    } else {
        bgMusic.pause();
    }
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature, .game-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

function startPageAnimations() {
    // Add entrance animations to elements
    document.querySelectorAll('.hero-text > *').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Start floating animations
    document.querySelectorAll('.floating-element').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });
}

// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Sound toggle
    soundToggle.addEventListener('click', toggleSound);
    
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        playSound('click');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            playSound('click');
        });
    });
    
    // Button hover sounds
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => playSound('hover'));
        btn.addEventListener('click', () => playSound('click'));
    });
    
    // Download launcher functionality
    const downloadButtons = document.querySelectorAll('.btn-download, .btn-download-small');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showDownloadModal();
            playSound('click');
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Parallax effect
    window.addEventListener('scroll', handleParallax);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Parallax effect
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element, .pattern-element');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get('name') || 'Anonymous';
    const email = formData.get('email') || 'No email';
    const message = formData.get('message') || 'No message';
    
    // Show success message
    showNotification('Tin nhắn đã được gửi thành công!', 'success');
    
    // Reset form
    e.target.reset();
    
    playSound('click');
}

// Download Modal
function showDownloadModal() {
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎮 Tải AntChill Launcher</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="download-info">
                    <div class="system-requirements">
                        <h4>📋 Yêu cầu hệ thống:</h4>
                        <ul>
                            <li>Windows 10/11 (64-bit)</li>
                            <li>RAM: 4GB trở lên</li>
                            <li>Dung lượng: 500MB trống</li>
                            <li>Kết nối internet ổn định</li>
                        </ul>
                    </div>
                    <div class="download-options">
                        <h4>💾 Tải xuống:</h4>
                        <div class="download-links">
                            <a href="#" class="download-link primary" id="downloadWindows">
                                <i class="fab fa-windows"></i>
                                Windows 64-bit
                                <span class="file-size">v1.0.0 (45.2 MB)</span>
                            </a>
                            <a href="#" class="download-link secondary" id="downloadZip">
                                <i class="fas fa-file-archive"></i>
                                Portable ZIP
                                <span class="file-size">v1.0.0 (42.8 MB)</span>
                            </a>
                        </div>
                    </div>
                    <div class="download-steps">
                        <h4>🚀 Hướng dẫn cài đặt:</h4>
                        <ol>
                            <li>Tải file .exe về máy</li>
                            <li>Chạy file với quyền Administrator</li>
                            <li>Làm theo hướng dẫn cài đặt</li>
                            <li>Khởi động launcher và đăng nhập</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeDownloadModal()">Đóng</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const downloadLinks = modal.querySelectorAll('.download-link');
    
    closeBtn.addEventListener('click', closeDownloadModal);
    downloadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filename = link.textContent.trim();
            startDownload(filename, '#');
        });
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDownloadModal();
        }
    });
    
    // Add modal styles
    addModalStyles();
}

function closeDownloadModal() {
    const modal = document.querySelector('.download-modal');
    if (modal) {
        modal.remove();
    }
}

function startDownload(filename, url) {
    // Simulate download
    showNotification(`Đang tải ${filename}...`, 'info');
    
    setTimeout(() => {
        showNotification(`${filename} đã được tải xuống!`, 'success');
        
        // Create temporary download link
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }, 2000);
}

function addModalStyles() {
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .download-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: var(--white);
                border-radius: 24px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
                animation: slideInUp 0.3s ease;
                border: 1px solid var(--border-color);
            }
            
            .modal-header {
                background: var(--gradient-primary);
                color: var(--white);
                padding: 1.5rem 2rem;
                border-radius: 24px 24px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: var(--white);
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .download-links {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .download-link {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
                border-radius: 16px;
                text-decoration: none;
                color: var(--white);
                font-weight: 600;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                box-shadow: var(--shadow-primary);
            }
            
            .download-link.primary {
                background: var(--gradient-primary);
            }
            
            .download-link.secondary {
                background: var(--gradient-secondary);
            }
            
            .download-link:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    addNotificationStyles();
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--white);
                border-radius: 12px;
                box-shadow: var(--shadow-lg);
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                border: 1px solid var(--border-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
            }
            
            .notification-message {
                color: var(--text-dark);
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-muted);
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: var(--bg-light);
                color: var(--text-dark);
            }
            
            .notification-success {
                border-left: 4px solid var(--accent-color);
            }
            
            .notification-info {
                border-left: 4px solid var(--primary-color);
            }
            
            .notification.fade-out {
                animation: slideOutRight 0.3s ease forwards;
            }
            
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + T: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Ctrl/Cmd + M: Toggle sound
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleSound();
    }
    
    // Ctrl/Cmd + B: Toggle music
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleMusic();
    }
    
    // Escape: Close modal
    if (e.key === 'Escape') {
        const modal = document.querySelector('.download-modal');
        if (modal) {
            closeDownloadModal();
        }
    }
}

// Performance optimization
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update any performance-critical animations here
    ticking = false;
}

// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(handleNavbarScroll, 16));
window.addEventListener('scroll', throttle(handleParallax, 16));

// Initialize when page is fully loaded
window.addEventListener('load', () => {
    // Add any post-load initialization here
    console.log('AntChill website loaded successfully! 🎮');
});
