// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Navigation
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animated Role Text
const roleText = document.getElementById('roleText');
const roles = [
    'Python Developer',
    'Data Analyst',
    'Azure DevOps Engineer',
    'Cloud Solutions Architect'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        roleText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeRole, typingSpeed);
}

setTimeout(typeRole, 1000);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            if (entry.target.classList.contains('stat-number')) {
                animateValue(entry.target);
            }
            
            if (entry.target.classList.contains('skill-progress')) {
                entry.target.style.width = entry.target.style.getPropertyValue('--skill-width');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category, .project-card, .education-card, .timeline-item, .stat-card').forEach(el => {
    observer.observe(el);
});

// Animated Counter for Stats
function animateValue(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const isDecimal = target % 1 !== 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (isDecimal) {
            element.textContent = current.toFixed(2);
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (element.textContent.includes('+') || target > 100) {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

document.querySelectorAll('.stat-number').forEach(stat => {
    observer.observe(stat);
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

const formFields = {
    name: {
        element: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: (value) => {
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return null;
        }
    },
    email: {
        element: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: (value) => {
            if (!value.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return null;
        }
    },
    subject: {
        element: document.getElementById('subject'),
        error: document.getElementById('subjectError'),
        validate: (value) => {
            if (!value.trim()) return 'Subject is required';
            if (value.trim().length < 3) return 'Subject must be at least 3 characters';
            return null;
        }
    },
    message: {
        element: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: (value) => {
            if (!value.trim()) return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            return null;
        }
    }
};

Object.keys(formFields).forEach(key => {
    const field = formFields[key];
    
    field.element.addEventListener('blur', () => {
        validateField(key);
    });
    
    field.element.addEventListener('input', () => {
        if (field.error.textContent) {
            validateField(key);
        }
    });
});

function validateField(fieldName) {
    const field = formFields[fieldName];
    const value = field.element.value;
    const error = field.validate(value);
    
    if (error) {
        field.error.textContent = error;
        field.element.style.borderColor = 'var(--color-error)';
        return false;
    } else {
        field.error.textContent = '';
        field.element.style.borderColor = 'rgba(59, 130, 246, 0.2)';
        return true;
    }
}

function validateForm() {
    let isValid = true;
    
    Object.keys(formFields).forEach(key => {
        if (!validateField(key)) {
            isValid = false;
        }
    });
    
    return isValid;
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        showFormMessage('Please fix the errors above', 'error');
        return;
    }
    
    const formData = {
        name: formFields.name.element.value,
        email: formFields.email.element.value,
        subject: formFields.subject.element.value,
        message: formFields.message.element.value
    };
    
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Sending...</span>';
    
    setTimeout(() => {
        showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
        contactForm.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }, 1500);
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Skill Progress Animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.style.getPropertyValue('--skill-width');
                }, index * 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// Console Message
console.log('%c👋 Hello, curious developer!', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cLooking for something? Feel free to reach out!', 'font-size: 14px; color: #8b5cf6;');
console.log('%cEmail: acmohanty2004@gmail.com', 'font-size: 14px; color: #06b6d4;');
