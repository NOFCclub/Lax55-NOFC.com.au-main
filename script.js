// IIFE for encapsulation
(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const newsletterForm = document.getElementById('newsletterForm');
    const navOverlay = document.getElementById('nav-overlay');

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavbar();
        initMobileMenu();
        initScrollEffects();
        initAnimations();
        initNewsletterForm();
    }

    // Navbar functionality
    function initNavbar() {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            // Add scrolled class to navbar
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Show/hide back to top button
            if (scrollY > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
            
            // Highlight active section
            highlightNavLink();
        });
        
        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        if (navMenu.classList.contains('active')) {
                            closeMenu();
                        }
                        smoothScrollTo(target);
                    }
                }
            });
        });
        
        // Back to top button
        if (backToTop) {
            backToTop.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Mobile menu functionality
    function initMobileMenu() {
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', toggleMenu);
        
        // Close on overlay click
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function toggleMenu() {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
        if (navOverlay) navOverlay.classList.add('active');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        if (navOverlay) navOverlay.classList.remove('active');
    }

    // Highlight active nav link
    function highlightNavLink() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // Smooth scroll function
    function smoothScrollTo(target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Animation on scroll
    function initScrollEffects() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animation = entry.target.getAttribute('data-animation');
                        if (animation) {
                            entry.target.classList.add('animated', animation);
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        document.querySelectorAll('[data-animation]').forEach(element => {
            observer.observe(element);
        });
    }

    // Initialize animations
    function initAnimations() {
        const animationTypes = ['fade-in-left', 'fade-in-right', 'fade-in-up'];
        
        animationTypes.forEach(type => {
            document.querySelectorAll(`[data-animation="${type}"]`).forEach(el => {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                if (type === 'fade-in-left') {
                    el.style.transform = 'translateX(-30px)';
                } else if (type === 'fade-in-right') {
                    el.style.transform = 'translateX(30px)';
                } else if (type === 'fade-in-up') {
                    el.style.transform = 'translateY(30px)';
                }
            });
        });
        
        setTimeout(() => {
            document.querySelectorAll('[data-animation]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translate(0)';
            });
        }, 100);
    }

    // Newsletter form
    function initNewsletterForm() {
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                if (validateEmail(email)) {
                    showNotification('Thank you for subscribing!', 'success');
                    this.reset();
                } else {
                    showNotification('Please enter a valid email', 'error');
                }
            });
        }
    }

    // Email validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    /* Sponsors Section - Updated for vertical layout with rounded boxes */
    const sponsorsSection = document.createElement('section');
    sponsorsSection.className = 'sponsors';
    sponsorsSection.innerHTML = `
        <div class="sponsors-grid">
            <a href="#" class="sponsor-item" data-animation="fade-in-up">
                <img src="sponsor1.png" alt="Sponsor 1">
            </a>
            <a href="#" class="sponsor-item" data-animation="fade-in-up">
                <img src="sponsor2.png" alt="Sponsor 2">
            </a>
            <a href="#" class="sponsor-item" data-animation="fade-in-up">
                <img src="sponsor3.png" alt="Sponsor 3">
            </a>
        </div>
    `;

    document.body.appendChild(sponsorsSection);

    const style = document.createElement('style');
    style.textContent = `
        .sponsors {
            padding: 80px 0;
            background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
        }

        .sponsors-grid {
            display: flex;
            flex-direction: column;
            gap: 30px;
            margin-top: 60px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .sponsor-item {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px;
            background: white;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            min-height: 150px;
        }

        .sponsor-item:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .sponsor-item img {
            max-width: 100%;
            height: auto;
            max-height: 120px;
            object-fit: contain;
        }

        @media (max-width: 768px) {
            .sponsors {
                padding: 60px 0;
            }

            .sponsors-grid {
                gap: 20px;
                max-width: 100%;
            }

            .sponsor-item {
                padding: 30px;
                border-radius: 40px;
                min-height: 120px;
            }

            .sponsor-item img {
                max-height: 100px;
            }
        }

        @media (max-width: 576px) {
            .sponsor-item {
                padding: 25px;
                border-radius: 30px;
            }

            .sponsor-item img {
                max-height: 80px;
            }
        }
    `;

    document.head.appendChild(style);

})();