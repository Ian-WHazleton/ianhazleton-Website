// Photo configuration - update these numbers when you add more photos
const PHOTO_CONFIG = {
    concerts: 15,    // Set to 15 as requested
    sports: 0,       // Set to 0 as requested
    individual: 4    // Set to 4 as requested
};

class PhotographyMain {
    constructor() {
        this.imageService = cloudinaryService;
        this.init();
    }

    init() {
        this.setupHeroImage();
        this.setupGalleryPreviews();
        this.setupImageErrorHandling();
        this.setupHoverEffects();
        this.logPhotoStatus();
    }

    setupHeroImage() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const heroImageUrl = this.imageService.getHeroImage('main-hero');
            heroSection.style.backgroundImage = `url(${heroImageUrl})`;
        }
    }

    setupGalleryPreviews() {
        this.setupConcertPreviews();
        this.setupSportsPreviews();
        this.setupIndividualPreviews();
    }

    setupConcertPreviews() {
        const concertImages = document.querySelectorAll('.concert-gallery img');
        const photoCount = Math.min(PHOTO_CONFIG.concerts, concertImages.length);
        
        console.log(`Setting up ${photoCount} concert photos`);
        
        concertImages.forEach((img, index) => {
            if (index < photoCount) {
                const publicId = `concert${index + 1}`;
                const metadata = getPhotoMetadata(publicId);
                
                img.src = this.imageService.getThumbnail(publicId);
                img.alt = metadata.title;
                img.title = `${metadata.title} - ${metadata.venue}`;
                img.style.display = 'block';
                img.style.opacity = '1';
                
                // Add click listener to show metadata
                img.addEventListener('click', () => this.showPhotoInfo(metadata));
            } else {
                img.style.display = 'none';
            }
        });

        this.adjustGridLayout('.concert-gallery', photoCount);
    }

    setupSportsPreviews() {
        const sportsImages = document.querySelectorAll('.sports-gallery img');
        const photoCount = Math.min(PHOTO_CONFIG.sports, sportsImages.length);
        
        console.log(`Setting up ${photoCount} sports photos`);
        
        sportsImages.forEach((img, index) => {
            if (index < photoCount) {
                const publicId = `sports${index + 1}`;
                const metadata = getPhotoMetadata(publicId);
                
                img.src = this.imageService.getThumbnail(publicId);
                img.alt = metadata.title;
                img.title = `${metadata.title} - ${metadata.venue}`;
                img.style.display = 'block';
                img.style.opacity = '1';
                
                img.addEventListener('click', () => this.showPhotoInfo(metadata));
            } else {
                img.style.display = 'none';
            }
        });

        this.adjustGridLayout('.sports-gallery', photoCount);
        this.showComingSoonIfEmpty('.sports-section', photoCount, 'sports');
    }

    setupIndividualPreviews() {
        const individualImages = document.querySelectorAll('.individual-gallery img');
        const photoCount = Math.min(PHOTO_CONFIG.individual, individualImages.length);
        
        console.log(`Setting up ${photoCount} individual photos`);
        
        individualImages.forEach((img, index) => {
            if (index < photoCount) {
                const publicId = `individual${index + 1}`;
                const metadata = getPhotoMetadata(publicId);
                
                img.src = this.imageService.getThumbnail(publicId);
                img.alt = metadata.title;
                img.title = `${metadata.title} - ${metadata.venue}`;
                img.style.display = 'block';
                img.style.opacity = '1';
                
                img.addEventListener('click', () => this.showPhotoInfo(metadata));
            } else {
                img.style.display = 'none';
            }
        });

        this.adjustGridLayout('.individual-gallery', photoCount);
        this.showComingSoonIfEmpty('.individual-section', photoCount, 'individual');
    }

    showPhotoInfo(metadata) {
        const info = `
📸 ${metadata.title}
📅 ${new Date(metadata.date).toLocaleDateString()}
📍 ${metadata.venue}, ${metadata.city}, ${metadata.state}
🎤 ${metadata.artist || metadata.subject || 'N/A'}
📷 ${metadata.camera}
⚙️ ${metadata.settings}

${metadata.description}
        `;
        alert(info);
    }

    adjustGridLayout(selector, photoCount) {
        const gallery = document.querySelector(selector);
        if (!gallery) return;

        switch(photoCount) {
            case 0:
                gallery.style.display = 'none';
                break;
            case 1:
                gallery.style.gridTemplateColumns = '1fr';
                gallery.style.gridTemplateRows = '1fr';
                gallery.style.maxWidth = '400px';
                break;
            case 2:
                gallery.style.gridTemplateColumns = 'repeat(2, 1fr)';
                gallery.style.gridTemplateRows = '1fr';
                gallery.style.maxWidth = '600px';
                break;
            case 3:
                gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
                gallery.style.gridTemplateRows = '1fr';
                gallery.style.maxWidth = '800px';
                break;
            case 4:
                gallery.style.gridTemplateColumns = 'repeat(2, 1fr)';
                gallery.style.gridTemplateRows = 'repeat(2, 1fr)';
                gallery.style.maxWidth = '600px';
                break;
            case 5:
            case 6:
                gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
                gallery.style.gridTemplateRows = 'repeat(2, 1fr)';
                gallery.style.maxWidth = '900px';
                break;
            case 7:
            case 8:
            default:
                gallery.style.gridTemplateColumns = 'repeat(4, 1fr)';
                gallery.style.gridTemplateRows = 'repeat(2, 1fr)';
                gallery.style.maxWidth = '1200px';
                break;
        }
    }

    showComingSoonIfEmpty(sectionSelector, photoCount, category) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        const existingMessage = section.querySelector('.coming-soon');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (photoCount === 0) {
            const comingSoonDiv = document.createElement('div');
            comingSoonDiv.className = 'coming-soon';
            comingSoonDiv.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 2rem;
                    background: rgba(59, 130, 246, 0.1);
                    border: 2px dashed #3b82f6;
                    border-radius: 8px;
                    margin: 2rem auto;
                    max-width: 600px;
                    color: #cbd5e1;
                ">
                    <h3 style="color: #3b82f6; margin-bottom: 1rem;">Coming Soon</h3>
                    <p>${category.charAt(0).toUpperCase() + category.slice(1)} photos will be available soon!</p>
                </div>
            `;
            
            const gallery = section.querySelector(`.${category}-gallery`);
            if (gallery) {
                gallery.parentNode.insertBefore(comingSoonDiv, gallery.nextSibling);
            }
        }
    }

    logPhotoStatus() {
        console.log('Photo Status:');
        console.log(`Concerts: ${PHOTO_CONFIG.concerts} photos`);
        console.log(`Sports: ${PHOTO_CONFIG.sports} photos`);
        console.log(`Individual: ${PHOTO_CONFIG.individual} photos`);
        
        console.log('\nAvailable metadata:');
        Object.keys(PHOTO_METADATA).forEach(photoId => {
            const meta = PHOTO_METADATA[photoId];
            console.log(`${photoId}: ${meta.title} (${meta.type})`);
        });
    }

    setupImageErrorHandling() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                console.log('Image failed to load:', this.src);
                this.style.background = '#334155';
                this.style.color = '#64748b';
                this.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 0.9rem;">Image not available</div>';
            });

            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        });
    }

    setupHoverEffects() {
        document.querySelectorAll('.concert-gallery img, .sports-gallery img, .individual-gallery img').forEach(img => {
            img.addEventListener('mouseenter', function() {
                if (this.src && !this.src.includes('undefined')) {
                    this.style.transform = 'scale(1.05)';
                    this.style.filter = 'brightness(1.1)';
                }
            });

            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.filter = 'brightness(1)';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PhotographyMain();
});