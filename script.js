// ===================================
// JENDA MOBILITY - PREMIUM FEATURES 2025/2026
// World-Class Interactive Experience
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // ===== LOADING SCREEN =====
    const loadingScreen = document.getElementById('loadingScreen');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    });

    // ===== SCROLL PROGRESS INDICATOR =====
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', throttle(updateScrollProgress, 10));

    // ===== CUSTOM CURSOR =====
    const customCursor = document.getElementById('customCursor');
    const customCursorDot = document.getElementById('customCursorDot');

    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
        customCursorDot.style.left = `${e.clientX}px`;
        customCursorDot.style.top = `${e.clientY}px`;
    });

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .faq-question');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => customCursor.classList.add('active'));
        el.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
    });

    // ===== MOBILE MENU TOGGLE =====
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    mobileToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== NAVBAR SCROLL EFFECT & HIDE/SHOW =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleNavbarScroll = throttle(() => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, 100);

    window.addEventListener('scroll', handleNavbarScroll);

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== SMOOTH SCROLL & ACTIVE LINK =====
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== TYPED TEXT EFFECT =====
    const typedElement = document.getElementById('typedText');
    const phrases = ['Elevate Your ', 'Transform Your ', 'Amplify Your ', 'Supercharge Your '];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    if (typedElement) {
        setTimeout(typeText, 1000);
    }

    // ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // ===== ACTIVE SECTION HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');

    const updateActiveSection = throttle(() => {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', updateActiveSection);

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 150;

    const runCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / counterSpeed;
        let current = 0;

        const updateCounter = () => {
            current += increment;

            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                runCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ===== MAGNETIC BUTTON EFFECT =====
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', function (e) {
            if (window.innerWidth < 768) return;

            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.15;
            const moveY = y * 0.15;

            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        button.addEventListener('mouseleave', function () {
            button.style.transform = '';
        });
    });

    // ===== PORTFOLIO FILTER =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===== TESTIMONIALS CAROUSEL =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentTestimonial = 0;

    // Create dots
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    prevBtn.addEventListener('click', () => {
        currentTestimonial = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
        showTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    });

    // Auto-rotate testimonials
    let testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Pause on hover
    const testimonialSection = document.querySelector('.testimonials-carousel');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
        testimonialSection.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
                showTestimonial(currentTestimonial);
            }, 5000);
        });
    }

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    function showToast(message, duration = 3000) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    contactForm.addEventListener('submit', function (e) {
        // e.preventDefault(); // Uncomment if handling via AJAX below, otherwise let default form action work for Formspree redirect

        // For AJAX submission (keep on same page):
        e.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        const formData = new FormData(this);

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Replace 'YOUR_FORMSPREE_ID' with your actual Formspree form ID
        fetch('https://formspree.io/f/mldqplvy', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #84CC16 0%, #22C55E 100%)';
                showToast('Thank you! We\'ll get back to you shortly.');
                this.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        showToast(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        showToast('Oops! There was a problem submitting your form');
                    }
                    submitBtn.innerHTML = originalHTML;
                })
            }
        }).catch(error => {
            showToast('Oops! There was a problem submitting your form');
            submitBtn.innerHTML = originalHTML;
        }).finally(() => {
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    });

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');

    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = this.querySelector('input[type="email"]').value;
        console.log('Newsletter subscription:', email);

        showToast('Successfully subscribed to our newsletter!');
        this.reset();
    });

    // ===== FORM VALIDATION FEEDBACK =====
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#F472B6';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function () {
            if (this.value.trim()) {
                this.style.borderColor = '#0EA5E9';
            }
        });
    });

    // ===== EMAIL VALIDATION =====
    const emailInput = document.getElementById('email');

    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#F472B6';
                showToast('Please enter a valid email address', 2000);
            } else if (this.value) {
                this.style.borderColor = '#0EA5E9';
            }
        });
    }

    // ===== SERVICE CARDS 3D TILT EFFECT =====
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            if (window.innerWidth < 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

    // ===== SCROLL INDICATOR =====
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 150) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }, 100));
    }

    // ===== LIVE ACTIVITY RANDOMIZER =====
    const liveActivity = document.getElementById('liveActivity');

    if (liveActivity) {
        function updateActivity() {
            const viewers = Math.floor(Math.random() * 20) + 15;
            liveActivity.textContent = `${viewers} people viewing this page today`;
        }

        setInterval(updateActivity, 10000);
    }

    // ===== EASTER EGG: SHAKE DETECTION (Mobile) =====
    if ('DeviceMotionEvent' in window) {
        let lastX, lastY, lastZ;
        let shakeTh = 800;

        window.addEventListener('devicemotion', (e) => {
            const acc = e.accelerationIncludingGravity;
            const x = acc.x;
            const y = acc.y;
            const z = acc.z;

            if (lastX !== undefined) {
                const deltaX = Math.abs(lastX - x);
                const deltaY = Math.abs(lastY - y);
                const deltaZ = Math.abs(lastZ - z);

                if (deltaX + deltaY + deltaZ > 30) {
                    showToast('🎉 You found the secret shake!');
                }
            }

            lastX = x;
            lastY = y;
            lastZ = z;
        }, true);
    }

    // ===== EASTER EGG: KONAMI CODE =====
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showToast('🎮 Konami Code Activated! You\'re awesome!');
                document.body.style.animation = 'rainbow 2s infinite';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // ===== PERFORMANCE OPTIMIZATION =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-base', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }

    // ===== PREVENT FOUC =====
    document.body.style.opacity = '1';

    // ===== ENHANCED CONSOLE BRANDING =====
    console.log('%c🚀 Jenda Mobility', 'background: linear-gradient(135deg, #0EA5E9, #8B5CF6); color: white; font-size: 28px; font-weight: bold; padding: 15px 30px; border-radius: 10px;');
    console.log('%c✨ Premium 10/10 Experience', 'color: #8B5CF6; font-size: 18px; font-weight: bold;');
    console.log('%c💎 Built with cutting-edge 2025 technology', 'color: #0EA5E9; font-size: 14px;');
    console.log('%c🎯 Featuring: Loading Animation • Scroll Progress • Custom Cursor • Testimonials Carousel • Portfolio Filter • FAQ Accordion • Pricing Tables • Newsletter & More!', 'color: #F472B6; font-size: 12px;');
});

// ===== UTILITY FUNCTIONS =====

function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, delay = 100) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// ===== RAINBOW ANIMATION (Easter Egg) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== PAGE LOAD PERFORMANCE =====
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%c⚡ Page loaded in ${pageLoadTime}ms`, 'color: #84CC16; font-weight: bold; font-size: 14px;');
    }
});
