// IIFE for encapsulation
(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {

        // reuse existing top-level variables if present, otherwise query safely
        const H = (typeof hamburger !== 'undefined' && hamburger) ? hamburger : document.getElementById('hamburger');
        const NAV = (typeof navMenu !== 'undefined' && navMenu) ? navMenu : document.getElementById('nav-menu');
        const NAVBAR = (typeof navbar !== 'undefined' && navbar) ? navbar : document.getElementById('navbar');
        const LINKS = (typeof navLinks !== 'undefined' && navLinks.length) ? navLinks : document.querySelectorAll('.nav-link');
        const BACK = (typeof backToTop !== 'undefined' && backToTop) ? backToTop : document.getElementById('backToTop');
        const OVERLAY = document.getElementById('nav-overlay');

        // Hamburger / mobile nav behavior (robust + accessible)
        if (H && NAV) {
        console.log('Mobile nav init:', { hasHamburger: !!H, hasNav: !!NAV, overlay: !!OVERLAY });
            H.setAttribute('role', 'button');
            H.setAttribute('aria-controls', NAV.id || 'nav-menu');
            H.setAttribute('aria-expanded', NAV.classList.contains('active') ? 'true' : 'false');

            function closeMenu() {
                console.log('closeMenu called');
                NAV.classList.remove('active');
                H.classList.remove('active');
                document.body.classList.remove('menu-open');
                H.setAttribute('aria-expanded', 'false');
                if (OVERLAY) OVERLAY.classList.remove('active');
            }

            function openMenu() {
                console.log('openMenu called');
                NAV.classList.add('active');
                H.classList.add('active');
                document.body.classList.add('menu-open');
                H.setAttribute('aria-expanded', 'true');
                if (OVERLAY) OVERLAY.classList.add('active');
            }

            H.addEventListener('click', () => {
                console.log('hamburger clicked');
                if (NAV.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            // Keyboard accessibility for hamburger
            H.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (NAV.classList.contains('active')) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                }
            });

            LINKS.forEach(link => {
                link.addEventListener('click', () => {
                    closeMenu();
                });
            });

            // close on outside click (including overlay)
            document.addEventListener('click', (e) => {
                if (NAV.classList.contains('active') && !NAV.contains(e.target) && !H.contains(e.target)) {
                    closeMenu();
                }
            });
            if (OVERLAY) {
                OVERLAY.addEventListener('click', closeMenu);
            }

            // close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && NAV.classList.contains('active')) {
                    closeMenu();
                }
            });
        }

        // Scroll effects + reveal-on-scroll (debounced)
        const animatedEls = document.querySelectorAll('[data-animation]');
        const debounce = (fn, ms = 12) => {
            let t;
            return function () {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, arguments), ms);
            };
        };

        const onScroll = () => {
            const y = window.scrollY || window.pageYOffset;
            if (NAVBAR) NAVBAR.classList.toggle('scrolled', y > 50);
            if (BACK) BACK.classList.toggle('visible', y > 400);

            animatedEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.85) el.classList.add('animated');
            });
        };

        window.addEventListener('scroll', debounce(onScroll, 20));
        onScroll(); // initial
    });

    // Navbar functionality
    function initNavbar() {
        // Change navbar on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Show or hide back-to-top button
            if (window.scrollY > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
            
            // Highlight active section
            highlightNavLink();
        });
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                    
                    // Smooth scroll to target
                    smoothScrollTo(target);
                }
            });
        });
        
        // Back to top button
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile menu functionality
    function initMobileMenu() {
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (
                navMenu.classList.contains('active') && 
                !e.target.closest('#nav-menu') && 
                !e.target.closest('#hamburger')
            ) {
                toggleMobileMenu();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // use the same class as CSS to prevent background scroll
        document.body.classList.toggle('menu-open');
        // toggle overlay if present
        const overlay = document.getElementById('nav-overlay');
        if (overlay) overlay.classList.toggle('active');
    }

    // Highlight active nav link
    function highlightNavLink() {
        let scrollPosition = window.scrollY;
        
        // Get all sections
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
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
        // Intersection Observer for scroll animations
        const animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animation = entry.target.getAttribute('data-animation');
                        if (animation) {
                            entry.target.classList.add(animation);
                            animationObserver.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        // Observe elements with animation data attribute
        document.querySelectorAll('[data-animation]').forEach(element => {
            animationObserver.observe(element);
        });
    }

    // Initialize animations
    function initAnimations() {
        // Add animation classes based on data attribute
        document.querySelectorAll('[data-animation="fade-in-left"]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        document.querySelectorAll('[data-animation="fade-in-right"]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        document.querySelectorAll('[data-animation="fade-in-up"]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // Apply animations after a short delay
        setTimeout(() => {
            document.querySelectorAll('[data-animation="fade-in-left"]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            });
            
            document.querySelectorAll('[data-animation="fade-in-right"]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            });
            
            document.querySelectorAll('[data-animation="fade-in-up"]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 100);
    }

    // Counter animation
    function initCounterAnimation() {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const count = parseInt(element.getAttribute('data-count'));
                        
                        // Only animate if not already animated
                        if (!element.classList.contains('counted')) {
                            animateCounter(element, count);
                            element.classList.add('counted');
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        // Observe counter elements
        document.querySelectorAll('[data-animation="counter"]').forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Animate counter
    function animateCounter(element, target) {
        const countElement = element.querySelector('.stat-count');
        let count = 0;
        const duration = 2000; // 2 seconds
        const interval = 50; // update every 50ms
        const increment = Math.ceil(target / (duration / interval));
        
        const counter = setInterval(() => {
            count += increment;
            
            if (count >= target) {
                countElement.textContent = target;
                clearInterval(counter);
            } else {
                countElement.textContent = count;
            }
        }, interval);
    }

    // Form handling
    function initFormHandling() {
        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simple validation
                const name = contactForm.querySelector('#name').value;
                const email = contactForm.querySelector('#email').value;
                const interest = contactForm.querySelector('#interest').value;
                const message = contactForm.querySelector('#message').value;
                
                if (validateForm(name, email, interest, message)) {
                    // Show loading state
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission (replace with actual API call)
                    setTimeout(() => {
                        showNotification('Thank you! Your message has been sent successfully.', 'success');
                        contactForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                }
            });
        }
        
        // Newsletter form
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                if (validateEmail(email)) {
                    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Subscribing...';
                    submitBtn.disabled = true;
                    
                    // Simulate subscription (replace with actual API call)
                    setTimeout(() => {
                        showNotification('Thank you for subscribing to our newsletter!', 'success');
                        newsletterForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                } else {
                    showNotification('Please enter a valid email address.', 'error');
                }
            });
        }
    }

    // Form validation
    function validateForm(name, email, interest, message) {
        let isValid = true;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Name validation
        if (name.trim() === '') {
            isValid = false;
            showNotification('Name is required.', 'error');
        }
        
        // Email validation
        if (email.trim() === '') {
            isValid = false;
            showNotification('Email is required.', 'error');
        } else if (!emailPattern.test(email)) {
            isValid = false;
            showNotification('Please enter a valid email address.', 'error');
        }
        
        // Interest validation
        if (interest.trim() === '') {
            isValid = false;
            showNotification('Interest is required.', 'error');
        }
        
        // Message validation
        if (message.trim() === '') {
            isValid = false;
            showNotification('Message is required.', 'error');
        }
        
        return isValid;
    }

    // Email validation
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Gallery filter
    function initGalleryFilter() {
        if (filterButtons.length && galleryItems.length) {
            // Filter items on button click
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filterValue = this.getAttribute('data-filter');
                    
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to the clicked button
                    this.classList.add('active');
                    
                    // Filter gallery items
                    galleryItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');
                        
                        if (filterValue === 'all' || itemCategory.includes(filterValue)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                });
            });
        }
    }

    // Smooth scroll with delegation
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Mobile nav toggle — robust and accessible
    (function () {
        'use strict';

        document.addEventListener('DOMContentLoaded', () => {
            const body = document.body;
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            const navOverlay = document.getElementById('nav-overlay');

            if (!hamburger || !navMenu) {
                console.warn('Navigation elements missing: hamburger or nav-menu not found.');
                return;
            }

            function openMenu() {
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
                navMenu.classList.add('active');
                navMenu.setAttribute('aria-hidden', 'false');
                if (navOverlay) navOverlay.classList.add('active');
                body.classList.add('menu-open');
            }

            function closeMenu() {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                navMenu.setAttribute('aria-hidden', 'true');
                if (navOverlay) navOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            }

            hamburger.addEventListener('click', () => {
                const expanded = hamburger.getAttribute('aria-expanded') === 'true';
                if (expanded) closeMenu(); else openMenu();
            });

            // Close when overlay clicked
            if (navOverlay) {
                navOverlay.addEventListener('click', closeMenu);
            }

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeMenu();
            });

            // Close when a nav link is clicked (use delegation)
            document.addEventListener('click', (e) => {
                if (e.target.closest('.nav-menu') && e.target.matches('.nav-link')) {
                    closeMenu();
                }
            });
        });
    })();

    // Initialize all components
    function init() {
        try {
            initNavbar();
            initMobileMenu();
            initScrollEffects();
            initAnimations();
            initCounterAnimation();
            initFormHandling();
            initGalleryFilter();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    init(); // Start initialization
})();