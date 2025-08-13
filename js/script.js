// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== DOM ELEMENTS =====
const loadingScreen = $('#loading-screen');
const navbar = $('#navbar');
const navMenu = $('#nav-menu');
const hamburger = $('#hamburger');
const navLinks = $$('.nav-link');
const themeToggle = $('#theme-toggle');
const backToTop = $('#back-to-top');
const contactForm = $('#contact-form');
const filterBtns = $$('.filter-btn');
const projectCards = $$('.project-card');
const skillProgressBars = $$('.skill-progress');

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);
});

// ===== NAVIGATION =====
// Smooth scroll to sections
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = $(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Update active link
        updateActiveNavLink(targetId);
    });
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Update active navigation link based on scroll position
function updateActiveNavLink(targetId = null) {
    if (targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
        return;
    }
    
    const sections = $$('section[id]');
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

// ===== SCROLL EFFECTS =====
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Navbar scroll effect
    if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (currentScrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Parallax effect for hero section
    const hero = $('#home');
    if (hero && currentScrollY < hero.offsetHeight) {
        const parallaxBg = $('.animated-bg');
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${currentScrollY * 0.5}px)`;
        }
    }
    
    lastScrollY = currentScrollY;
});

// Back to top functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== THEME TOGGLE =====
const getTheme = () => localStorage.getItem('theme') || 'light';
const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
    // Guard if toggle not present
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
        themeToggle.setAttribute('title', 'Switch to light theme');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        themeToggle.setAttribute('title', 'Switch to dark theme');
    }
};

// Initialize theme
setTheme(getTheme());

// Theme toggle event
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
            
            // Animate statistics counters
            if (entry.target.classList.contains('about')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe sections for animations
const sections = $$('section');
sections.forEach(section => observer.observe(section));

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
    skillProgressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 200);
    });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = $$('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + suffix;
        }, 20);
    });
}

// ===== PROJECTS FILTER =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filter projects
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                }, 100);
            } else {
                card.style.transform = 'scale(0.9)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
    });
});

// ===== PROJECT FILTERING =====
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                // Remove any existing animation classes
                card.classList.remove('show', 'hide');
                
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    // Show card
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('show');
                    }, 10);
                } else {
                    // Hide card
                    card.classList.add('hide');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== PROJECT IMAGE LOADING =====
function initProjectImages() {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
        const container = img.parentElement;
        
        // Add loading state
        container.classList.add('loading');
        
        img.addEventListener('load', () => {
            container.classList.remove('loading');
        });
        
        img.addEventListener('error', () => {
            container.classList.remove('loading');
            // Create placeholder if image fails to load
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <div class="placeholder-icon">
                    <i class="fas fa-image"></i>
                </div>
                <div class="placeholder-text">Project Image</div>
            `;
            container.appendChild(placeholder);
            img.style.display = 'none';
        });
    });
}

// ===== CONTACT FORM =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (validateForm(data)) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email');
    if (!data.subject.trim()) errors.push('Subject is required');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = $$('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
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

// ===== TYPING ANIMATION FOR HERO =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const professionElement = $('.profession');
        if (professionElement) {
            const professions = ['IT Professional', 'Full Stack Developer', 'Software Engineer', 'Problem Solver'];
            let currentIndex = 0;
            
            function cycleProfessions() {
                typeWriter(professionElement, professions[currentIndex], 100);
                currentIndex = (currentIndex + 1) % professions.length;
                setTimeout(cycleProfessions, 3000);
            }
            
            cycleProfessions();
        }
    }, 2000);
});

// ===== PARTICLE BACKGROUND EFFECT =====
function createParticleBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;
    
    document.body.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = Math.random() * 3 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                    ctx.globalAlpha = 1 - distance / 100;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize canvas when window resizes
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize particle background
window.addEventListener('load', () => {
    if (window.innerWidth > 768) {
        createParticleBackground();
    }
});

// ===== SMOOTH REVEAL ANIMATIONS =====
function revealOnScroll() {
    const reveals = $$('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add reveal class to elements that should animate
document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = $$('.project-card, .skill-item, .experience-card, .stat-item');
    elementsToReveal.forEach(element => {
        element.classList.add('reveal');
    });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const sections = Array.from($$('section[id]'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let nextIndex;
            
            if (e.key === 'ArrowUp') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
            } else {
                nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
            }
            
            const nextSection = sections[nextIndex];
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Add ARIA labels and roles where needed
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = $('main') || $('section');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    // Improve button accessibility
    const buttons = $$('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            const icon = button.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                let label = 'Button';
                if (iconClass.includes('fa-moon')) label = 'Toggle dark mode';
                if (iconClass.includes('fa-sun')) label = 'Toggle light mode';
                if (iconClass.includes('fa-chevron-up')) label = 'Back to top';
                if (iconClass.includes('fa-bars')) label = 'Open menu';
                button.setAttribute('aria-label', label);
            }
        }
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// ===== CONSOLE EASTER EGG =====
console.log(`
%c🚀 Welcome to my Portfolio! 

%cLooks like you're checking out the code! 
I'm always open to discussing the technical details.
Feel free to reach out if you have any questions!

%cBuilt with: HTML5, CSS3, Vanilla JavaScript
Features: Responsive Design, Dark Mode, Smooth Animations, Accessibility

`, 
'color: #6366f1; font-size: 24px; font-weight: bold;',
'color: #374151; font-size: 16px;',
'color: #6b7280; font-size: 14px;'
);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website initialized successfully! 🎉');
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
    
    // Initialize any additional features
    if ('serviceWorker' in navigator) {
        // You can add service worker registration here for PWA features
    }
    
    // Initialize project filtering
    initProjectFilter();
    
    // Initialize project images
    initProjectImages();
    
    // Initialize project gallery
    initProjectGallery();
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateActiveNavLink,
        validateForm,
        isValidEmail,
        showNotification
    };
}

// ===== ANIMATED PROFESSION TYPEWRITER EFFECT =====
class TypewriterEffect {
    constructor(element, texts, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        // Start the typewriter effect
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (!this.isDeleting && this.currentCharIndex < currentText.length) {
            // Typing forward
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            setTimeout(() => this.type(), this.typeSpeed);
            
        } else if (this.isDeleting && this.currentCharIndex > 0) {
            // Deleting backward
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            setTimeout(() => this.type(), this.deleteSpeed);
            
        } else if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            // Finished typing, pause then start deleting
            this.isPaused = true;
            setTimeout(() => {
                this.isDeleting = true;
                this.isPaused = false;
                this.type();
            }, this.pauseTime);
            
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            // Finished deleting, move to next text
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            setTimeout(() => this.type(), this.typeSpeed);
        }
    }
}

// Initialize the typewriter effect when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Profession typewriter effect
    const professionElement = document.getElementById('profession-text');
    const professionTexts = [
        'Front-end Developer',
        'Website Developer'
    ];
    
    if (professionElement) {
        // Start typewriter effect with the existing styling
        new TypewriterEffect(professionElement, professionTexts, 150, 75, 2500);
    }
});

// ===== PROJECT GALLERY - CORRECTED VERSION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Initializing Project Gallery...');
    
    // Gallery data for all projects
    const galleryData = {
        paperazzi: {
            title: "Paperazzi - Coin Operated Printing Machine",
            images: [
                {
                    src: "assets/PAPERAZZI/1.png",
                    alt: "Paperazzi Main Interface",
                    description: "Main user interface of the Paperazzi coin-operated printing system"
                },
                {
                    src: "assets/PAPERAZZI/2.png",
                    alt: "Payment Processing Screen", 
                    description: "Coin insertion and payment processing interface"
                },
                {
                    src: "assets/PAPERAZZI/3.png",
                    alt: "Document Selection Menu",
                    description: "Document type selection and print options"
                },
                {
                    src: "assets/PAPERAZZI/4.png",
                    alt: "Print Settings Configuration",
                    description: "Print quality and page setup configuration screen"
                },
                {
                    src: "assets/PAPERAZZI/5.png",
                    alt: "Print Progress Display",
                    description: "Real-time printing progress and status display"
                }
            ]
        },
        kainimo: {
            title: "Kainimo - Restaurant Finder in Imus, Cavite",
            images: [
                {
                    src: "assets/kainimo/1 (1).png",
                    alt: "Kainimo Homepage",
                    description: "Homepage featuring restaurant discovery and search functionality for Imus, Cavite"
                },
                {
                    src: "assets/kainimo/2 (2).png",
                    alt: "Restaurant Listings",
                    description: "Browse through various restaurants and eateries in Imus with detailed listings"
                },
                {
                    src: "assets/kainimo/3 (1).png",
                    alt: "Restaurant Details",
                    description: "Detailed restaurant information including menu, reviews, and location details"
                },
                {
                    src: "assets/kainimo/4 (1).png",
                    alt: "Search and Filter Results",
                    description: "Advanced search and filtering options to find the perfect dining experience"
                }
            ]
        },
        smilebright: {
            title: "Smile Bright - Dental Clinic Management System",
            images: [
                {
                    src: "assets/SMILE BRIGHT/1 (2).jpg",
                    alt: "Homepage & Welcome",
                    description: "Main homepage showcasing dental services and clinic information"
                },
                {
                    src: "assets/SMILE BRIGHT/2.jpg",
                    alt: "Services Overview",
                    description: "Comprehensive list of dental services offered by the clinic"
                },
                {
                    src: "assets/SMILE BRIGHT/3.jpg",
                    alt: "Appointment Booking",
                    description: "Online appointment scheduling system for patients"
                },
                {
                    src: "assets/SMILE BRIGHT/4 (2).jpg",
                    alt: "Patient Portal",
                    description: "Patient dashboard for managing appointments and medical records"
                },
                {
                    src: "assets/SMILE BRIGHT/5.jpg",
                    alt: "Admin Dashboard",
                    description: "Administrative panel for clinic management and patient oversight"
                }
            ]
        },
        "etracker-student": {
            title: "eTracker - Student Portal for CVSU Extension Services",
            images: [
                {
                    src: "assets/etracker/student/1 (2).jpg",
                    alt: "Student Dashboard",
                    description: "Main dashboard for students to overview their extension service programs and progress"
                },
                {
                    src: "assets/etracker/student/2.jpg",
                    alt: "Program Enrollment",
                    description: "Browse and enroll in available CVSU extension service programs"
                },
                {
                    src: "assets/etracker/student/3.jpg",
                    alt: "Document Upload",
                    description: "Upload required documents for program enrollment and verification"
                },
                {
                    src: "assets/etracker/student/4 (2).jpg",
                    alt: "Certificate Tracking",
                    description: "Track and download certificates upon program completion"
                },
                {
                    src: "assets/etracker/student/5.jpg",
                    alt: "Profile Management",
                    description: "Manage student profile information and account settings"
                }
            ]
        },
        "etracker-faculty": {
            title: "eTracker - Faculty Portal for CVSU Extension Services",
            images: [
                {
                    src: "assets/etracker/faculty/1 (2).jpg",
                    alt: "Faculty Dashboard",
                    description: "Comprehensive faculty dashboard for managing extension service programs"
                },
                {
                    src: "assets/etracker/faculty/2.jpg",
                    alt: "Program Management",
                    description: "Create, edit, and manage extension service programs and courses"
                },
                {
                    src: "assets/etracker/faculty/3.jpg",
                    alt: "Student Management",
                    description: "Monitor student enrollment, progress, and program completion"
                },
                {
                    src: "assets/etracker/faculty/4 (2).jpg",
                    alt: "Certificate Management",
                    description: "Generate and manage certificates for completed programs"
                },
                {
                    src: "assets/etracker/faculty/5.jpg",
                    alt: "Reports & Analytics",
                    description: "Generate detailed reports on program performance and student outcomes"
                }
            ]
        },
        "etracker-admin": {
            title: "eTracker - Admin Portal for CVSU Extension Services",
            images: [
                {
                    src: "assets/etracker/admin/1 (2).jpg",
                    alt: "Admin Dashboard",
                    description: "Complete administrative overview of the extension services system"
                },
                {
                    src: "assets/etracker/admin/2.jpg",
                    alt: "User Management",
                    description: "Manage student, faculty, and admin user accounts and permissions"
                },
                {
                    src: "assets/etracker/admin/3.jpg",
                    alt: "Program Administration",
                    description: "Oversee all extension service programs and their configurations"
                },
                {
                    src: "assets/etracker/admin/4 (2).jpg",
                    alt: "System Reports",
                    description: "Generate comprehensive system-wide reports and analytics"
                },
                {
                    src: "assets/etracker/admin/5.jpg",
                    alt: "Analytics Dashboard",
                    description: "Advanced analytics and insights for system performance"
                }
            ]
        },
        "student-api": {
            title: "Student Management API - RESTful Backend System",
            images: [
                {
                    src: "assets/STUDENT MANAGEMNET API/1.png",
                    alt: "Student Management API Interface",
                    description: "Comprehensive RESTful API documentation and testing interface for student management operations"
                }
            ]
        },
        "weather-api": {
            title: "Weather API Service - Real-time Weather Application",
            images: [
                {
                    src: "assets/WEATHER/1 (3).jpg",
                    alt: "Weather API Interface",
                    description: "Modern weather forecasting application with real-time data integration and responsive design"
                }
            ]
        }
    };

    let currentGallery = null;
    let currentImageIndex = 0;

    // Get modal elements
    const modal = document.getElementById('gallery-modal');
    const galleryTitle = document.querySelector('.gallery-title');
    const mainImage = document.getElementById('gallery-main-image');
    const galleryDescription = document.getElementById('gallery-description');
    const galleryCounter = document.getElementById('gallery-current');
    const galleryTotal = document.getElementById('gallery-total');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    const closeBtn = document.querySelector('.gallery-close');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');

    if (!modal) {
        console.error('❌ Gallery modal not found!');
        return;
    }

    console.log('✅ Gallery elements found successfully');

    // Enhanced click handler for gallery buttons
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button') || e.target;
        
        // Debug logging
        console.log('🖱️ Click detected on:', {
            tagName: target.tagName,
            className: target.className,
            hasGalleryBtn: target.classList.contains('project-gallery-btn'),
            hasViewAllBtn: target.classList.contains('view-all-btn'),
            closestCard: !!target.closest('.project-card'),
            dataGallery: target.closest('[data-gallery]')?.dataset.gallery
        });

        // Handle gallery button clicks
        if (target.classList.contains('project-gallery-btn') || 
            target.classList.contains('view-all-btn') ||
            target.closest('.project-gallery-btn') ||
            target.closest('.view-all-btn')) {
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log('✅ Gallery button clicked!');
            
            const projectCard = target.closest('.project-card');
            if (!projectCard) {
                console.error('❌ No project card found');
                return;
            }
            
            const galleryId = projectCard.dataset.gallery;
            console.log('🎯 Gallery ID:', galleryId);
            
            if (galleryId && galleryData[galleryId]) {
                console.log('🚀 Opening gallery:', galleryId);
                openGallery(galleryId, 0);
            } else {
                console.error('❌ Gallery not found:', galleryId);
            }
            return;
        }

        // Handle modal close
        if (target === modal || target.closest('.gallery-close')) {
            closeGallery();
            return;
        }

        // Handle navigation buttons
        if (target.closest('.gallery-prev')) {
            showPreviousImage();
            return;
        }
        if (target.closest('.gallery-next')) {
            showNextImage();
            return;
        }

        // Handle thumbnail clicks in modal
        if (target.closest('.gallery-thumb')) {
            const thumb = target.closest('.gallery-thumb');
            const index = parseInt(thumb.dataset.index);
            if (!isNaN(index)) {
                showImage(index);
            }
            return;
        }

        // Handle thumbnail clicks in project cards
        if (target.closest('.thumb-item')) {
            const thumbItem = target.closest('.thumb-item');
            const projectCard = thumbItem.closest('.project-card');
            const mainImg = projectCard.querySelector('.project-image img');
            const counter = projectCard.querySelector('.image-counter span');
            const allThumbs = projectCard.querySelectorAll('.thumb-item');
            
            // Remove active class from all thumbnails
            allThumbs.forEach(t => t.classList.remove('active'));
            thumbItem.classList.add('active');
            
            // Update main image
            if (mainImg) {
                mainImg.style.opacity = '0.7';
                setTimeout(() => {
                    mainImg.src = thumbItem.dataset.src;
                    mainImg.alt = thumbItem.dataset.alt;
                    mainImg.style.opacity = '1';
                    
                    // Update counter
                    const index = Array.from(allThumbs).indexOf(thumbItem) + 1;
                    if (counter) {
                        counter.textContent = `${index} / ${allThumbs.length}`;
                    }
                }, 150);
            }
            return;
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    function openGallery(galleryId, startIndex = 0) {
        console.log('🎨 Opening gallery:', galleryId);
        currentGallery = galleryData[galleryId];
        currentImageIndex = startIndex;

        if (!currentGallery) {
            console.error('❌ Gallery data not found for:', galleryId);
            return;
        }

        // Set gallery title
        if (galleryTitle) {
            galleryTitle.textContent = currentGallery.title;
        }

        // Set total count
        if (galleryTotal) {
            galleryTotal.textContent = currentGallery.images.length;
        }

        // Create thumbnails
        createThumbnails();

        // Show initial image
        showImage(currentImageIndex);

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Gallery opened successfully');
    }

    function closeGallery() {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentGallery = null;
        currentImageIndex = 0;
        
        console.log('✅ Gallery closed');
    }

    function createThumbnails() {
        if (!thumbnailsContainer || !currentGallery) {
            console.error('❌ Thumbnails container or gallery data missing');
            return;
        }

        console.log('🖼️ Creating thumbnails...');
        thumbnailsContainer.innerHTML = '';

        currentGallery.images.forEach((image, index) => {
            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'gallery-thumb';
            thumbDiv.dataset.index = index;
            
            if (index === currentImageIndex) {
                thumbDiv.classList.add('active');
            }

            const thumbImg = document.createElement('img');
            thumbImg.src = image.src;
            thumbImg.alt = image.alt;
            thumbImg.loading = 'lazy';
            
            thumbImg.onerror = function() {
                console.warn('⚠️ Thumbnail failed to load:', image.src);
                thumbDiv.style.background = 'var(--gradient-primary)';
                thumbDiv.innerHTML = '<div style="color: white; font-size: 0.75rem; text-align: center; padding: 10px;">📷</div>';
            };

            thumbDiv.appendChild(thumbImg);
            thumbnailsContainer.appendChild(thumbDiv);
        });
        
        console.log('✅ Thumbnails created:', currentGallery.images.length);
    }

    function showImage(index) {
        if (!currentGallery || index < 0 || index >= currentGallery.images.length) {
            console.error('❌ Invalid image index or gallery missing');
            return;
        }

        console.log('📸 Showing image:', index + 1);
        currentImageIndex = index;
        const image = currentGallery.images[index];

        // Update main image
        if (mainImage) {
            mainImage.style.opacity = '0.7';
            
            setTimeout(() => {
                mainImage.src = image.src;
                mainImage.alt = image.alt;
                
                mainImage.onload = () => {
                    mainImage.style.opacity = '1';
                    console.log('✅ Image loaded successfully');
                };
                
                mainImage.onerror = () => {
                    console.error('❌ Failed to load image:', image.src);
                    mainImage.style.opacity = '1';
                };
            }, 150);
        }

        // Update description
        if (galleryDescription) {
            galleryDescription.textContent = image.description;
        }

        // Update counter
        if (galleryCounter) {
            galleryCounter.textContent = index + 1;
        }

        // Update active thumbnail
        const thumbnails = thumbnailsContainer?.querySelectorAll('.gallery-thumb');
        if (thumbnails) {
            thumbnails.forEach((thumb, i) => {
                thumb.classList.remove('active');
                if (i === index) {
                    thumb.classList.add('active');
                    thumb.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest', 
                        inline: 'center' 
                    });
                }
            });
        }
        
        console.log('✅ Image display updated:', index + 1, '/', currentGallery.images.length);
    }

    function showNextImage() {
        if (!currentGallery) return;
        const nextIndex = (currentImageIndex + 1) % currentGallery.images.length;
        showImage(nextIndex);
    }

    function showPreviousImage() {
        if (!currentGallery) return;
        const prevIndex = currentImageIndex === 0 ? currentGallery.images.length - 1 : currentImageIndex - 1;
        showImage(prevIndex);
    }

    console.log('✅ Project Gallery initialized successfully!');
});
