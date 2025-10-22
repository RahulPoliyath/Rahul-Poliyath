// Global state management (no localStorage due to sandbox restrictions)
let currentTheme = 'light';
let isMenuOpen = false;
let isResumeOpen = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeAnimations();
    initializeTypingEffect();
    initializeScrollEffects();
    initializeContactForm();
    initializeMobileMenu();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme = 'dark';
        updateThemeDisplay();
    }
    
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!document.body.hasAttribute('data-theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                updateThemeDisplay();
            }
        });
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateThemeDisplay();
}

function updateThemeDisplay() {
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun theme-icon';
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon theme-icon';
    }
}

// Navigation Management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
    
    // Navbar background on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = currentTheme === 'dark' ? 
                'rgba(10, 10, 10, 0.95)' : 'rgba(252, 252, 249, 0.95)';
        } else {
            navbar.style.background = currentTheme === 'dark' ? 
                'rgba(10, 10, 10, 0.8)' : 'rgba(252, 252, 249, 0.8)';
        }
        
        // Update active navigation based on scroll position
        updateActiveNavigation();
        
        lastScrollY = currentScrollY;
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Mobile Menu Management
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (isMenuOpen) {
        mobileMenuBtn.classList.add('active');
        navMenu.classList.add('active');
    } else {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

function closeMobileMenu() {
    if (isMenuOpen) {
        isMenuOpen = false;
        document.getElementById('mobileMenuBtn').classList.remove('active');
        document.getElementById('navMenu').classList.remove('active');
    }
}

// Typing Effect
function initializeTypingEffect() {
    const typingText = document.getElementById('typingText');
    const text = 'Full Stack Developer';
    let index = 0;
    let isDeleting = false;
    
    function typeWriter() {
        if (!isDeleting && index < text.length) {
            typingText.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, 100);
        } else if (isDeleting && index > 0) {
            typingText.textContent = text.substring(0, index - 1);
            index--;
            setTimeout(typeWriter, 50);
        } else if (!isDeleting && index === text.length) {
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 2000);
        } else if (isDeleting && index === 0) {
            setTimeout(() => {
                isDeleting = false;
                typeWriter();
            }, 500);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// Animation Management
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.section-title, .project-card, .skill-category, .highlight-card, .about-content, .contact-content'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const particles = document.querySelectorAll('.particle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.1;
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Contact Form Management
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form
        let isValid = true;
        
        if (!name || name.trim().length < 2) {
            showFieldError('name', 'Name must be at least 2 characters long');
            isValid = false;
        } else {
            clearFieldError('name');
        }
        
        if (!email || !isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearFieldError('email');
        }
        
        if (!subject || subject.trim().length < 3) {
            showFieldError('subject', 'Subject must be at least 3 characters long');
            isValid = false;
        } else {
            clearFieldError('subject');
        }
        
        if (!message || message.trim().length < 10) {
            showFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        } else {
            clearFieldError('message');
        }
        
        if (isValid) {
            submitContactForm({ name, email, subject, message });
        }
    });
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('error');
    errorElement.textContent = message;
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.remove('error');
    errorElement.textContent = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitContactForm(data) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'var(--color-success)';
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
        
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    }, 2000);
}

// Resume Management
function showResume() {
    const modal = document.getElementById('resumeModal');
    modal.classList.add('active');
    isResumeOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Close on escape key
    document.addEventListener('keydown', handleEscapeKey);
    
    // Close when clicking outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeResume();
        }
    });
}

function closeResume() {
    const modal = document.getElementById('resumeModal');
    modal.classList.remove('active');
    isResumeOpen = false;
    document.body.style.overflow = '';
    
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape' && isResumeOpen) {
        closeResume();
    }
}

function downloadResume() {
    // Create a professional resume content
    const resumeContent = generateResumeHTML();
    
    // Create a new window/tab for the resume
    const resumeWindow = window.open('', '_blank');
    resumeWindow.document.write(resumeContent);
    resumeWindow.document.close();
    
    // Trigger print dialog for PDF creation
    setTimeout(() => {
        resumeWindow.print();
    }, 1000);
    
    showNotification('Resume opened in new tab. Use your browser\'s print function to save as PDF.', 'info');
}

function generateResumeHTML() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rahul Poliyath - Resume</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                    line-height: 1.6;
                    color: #333;
                }
                h1 { color: #2c5aa0; margin-bottom: 5px; }
                h2 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 5px; }
                h3 { margin-bottom: 5px; }
                .header { text-align: center; margin-bottom: 30px; }
                .contact-info { text-align: center; color: #666; margin-bottom: 30px; }
                .section { margin-bottom: 30px; }
                .job-header { display: flex; justify-content: space-between; align-items: center; }
                .company { color: #2c5aa0; font-weight: bold; }
                .date { color: #666; font-style: italic; }
                .skills { display: flex; flex-wrap: wrap; gap: 10px; }
                .skill-tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 0.9em; }
                @media print {
                    body { padding: 20px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>RAHUL POLIYATH</h1>
                <p style="font-size: 1.2em; color: #2c5aa0; margin: 0;">Full Stack Developer</p>
            </div>
            
            <div class="contact-info">
                <p>Email: rahul.poliyath@email.com | Phone: +91-XXXXXXXXXX</p>
                <p>LinkedIn: linkedin.com/in/rahulpoliyath | GitHub: github.com/rahulpoliyath</p>
            </div>
            
            <div class="section">
                <h2>Professional Summary</h2>
                <p>Passionate full stack developer with 3+ years of experience building scalable web applications and AI-powered solutions. Expert in modern JavaScript frameworks, Python, and cloud technologies. Proven track record of delivering high-quality software solutions and leading development teams.</p>
            </div>
            
            <div class="section">
                <h2>Technical Skills</h2>
                <div style="margin-bottom: 15px;">
                    <strong>Frontend:</strong> HTML5, CSS3, JavaScript (ES6+), React.js, Vue.js, C++, Tailwind CSS, Bootstrap, Material Ui
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Backend:</strong> Node.js, Python, Java, FastAPI, PHP, Express.js, RESTful APIs, GraphQL, MySQL , DMBS, linux
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Tools & Technologies:</strong> Git, Docker, VS Code, Visual Studio, Webpack, AWS, RedHat5, Android, KaliLinux, Android Studio, Aide
                </div>
            </div>
            
            <div class="section">
                <h2>Professional Experience</h2>
                
                <div style="margin-bottom: 20px;">
                    <div class="job-header">
                        <h3>Company Name</h3>
                        <span class="date">July 2023 - June 2025</span>
                    </div>
                    <div class="company">eClerx Services Ltd</div>
                    <ul>
                        <li>Analyst - Technical Support Executive</li>
                        <li>Leading frontend architecture decisions and code reviews</li>
                        <li>Implementing AI-powered features using Python and machine learning APIs</li>
                        <li>Collaborating with cross-functional teams to deliver high-quality products</li>
                    </ul>
                </div>
               
               <div style="margin-bottom: 20px;">
                    <div class="job-header">
                        <h3>Web Developer</h3>
                        <span class="date">2021 - 2023</span>
                    </div>
                    <div class="company">Digital Solutions</div>
                    <ul>
                        <li>Built responsive websites and web applications from scratch</li>
                        <li>Integrated third-party APIs and payment gateways</li>
                        <li>Optimized website performance and implemented SEO best practices</li>
                        <li>Mentored junior developers and conducted code reviews</li>
                    </ul>
                </div> 
            </div>
            
            <div class="section">
                <h2>Featured Projects</h2>
                
                <div style="margin-bottom: 15px;">
                    <strong>AI Video Generator:</strong> Production-ready AI-powered video generation platform with text-to-video capabilities using Python, FastAPI, React, and AI APIs.
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>E-Commerce Platform:</strong> Full-stack responsive e-commerce solution with payment integration built with React, Node.js, MongoDB, and Stripe.
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>Real-time Chat Application:</strong> WebSocket-based chat app with authentication and file sharing using Socket.io, React, Node.js, and JWT.
                </div>
            </div>
            
            <div class="section">
                <h2>Education</h2>
                <div style="margin-bottom: 10px;">
                    <strong>Bachelor of Technology in Computer Science</strong>
                </div>
                <div style="color: #666;">University Name - 2021</div>
            </div>
            
            <div class="section">
                <h2>Certifications</h2>
                <ul>
                    <li>AWS Certified Developer Associate</li>
                    <li>Google Cloud Professional Developer</li>
                    <li>React.js Certification</li>
                </ul>
            </div>
        </body>
        </html>
    `;
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 16px 20px;
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--color-text);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
    }
    
    .notification-close:hover {
        background: var(--color-secondary);
        color: var(--color-text);
    }
    
    .notification--success {
        border-left: 4px solid var(--color-success);
    }
    
    .notification--error {
        border-left: 4px solid var(--color-error);
    }
    
    .notification--warning {
        border-left: 4px solid var(--color-warning);
    }
    
    .notification--info {
        border-left: 4px solid var(--color-info);
    }
`;
document.head.appendChild(notificationStyles);

// Performance Optimization
function debounce(func, wait) {
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

// Optimize scroll events
const debouncedScrollHandler = debounce(() => {
    updateActiveNavigation();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Hi there! I’m Rahul  👋', 'info');
    }, 1000);

       // Show second notification after (1s + delay of first notification)
    setTimeout(() => {
        showNotification(' Welcome to my space. 🚀', 'success');
    }, 6000); // adjust this delay depending on how long your notification lasts
});

// Error handling for images and external resources
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.log('Image failed to load:', e.target.src);
        // Could add fallback image here
    }
}, true);

// Export functions for global access (needed for onclick handlers)
window.showResume = showResume;
window.closeResume = closeResume;
window.downloadResume = downloadResume;
window.scrollToSection = scrollToSection;
