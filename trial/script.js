// ========================================
// Particle Animation
// ========================================
class ParticleAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                baseX: Math.random() * this.canvas.width,
                baseY: Math.random() * this.canvas.height,
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25,
                size: Math.random() * 2 + 1,
                density: Math.random() * 30 + 1
            });
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Draw particle
            this.ctx.fillStyle = `rgba(102, 126, 234, ${0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Connect particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle2 = this.particles[j];
                const dx = particle.x - particle2.x;
                const dy = particle.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateParticles() {
        for (let particle of this.particles) {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = this.mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * particle.density;
            const directionY = forceDirectionY * force * particle.density;
            
            if (distance < this.mouse.radius) {
                particle.x -= directionX;
                particle.y -= directionY;
            } else {
                // Return to base position
                if (particle.x !== particle.baseX) {
                    const dx = particle.x - particle.baseX;
                    particle.x -= dx / 20;
                }
                if (particle.y !== particle.baseY) {
                    const dy = particle.y - particle.baseY;
                    particle.y -= dy / 20;
                }
            }
            
            // Base movement
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx = -particle.vx;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy = -particle.vy;
            }
        }
    }
    
    animate() {
        this.drawParticles();
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ========================================
// Navigation
// ========================================
class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });
        
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
        
        // Active link highlighting
        this.setupActiveLinks();
    }
    
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink?.classList.add('active');
                } else {
                    navLink?.classList.remove('active');
                }
            });
        });
    }
}

// ========================================
// Scroll Animations
// ========================================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.setupObserver();
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
        
        // Observe all project cards
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observe skill categories
        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
        
        // Observe stat items
        document.querySelectorAll('.stat-item').forEach(stat => {
            observer.observe(stat);
        });
    }
}

// ========================================
// Skill Progress Animation
// ========================================
class SkillAnimations {
    constructor() {
        this.animateOnScroll();
    }
    
    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const progress = bar.style.getPropertyValue('--progress');
                        bar.style.width = progress;
                    });
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
    }
}

// ========================================
// Number Counter Animation
// ========================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animateCounters();
    }
    
    animateCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.countUp(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    countUp(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = element.textContent;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }
}

// ========================================
// Form Handling
// ========================================
class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.setupFormSubmission();
    }
    
    setupFormSubmission() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
    }
    
    async handleSubmit(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            console.log('Form data:', data);
            
            // Show success message
            this.showMessage('Message sent successfully!', 'success');
            
            // Reset form
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
    
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'rgba(39, 201, 63, 0.2)' : 'rgba(255, 95, 86, 0.2)'};
            border: 1px solid ${type === 'success' ? 'rgba(39, 201, 63, 0.5)' : 'rgba(255, 95, 86, 0.5)'};
            border-radius: 8px;
            color: white;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// ========================================
// Smooth Scroll
// ========================================
class SmoothScroll {
    constructor() {
        this.setupSmoothScroll();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// Cursor Trail Effect (Optional)
// ========================================
class CursorTrail {
    constructor() {
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.dotCount = 20;
        
        this.createDots();
        this.animate();
        this.setupEventListeners();
    }
    
    createDots() {
        for (let i = 0; i < this.dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - (i / this.dotCount)};
                transition: transform 0.15s ease;
            `;
            document.body.appendChild(dot);
            this.dots.push({
                element: dot,
                x: 0,
                y: 0
            });
        }
    }
    
    animate() {
        let x = this.mouse.x;
        let y = this.mouse.y;
        
        this.dots.forEach((dot, index) => {
            dot.x += (x - dot.x) * 0.3;
            dot.y += (y - dot.y) * 0.3;
            dot.element.style.left = dot.x + 'px';
            dot.element.style.top = dot.y + 'px';
            
            x = dot.x;
            y = dot.y;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle animation
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        new ParticleAnimation(canvas);
    }
    
    // Initialize navigation
    new Navigation();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize skill animations
    new SkillAnimations();
    
    // Initialize counter animation
    new CounterAnimation();
    
    // Initialize form handler
    new FormHandler();
    
    // Initialize smooth scroll
    new SmoothScroll();
    
    // Initialize cursor trail (optional - uncomment if desired)
    // new CursorTrail();
    
    // Add CSS animation keyframes
    const style = document.createElement('style');
    style.textContent = `
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
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .nav-link.active {
            color: var(--text-primary);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
});

// ========================================
// Loading Screen (Optional)
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
