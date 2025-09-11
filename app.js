// Personal Website JavaScript - All Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initThemeToggle();
    initAnimatedCounters();
    initSkillsAnimation();
    initPortfolioFilters();
    initProjectModals();
    initContactForm();
    initScrollAnimations();
    initSmoothScrolling();
    initDownloadHandlers();
});

// Navigation Functions
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 253, 0.98)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)';
            } else {
                navbar.style.background = 'rgba(255, 255, 253, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Active link highlighting based on scroll position
    window.addEventListener('scroll', debounce(updateActiveNavLink, 10));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Check for saved theme or default to light mode
    let currentTheme = 'light';
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = body.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        body.setAttribute('data-color-scheme', theme);
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        
        // Update navbar background based on theme
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (theme === 'dark') {
                navbar.style.background = 'rgba(38, 40, 40, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 253, 0.95)';
            }
        }
    }
}

// Animated Counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        animated = true;
    };

    // Trigger animation when stats section is in view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }
}

// Skills Progress Animation
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;

    const animateSkills = () => {
        if (skillsAnimated) return;
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
        });
        
        skillsAnimated = true;
    };

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    }
}

// Portfolio Filters
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        if (item.classList.contains('hidden')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Project Modals
function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    const viewProjectBtns = document.querySelectorAll('.view-project');

    if (!modal || !modalClose || !modalBody) return;

    const projects = [
        {
            title: "E-Commerce Platform",
            description: "A comprehensive e-commerce solution built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and an administrative dashboard for inventory management.",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express.js", "JWT"],
            features: [
                "User authentication and profiles",
                "Product catalog with search and filtering",
                "Shopping cart and checkout process",
                "Stripe payment integration",
                "Order tracking and history",
                "Admin dashboard for inventory management",
                "Responsive design for all devices"
            ],
            challenges: "Implementing secure payment processing and managing complex state across the application.",
            outcome: "Successfully launched with 500+ active users and $50K+ in monthly transactions."
        },
        {
            title: "Task Management App",
            description: "A collaborative project management mobile application designed for teams to organize, track, and complete projects efficiently. Built with React Native for cross-platform compatibility and Firebase for real-time data synchronization.",
            technologies: ["React Native", "Firebase", "Redux", "JavaScript", "Expo"],
            features: [
                "Real-time task updates and notifications",
                "Team collaboration and commenting",
                "Project timeline and milestone tracking",
                "File sharing and attachments",
                "Mobile-first responsive design",
                "Offline functionality with sync",
                "Role-based permissions"
            ],
            challenges: "Ensuring real-time synchronization across devices and handling offline scenarios.",
            outcome: "Adopted by 10+ companies with 95% user satisfaction rating."
        },
        {
            title: "Portfolio Website",
            description: "A stunning portfolio website for a creative agency featuring smooth animations, interactive elements, and a content management system. Built with modern web technologies focusing on performance and user experience.",
            technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Webpack"],
            features: [
                "Smooth scroll animations with GSAP",
                "Interactive portfolio gallery",
                "Contact form with email integration",
                "SEO optimized structure",
                "Mobile-first responsive design",
                "Fast loading performance",
                "Content management integration"
            ],
            challenges: "Balancing rich animations with performance optimization and ensuring cross-browser compatibility.",
            outcome: "Increased client inquiries by 200% and won a design award for creativity."
        },
        {
            title: "Data Dashboard",
            description: "A comprehensive analytics dashboard providing real-time data visualization and insights. Features interactive charts, customizable widgets, and data export capabilities for business intelligence.",
            technologies: ["Vue.js", "D3.js", "Python", "PostgreSQL", "Flask"],
            features: [
                "Real-time data visualization",
                "Interactive charts and graphs",
                "Customizable dashboard widgets",
                "Data filtering and search",
                "Export functionality (PDF, Excel)",
                "User role management",
                "API integration for data sources"
            ],
            challenges: "Processing large datasets efficiently and creating responsive visualizations.",
            outcome: "Reduced reporting time by 80% and improved data-driven decision making."
        }
    ];

    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const projectIndex = parseInt(this.getAttribute('data-project'));
            const project = projects[projectIndex];
            
            if (project) {
                modalBody.innerHTML = `
                    <h2>${project.title}</h2>
                    <p class="project-description">${project.description}</p>
                    
                    <h3>Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    
                    <h3>Key Features</h3>
                    <ul class="feature-list">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    
                    <h3>Challenges & Solutions</h3>
                    <p>${project.challenges}</p>
                    
                    <h3>Outcome</h3>
                    <p class="outcome">${project.outcome}</p>
                    
                    <div class="project-actions">
                        <a href="#" class="btn btn--primary" onclick="showNotification('Demo link clicked!', 'success'); return false;">View Live Demo</a>
                        <a href="#" class="btn btn--outline" onclick="showNotification('Code repository clicked!', 'success'); return false;">View Code</a>
                    </div>
                `;
                
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    modalClose.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (!form || !formMessage) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();

        // Validate form
        if (!validateForm(name, email, subject, message)) {
            return;
        }

        // Simulate form submission
        submitForm(name, email, subject, message);
    });

    function validateForm(name, email, subject, message) {
        // Reset previous validation
        clearFieldErrors();

        let isValid = true;

        // Name validation
        if (name.length < 2) {
            showFieldError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        if (subject.length < 5) {
            showFieldError('subject', 'Subject must be at least 5 characters long');
            isValid = false;
        }

        // Message validation
        if (message.length < 10) {
            showFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.style.borderColor = '#C0152F';
            
            // Create or update error message
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.style.color = '#C0152F';
                errorElement.style.fontSize = '12px';
                errorElement.style.marginTop = '4px';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }
    }

    function clearFieldErrors() {
        const fields = ['name', 'email', 'subject', 'message'];
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.style.borderColor = '';
                
                const errorElement = field.parentNode.querySelector('.field-error');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        });
        
        formMessage.classList.remove('show', 'success', 'error');
    }

    function submitForm(name, email, subject, message) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success message
                showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                
                // Reset form
                form.reset();
            }, 2000);
        }
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.classList.add('show');

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add animation classes to elements
    const elementsToAnimate = [
        '.service-card',
        '.portfolio-item',
        '.blog-card',
        '.timeline-item'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Download Handlers
function initDownloadHandlers() {
    const downloadButtons = document.querySelectorAll('#download-cv, #download-resume');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Create a simple text-based CV content
            const cvContent = generateCVContent();
            
            // Create and download the file
            const blob = new Blob([cvContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Alex_Johnson_CV.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success message
            showNotification('CV downloaded successfully!', 'success');
        });
    });
}

function generateCVContent() {
    return `ALEX JOHNSON
Full-Stack Developer & Creative Problem Solver
Email: alex.johnson@email.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA

PROFESSIONAL SUMMARY
Passionate full-stack developer with 5+ years of experience creating innovative web applications and digital solutions. I specialize in modern JavaScript frameworks, responsive design, and user experience optimization.

TECHNICAL SKILLS
- JavaScript (95%)
- React (90%)  
- Node.js (85%)
- Python (80%)
- UI/UX Design (75%)
- Database Design (85%)

PROFESSIONAL EXPERIENCE

Senior Full-Stack Developer | TechCorp Solutions | 2021 - Present
• Lead development of scalable web applications
• Mentor junior developers
• Collaborate with cross-functional teams to deliver high-quality products

Frontend Developer | StartupXYZ | 2019 - 2021  
• Built responsive user interfaces
• Implemented modern JavaScript frameworks
• Optimized application performance for better user experience

Junior Developer | WebStudio Inc | 2018 - 2019
• Developed websites and web applications
• Learned industry best practices
• Contributed to team projects in an agile environment

PROJECTS
• E-Commerce Platform - Full-featured online store with payment processing
• Task Management App - Collaborative project management tool
• Portfolio Website - Responsive portfolio with smooth animations
• Data Dashboard - Real-time analytics dashboard with data visualization

ACHIEVEMENTS
• 50+ Projects Completed
• 30+ Happy Clients
• 5 Years Experience
`;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#218d8d' : '#C0152F'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
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

// Remove any focus outlines that might cause blue circles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        *:focus:not(:focus-visible) {
            outline: none;
        }
        button:focus:not(:focus-visible) {
            outline: none;
        }
        a:focus:not(:focus-visible) {
            outline: none;
        }
    `;
    document.head.appendChild(style);
    
    // Remove loading class from body if it exists
    document.body.classList.remove('loading');
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main') || document.body;
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        mainContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 100);
});
