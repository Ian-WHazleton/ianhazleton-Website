class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupScrollObserver();
        this.setupParallaxEffect();
        this.setupProgressIndicator();
        this.setupSmoothReveal();
    }

    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animation for gallery images
                    if (entry.target.classList.contains('gallery-section')) {
                        this.staggerGalleryImages(entry.target);
                    }
                }
            });
        }, this.observerOptions);

        // Observe sections for animation
        document.querySelectorAll('.concert-section, .sports-section, .individual-section, .gallery-hero, .photo-grid').forEach(section => {
            section.classList.add('animate-target');
            observer.observe(section);
        });
    }

    staggerGalleryImages(gallerySection) {
        const images = gallerySection.querySelectorAll('img, .photo-item');
        images.forEach((img, index) => {
            setTimeout(() => {
                img.classList.add('animate-in');
            }, index * 100); // 100ms delay between each image
        });
    }

    setupParallaxEffect() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            heroSection.style.transform = `translateY(${parallax}px)`;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    setupProgressIndicator() {
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            const progressBarFill = document.querySelector('.scroll-progress-bar');
            if (progressBarFill) {
                progressBarFill.style.width = scrollPercent + '%';
            }
        };

        window.addEventListener('scroll', updateProgress);
    }

    setupSmoothReveal() {
        // Add reveal animations for text content
        const textElements = document.querySelectorAll('h1, h2, h3, p, .hero-text');
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('text-reveal');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -20px 0px'
        });

        textElements.forEach(element => {
            element.classList.add('text-reveal-target');
            textObserver.observe(element);
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});