/* ============================================
   PORTFOLIO SCRIPT
   Purpose: Main client-side logic renderProjectModal
   ============================================ */

/* ===== STATE VARIABLES ===== */
let currentTestimonialIndex = 0;
let isCarouselAnimating = false;
let currentLightboxIndex = 0;
let lightboxImages = [];

/* ===== DOM ELEMENTS ===== */
let navbar;
let heroContainer;
let testimonialTrack;
let testimonialCards;
let modal;
let modalBody;
let lightbox;
let lightboxImg;
let lightboxCurrent;
let lightboxTotal;

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements AFTER DOM is ready
    navbar = document.getElementById('navbar');
    heroContainer = document.querySelector('.hero-container');
    testimonialTrack = document.querySelector('.testimonial-track');
    testimonialCards = document.querySelectorAll('.testimonial-card');
    modal = document.getElementById('projectModal');
    modalBody = document.getElementById('modalBody');
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightboxImg');
    lightboxCurrent = document.getElementById('lightboxCurrent');
    lightboxTotal = document.getElementById('lightboxTotal');
    
    // Initialize features
    initSmoothScroll();
    initNavbarEffects();
    initTestimonialCarousel();
    initProjectModals();
    initLightbox();
    initContactTracking();
    initScrollAnimations();
    logVisit();
});

/* ===== SMOOTH SCROLL NAVIGATION ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Track navigation clicks
                const section = this.getAttribute('href').replace('#', '');
                console.log(`Navigation: User clicked ${section} section`);
            }
        });
    });
}

/* ===== NAVBAR SCROLL EFFECTS ===== */
function initNavbarEffects() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 249, 63, 0.15)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'none';
        }
    });
}

/* ===== TESTIMONIAL CAROUSEL ===== */
let carouselInterval;

function startCarouselAutoRotate() {
    carouselInterval = setInterval(() => {
        if (!isCarouselAnimating) {
            nextTestimonial();
        }
    }, 5000);
}

function stopCarouselAutoRotate() {
    clearInterval(carouselInterval);
}

function initTestimonialCarousel() {
    if (!testimonialTrack || testimonialCards.length === 0) return;

    // Set initial position
    updateCarouselPosition();
    
    // Start auto-rotate
    startCarouselAutoRotate();

    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', stopCarouselAutoRotate);
    testimonialTrack.addEventListener('mouseleave', startCarouselAutoRotate);

    // Carousel controls
    document.querySelectorAll('[data-carousel-btn]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (isCarouselAnimating) return;
            
            const direction = this.getAttribute('data-carousel-btn');
            if (direction === 'next') {
                nextTestimonial();
            } else if (direction === 'prev') {
                prevTestimonial();
            }
            
            // Reset auto-rotate timer when user manually navigates
            stopCarouselAutoRotate();
            startCarouselAutoRotate();
        });
    });
}

function nextTestimonial() {
    if (isCarouselAnimating) return;
    isCarouselAnimating = true;
    
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
    updateCarouselPosition();
    
    setTimeout(() => {
        isCarouselAnimating = false;
    }, 500);
}

function prevTestimonial() {
    if (isCarouselAnimating) return;
    isCarouselAnimating = true;
    
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
    updateCarouselPosition();
    
    setTimeout(() => {
        isCarouselAnimating = false;
    }, 500);
}

function updateCarouselPosition() {
    if (!testimonialTrack) return;
    
    const translateX = -currentTestimonialIndex * 100;
    testimonialTrack.style.transform = `translateX(${translateX}%)`;
    
    console.log(`Carousel: Showing testimonial ${currentTestimonialIndex + 1} of ${testimonialCards.length}`);
}

/* ===== PROJECT MODALS ===== */
function initProjectModals() {
    // Open modal on "Read More" button click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more-btn')) {
            const projectId = e.target.dataset.project;
            openProjectModal(projectId);
        }
        
        // Open modal on project image click
        if (e.target.classList.contains('project-img')) {
            const projectId = e.target.dataset.project;
            openProjectModal(projectId);
        }
    });

    // Close modal button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close')) {
            closeProjectModal();
        }
    });

    // Close modal on backdrop click
    modal?.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal?.style.display === 'flex') {
            closeProjectModal();
        }
    });
}

function openProjectModal(projectId) {
    if (!modal || !modalBody) return;
    
    const projectData = getProjectData(projectId);
    if (!projectData) {
        console.error(`Project data not found for: ${projectId}`);
        return;
    }
    
    modalBody.innerHTML = renderProjectModal(projectData, projectId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Attach thumbnail click listeners after modal renders
    attachThumbnailListeners();
    
    console.log(`Modal: Opened project ${projectId}`);
}

function closeProjectModal() {
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    console.log('Modal: Closed project modal');
}

/* ===== RENDER PROJECT MODAL (CODE-STYLE) ===== */
function renderProjectModal(project, projectId) {
    const images = extractImages(project.description);
    const tech = extractTechStack(project.description);
    const links = getProjectLinks(projectId);
    
    return `
        <div class="code-section">
            <span class="code-comment">// Project Information</span>
            <h2 class="code-title">${project.title}</h2>
        </div>
        
        <div class="code-section">
            <span class="code-comment">// Description</span>
            <div class="code-text">
                ${project.description.replace(/<div class="modal-images">[\s\S]*?<\/div>/, '').replace(/<h3>Tech Stack<\/h3>[\s\S]*?<\/div>/, '')}
            </div>
        </div>
        
        ${tech.length > 0 ? `
        <div class="code-section">
            <span class="code-comment">// Tech Stack</span>
            <div class="tech-pills">
                ${tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${images.length > 0 ? `
        <div class="code-section">
            <span class="code-comment">// Screenshots</span>
            <div class="thumbnail-grid">
                ${images.map((img, i) => `
                    <img src="${img}" 
                         alt="Screenshot ${i + 1}" 
                         class="thumbnail" 
                         data-index="${i}"
                         data-images='${JSON.stringify(images)}'>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${links.length > 0 ? `
        <div class="code-section">
            <span class="code-comment">// Links</span>
            <div class="project-buttons">
                ${links.map(link => `
                    <a href="${link.url}" class="code-btn" target="_blank" rel="noopener">
                        <span>${link.icon}</span> ${link.label}
                    </a>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

/* ===== EXTRACT IMAGES FROM PROJECT DESCRIPTION ===== */
function extractImages(description) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const imgElements = doc.querySelectorAll('.modal-images img');
    return Array.from(imgElements).map(img => img.src);
}

/* ===== EXTRACT TECH STACK FROM PROJECT DESCRIPTION ===== */
function extractTechStack(description) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const techBadges = doc.querySelectorAll('.tech-badge');
    return Array.from(techBadges).map(badge => badge.textContent.trim());
}

/* ===== GET PROJECT LINKS ===== */
function getProjectLinks(projectId) {
    const links = {
        'money-tracker': [
            { url: 'https://money-tracker-demo.com', label: 'Live Demo', icon: '🔗' },
            { url: 'https://github.com/yourusername/money-tracker', label: 'GitHub', icon: '💻' }
        ],
        'task-manager': [
            { url: 'https://task-manager-demo.com', label: 'Live Demo', icon: '🔗' },
            { url: 'https://github.com/yourusername/task-manager', label: 'GitHub', icon: '💻' }
        ],
        'ecommerce': [
            { url: 'https://ecommerce-demo.com', label: 'Live Demo', icon: '🔗' },
            { url: 'https://github.com/yourusername/ecommerce', label: 'GitHub', icon: '💻' }
        ]
    };
    
    return links[projectId] || [];
}

/* ===== LIGHTBOX FOR FULL-SIZE IMAGES ===== */
function initLightbox() {
    // Close lightbox button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
        
        // Previous image
        if (e.target.classList.contains('lightbox-prev')) {
            showPrevImage();
        }
        
        // Next image
        if (e.target.classList.contains('lightbox-next')) {
            showNextImage();
        }
    });

    // Close lightbox on backdrop click
    lightbox?.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox?.style.display === 'flex') {
            closeLightbox();
        }
        
        // Arrow key navigation
        if (lightbox?.style.display === 'flex') {
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
}

function attachThumbnailListeners() {
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            lightboxImages = JSON.parse(this.dataset.images);
            currentLightboxIndex = parseInt(this.dataset.index);
            openLightbox();
        });
    });
}

function openLightbox() {
    if (!lightbox || !lightboxImg || lightboxImages.length === 0) return;
    
    updateLightboxImage();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    console.log(`Lightbox: Opened image ${currentLightboxIndex + 1} of ${lightboxImages.length}`);
}

function closeLightbox() {
    if (!lightbox) return;
    
    lightbox.style.display = 'none';
    document.body.style.overflow = 'hidden'; // Keep modal scroll locked
    
    console.log('Lightbox: Closed');
}

function updateLightboxImage() {
    if (!lightboxImg) return;
    
    lightboxImg.src = lightboxImages[currentLightboxIndex];
    lightboxCurrent.textContent = currentLightboxIndex + 1;
    lightboxTotal.textContent = lightboxImages.length;
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}

/* ===== PROJECT DATA WITH BILINGUAL SUPPORT ===== */
function getProjectData(projectId) {
    const currentLang = document.documentElement.lang || 
                       (window.location.pathname.includes('/es/') ? 'es' : 'en');

    const projects = {
        ramos: {
            title: "Ramos Elite Scape",
            titleEs: "Ramos Elite Scape",
            description: `
                <h2>Ramos Elite Scape - Hardscape & Landscaping</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/ramos-elite/img2.webp" alt="Ramos Elite Scape Screenshot 2">
                    <img src="assets/images/projects/ramos-elite/img3.webp" alt="Ramos Elite Scape Screenshot 3">
                    <img src="assets/images/projects/ramos-elite/img4.webp" alt="Ramos Elite Scape Screenshot 4">
                    <img src="assets/images/projects/ramos-elite/img5.webp" alt="Ramos Elite Scape Screenshot 5">
                </div>
                <h3>Project Overview</h3>
                <p>Professional website for a hardscape and landscaping business in Statesville, NC. Built to showcase their services, portfolio, and contact information with a clean, modern design.</p>
                <h3>Key Features</h3>
                <ul>
                    <li>Responsive design that works on all devices</li>
                    <li>Service showcase with detailed descriptions</li>
                    <li>Photo gallery of completed projects</li>
                    <li>Contact form with email integration</li>
                    <li>Mobile-friendly navigation</li>
                </ul>
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Client Impact</h3>
                <p>The website helped Ramos Elite Scape establish a professional online presence, making it easier for potential customers to learn about their services and request quotes.</p>
            `,
            descriptionEs: `
                <h2>Ramos Elite Scape - Hardscape & Paisajismo</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/ramos-elite/img2.webp" alt="Captura de pantalla de Ramos Elite Scape 2">
                    <img src="../assets/images/projects/ramos-elite/img3.webp" alt="Captura de pantalla de Ramos Elite Scape 3">
                    <img src="../assets/images/projects/ramos-elite/img4.webp" alt="Captura de pantalla de Ramos Elite Scape 4">
                    <img src="../assets/images/projects/ramos-elite/img5.webp" alt="Captura de pantalla de Ramos Elite Scape 5">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Sitio web profesional para un negocio de hardscape y paisajismo en Statesville, NC. Construido para mostrar sus servicios, portafolio e información de contacto con un diseño limpio y moderno.</p>
                <h3>Características Principales</h3>
                <ul>
                    <li>Diseño responsivo que funciona en todos los dispositivos</li>
                    <li>Muestra de servicios con descripciones detalladas</li>
                    <li>Galería de fotos de proyectos completados</li>
                    <li>Formulario de contacto con integración de email</li>
                    <li>Navegación amigable para móviles</li>
                </ul>
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Impacto para el Cliente</h3>
                <p>El sitio web ayudó a Ramos Elite Scape a establecer una presencia profesional en línea, facilitando que los clientes potenciales aprendan sobre sus servicios y soliciten cotizaciones.</p>
            `
        },
        trak30: {
            title: "Trak30",
            titleEs: "Trak30",
            description: `
                <h2>Trak30 - Privacy-Focused Budget Tracker</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/trak30/img1.webp" alt="Trak30 Screenshot 1">
                    <img src="assets/images/projects/trak30/img2.webp" alt="Trak30 Screenshot 2">
                    <img src="assets/images/projects/trak30/img3.webp" alt="Trak30 Screenshot 3">
                    <img src="assets/images/projects/trak30/img4.webp" alt="Trak30 Screenshot 4">
                    <img src="assets/images/projects/trak30/img5.webp" alt="Trak30 Screenshot 5">
                    <img src="assets/images/projects/trak30/img6.webp" alt="Trak30 Screenshot 6">
                    <img src="assets/images/projects/trak30/img7.webp" alt="Trak30 Screenshot 7">
                </div>
                <h3>Project Overview</h3>
                <p>A comprehensive personal finance tracking application built for people who want accountability without compromising privacy. Trak30 is a complete SaaS product with no email signup required, no bank linking, and zero tracking — just you and your money.</p>
                
                <h3>Core Features</h3>
                <ul>
                    <li><strong>OCR Receipt Scanning:</strong> Snap a photo of any receipt and let AI extract the amount and date automatically using Tesseract.js</li>
                    <li><strong>Recurring Bill Automation:</strong> Set up bills once and the system auto-creates transactions on due dates via cron jobs</li>
                    <li><strong>Money Leak Detection:</strong> AI identifies small recurring expenses under $50 that add up over time (subscriptions, forgotten payments)</li>
                    <li><strong>Calendar View:</strong> Visual timeline showing all past transactions and upcoming bills</li>
                    <li><strong>Custom Categories:</strong> Create unlimited income and expense categories with custom icons and colors</li>
                    <li><strong>Analytics Dashboard:</strong> Spending trends, category breakdowns, income vs expenses charts, savings rate calculation</li>
                    <li><strong>Data Export:</strong> Download all transactions as CSV or PDF anytime — you own your data</li>
                    <li><strong>PWA (Progressive Web App):</strong> Install on any device, works completely offline</li>
                    <li><strong>No Email Required:</strong> Sign up with just username and password for maximum privacy</li>
                </ul>
                
                <h3>Privacy & Security</h3>
                <ul>
                    <li><strong>Bank-Level Security:</strong> JWT authentication with httpOnly cookies, bcrypt password hashing, HTTPS/TLS encryption</li>
                    <li><strong>Zero Tracking:</strong> No analytics, no ads, no selling data — completely privacy-focused</li>
                    <li><strong>No Bank Linking:</strong> Manual entry keeps your financial data 100% private (no third-party API risks)</li>
                    <li><strong>Rate Limiting:</strong> Protection against brute force attacks (5 login attempts per 15 minutes)</li>
                    <li><strong>Account Deletion:</strong> Permanent data removal on request</li>
                </ul>
                
                <h3>Technical Highlights</h3>
                <ul>
                    <li><strong>Automated Recurring Bills:</strong> Node-cron runs daily at 8 AM to check and create transactions for bills due today</li>
                    <li><strong>OCR Processing:</strong> Tesseract.js extracts transaction data from receipt photos</li>
                    <li><strong>JWT Authentication:</strong> Secure token-based auth with 7-day expiry</li>
                    <li><strong>MongoDB Database:</strong> User accounts, categories, transactions, and recurring bills all stored and indexed for performance</li>
                    <li><strong>Chart.js Visualizations:</strong> Interactive spending trends and analytics charts</li>
                    <li><strong>Service Worker:</strong> Full offline functionality via PWA</li>
                    <li><strong>Responsive Design:</strong> Mobile-first UI optimized for phones, tablets, and desktop</li>
                </ul>
                
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">MongoDB</span>
                    <span class="tech-badge">Mongoose</span>
                    <span class="tech-badge">JWT</span>
                    <span class="tech-badge">bcrypt</span>
                    <span class="tech-badge">Tesseract.js</span>
                    <span class="tech-badge">node-cron</span>
                    <span class="tech-badge">Multer</span>
                    <span class="tech-badge">Chart.js</span>
                    <span class="tech-badge">PWA</span>
                    <span class="tech-badge">Service Worker</span>
                    <span class="tech-badge">Helmet.js</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">Vanilla JavaScript</span>
                </div>
                
                <h3>Database Architecture</h3>
                <ul>
                    <li><strong>Users:</strong> Accounts with bcrypt-hashed passwords, timezone preferences, household settings</li>
                    <li><strong>Categories:</strong> Custom income/expense categories with usage tracking for smart sorting</li>
                    <li><strong>Transactions:</strong> All financial records with category links, dates, OCR text, recurring flags</li>
                    <li><strong>Recurring Bills:</strong> Templates for automated bill creation with frequency settings and next-due calculations</li>
                </ul>
                
                <h3>Why It Matters</h3>
                <p>Trak30 demonstrates expertise in building production SaaS applications with:</p>
                <ul>
                    <li>Complex user authentication and security (JWT, bcrypt, rate limiting)</li>
                    <li>Automated background processes (cron jobs for recurring bills)</li>
                    <li>AI/ML integration (OCR receipt scanning with Tesseract)</li>
                    <li>Advanced data visualization (Chart.js analytics)</li>
                    <li>Progressive Web App implementation (offline-first architecture)</li>
                    <li>Privacy-first design (no email, no tracking, no bank linking)</li>
                    <li>File upload handling (receipt images via Multer)</li>
                    <li>Database optimization (indexed queries, usage tracking)</li>
                </ul>
                
                <h3>Impact</h3>
                <p>Built as a privacy-focused alternative to bloated finance apps like Mint or YNAB. Users get complete control over their financial data without needing to link bank accounts or share personal information. The OCR feature and automated recurring bills save hours of manual entry while maintaining zero third-party data exposure.</p>
            `,
            descriptionEs: `
                <h2>Trak30 - Rastreador de Presupuesto Enfocado en Privacidad</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/trak30/img1.webp" alt="Captura de pantalla de Trak30 1">
                    <img src="../assets/images/projects/trak30/img2.webp" alt="Captura de pantalla de Trak30 2">
                    <img src="../assets/images/projects/trak30/img3.webp" alt="Captura de pantalla de Trak30 3">
                    <img src="../assets/images/projects/trak30/img4.webp" alt="Captura de pantalla de Trak30 4">
                    <img src="../assets/images/projects/trak30/img5.webp" alt="Captura de pantalla de Trak30 5">
                    <img src="../assets/images/projects/trak30/img6.webp" alt="Captura de pantalla de Trak30 6">
                    <img src="../assets/images/projects/trak30/img7.webp" alt="Captura de pantalla de Trak30 7">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Una aplicación completa de seguimiento de finanzas personales construida para personas que quieren responsabilidad sin comprometer su privacidad. Trak30 es un producto SaaS completo sin registro de email requerido, sin vincular bancos, y cero rastreo — solo tú y tu dinero.</p>
                
                <h3>Características Principales</h3>
                <ul>
                    <li><strong>Escaneo OCR de Recibos:</strong> Toma una foto de cualquier recibo y deja que la IA extraiga el monto y fecha automáticamente usando Tesseract.js</li>
                    <li><strong>Automatización de Facturas Recurrentes:</strong> Configura facturas una vez y el sistema auto-crea transacciones en las fechas de vencimiento vía cron jobs</li>
                    <li><strong>Detección de Fugas de Dinero:</strong> IA identifica pequeños gastos recurrentes bajo $50 que se acumulan con el tiempo (suscripciones, pagos olvidados)</li>
                    <li><strong>Vista de Calendario:</strong> Línea de tiempo visual mostrando todas las transacciones pasadas y facturas próximas</li>
                    <li><strong>Categorías Personalizadas:</strong> Crea categorías ilimitadas de ingresos y gastos con iconos y colores personalizados</li>
                    <li><strong>Panel de Analíticas:</strong> Tendencias de gastos, desgloses por categoría, gráficos de ingresos vs gastos, cálculo de tasa de ahorro</li>
                    <li><strong>Exportación de Datos:</strong> Descarga todas las transacciones como CSV o PDF en cualquier momento — tú posees tus datos</li>
                    <li><strong>PWA (Progressive Web App):</strong> Instala en cualquier dispositivo, funciona completamente sin conexión</li>
                    <li><strong>Sin Email Requerido:</strong> Regístrate solo con nombre de usuario y contraseña para máxima privacidad</li>
                </ul>
                
                <h3>Privacidad y Seguridad</h3>
                <ul>
                    <li><strong>Seguridad de Nivel Bancario:</strong> Autenticación JWT con cookies httpOnly, hashing de contraseñas bcrypt, encriptación HTTPS/TLS</li>
                    <li><strong>Cero Rastreo:</strong> Sin analíticas, sin anuncios, sin venta de datos — completamente enfocado en privacidad</li>
                    <li><strong>Sin Vincular Bancos:</strong> Entrada manual mantiene tus datos financieros 100% privados (sin riesgos de APIs de terceros)</li>
                    <li><strong>Limitación de Tasa:</strong> Protección contra ataques de fuerza bruta (5 intentos de login por 15 minutos)</li>
                    <li><strong>Eliminación de Cuenta:</strong> Eliminación permanente de datos a petición</li>
                </ul>
                
                <h3>Aspectos Técnicos Destacados</h3>
                <ul>
                    <li><strong>Facturas Recurrentes Automatizadas:</strong> Node-cron se ejecuta diariamente a las 8 AM para verificar y crear transacciones para facturas vencidas hoy</li>
                    <li><strong>Procesamiento OCR:</strong> Tesseract.js extrae datos de transacciones de fotos de recibos</li>
                    <li><strong>Autenticación JWT:</strong> Autenticación segura basada en tokens con expiración de 7 días</li>
                    <li><strong>Base de Datos MongoDB:</strong> Cuentas de usuario, categorías, transacciones y facturas recurrentes almacenadas e indexadas para rendimiento</li>
                    <li><strong>Visualizaciones Chart.js:</strong> Gráficos interactivos de tendencias de gastos y analíticas</li>
                    <li><strong>Service Worker:</strong> Funcionalidad completa sin conexión vía PWA</li>
                    <li><strong>Diseño Responsivo:</strong> UI mobile-first optimizada para teléfonos, tablets y escritorio</li>
                </ul>
                
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">MongoDB</span>
                    <span class="tech-badge">Mongoose</span>
                    <span class="tech-badge">JWT</span>
                    <span class="tech-badge">bcrypt</span>
                    <span class="tech-badge">Tesseract.js</span>
                    <span class="tech-badge">node-cron</span>
                    <span class="tech-badge">Multer</span>
                    <span class="tech-badge">Chart.js</span>
                    <span class="tech-badge">PWA</span>
                    <span class="tech-badge">Service Worker</span>
                    <span class="tech-badge">Helmet.js</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">Vanilla JavaScript</span>
                </div>
                
                <h3>Arquitectura de Base de Datos</h3>
                <ul>
                    <li><strong>Usuarios:</strong> Cuentas con contraseñas hasheadas bcrypt, preferencias de zona horaria, configuraciones del hogar</li>
                    <li><strong>Categorías:</strong> Categorías personalizadas de ingresos/gastos con seguimiento de uso para ordenamiento inteligente</li>
                    <li><strong>Transacciones:</strong> Todos los registros financieros con enlaces de categoría, fechas, texto OCR, banderas recurrentes</li>
                    <li><strong>Facturas Recurrentes:</strong> Plantillas para creación automatizada de facturas con configuraciones de frecuencia y cálculos de próximo vencimiento</li>
                </ul>
                
                <h3>Por Qué es Importante</h3>
                <p>Trak30 demuestra experiencia en construir aplicaciones SaaS de producción con:</p>
                <ul>
                    <li>Autenticación de usuario compleja y seguridad (JWT, bcrypt, limitación de tasa)</li>
                    <li>Procesos automatizados en segundo plano (cron jobs para facturas recurrentes)</li>
                    <li>Integración AI/ML (escaneo OCR de recibos con Tesseract)</li>
                    <li>Visualización avanzada de datos (analíticas Chart.js)</li>
                    <li>Implementación Progressive Web App (arquitectura offline-first)</li>
                    <li>Diseño privacy-first (sin email, sin rastreo, sin vincular bancos)</li>
                    <li>Manejo de carga de archivos (imágenes de recibos vía Multer)</li>
                    <li>Optimización de base de datos (consultas indexadas, seguimiento de uso)</li>
                </ul>
                
                <h3>Impacto</h3>
                <p>Construido como una alternativa enfocada en privacidad a aplicaciones financieras infladas como Mint o YNAB. Los usuarios obtienen control completo sobre sus datos financieros sin necesidad de vincular cuentas bancarias o compartir información personal. La función OCR y las facturas recurrentes automatizadas ahorran horas de entrada manual mientras mantienen cero exposición de datos a terceros.</p>
            `
        },
        rucker: {
            title: "Rucker Dentistry",
            titleEs: "Rucker Dentistry",
            description: `
                <h2>Rucker Dentistry - Dental Practice Website</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/rucker-dentistry/img1.webp" alt="Rucker Dentistry Screenshot 1">
                    <img src="assets/images/projects/rucker-dentistry/img2.webp" alt="Rucker Dentistry Screenshot 2">
                    <img src="assets/images/projects/rucker-dentistry/img3.webp" alt="Rucker Dentistry Screenshot 3">
                    <img src="assets/images/projects/rucker-dentistry/img4.webp" alt="Rucker Dentistry Screenshot 4">
                    <img src="assets/images/projects/rucker-dentistry/img5.webp" alt="Rucker Dentistry Screenshot 5">
                    <img src="assets/images/projects/rucker-dentistry/img6.webp" alt="Rucker Dentistry Screenshot 6">
                    <img src="assets/images/projects/rucker-dentistry/img7.webp" alt="Rucker Dentistry Screenshot 7">
                    <img src="assets/images/projects/rucker-dentistry/img8.webp" alt="Rucker Dentistry Screenshot 8">
                    <img src="assets/images/projects/rucker-dentistry/img9.webp" alt="Rucker Dentistry Screenshot 9">
                    <img src="assets/images/projects/rucker-dentistry/img10.webp" alt="Rucker Dentistry Screenshot 10">
                    <img src="assets/images/projects/rucker-dentistry/img11.webp" alt="Rucker Dentistry Screenshot 11">
                    <img src="assets/images/projects/rucker-dentistry/img12.webp" alt="Rucker Dentistry Screenshot 12">
                    <img src="assets/images/projects/rucker-dentistry/img13.webp" alt="Rucker Dentistry Screenshot 13">
                    <img src="assets/images/projects/rucker-dentistry/img14.webp" alt="Rucker Dentistry Screenshot 14">
                    <img src="assets/images/projects/rucker-dentistry/img15.webp" alt="Rucker Dentistry Screenshot 15">
                </div>
                <h3>Project Overview</h3>
                <p>Professional website for a dental practice in Lancaster, SC. Designed to provide patients with easy access to information about services, appointments, and contact details.</p>
                <h3>Key Features</h3>
                <ul>
                    <li>Service descriptions and dental care information</li>
                    <li>Online appointment request form</li>
                    <li>Patient resources and FAQs</li>
                    <li>Responsive design for mobile and desktop</li>
                    <li>Contact information and office hours</li>
                </ul>
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Client Impact</h3>
                <p>The website improved patient communication and made it easier for new patients to learn about available services and schedule appointments.</p>
            `,
            descriptionEs: `
                <h2>Rucker Dentistry - Sitio Web de Consultorio Dental</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/rucker-dentistry/img1.webp" alt="Captura de pantalla de Rucker Dentistry 1">
                    <img src="../assets/images/projects/rucker-dentistry/img2.webp" alt="Captura de pantalla de Rucker Dentistry 2">
                    <img src="../assets/images/projects/rucker-dentistry/img3.webp" alt="Captura de pantalla de Rucker Dentistry 3">
                    <img src="../assets/images/projects/rucker-dentistry/img4.webp" alt="Captura de pantalla de Rucker Dentistry 4">
                    <img src="../assets/images/projects/rucker-dentistry/img5.webp" alt="Captura de pantalla de Rucker Dentistry 5">
                    <img src="../assets/images/projects/rucker-dentistry/img6.webp" alt="Captura de pantalla de Rucker Dentistry 6">
                    <img src="../assets/images/projects/rucker-dentistry/img7.webp" alt="Captura de pantalla de Rucker Dentistry 7">
                    <img src="../assets/images/projects/rucker-dentistry/img8.webp" alt="Captura de pantalla de Rucker Dentistry 8">
                    <img src="../assets/images/projects/rucker-dentistry/img9.webp" alt="Captura de pantalla de Rucker Dentistry 9">
                    <img src="../assets/images/projects/rucker-dentistry/img10.webp" alt="Captura de pantalla de Rucker Dentistry 10">
                    <img src="../assets/images/projects/rucker-dentistry/img11.webp" alt="Captura de pantalla de Rucker Dentistry 11">
                    <img src="../assets/images/projects/rucker-dentistry/img12.webp" alt="Captura de pantalla de Rucker Dentistry 12">
                    <img src="../assets/images/projects/rucker-dentistry/img13.webp" alt="Captura de pantalla de Rucker Dentistry 13">
                    <img src="../assets/images/projects/rucker-dentistry/img14.webp" alt="Captura de pantalla de Rucker Dentistry 14">
                    <img src="../assets/images/projects/rucker-dentistry/img15.webp" alt="Captura de pantalla de Rucker Dentistry 15">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Sitio web profesional para un consultorio dental en Lancaster, SC. Diseñado para proporcionar a los pacientes acceso fácil a información sobre servicios, citas y detalles de contacto.</p>
                <h3>Características Principales</h3>
                <ul>
                    <li>Descripciones de servicios e información de cuidado dental</li>
                    <li>Formulario de solicitud de citas en línea</li>
                    <li>Recursos para pacientes y preguntas frecuentes</li>
                    <li>Diseño responsivo para móvil y escritorio</li>
                    <li>Información de contacto y horario de oficina</li>
                </ul>
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Impacto para el Cliente</h3>
                <p>El sitio web mejoró la comunicación con los pacientes y facilitó que nuevos pacientes aprendieran sobre los servicios disponibles y programaran citas.</p>
            `
        },
        honeymilk: {
            title: "Honey & Milk Lactation",
            titleEs: "Honey & Milk Lactation",
            description: `
                <h2>Honey & Milk Lactation - Consultation Services</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/honey-milk/img2.webp" alt="Honey & Milk Screenshot 2">
                    <img src="assets/images/projects/honey-milk/img4.webp" alt="Honey & Milk Screenshot 4">
                    <img src="assets/images/projects/honey-milk/img5.webp" alt="Honey & Milk Screenshot 5">
                    <img src="assets/images/projects/honey-milk/img11.webp" alt="Honey & Milk Screenshot 11">
                </div>
                <h3>Project Overview</h3>
                <p>Website for a lactation consulting service in Lancaster, SC. Built to help new mothers find support and schedule consultations.</p>
                <h3>Key Features</h3>
                <ul>
                    <li>Service information and consultant credentials</li>
                    <li>Online booking system</li>
                    <li>Educational resources for new mothers</li>
                    <li>Contact form with email notifications</li>
                    <li>Mobile-responsive design</li>
                </ul>
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Client Impact</h3>
                <p>The website made it easier for new mothers to access lactation support and schedule consultations, improving client communication and booking efficiency.</p>
            `,
            descriptionEs: `
                <h2>Honey & Milk Lactation - Servicios de Consultoría</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/honey-milk/img2.webp" alt="Captura de pantalla de Honey & Milk 2">
                    <img src="../assets/images/projects/honey-milk/img4.webp" alt="Captura de pantalla de Honey & Milk 4">
                    <img src="../assets/images/projects/honey-milk/img5.webp" alt="Captura de pantalla de Honey & Milk 5">
                    <img src="../assets/images/projects/honey-milk/img11.webp" alt="Captura de pantalla de Honey & Milk 11">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Sitio web para un servicio de consultoría de lactancia en Lancaster, SC. Construido para ayudar a nuevas madres a encontrar apoyo y programar consultas.</p>
                <h3>Características Principales</h3>
                <ul>
                    <li>Información de servicios y credenciales de la consultora</li>
                    <li>Sistema de reservas en línea</li>
                    <li>Recursos educativos para nuevas madres</li>
                    <li>Formulario de contacto con notificaciones por email</li>
                    <li>Diseño responsivo para móviles</li>
                </ul>
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Impacto para el Cliente</h3>
                <p>El sitio web facilitó que las nuevas madres accedan a apoyo de lactancia y programen consultas, mejorando la comunicación con clientes y la eficiencia de reservas.</p>
            `
        },
        gyderne: {
            title: "Gyderne",
            titleEs: "Gyderne",
            description: `
                <h2>Gyderne - AI-Powered Education Platform</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/gyderne/img1.webp" alt="Gyderne Screenshot 1">
                    <img src="assets/images/projects/gyderne/img2.webp" alt="Gyderne Screenshot 2">
                    <img src="assets/images/projects/gyderne/img3.webp" alt="Gyderne Screenshot 3">
                    <img src="assets/images/projects/gyderne/img4.webp" alt="Gyderne Screenshot 4">
                    <img src="assets/images/projects/gyderne/img5.webp" alt="Gyderne Screenshot 5">
                    <img src="assets/images/projects/gyderne/img6.webp" alt="Gyderne Screenshot 6">
                    <img src="assets/images/projects/gyderne/img7.webp" alt="Gyderne Screenshot 7">
                </div>
                <h3>Project Overview</h3>
                <p>A comprehensive AI-powered education platform that has been in production for over 5 years. Designed to help students learn mathematics with step-by-step reasoning and peer review.</p>
                <h3>Key Features</h3>
                <ul>
                    <li>AI-powered math reasoning with LaTeX/MathJax rendering</li>
                    <li>Peer review system for student work</li>
                    <li>Interactive problem-solving tools</li>
                    <li>Progress tracking and analytics</li>
                    <li>Multi-user support with different permission levels</li>
                </ul>
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">MongoDB</span>
                    <span class="tech-badge">LaTeX</span>
                    <span class="tech-badge">MathJax</span>
                </div>
                <h3>Why It Matters</h3>
                <p>Gyderne has been helping students improve their math skills for over 5 years, providing a robust platform for learning and peer collaboration.</p>
            `,
            descriptionEs: `
                <h2>Gyderne - Plataforma Educativa con IA</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/gyderne/img1.webp" alt="Captura de pantalla de Gyderne 1">
                    <img src="../assets/images/projects/gyderne/img2.webp" alt="Captura de pantalla de Gyderne 2">
                    <img src="../assets/images/projects/gyderne/img3.webp" alt="Captura de pantalla de Gyderne 3">
                    <img src="../assets/images/projects/gyderne/img4.webp" alt="Captura de pantalla de Gyderne 4">
                    <img src="../assets/images/projects/gyderne/img5.webp" alt="Captura de pantalla de Gyderne 5">
                    <img src="../assets/images/projects/gyderne/img6.webp" alt="Captura de pantalla de Gyderne 6">
                    <img src="../assets/images/projects/gyderne/img7.webp" alt="Captura de pantalla de Gyderne 7">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Una plataforma educativa completa impulsada por IA que ha estado en producción por más de 5 años. Diseñada para ayudar a estudiantes a aprender matemáticas con razonamiento paso a paso y revisión de pares.</p>
                <h3>Características Principales</h3>
                <ul>
                    <li>Razonamiento matemático con IA y renderizado LaTeX/MathJax</li>
                    <li>Sistema de revisión de pares para trabajo estudiantil</li>
                    <li>Herramientas interactivas para resolución de problemas</li>
                    <li>Seguimiento de progreso y analíticas</li>
                    <li>Soporte multi-usuario con diferentes niveles de permisos</li>
                </ul>
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">MongoDB</span>
                    <span class="tech-badge">LaTeX</span>
                    <span class="tech-badge">MathJax</span>
                </div>
                <h3>Por Qué es Importante</h3>
                <p>Gyderne ha estado ayudando a estudiantes a mejorar sus habilidades matemáticas por más de 5 años, proporcionando una plataforma robusta para aprendizaje y colaboración entre pares.</p>
            `
        },
        construccion: {
            title: "Construcción Robledo",
            titleEs: "Construcción Robledo",
            description: `
                <h2>Construcción Robledo - Civil Engineering Business</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/construccion-robledo/img1.webp" alt="Construccion Robledo Screenshot 1">
                    <img src="assets/images/projects/construccion-robledo/img2.webp" alt="Construccion Robledo Screenshot 2">
                    <img src="assets/images/projects/construccion-robledo/img3.webp" alt="Construccion Robledo Screenshot 3">
                    <img src="assets/images/projects/construccion-robledo/img4.webp" alt="Construccion Robledo Screenshot 4">
                    <img src="assets/images/projects/construccion-robledo/img5.webp" alt="Construccion Robledo Screenshot 5">
                </div>
                <h3>Project Overview</h3>
                <p>Professional website for a civil engineering and construction business. Built entirely in Spanish to serve the Latino market.</p>
                <h3>Key Features</h3>
                <ul>
                    <li>Bilingual content (Spanish primary)</li>
                    <li>Service portfolio and project showcase</li>
                    <li>Contact forms with email integration</li>
                    <li>Responsive design for all devices</li>
                    <li>SEO optimized for local search</li>
                </ul>
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Client Impact</h3>
                <p>Helped establish a professional online presence for the business, making it easier to reach potential clients in the Spanish-speaking community.</p>
            `,
            descriptionEs: `
                <h2>Construcción Robledo - Negocio de Ingeniería Civil</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/construccion-robledo/img1.webp" alt="Captura de pantalla de Construcción Robledo 1">
                    <img src="../assets/images/projects/construccion-robledo/img2.webp" alt="Captura de pantalla de Construcción Robledo 2">
                    <img src="../assets/images/projects/construccion-robledo/img3.webp" alt="Captura de pantalla de Construcción Robledo 3">
                    <img src="../assets/images/projects/construccion-robledo/img4.webp" alt="Captura de pantalla de Construcción Robledo 4">
                    <img src="../assets/images/projects/construccion-robledo/img5.webp" alt="Captura de pantalla de Construcción Robledo 5">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Sitio web profesional para un negocio de ingeniería civil y construcción. Construido completamente en español para servir al mercado latino.</p>
                <h3>Características Principales</h3>
                <ul>
                    <li>Contenido bilingüe (español principal)</li>
                    <li>Portafolio de servicios y muestra de proyectos</li>
                    <li>Formularios de contacto con integración de email</li>
                    <li>Diseño responsivo para todos los dispositivos</li>
                    <li>Optimizado SEO para búsqueda local</li>
                </ul>
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Nodemailer</span>
                </div>
                <h3>Impacto para el Cliente</h3>
                <p>Ayudó a establecer una presencia profesional en línea para el negocio, facilitando alcanzar clientes potenciales en la comunidad de habla hispana.</p>
            `
        },
        cosmic: {
            title: "Cosmic Cassy",
            titleEs: "Cosmic Cassy",
            description: `
                <h2>Cosmic Cassy - Childhood Cancer Resource Platform</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/cosmic-cassy/img1.webp" alt="Cosmic Cassy Screenshot 1">
                    <img src="assets/images/projects/cosmic-cassy/img2.webp" alt="Cosmic Cassy Screenshot 2">
                    <img src="assets/images/projects/cosmic-cassy/img3.webp" alt="Cosmic Cassy Screenshot 3">
                    <img src="assets/images/projects/cosmic-cassy/img4.webp" alt="Cosmic Cassy Screenshot 4">
                    <img src="assets/images/projects/cosmic-cassy/img5.webp" alt="Cosmic Cassy Screenshot 5">
                    <img src="assets/images/projects/cosmic-cassy/img7.webp" alt="Cosmic Cassy Screenshot 7">
                    <img src="assets/images/projects/cosmic-cassy/img8.webp" alt="Cosmic Cassy Screenshot 8">
                    <img src="assets/images/projects/cosmic-cassy/img9.webp" alt="Cosmic Cassy Screenshot 9">
                </div>
                <h3>Project Overview</h3>
                <p>A comprehensive resource management platform designed specifically for families dealing with childhood cancer. This system provides curated, verified resources for medical, financial, emotional, practical, and educational support with advanced filtering, location detection, and community-driven quality control.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li><strong>Intelligent Location Detection:</strong> Auto-detects user's state from timezone or saved profile for relevant local resources</li>
                    <li><strong>Advanced Resource Filtering:</strong> Search by state, category, keywords with real-time updates</li>
                    <li><strong>User Engagement System:</strong> Vote resources as helpful, report issues, track analytics</li>
                    <li><strong>Admin Moderation Panel:</strong> Complete resource management, URL verification, report handling</li>
                    <li><strong>Blog Platform:</strong> AI-assisted writing tools for content creation with grammar checking and title generation</li>
                    <li><strong>Analytics Dashboard:</strong> Track views, clicks, helpful votes, and engagement metrics</li>
                    <li><strong>Automated URL Verification:</strong> System checks resource links and flags broken URLs</li>
                    <li><strong>User Authentication:</strong> Secure login, email verification, password reset functionality</li>
                    <li><strong>Spam Protection:</strong> Honeypot fields and time-based validation on contact forms</li>
                </ul>
                
                <h3>Database Architecture</h3>
                <ul>
                    <li><strong>Resource Management:</strong> Complete CRUD operations with status tracking and verification</li>
                    <li><strong>Report System:</strong> User-submitted reports with admin moderation workflow</li>
                    <li><strong>State Caching:</strong> Optimized queries for state-specific resource delivery</li>
                    <li><strong>Session Management:</strong> Secure user sessions with MongoDB storage</li>
                    <li><strong>Contact Submissions:</strong> Logs all contact form submissions with spam detection</li>
                </ul>
                
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">MongoDB</span>
                    <span class="tech-badge">Mongoose</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Vanilla JavaScript</span>
                    <span class="tech-badge">Nodemailer</span>
                    <span class="tech-badge">bcrypt</span>
                    <span class="tech-badge">IntersectionObserver API</span>
                </div>
                
                <h3>Why It Matters</h3>
                <p>Cosmic Cassy demonstrates expertise in building complex, production-ready web applications with:</p>
                <ul>
                    <li>Multi-user authentication and authorization systems</li>
                    <li>Advanced database design with multiple related collections</li>
                    <li>Real-time filtering and search functionality</li>
                    <li>Admin panel with moderation workflows</li>
                    <li>API design for public and authenticated endpoints</li>
                    <li>Client-side state management and event handling</li>
                    <li>Security best practices (input validation, spam protection, rate limiting)</li>
                    <li>Performance optimization (database indexes, event delegation, lazy loading)</li>
                </ul>
                
                <h3>Impact</h3>
                <p>This platform helps families navigate the overwhelming challenge of finding verified, helpful resources during one of the most difficult times in their lives. The system ensures resource quality through community voting and admin verification while providing intelligent filtering to show the most relevant resources based on location and needs.</p>
            `,
            descriptionEs: `
                <h2>Cosmic Cassy - Plataforma de Recursos para Cáncer Infantil</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/cosmic-cassy/img1.webp" alt="Captura de pantalla de Cosmic Cassy 1">
                    <img src="../assets/images/projects/cosmic-cassy/img2.webp" alt="Captura de pantalla de Cosmic Cassy 2">
                    <img src="../assets/images/projects/cosmic-cassy/img3.webp" alt="Captura de pantalla de Cosmic Cassy 3">
                    <img src="../assets/images/projects/cosmic-cassy/img4.webp" alt="Captura de pantalla de Cosmic Cassy 4">
                    <img src="../assets/images/projects/cosmic-cassy/img5.webp" alt="Captura de pantalla de Cosmic Cassy 5">
                    <img src="../assets/images/projects/cosmic-cassy/img7.webp" alt="Captura de pantalla de Cosmic Cassy 7">
                    <img src="../assets/images/projects/cosmic-cassy/img8.webp" alt="Captura de pantalla de Cosmic Cassy 8">
                    <img src="../assets/images/projects/cosmic-cassy/img9.webp" alt="Captura de pantalla de Cosmic Cassy 9">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Una plataforma completa de gestión de recursos diseñada específicamente para familias que enfrentan cáncer infantil. Este sistema proporciona recursos curados y verificados para apoyo médico, financiero, emocional, práctico y educativo con filtrado avanzado, detección de ubicación y control de calidad impulsado por la comunidad.</p>
                
                <h3>Características Principales</h3>
                <ul>
                    <li><strong>Detección Inteligente de Ubicación:</strong> Auto-detecta el estado del usuario desde zona horaria o perfil guardado para recursos locales relevantes</li>
                    <li><strong>Filtrado Avanzado de Recursos:</strong> Búsqueda por estado, categoría, palabras clave con actualizaciones en tiempo real</li>
                    <li><strong>Sistema de Participación de Usuarios:</strong> Votar recursos como útiles, reportar problemas, rastrear analíticas</li>
                    <li><strong>Panel de Moderación Admin:</strong> Gestión completa de recursos, verificación de URLs, manejo de reportes</li>
                    <li><strong>Plataforma de Blog:</strong> Herramientas de escritura asistida por IA para creación de contenido con revisión gramatical y generación de títulos</li>
                    <li><strong>Panel de Analíticas:</strong> Rastrear vistas, clics, votos útiles y métricas de participación</li>
                    <li><strong>Verificación Automatizada de URLs:</strong> Sistema verifica enlaces de recursos y marca URLs rotas</li>
                    <li><strong>Autenticación de Usuarios:</strong> Login seguro, verificación de email, funcionalidad de restablecimiento de contraseña</li>
                    <li><strong>Protección contra Spam:</strong> Campos honeypot y validación basada en tiempo en formularios de contacto</li>
                </ul>
                
                <h3>Arquitectura de Base de Datos</h3>
                <ul>
                    <li><strong>Gestión de Recursos:</strong> Operaciones CRUD completas con seguimiento de estado y verificación</li>
                    <li><strong>Sistema de Reportes:</strong> Reportes enviados por usuarios con flujo de trabajo de moderación admin</li>
                    <li><strong>Caché de Estados:</strong> Consultas optimizadas para entrega de recursos específicos del estado</li>
                    <li><strong>Gestión de Sesiones:</strong> Sesiones de usuario seguras con almacenamiento MongoDB</li>
                    <li><strong>Envíos de Contacto:</strong> Registra todos los envíos de formularios de contacto con detección de spam</li>
                </ul>
                
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">MongoDB</span>
                    <span class="tech-badge">Mongoose</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">Vanilla JavaScript</span>
                    <span class="tech-badge">Nodemailer</span>
                    <span class="tech-badge">bcrypt</span>
                    <span class="tech-badge">IntersectionObserver API</span>
                </div>
                
                <h3>Por Qué es Importante</h3>
                <p>Cosmic Cassy demuestra experiencia en construir aplicaciones web complejas y listas para producción con:</p>
                <ul>
                    <li>Sistemas de autenticación y autorización multi-usuario</li>
                    <li>Diseño avanzado de base de datos con múltiples colecciones relacionadas</li>
                    <li>Funcionalidad de filtrado y búsqueda en tiempo real</li>
                    <li>Panel de administración con flujos de trabajo de moderación</li>
                    <li>Diseño de API para endpoints públicos y autenticados</li>
                    <li>Gestión de estado del lado del cliente y manejo de eventos</li>
                    <li>Mejores prácticas de seguridad (validación de entradas, protección contra spam, limitación de tasa)</li>
                    <li>Optimización de rendimiento (índices de base de datos, delegación de eventos, carga perezosa)</li>
                </ul>
                
                <h3>Impacto</h3>
                <p>Esta plataforma ayuda a familias a navegar el desafío abrumador de encontrar recursos verificados y útiles durante uno de los momentos más difíciles de sus vidas. El sistema asegura la calidad de recursos a través de votación comunitaria y verificación admin mientras proporciona filtrado inteligente para mostrar los recursos más relevantes basados en ubicación y necesidades.</p>
            `
        },
        neural: {
            title: "Neural Legacy",
            titleEs: "Neural Legacy",
            description: `
                <h2>Neural Legacy - 3D Memory Archive Desktop Software</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/neural-legacy/img1.webp" alt="Neural Legacy Screenshot 1">
                </div>
                <h3>The Vision</h3>
                <p>Imagine opening an app and seeing a glowing 3D universe. At the center is a pulsing core of light. Branching out from it are glowing spheres — each one represents a category like Family Photos, Dad's Wisdom, or Wedding Videos. Click on a category, and you zoom toward it. Orbiting around it are smaller glowing nodes — individual memories. Each one pulses gently with life.</p>
                <p><strong>No cloud. No internet. No subscriptions. Just you and your legacy.</strong></p>
                
                <h3>The Technical Challenge</h3>
                <p>Building a 3D universe isn't hard. Making it perform with 1000+ memories at 60 FPS? That's the real engineering.</p>
                
                <h3>Performance Optimization</h3>
                <ul>
                    <li><strong>Instanced Rendering:</strong> Instead of creating 1000 separate 3D objects, one base geometry is instanced 1000 times. Result: 1000 nodes = just 2 draw calls instead of 1000. Massive performance gain.</li>
                    <li><strong>Level of Detail (LOD) System:</strong> Memories close to camera get full detail with particles and animations. 50-200 units away get simplified geometry. Beyond 200 units? Simple spheres. Beyond 500? Not rendered at all (frustum culling).</li>
                    <li><strong>Dynamic Particle Budget:</strong> Only nearby nodes get particle effects. System intelligently allocates 5,000 particles, giving 200 to close nodes, 50 to medium-distance nodes, zero to far ones.</li>
                    <li><strong>Pre-calculated Positions:</strong> All 3D positions calculated once using Fibonacci sphere distribution and stored in database. On load: zero calculation, instant rendering.</li>
                    <li><strong>Merged Branch Geometry:</strong> All connecting branches merged into ONE mesh. 100 branches = 1 draw call instead of 100.</li>
                    <li><strong>Smart Animation System:</strong> Nodes only animate within 100 units of camera. Beyond that, animations freeze to save CPU.</li>
                </ul>
                
                <h3>Key Features</h3>
                <ul>
                    <li><strong>3D Neural Tree Visualization:</strong> Glowing spheres connected by pulsing neural branches, creating an organic tree-like structure</li>
                    <li><strong>Multi-User Permissions System:</strong> Owner has full control, family members get custom access, permissions cascade down categories</li>
                    <li><strong>Universal Content Support:</strong> Videos (MP4, WebM, MOV), images (JPG, PNG, GIF, WebP) with gallery, audio (MP3, WAV, M4A) with waveform, text with Markdown, PDFs with page navigation</li>
                    <li><strong>Local Server Architecture:</strong> Electron app runs local Express server, displays IP address for mobile Wi-Fi access — upload from phone to desktop instantly</li>
                    <li><strong>100% Offline:</strong> All files stored locally in SQLite database, no cloud dependencies, works forever</li>
                    <li><strong>Performance Presets:</strong> Low (30 FPS), Medium (60 FPS balanced), High (60 FPS all effects), Ultra (120 FPS maximum quality)</li>
                    <li><strong>Mobile-First Upload Interface:</strong> Touch-friendly buttons (44px minimum), large text, bottom navigation, camera-direct upload</li>
                    <li><strong>Lazy Content Loading:</strong> Videos and images only load when clicked — keeps memory usage low</li>
                </ul>
                
                <h3>Architecture Highlights</h3>
                <ul>
                    <li><strong>Desktop:</strong> Electron app with local Express server</li>
                    <li><strong>3D Engine:</strong> Babylon.js (better performance than Three.js for this use case)</li>
                    <li><strong>Database:</strong> SQLite (Better-SQLite3) — completely offline, unlimited storage</li>
                    <li><strong>Mobile Access:</strong> Progressive Web App accessible via local IP (e.g., http://192.168.1.100:3000)</li>
                    <li><strong>Frontend:</strong> Vanilla JavaScript (ES6 modules), Pure CSS3</li>
                </ul>
                
                <h3>Performance Achieved</h3>
                <ul>
                    <li><strong>60 FPS</strong> with 1000+ nodes (medium preset)</li>
                    <li><strong>&lt;3 second</strong> load times</li>
                    <li><strong>&lt;500MB</strong> memory footprint</li>
                    <li><strong>Instant</strong> mobile uploads via local Wi-Fi</li>
                </ul>
                
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Electron</span>
                    <span class="tech-badge">Babylon.js</span>
                    <span class="tech-badge">SQLite</span>
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">3D Graphics</span>
                    <span class="tech-badge">Instanced Rendering</span>
                    <span class="tech-badge">LOD System</span>
                    <span class="tech-badge">Frustum Culling</span>
                    <span class="tech-badge">PWA</span>
                </div>
                
                <h3>Why This Matters</h3>
                <p>This project demonstrates advanced software engineering:</p>
                <ul>
                    <li>High-performance 3D rendering optimization (instancing, LOD, frustum culling)</li>
                    <li>Desktop application development with local server architecture</li>
                    <li>Mobile-first responsive design principles</li>
                    <li>Database architecture for offline-first applications</li>
                    <li>Multi-user permission systems</li>
                    <li>Real-time 3D camera controls and navigation</li>
                    <li>Cross-platform compatibility (Windows/macOS)</li>
                </ul>
                
                <h3>The Big Idea</h3>
                <p>Cloud storage companies want you to keep paying monthly fees. They control your data. They can shut down. Your memories are hostage to their business model.</p>
                <p>Neural Legacy flips that: you own it completely. One-time purchase, lifetime access. Your data lives on your computer. You can back it up anywhere. No one can take it away.</p>
                <p>And it's beautiful. Memories deserve more than folders and filenames. They deserve to exist in a universe that feels alive.</p>
            `,
            descriptionEs: `
                <h2>Neural Legacy - Software de Archivo de Memorias 3D</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/neural-legacy/img1.webp" alt="Captura de pantalla de Neural Legacy 1">
                </div>
                <h3>La Visión</h3>
                <p>Imagina abrir una aplicación y ver un universo 3D brillante. En el centro hay un núcleo de luz pulsante. Ramificándose desde él hay esferas brillantes — cada una representa una categoría como Fotos Familiares, Sabiduría de Papá, o Videos de Boda. Haz clic en una categoría y te acercas a ella. Orbitando alrededor hay nodos más pequeños brillantes — memorias individuales. Cada uno pulsa suavemente con vida.</p>
                <p><strong>Sin nube. Sin internet. Sin suscripciones. Solo tú y tu legado.</strong></p>
                
                <h3>El Desafío Técnico</h3>
                <p>Construir un universo 3D no es difícil. ¿Hacerlo funcionar con 1000+ memorias a 60 FPS? Esa es la ingeniería real.</p>
                
                <h3>Optimización de Rendimiento</h3>
                <ul>
                    <li><strong>Renderizado Instanciado:</strong> En lugar de crear 1000 objetos 3D separados, una geometría base se instancia 1000 veces. Resultado: 1000 nodos = solo 2 llamadas de dibujo en lugar de 1000. Ganancia masiva de rendimiento.</li>
                    <li><strong>Sistema de Nivel de Detalle (LOD):</strong> Memorias cerca de la cámara obtienen detalle completo con partículas y animaciones. 50-200 unidades de distancia obtienen geometría simplificada. ¿Más de 200 unidades? Esferas simples. ¿Más de 500? No se renderizan (frustum culling).</li>
                    <li><strong>Presupuesto Dinámico de Partículas:</strong> Solo los nodos cercanos obtienen efectos de partículas. Sistema asigna inteligentemente 5,000 partículas, dando 200 a nodos cercanos, 50 a nodos de distancia media, cero a lejanos.</li>
                    <li><strong>Posiciones Pre-calculadas:</strong> Todas las posiciones 3D calculadas una vez usando distribución de esfera Fibonacci y almacenadas en base de datos. Al cargar: cero cálculo, renderizado instantáneo.</li>
                    <li><strong>Geometría de Ramas Fusionadas:</strong> Todas las ramas conectoras fusionadas en UNA malla. 100 ramas = 1 llamada de dibujo en lugar de 100.</li>
                    <li><strong>Sistema de Animación Inteligente:</strong> Nodos solo se animan dentro de 100 unidades de la cámara. Más allá, las animaciones se congelan para ahorrar CPU.</li>
                </ul>
                
                <h3>Características Principales</h3>
                <ul>
                    <li><strong>Visualización de Árbol Neural 3D:</strong> Esferas brillantes conectadas por ramas neurales pulsantes, creando una estructura orgánica tipo árbol</li>
                    <li><strong>Sistema de Permisos Multi-Usuario:</strong> Propietario tiene control total, miembros familiares obtienen acceso personalizado, permisos en cascada por categorías</li>
                    <li><strong>Soporte Universal de Contenido:</strong> Videos (MP4, WebM, MOV), imágenes (JPG, PNG, GIF, WebP) con galería, audio (MP3, WAV, M4A) con forma de onda, texto con Markdown, PDFs con navegación de páginas</li>
                    <li><strong>Arquitectura de Servidor Local:</strong> App Electron ejecuta servidor Express local, muestra dirección IP para acceso Wi-Fi móvil — sube desde teléfono a escritorio instantáneamente</li>
                    <li><strong>100% Sin Conexión:</strong> Todos los archivos almacenados localmente en base de datos SQLite, sin dependencias de nube, funciona para siempre</li>
                    <li><strong>Presets de Rendimiento:</strong> Bajo (30 FPS), Medio (60 FPS balanceado), Alto (60 FPS todos los efectos), Ultra (120 FPS calidad máxima)</li>
                    <li><strong>Interfaz de Carga Mobile-First:</strong> Botones táctiles (mínimo 44px), texto grande, navegación inferior, carga directa desde cámara</li>
                    <li><strong>Carga Perezosa de Contenido:</strong> Videos e imágenes solo se cargan al hacer clic — mantiene bajo uso de memoria</li>
                </ul>
                
                <h3>Aspectos Destacados de Arquitectura</h3>
                <ul>
                    <li><strong>Escritorio:</strong> App Electron con servidor Express local</li>
                    <li><strong>Motor 3D:</strong> Babylon.js (mejor rendimiento que Three.js para este caso de uso)</li>
                    <li><strong>Base de Datos:</strong> SQLite (Better-SQLite3) — completamente sin conexión, almacenamiento ilimitado</li>
                    <li><strong>Acceso Móvil:</strong> Progressive Web App accesible vía IP local (ej., http://192.168.1.100:3000)</li>
                    <li><strong>Frontend:</strong> Vanilla JavaScript (módulos ES6), CSS3 Puro</li>
                </ul>
                
                <h3>Rendimiento Logrado</h3>
                <ul>
                    <li><strong>60 FPS</strong> con 1000+ nodos (preset medio)</li>
                    <li><strong>&lt;3 segundos</strong> tiempo de carga</li>
                    <li><strong>&lt;500MB</strong> huella de memoria</li>
                    <li><strong>Instantánea</strong> carga móvil vía Wi-Fi local</li>
                </ul>
                
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Electron</span>
                    <span class="tech-badge">Babylon.js</span>
                    <span class="tech-badge">SQLite</span>
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">Gráficos 3D</span>
                    <span class="tech-badge">Renderizado Instanciado</span>
                    <span class="tech-badge">Sistema LOD</span>
                    <span class="tech-badge">Frustum Culling</span>
                    <span class="tech-badge">PWA</span>
                </div>
                
                <h3>Por Qué es Importante</h3>
                <p>Este proyecto demuestra ingeniería de software avanzada:</p>
                <ul>
                    <li>Optimización de renderizado 3D de alto rendimiento (instanciado, LOD, frustum culling)</li>
                    <li>Desarrollo de aplicaciones de escritorio con arquitectura de servidor local</li>
                    <li>Principios de diseño responsivo mobile-first</li>
                    <li>Arquitectura de base de datos para aplicaciones offline-first</li>
                    <li>Sistemas de permisos multi-usuario</li>
                    <li>Controles y navegación de cámara 3D en tiempo real</li>
                    <li>Compatibilidad multiplataforma (Windows/macOS)</li>
                </ul>
                
                <h3>La Gran Idea</h3>
                <p>Las compañías de almacenamiento en la nube quieren que sigas pagando tarifas mensuales. Controlan tus datos. Pueden cerrar. Tus memorias son rehenes de su modelo de negocio.</p>
                <p>Neural Legacy invierte eso: lo posees completamente. Compra única, acceso de por vida. Tus datos viven en tu computadora. Puedes respaldarlos donde quieras. Nadie puede quitártelo.</p>
                <p>Y es hermoso. Las memorias merecen más que carpetas y nombres de archivo. Merecen existir en un universo que se siente vivo.</p>
            `
        },        
        terracore: {
            title: "Terra Core Construction",
            titleEs: "Terra Core Construction",
            description: `
                <h2>Terra Core Construction - Home Improvement Platform</h2>
                <div class="modal-images">
                    <img src="assets/images/projects/terra-core/img1.webp" alt="Terra Core Construction Screenshot 1">
                    <img src="assets/images/projects/terra-core/img2.webp" alt="Terra Core Construction Screenshot 2">
                    <img src="assets/images/projects/terra-core/img3.webp" alt="Terra Core Construction Screenshot 3">
                    <img src="assets/images/projects/terra-core/img4.webp" alt="Terra Core Construction Screenshot 4">
                    <img src="assets/images/projects/terra-core/img5.webp" alt="Terra Core Construction Screenshot 5">
                </div>
                <h3>Project Overview</h3>
                <p>A comprehensive website for a family-owned home improvement business serving Lancaster, Rock Hill, Fort Mill, and surrounding South Carolina areas. Built to showcase 11 specialized services with professional design and streamlined quote requests.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li><strong>Service Category Filtering:</strong> Dynamic JavaScript filtering system allowing users to browse by "All Services", "Remodeling", "Outdoor Living", "Construction", "Painting", and "Repairs"</li>
                    <li><strong>11 Specialized Services:</strong> Home Additions, Outdoor Kitchens, Bathroom Remodeling, Kitchen Remodeling, Painting, Concrete Work, Decks & Pergolas, Fire Pits, Custom Carpentry, Drywall Repair, Retaining Walls</li>
                    <li><strong>Modal Quote Form:</strong> Non-intrusive quote request system that keeps users on the page with instant validation and email notifications</li>
                    <li><strong>Trust Indicators:</strong> Prominently displayed stats (12+ years experience, 500+ projects, family-owned) build immediate credibility</li>
                    <li><strong>Geographic SEO:</strong> Lists 8 specific service areas for local search optimization</li>
                    <li><strong>Testimonial System:</strong> Three detailed client reviews with locations to establish social proof</li>
                    <li><strong>Multiple Contact Methods:</strong> Email, two phone lines, quote forms for maximum lead capture</li>
                </ul>
                
                <h3>Technical Implementation</h3>
                <ul>
                    <li><strong>Service Cards System:</strong> Each service has a professional hero image, benefit-focused title, and category badge for instant recognition</li>
                    <li><strong>Form Validation:</strong> Client-side validation with required field checking and "How did you hear about us?" tracking for marketing attribution</li>
                    <li><strong>Responsive Design:</strong> Mobile-first approach ensures perfect display on phones, tablets, and desktop</li>
                    <li><strong>Email Integration:</strong> Nodemailer sends instant notifications to business owner when quote forms are submitted</li>
                    <li><strong>Performance Optimization:</strong> WebP image format for fast load times without quality loss</li>
                    <li><strong>Breadcrumb Navigation:</strong> Clear user path tracking improves UX and SEO</li>
                </ul>
                
                <h3>Business Impact</h3>
                <ul>
                    <li><strong>Lead Generation:</strong> Multiple quote request CTAs throughout site maximize conversion opportunities</li>
                    <li><strong>Credibility Building:</strong> Professional design with testimonials and project stats establishes authority in competitive home improvement market</li>
                    <li><strong>Service Clarity:</strong> Category filtering helps customers quickly find exactly what they need, reducing bounce rate</li>
                    <li><strong>Local SEO:</strong> Geographic targeting for Lancaster, Rock Hill, Fort Mill improves ranking for "near me" searches</li>
                </ul>
                
                <h3>Tech Stack</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">JavaScript</span>
                    <span class="tech-badge">Nodemailer</span>
                    <span class="tech-badge">WebP Images</span>
                    <span class="tech-badge">Responsive Design</span>
                </div>
                
                <h3>Why It Matters</h3>
                <p>Terra Core Construction demonstrates expertise in building conversion-focused business websites with:</p>
                <ul>
                    <li>Service filtering and categorization for improved UX</li>
                    <li>Lead generation optimization with multiple CTAs and contact methods</li>
                    <li>Local SEO targeting for geographic service areas</li>
                    <li>Trust-building elements (testimonials, stats, family-owned messaging)</li>
                    <li>Modal-based forms that keep users engaged without page redirects</li>
                    <li>Performance optimization for fast mobile loading</li>
                </ul>
                
                <h3>Client Success</h3>
                <p>This website helped Terra Core establish a professional online presence in the competitive South Carolina home improvement market. The service filtering system makes it easy for customers to find exactly what they need, while multiple contact methods and quote forms provide various paths to conversion, maximizing lead capture.</p>
            `,
            descriptionEs: `
                <h2>Terra Core Construction - Plataforma de Mejoras del Hogar</h2>
                <div class="modal-images">
                    <img src="../assets/images/projects/terra-core/img1.webp" alt="Captura de pantalla de Terra Core Construction 1">
                    <img src="../assets/images/projects/terra-core/img2.webp" alt="Captura de pantalla de Terra Core Construction 2">
                    <img src="../assets/images/projects/terra-core/img3.webp" alt="Captura de pantalla de Terra Core Construction 3">
                    <img src="../assets/images/projects/terra-core/img4.webp" alt="Captura de pantalla de Terra Core Construction 4">
                    <img src="../assets/images/projects/terra-core/img5.webp" alt="Captura de pantalla de Terra Core Construction 5">
                </div>
                <h3>Descripción del Proyecto</h3>
                <p>Un sitio web completo para un negocio familiar de mejoras del hogar que sirve a Lancaster, Rock Hill, Fort Mill y áreas circundantes de Carolina del Sur. Construido para mostrar 11 servicios especializados con diseño profesional y solicitudes de cotización optimizadas.</p>
                
                <h3>Características Principales</h3>
                <ul>
                    <li><strong>Filtrado de Categorías de Servicios:</strong> Sistema de filtrado JavaScript dinámico que permite a los usuarios navegar por "Todos los Servicios", "Remodelación", "Vida al Aire Libre", "Construcción", "Pintura" y "Reparaciones"</li>
                    <li><strong>11 Servicios Especializados:</strong> Adiciones de Hogar, Cocinas al Aire Libre, Remodelación de Baños, Remodelación de Cocinas, Pintura, Trabajo de Concreto, Decks y Pérgolas, Fogatas, Carpintería Personalizada, Reparación de Drywall, Muros de Contención</li>
                    <li><strong>Formulario de Cotización Modal:</strong> Sistema de solicitud de cotización no intrusivo que mantiene a los usuarios en la página con validación instantánea y notificaciones por email</li>
                    <li><strong>Indicadores de Confianza:</strong> Estadísticas mostradas prominentemente (12+ años de experiencia, 500+ proyectos, negocio familiar) construyen credibilidad inmediata</li>
                    <li><strong>SEO Geográfico:</strong> Lista 8 áreas de servicio específicas para optimización de búsqueda local</li>
                    <li><strong>Sistema de Testimonios:</strong> Tres reseñas detalladas de clientes con ubicaciones para establecer prueba social</li>
                    <li><strong>Múltiples Métodos de Contacto:</strong> Email, dos líneas telefónicas, formularios de cotización para máxima captura de leads</li>
                </ul>
                
                <h3>Implementación Técnica</h3>
                <ul>
                    <li><strong>Sistema de Tarjetas de Servicios:</strong> Cada servicio tiene una imagen profesional, título enfocado en beneficios y etiqueta de categoría para reconocimiento instantáneo</li>
                    <li><strong>Validación de Formularios:</strong> Validación del lado del cliente con verificación de campos requeridos y seguimiento de "¿Cómo se enteró de nosotros?" para atribución de marketing</li>
                    <li><strong>Diseño Responsivo:</strong> Enfoque mobile-first asegura visualización perfecta en teléfonos, tablets y escritorio</li>
                    <li><strong>Integración de Email:</strong> Nodemailer envía notificaciones instantáneas al propietario del negocio cuando se envían formularios de cotización</li>
                    <li><strong>Optimización de Rendimiento:</strong> Formato de imagen WebP para tiempos de carga rápidos sin pérdida de calidad</li>
                    <li><strong>Navegación Breadcrumb:</strong> Seguimiento claro de ruta del usuario mejora UX y SEO</li>
                </ul>
                
                <h3>Impacto Empresarial</h3>
                <ul>
                    <li><strong>Generación de Leads:</strong> Múltiples CTAs de solicitud de cotización en todo el sitio maximizan oportunidades de conversión</li>
                    <li><strong>Construcción de Credibilidad:</strong> Diseño profesional con testimonios y estadísticas de proyectos establece autoridad en mercado competitivo de mejoras del hogar</li>
                    <li><strong>Claridad de Servicios:</strong> Filtrado de categorías ayuda a clientes a encontrar rápidamente exactamente lo que necesitan, reduciendo tasa de rebote</li>
                    <li><strong>SEO Local:</strong> Orientación geográfica para Lancaster, Rock Hill, Fort Mill mejora clasificación para búsquedas "cerca de mí"</li>
                </ul>
                
                <h3>Tecnologías Utilizadas</h3>
                <div class="tech-stack">
                    <span class="tech-badge">Node.js</span>
                    <span class="tech-badge">Express</span>
                    <span class="tech-badge">EJS</span>
                    <span class="tech-badge">CSS3</span>
                    <span class="tech-badge">JavaScript</span>
                    <span class="tech-badge">Nodemailer</span>
                    <span class="tech-badge">Imágenes WebP</span>
                    <span class="tech-badge">Diseño Responsivo</span>
                </div>
                
                <h3>Por Qué es Importante</h3>
                <p>Terra Core Construction demuestra experiencia en construir sitios web empresariales enfocados en conversión con:</p>
                <ul>
                    <li>Filtrado y categorización de servicios para UX mejorada</li>
                    <li>Optimización de generación de leads con múltiples CTAs y métodos de contacto</li>
                    <li>Orientación SEO local para áreas de servicio geográficas</li>
                    <li>Elementos de construcción de confianza (testimonios, estadísticas, mensajería de negocio familiar)</li>
                    <li>Formularios basados en modal que mantienen a usuarios comprometidos sin redirecciones de página</li>
                    <li>Optimización de rendimiento para carga móvil rápida</li>
                </ul>
                
                <h3>Éxito del Cliente</h3>
                <p>Este sitio web ayudó a Terra Core a establecer una presencia profesional en línea en el competitivo mercado de mejoras del hogar de Carolina del Sur. El sistema de filtrado de servicios facilita que los clientes encuentren exactamente lo que necesitan, mientras que múltiples métodos de contacto y formularios de cotización proporcionan varias vías de conversión, maximizando la captura de leads.</p>
            `
        }

    };

    const project = projects[projectId];
    if (!project) return null;

    // Return project with correct description based on language
    return {
        ...project,
        description: currentLang === 'es' ? project.descriptionEs : project.description
    };
}

/* ===== CONTACT TRACKING ===== */
function initContactTracking() {
    document.querySelectorAll('[data-contact]').forEach(element => {
        element.addEventListener('click', function() {
            const contactMethod = this.getAttribute('data-contact');
            console.log(`Contact: User clicked ${contactMethod}`);
        });
    });

    document.querySelectorAll('[data-social]').forEach(element => {
        element.addEventListener('click', function() {
            const social = this.getAttribute('data-social');
            console.log(`Social: User clicked ${social}`);
        });
    });

    document.querySelectorAll('[data-project-link]').forEach(element => {
        element.addEventListener('click', function() {
            const project = this.getAttribute('data-project-link');
            console.log(`Project Link: User visited ${project} live site`);
        });
    });
}

/* ===== VISIT LOGGING ===== */
function logVisit() {
    const visitData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        referrer: document.referrer,
        url: window.location.href
    };
    
    console.log('Page Visit:', visitData);
}

/* ===== INTERSECTION OBSERVER FOR ANIMATIONS ===== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                console.log(`Animation: ${entry.target.id || entry.target.className} section animated in`);
            }
        });
    }, observerOptions);

    // Observe sections for animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/* ===== ERROR HANDLING ===== */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
});

/* ===== PERFORMANCE MONITORING ===== openProjectModal */
window.addEventListener('load', function() {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Performance:', {
            pageLoadTime: Math.round(perfData.loadEventEnd - perfData.navigationStart),
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
            firstByte: Math.round(perfData.responseStart - perfData.navigationStart)
        });
    }, 0);
});