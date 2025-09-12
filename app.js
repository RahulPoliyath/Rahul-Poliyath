// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.setAttribute('data-theme', theme);
        }
    }

    toggle() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, speed = 100, delay = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.delay = delay;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let timeout = this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            timeout = 500;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        if (this.menuBtn && this.navMenu) {
            this.menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.menuBtn.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.close();
                }
            });
        }
    }

    toggle() {
        this.menuBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    close() {
        this.menuBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Smooth Scrolling Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const backToTop = document.getElementById('back-to-top');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId && targetId !== '#') {
                    this.scrollTo(targetId);
                }
            });
        });

        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollTo('#home');
            });
        }

        // Show/hide back to top button
        this.handleBackToTopVisibility();
    }

    scrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    }

    handleBackToTopVisibility() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        // Initially hide the button
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
        backToTop.style.transition = 'all 0.3s ease';

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
    }
}

// Form Validation and Handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (value.length < 5) {
                    errorMessage = 'Subject must be at least 5 characters';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        this.showError(field, errorMessage, !isValid);
        return isValid;
    }

    showError(field, message, show) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.toggle('show', show);
        }
        
        field.classList.toggle('error', show);
    }

    clearError(field) {
        this.showError(field, '', false);
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;

        // Simulate form submission
        try {
            await this.simulateSubmission();
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000); // Simulate network delay
        });
    }

    showSuccessMessage() {
        this.showNotification('Message sent successfully!', 'success', 'fas fa-check-circle');
    }

    showErrorMessage() {
        this.showNotification('Failed to send message. Please try again.', 'error', 'fas fa-exclamation-triangle');
    }

    showNotification(text, type, icon) {
        const message = document.createElement('div');
        message.className = `notification ${type}`;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
            color: white;
            padding: var(--space-16) var(--space-24);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: var(--space-8);
        `;
        message.innerHTML = `
            <i class="${icon}"></i>
            <span>${text}</span>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Resume Download Handler
class ResumeDownload {
    constructor() {
        this.init();
    }

    init() {
        const downloadBtn = document.getElementById('download-resume');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        }
    }

    downloadResume() {
        // Create a simulated PDF download
        const resumeContent = this.generateResumeData();
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Rahul_Poliyath_Resume.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show download notification
        this.showDownloadNotification();
    }

    generateResumeData() {
        return `
RAHUL POLIYATH
Full Stack Developer
Email: Rahulpoliyath@gmail.com
Location: NAVI MUMBAI, MH
GitHub: https://github.com/rahulpoliyath
LinkedIn: https://linkedin.com/in/rahulpoliyath

SUMMARY
Passionate full-stack developer with 5+ years of experience building scalable web applications. 
I specialize in modern JavaScript frameworks, cloud technologies, and creating exceptional user experiences.

EXPERIENCE

Senior Full Stack Developer | TechCorp Inc. | 2022 - Present
- Lead development of enterprise web applications
- Mentor junior developers and architect scalable solutions
- Implemented microservices architecture reducing system latency by 40%

Frontend Developer | StartupXYZ | 2020 - 2022
- Developed responsive web applications using React and TypeScript
- Collaborated with design teams to implement pixel-perfect UIs
- Improved application performance by 60% through code optimization

Junior Developer | WebAgency | 2019 - 2020
- Built client websites using modern web technologies
- Learned best practices in web development and project management
- Delivered 15+ client projects on time and under budget

TECHNICAL SKILLS

Frontend Technologies:
- JavaScript (95% - Expert level)
- React (90% - Advanced)
- TypeScript (85% - Advanced)
- Vue.js (80% - Intermediate)

Backend Technologies:
- Node.js (90% - Advanced)
- Python (85% - Advanced)

Database & Cloud:
- PostgreSQL (80% - Intermediate)
- MongoDB (75% - Intermediate)
- AWS (80% - Intermediate)
- Docker (75% - Intermediate)

Tools & Others:
- Git (95% - Expert)
- REST APIs
- GraphQL
- Socket.io
- Jest/Testing

FEATURED PROJECTS

E-Commerce Platform
Technologies: React, Node.js, PostgreSQL, Stripe API
- Full-stack e-commerce solution with payment processing
- User authentication, admin dashboard, inventory management
- Deployed on AWS with CI/CD pipeline

Task Management App  
Technologies: Vue.js, Express.js, MongoDB, Socket.io
- Collaborative task management with real-time updates
- Team collaboration features and advanced filtering
- Progressive Web App (PWA) capabilities

Weather Dashboard
Technologies: React, Chart.js, Weather API, CSS Grid
- Interactive weather dashboard with location-based forecasts
- Historical data visualization and mobile-responsive design
- Integration with third-party weather APIs

CONTACT INFORMATION
Email: rahulpoliyath@gmail.com
Phone: Available upon request
Location: NAVI MUMBAI, MH
GitHub: https://github.com/rahulpoliyath5230
LinkedIn: https://linkedin.com/in/rahulpoliyath
Twitter: https://twitter.com/rahulpoliyath

---
Generated on: ${new Date().toLocaleDateString()}
        `;
    }

    showDownloadNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: var(--space-16) var(--space-24);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: var(--space-8);
        `;
        notification.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Resume downloaded successfully!</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
        this.animateSkillBars();
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);
    }

    observeElements() {
        const elements = document.querySelectorAll('.section-title, .about-text, .stat-card, .project-card, .timeline-item, .contact-info');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            this.observer.observe(el);
        });
    }

    animateSkillBars() {
        const skillsSection = document.getElementById('skills');
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 300);
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        if (skillsSection) {
            skillsObserver.observe(skillsSection);
        }
    }
}

// Navbar scroll effect
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        if (this.navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    this.navbar.style.boxShadow = 'var(--shadow-md)';
                } else {
                    this.navbar.style.background = 'var(--glass-bg)';
                    this.navbar.style.boxShadow = 'none';
                }
            });
        }
    }
}

// Add CSS animations
const animationStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes bounceIn {
        0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .error input,
    .error textarea {
        border-color: var(--color-error) !important;
    }
`;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);

    // Initialize all components
    const themeManager = new ThemeManager();
    const mobileNav = new MobileNav();
    const smoothScroll = new SmoothScroll();
    const contactForm = new ContactForm();
    const resumeDownload = new ResumeDownload();
    const scrollAnimations = new ScrollAnimations();
    const navbarScroll = new NavbarScroll();

    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const texts = [
            'Full Stack Developer',
            'Anonymous',
            'React Specialist',
            'Node.js Expert',
            'UI/UX Enthusiast',
            'Problem Solver'
        ];
        new TypingAnimation(typingElement, texts, 100, 2000);
    }

    // Add loading completed class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Debug logging
    console.log('Portfolio website initialized successfully');
    console.log('Theme Manager:', themeManager);
    console.log('All components loaded');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Come back soon! - XrAnonymous';
    } else {
        document.title = 'RahulPoliyath - Full Stack Developer';
    }
});

// Add some Easter eggs for fun
let clickCount = 0;
document.addEventListener('click', (e) => {
    if (e.target.closest('.profile-photo')) {
        clickCount++;
        if (clickCount === 5) {
            const messages = [
                "You found the Easter egg! 🎉",
                "Thanks for being curious! 🔍",
                "Keep exploring! 🚀",
                "You're awesome! ⭐"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--gradient-primary);
                color: white;
                padding: var(--space-24);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 1001;
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-semibold);
                animation: bounceIn 0.5s ease-out;
            `;
            notification.textContent = randomMessage;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => notification.remove(), 500);
            }, 2000);
            
            clickCount = 0;
        }
    }
});
