/**
 * AntChill Studio - Enhanced JavaScript
 * Optimized with particle effects and smooth interactions
 */

// Initialize all modules on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initScrollEffects();
    initCounterAnimation();
    initMagneticButtons();
    initFormValidation();
});

/**
 * Particle System - Lightweight floating particles
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = window.innerWidth > 768 ? 30 : 15;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    const hue = Math.random() > 0.5 ? 270 : 190; // Purple or cyan

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        background: hsl(${hue}, 80%, 60%);
    `;

    container.appendChild(particle);
}

/**
 * Navigation System
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect with throttle
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll(navbar, sections, navLinks);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile menu
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');

            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

function handleScroll(navbar, sections, navLinks) {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Active section
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}

/**
 * Scroll Effects with Intersection Observer
 */
function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Elements to animate
    const elements = document.querySelectorAll(
        '.about-card, .game-card, .contact-card, .section-header, .download-info, .download-preview'
    );

    elements.forEach(el => {
        el.classList.add('scroll-fade');
        observer.observe(el);
    });
}

/**
 * Counter Animation for Stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 1000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(update);
}

/**
 * Magnetic Button Effect
 */
function initMagneticButtons() {
    if (window.innerWidth < 768) return; // Skip on mobile

    const buttons = document.querySelectorAll('.magnetic');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));

        // Validation
        if (!data.name?.trim() || !data.email?.trim() || !data.subject || !data.message?.trim()) {
            showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showNotification('Email không hợp lệ!', 'error');
            return;
        }

        // Success
        showNotification('Gửi tin nhắn thành công! Cảm ơn bạn đã liên hệ.', 'success');
        form.reset();
    });
}

function showNotification(message, type = 'info') {
    // Remove existing
    document.querySelector('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button aria-label="Close notification">&times;</button>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'success'
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease'
    });

    const closeBtn = notification.querySelector('button');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        lineHeight: '1'
    });

    closeBtn.addEventListener('click', () => notification.remove());
    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Inject animation styles once
const styles = document.createElement('style');
styles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styles);
