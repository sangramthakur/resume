// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}
window.addEventListener('scroll', highlightNav);

// ===== Dynamic Experience Calculator =====
function updateExperience() {
    const startDate = new Date(2017, 6, 3); // July 3, 2017
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (now.getDate() < startDate.getDate()) months--;
    if (months < 0) { years--; months += 12; }
    const el = document.querySelector('.stat-experience');
    if (el) {
        el.innerHTML = `<span class="stat-number" style="display:inline">${years}</span><span class="stat-suffix"> Yrs </span><span class="stat-number" style="display:inline">${months}</span><span class="stat-suffix"> Mos</span>`;
    }
    const heroYears = document.getElementById('hero-years');
    if (heroYears) heroYears.textContent = years;
    const aboutYears = document.getElementById('about-years');
    if (aboutYears) aboutYears.textContent = years;
}
// Set experience values immediately
updateExperience();

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * ease);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(update);
    });
    // Also animate the experience stat
    animateExperience();
}

function animateExperience() {
    const startDate = new Date(2017, 6, 3);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (now.getDate() < startDate.getDate()) months--;
    if (months < 0) { years--; months += 12; }

    const el = document.querySelector('.stat-experience');
    if (!el) return;
    const duration = 1500;
    const startTime = performance.now();

    function update(t) {
        const elapsed = t - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const curYears = Math.floor(years * ease);
        const curMonths = Math.floor(months * ease);
        el.innerHTML = `<span class="stat-number" style="display:inline">${curYears}</span><span class="stat-suffix"> Yrs </span><span class="stat-number" style="display:inline">${curMonths}</span><span class="stat-suffix"> Mos</span>`;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.innerHTML = `<span class="stat-number" style="display:inline">${years}</span><span class="stat-suffix"> Yrs </span><span class="stat-number" style="display:inline">${months}</span><span class="stat-suffix"> Mos</span>`;
        }
    }
    requestAnimationFrame(update);
}

// ===== Intersection Observer for Animations =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in to animatable elements
document.addEventListener('DOMContentLoaded', () => {
    updateExperience(); // Set initial values before animation kicks in
    const animElements = document.querySelectorAll(
        '.timeline-item, .project-card, .skill-category, .highlight-card, ' +
        '.edu-card, .cert-item, .contact-card, .about-text, .about-highlights'
    );
    animElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Observe hero stats for counter animation
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
});

// ===== Visitor Counter =====
fetch('https://api.countapi.xyz/hit/sangramthakur-resume/visits')
    .then(r => r.json())
    .then(data => {
        const el = document.getElementById('visitor-count');
        if (el) el.textContent = data.value.toLocaleString();
    })
    .catch(() => {
        const el = document.getElementById('visitor-count');
        if (el) el.textContent = '—';
    });

// ===== Smooth scroll for Safari =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
