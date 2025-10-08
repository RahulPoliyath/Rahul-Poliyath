// Futuristic Portfolio JavaScript

class FuturisticPortfolio {
    constructor() {
        this.initializeParticles();
        this.initializeThemeToggle();
        this.initializeScrollAnimations();
        this.initializeSkillBars();
        this.initializeContactForm();
        this.initializeBackToTop();
        this.initializeSmoothScroll();
        // Initialize typing animation after a short delay to ensure DOM is ready
        setTimeout(() => this.initializeTypingAnimation(), 500);
    }

    // Initialize Particles.js background
    initializeParticles() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#00ffc6', '#ba4aff', '#3b82f6']
                },
                shape: {
                    type: ['circle', 'triangle', 'edge'],
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00ffc6',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }

    // Typing animation for hero name
    initializeTypingAnimation() {
        const nameElement = document.getElementById('typing-name');
        if (!nameElement) return;

        const name = 'Alex Thompson';
        let i = 0;
        
        // Clear any existing content
        nameElement.innerHTML = '';

        const typeWriter = () => {
            if (i < name.length) {
                nameElement.innerHTML += name.charAt(i);
                i++;
                setTimeout(typeWriter, 150);
            } else {
                // Add blinking cursor after completion
                setTimeout(() => {
                    nameElement.innerHTML += '<span class="cursor">|</span>';
                    
                    // Add CSS for blinking cursor if not already added
                    if (!document.querySelector('#cursor-style')) {
                        const style = document.createElement('style');
                        style.id = 'cursor-style';
                        style.textContent = `
                            .cursor {
                                animation: blink 1s infinite;
                                color: var(--accent-primary);
                            }
                            @keyframes blink {
                                0%, 50% { opacity: 1; }
                                51%, 100% { opacity: 0; }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }, 500);
            }
        };

        // Start typing animation immediately
        typeWriter();
    }

    // Theme toggle functionality
    initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-switch');
        const body = document.body;

        // Check for saved theme preference
        const currentTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'light') {
            themeToggle.checked = true;
        }

        // Theme toggle event listener
        themeToggle.addEventListener('change', () => {
            const theme = themeToggle.checked ? 'light' : 'dark';
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update particles color based on theme
            this.updateParticlesTheme(theme);
        });
    }

    // Update particles theme
    updateParticlesTheme(theme) {
        if (window.pJSDom && window.pJSDom[0]) {
            const particles = window.pJSDom[0].pJS.particles;
            const colors = theme === 'light' 
                ? ['#14b8a6', '#8b5cf6', '#3b82f6']
                : ['#00ffc6', '#ba4aff', '#3b82f6'];
            
            particles.array.forEach(particle => {
                particle.color.value = colors[Math.floor(Math.random() * colors.length)];
            });
        }
    }

    // Scroll animations using Intersection Observer
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Trigger skill bar animations
                    if (entry.target.classList.contains('skills-grid')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);

        // Observe sections for fade-in animations
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });

        // Observe individual elements
        const elements = document.querySelectorAll('.project-card, .skill-item, .contact-form-wrapper');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // Initialize skill bars
    initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = '0%';
        });
    }

    // Animate skill bars
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 200);
        });
    }

    // Contact form validation and handling
    initializeContactForm() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('.form-input');
        
        // Add floating label functionality
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        // Form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (this.validateForm(data)) {
                this.submitForm(data);
            }
        });
    }

    // Form validation
    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject || data.subject.trim().length < 3) {
            errors.push('Subject must be at least 3 characters long');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            this.showFormErrors(errors);
            return false;
        }
        
        return true;
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form errors
    showFormErrors(errors) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: rgba(255, 84, 89, 0.1);
            border: 1px solid rgba(255, 84, 89, 0.3);
            color: #ff5459;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        `;
        
        errorDiv.innerHTML = `
            <strong>Please fix the following errors:</strong>
            <ul style="margin: 0.5rem 0 0 1.5rem;">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        const form = document.getElementById('contactForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Submit form (demo functionality)
    submitForm(data) {
        const submitButton = document.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Remove focused classes
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('focused'));
            
        }, 2000);
    }

    // Show success message
    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = `
            background: rgba(0, 255, 198, 0.1);
            border: 1px solid rgba(0, 255, 198, 0.3);
            color: #00ffc6;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
        `;
        
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Message sent successfully!</strong>
            <p style="margin: 0.5rem 0 0 0;">Thank you for reaching out. I'll get back to you soon!</p>
        `;
        
        const form = document.getElementById('contactForm');
        form.insertBefore(successDiv, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    // Back to top button functionality
    initializeBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for navigation links
    initializeSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Also handle CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            if (button.getAttribute('href').startsWith('#')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const targetId = button.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const navHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = targetSection.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        });
    }
}

// Additional animations and effects
class AnimationController {
    constructor() {
        this.initializeParallax();
        this.initializeHoverEffects();
        this.initializeTextAnimations();
    }

    // Parallax scrolling effect
    initializeParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-content');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Enhanced hover effects
    initializeHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add glow effect to social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.boxShadow = '0 0 30px var(--glow-primary)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.boxShadow = 'var(--glass-shadow)';
            });
        });
    }

    // Text reveal animations
    initializeTextAnimations() {
        const textElements = document.querySelectorAll('.bio-text, .contact-info p');
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            });
        }, { threshold: 0.3 });
        
        textElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            textObserver.observe(element);
        });
    }
}

// Utility functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Performance optimizations
const optimizedScroll = Utils.throttle(() => {
    // Throttled scroll handler for better performance
    const scrolled = window.pageYOffset;
    
    // Update navbar opacity based on scroll
    const navbar = document.querySelector('.navbar');
    if (scrolled > 100) {
        navbar.style.background = 'rgba(30, 41, 59, 0.9)';
    } else {
        navbar.style.background = 'var(--bg-glass)';
    }
}, 16);

window.addEventListener('scroll', optimizedScroll);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for particles.js to load
    setTimeout(() => {
        new FuturisticPortfolio();
        new AnimationController();
    }, 100);
});

// Handle window resize for responsive particles
window.addEventListener('resize', Utils.debounce(() => {
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}, 250));

// Add loading animation
window.addEventListener('load', () => {
    // Remove any loading overlay if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Trigger initial animations
    document.body.classList.add('loaded');
});
