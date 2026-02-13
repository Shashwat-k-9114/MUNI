// ========== MUNI EDUCARE - MASTER SCRIPT 3D ULTIMATE ==========
// INSTANT PAGE TRANSITIONS + 3D TILT + CRYSTAL CLEAR CARDS

// ========== PRELOAD ALL PAGES FOR INSTANT NAVIGATION ==========
function preloadAllPages() {
    const pagesToPreload = [
        'index.html',
        'about.html', 
        'philosophy.html',
        'model.html',
        'vision-mission.html',
        'leadership.html',
        'faq.html',
        'visit.html'
    ];
    
    pagesToPreload.forEach(page => {
        const linkPrefetch = document.createElement('link');
        linkPrefetch.rel = 'prefetch';
        linkPrefetch.href = page;
        document.head.appendChild(linkPrefetch);
        
        const linkPreload = document.createElement('link');
        linkPreload.rel = 'preload';
        linkPreload.as = 'document';
        linkPreload.href = page;
        document.head.appendChild(linkPreload);
    });
    console.log('🚀 All pages preloaded for instant navigation');
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
// Detect low-performance devices
const isLowPerfDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768
    || window.navigator.hardwareConcurrency <= 4; // Less than 4 CPU cores

if (isLowPerfDevice) {
    // Disable heavy animations on low-end devices
    document.documentElement.classList.add('low-performance');
    
    // Reduce particle count in background
    window.particleCount = 10; // Will be used in createParticleBackground
}

// ========== PRELOAD SINGLE PAGE ON HOVER ==========
function preloadPage(url) {
    if (url && !url.startsWith('#') && !url.startsWith('http') && !url.startsWith('javascript')) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }
}

// ========== SUBTLE PARTICLE BACKGROUND ==========
function createParticleBackground() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-background';
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
        particleContainer.appendChild(particle);
    }
    document.body.appendChild(particleContainer);
}

// ========== 3D TILT EFFECT - CRYSTAL CLEAR ==========
function init3DTilt() {
    const tiltElements = document.querySelectorAll(
        '.impact-card, .philosophy-card, .model-card, .team-card, .recognition-card, .leader-detail-card, .contact-card'
    );
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xCenter = rect.width / 2;
            const yCenter = rect.height / 2;
            
            const rotateX = (y - yCenter) / 20;
            const rotateY = (xCenter - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            this.style.boxShadow = `0 25px 50px rgba(46, 204, 113, 0.2)`;
            this.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            this.style.boxShadow = '';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });
}

// ========== DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function() {
    
    // Preload all pages
    preloadAllPages();
    
    // Create subtle particle background
    createParticleBackground();
    
    // ========== INSTANT PAGE TRANSITIONS ==========
    document.body.classList.add('page-transition-fade');
    setTimeout(() => {
        document.body.classList.remove(
            'page-transition-left', 'page-transition-right', 
            'page-transition-top', 'page-transition-bottom',
            'page-transition-fade', 'page-transition-scale'
        );
    }, 300);
    
    // ========== NAVIGATION LINKS ==========
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta, .footer-nav a, .btn');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript')) {
            link.addEventListener('mouseenter', function() {
                preloadPage(href);
            });
        }
        
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript') && !href.startsWith('tel') && !href.startsWith('mailto')) {
                e.preventDefault();
                
                document.body.style.opacity = '0.7';
                document.body.style.transform = 'scale(0.98)';
                document.body.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 150);
            }
        });
    });
    
// ========== OPTIMIZED SCROLL HANDLER ==========
const navbar = document.querySelector('.navbar');

function updateNavbarBlur() {
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.cssText = `
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px) saturate(200%);
            -webkit-backdrop-filter: blur(20px) saturate(200%);
            box-shadow: 0 20px 50px rgba(26, 43, 60, 0.15);
            transform: translateX(-50%) scale(0.98) translateY(-2px);
            transition: all 0.3s ease;
        `;
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.cssText = `
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            box-shadow: 0 15px 40px rgba(26, 43, 60, 0.05);
            transform: translateX(-50%) scale(1) translateY(0);
            transition: all 0.3s ease;
        `;
    }
}

if (navbar) {
    updateNavbarBlur();
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(updateNavbarBlur);
    }, { passive: true }); // Add passive for better scroll performance
}
    
    // ========== INITIALIZE 3D TILT ==========
    init3DTilt();
    
    // ========== AOS INIT ==========
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
            delay: 0,
            throttle: 50,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
        });
    }
    
// ========== OPTIMIZED CUSTOM CURSOR ==========
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Disable on mobile/touch devices
if (cursorDot && cursorOutline && !('ontouchstart' in window)) {
    // Use transform3d for GPU acceleration
    document.addEventListener('mousemove', function(e) {
        // Use requestAnimationFrame for smoothness
        requestAnimationFrame(() => {
            cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            cursorOutline.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        });
    }, { passive: true });
    
    document.addEventListener('mousedown', function() {
        cursorDot.style.transform += ' scale(0.8)';
        cursorOutline.style.transform += ' scale(1.5)';
    }, { passive: true });
    
    document.addEventListener('mouseup', function() {
        cursorDot.style.transform = cursorDot.style.transform.replace(' scale(0.8)', '');
        cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', '');
    }, { passive: true });
}
    
    // ========== MOBILE MENU ==========
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // ========== ANIMATED COUNTERS ==========
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
        }, 30);
    }
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    const suffix = text.includes('K') ? 'K+' : text.includes('+') ? '+' : '';
                    
                    if (!isNaN(number) && number > 0) {
                        stat.textContent = '0' + (suffix || '');
                        animateCounter(stat, number, suffix);
                    }
                });
                
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
    
    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // ========== CTA BUTTON ==========
    const ctaBtn = document.getElementById('contactTrigger');
    const formHint = document.getElementById('formHint');
    
    if (ctaBtn && formHint) {
        formHint.style.display = 'none';
        
        ctaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { 
                this.style.transform = 'scale(1)'; 
            }, 200);
            
            if (formHint.style.display === 'none') {
                formHint.style.display = 'block';
                formHint.style.animation = 'fadeInUp 0.5s ease';
                
                setTimeout(() => {
                    formHint.style.animation = 'fadeOutDown 0.5s ease';
                    setTimeout(() => { formHint.style.display = 'none'; }, 400);
                }, 5000);
            }
        });
    }
    
    // ========== PAGE ENTRANCE ==========
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    
    if (pageName.includes('index') || pageName === '') {
        document.body.classList.add('page-transition-fade');
    } else if (pageName.includes('about')) {
        document.body.classList.add('page-transition-left');
    } else if (pageName.includes('philosophy')) {
        document.body.classList.add('page-transition-right');
    } else if (pageName.includes('model')) {
        document.body.classList.add('page-transition-bottom');
    } else if (pageName.includes('vision')) {
        document.body.classList.add('page-transition-top');
    } else if (pageName.includes('leadership')) {
        document.body.classList.add('page-transition-scale');
    } else if (pageName.includes('faq')) {
        document.body.classList.add('page-transition-fade');
    } else if (pageName.includes('visit')) {
        document.body.classList.add('page-transition-scale');
    }
    
    setTimeout(() => {
        document.body.classList.remove(
            'page-transition-left', 'page-transition-right', 
            'page-transition-top', 'page-transition-bottom',
            'page-transition-fade', 'page-transition-scale'
        );
    }, 300);
    
    console.log('🚀 Muni Educare - 3D Ultimate Edition Loaded');
});

// ========== KONAMI CODE EASTER EGG ==========
// Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    // Check if key matches konami code
    const requiredKey = konamiCode[konamiIndex];
    
    if (e.key === requiredKey || (requiredKey === 'b' && e.key === 'b') || (requiredKey === 'a' && e.key === 'a')) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            // Activate easter egg
            activateShashwatReveal();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateShashwatReveal() {
    // Create explosion of colors
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: hsl(${Math.random() * 360}, 100%, 50%);
                border-radius: 50%;
                z-index: 10000;
                animation: explode 1s ease-out forwards;
                pointer-events: none;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 30);
    }
    
    // Create the credit text
    const credit = document.createElement('div');
    credit.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #1A2B3C, #000);
        padding: 40px 80px;
        border-radius: 20px;
        z-index: 10001;
        color: white;
        text-align: center;
        border: 2px solid #2ECC71;
        box-shadow: 0 0 100px #2ECC71;
        animation: creditPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        pointer-events: none;
    `;
    credit.innerHTML = `
        <h2 style="color: #2ECC71; font-size: 3rem; margin-bottom: 10px;">SHASHWAT KASHYAP</h2>
        <p style="font-size: 1.2rem; letter-spacing: 4px;">⚡ THE BRAIN BEHIND THIS ⚡</p>
        <p style="margin-top: 20px; color: #888;">Three.js • WebGL • UI/UX • Full-Stack</p>
    `;
    document.body.appendChild(credit);
    
    setTimeout(() => credit.remove(), 3000);
    
    // Add the CSS animation if not exists
    if (!document.querySelector('#easter-egg-styles')) {
        const style = document.createElement('style');
        style.id = 'easter-egg-styles';
        style.textContent = `
            @keyframes explode {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(20); opacity: 0; }
            }
            @keyframes creditPop {
                0% { transform: translate(-50%, -50%) scale(0); }
                70% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}
