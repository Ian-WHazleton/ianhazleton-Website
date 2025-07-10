class PhotoGallery {
    constructor() {
        this.photos = [];
        this.allPhotos = [];
        this.currentFilter = 'all';
        this.currentPhoto = 0;
        this.filteredPhotos = [];
        this.imageService = cloudinaryService;
        this.currentPage = this.getCurrentPage();
        
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('concerts.html')) return 'concerts';
        if (path.includes('sports.html')) return 'sports';
        if (path.includes('individual.html')) return 'individual';
        return 'gallery'; // For gallery.html (all photos)
    }

    async init() {
        await this.loadPhotos();
        this.renderPhotos();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    async loadPhotos() {
        // Use your existing PHOTO_METADATA from photo-data.js
        this.allPhotos = Object.keys(PHOTO_METADATA).map(photoId => ({
            id: photoId,
            publicId: photoId,
            thumbnail: this.imageService.getThumbnail(photoId),
            fullSize: this.imageService.getLightboxImage(photoId),
            ...PHOTO_METADATA[photoId]
        }));

        // Filter photos based on current page
        if (this.currentPage === 'gallery') {
            this.photos = this.allPhotos; // Show all photos
        } else {
            this.photos = this.allPhotos.filter(photo => photo.type === this.currentPage);
        }

        console.log(`Loaded ${this.photos.length} photos for ${this.currentPage} page`);
    }

    renderPhotos() {
        const grid = document.getElementById('photo-grid');
        if (!grid) return;

        this.filteredPhotos = this.currentFilter === 'all' 
            ? this.photos 
            : this.photos.filter(photo => photo.category === this.currentFilter);

        console.log(`Rendering ${this.filteredPhotos.length} photos with filter: ${this.currentFilter}`);

        grid.innerHTML = this.filteredPhotos.map((photo, index) => `
            <div class="photo-item" data-photo-index="${index}">
                <img src="${photo.thumbnail}" 
                     alt="${photo.title}" 
                     loading="lazy">
                <div class="photo-overlay">
                    <h3>${photo.title}</h3>
                    <p>${photo.description}</p>
                    <div class="photo-meta">
                        <span>${photo.venue || 'Unknown Venue'}</span>
                        <span>${new Date(photo.date).toLocaleDateString()}</span>
                    </div>
                    <div class="photo-category ${photo.category}">${photo.category}</div>
                </div>
            </div>
        `).join('');

        this.setupPhotoClickListeners();
        this.addPhotoGridStyles();
    }

    addPhotoGridStyles() {
        // Add CSS if it doesn't exist
        if (!document.getElementById('gallery-styles')) {
            const style = document.createElement('style');
            style.id = 'gallery-styles';
            style.textContent = `
                .photo-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .photo-item {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    background: #1e293b;
                    aspect-ratio: 4/3;
                }

                .photo-item:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                }

                .photo-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .photo-item:hover img {
                    transform: scale(1.05);
                }

                .photo-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
                    color: white;
                    padding: 2rem 1.5rem 1.5rem;
                    transform: translateY(80%);
                    transition: transform 0.3s ease;
                }

                .photo-item:hover .photo-overlay {
                    transform: translateY(0);
                }

                .photo-overlay h3 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                    color: white;
                }

                .photo-overlay p {
                    margin: 0 0 1rem 0;
                    font-size: 0.9rem;
                    color: #cbd5e1;
                    line-height: 1.4;
                }

                .photo-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    margin-bottom: 0.5rem;
                }

                .photo-category {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    backdrop-filter: blur(10px);
                }

                .photo-category.rock { background: rgba(239, 68, 68, 0.9); color: white; }
                .photo-category.indie { background: rgba(245, 158, 11, 0.9); color: white; }
                .photo-category.electronic { background: rgba(139, 92, 246, 0.9); color: white; }
                .photo-category.football { background: rgba(16, 185, 129, 0.9); color: white; }
                .photo-category.basketball { background: rgba(249, 115, 22, 0.9); color: white; }
                .photo-category.senior { background: rgba(59, 130, 246, 0.9); color: white; }
                .photo-category.professional { background: rgba(107, 114, 128, 0.9); color: white; }

                /* Lightbox Styles */
                .lightbox {
                    display: none;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                }

                .lightbox-content {
                    display: block;
                    margin: 5% auto;
                    max-width: 80%;
                    max-height: 70%;
                    border-radius: 8px;
                    object-fit: contain;
                }

                .lightbox-info {
                    text-align: center;
                    color: white;
                    padding: 2rem;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .lightbox-info h3 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: white;
                }

                .lightbox-info p {
                    margin-bottom: 1rem;
                    color: #cbd5e1;
                }

                .lightbox-info .photo-meta {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    font-size: 0.9rem;
                    color: #94a3b8;
                }

                .close {
                    position: absolute;
                    top: 2rem;
                    right: 3rem;
                    color: white;
                    font-size: 3rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .close:hover {
                    color: #3b82f6;
                }

                .prev, .next {
                    position: absolute;
                    top: 50%;
                    color: white;
                    font-size: 2rem;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 1rem;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    transform: translateY(-50%);
                }

                .prev {
                    left: 2rem;
                }

                .next {
                    right: 2rem;
                }

                .prev:hover, .next:hover {
                    background: rgba(59, 130, 246, 0.8);
                }

                @media (max-width: 768px) {
                    .photo-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 1rem;
                        padding: 1rem;
                    }
                    
                    .lightbox-content {
                        max-width: 95%;
                        max-height: 60%;
                    }
                    
                    .prev, .next {
                        font-size: 1.5rem;
                        padding: 0.5rem;
                    }
                    
                    .close {
                        font-size: 2rem;
                        right: 1rem;
                        top: 1rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupPhotoClickListeners() {
        document.querySelectorAll('.photo-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openLightbox(index);
            });
        });
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderPhotos();
            });
        });

        // Lightbox controls
        document.querySelector('.close')?.addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox')) {
                this.closeLightbox();
            }
        });
    }

    openLightbox(index) {
        this.currentPhoto = index;
        const photo = this.filteredPhotos[index];
        
        if (!photo) return;
        
        const lightboxImg = document.getElementById('lightbox-img');
        const photoTitle = document.getElementById('photo-title');
        const photoDescription = document.getElementById('photo-description');
        const photoCamera = document.getElementById('photo-camera');
        const photoSettings = document.getElementById('photo-settings');
        const photoDate = document.getElementById('photo-date');
        const lightbox = document.getElementById('lightbox');
        
        if (lightboxImg) lightboxImg.src = photo.fullSize;
        if (photoTitle) photoTitle.textContent = photo.title;
        if (photoDescription) photoDescription.textContent = photo.description;
        if (photoCamera) photoCamera.textContent = photo.camera;
        if (photoSettings) photoSettings.textContent = photo.settings;
        if (photoDate) photoDate.textContent = new Date(photo.date).toLocaleDateString();
        
        if (lightbox) {
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.style.display === 'block') {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    this.changePhoto(-1);
                } else if (e.key === 'ArrowRight') {
                    this.changePhoto(1);
                }
            }
        });
    }

    changePhoto(direction) {
        this.currentPhoto += direction;
        if (this.currentPhoto < 0) {
            this.currentPhoto = this.filteredPhotos.length - 1;
        } else if (this.currentPhoto >= this.filteredPhotos.length) {
            this.currentPhoto = 0;
        }
        this.openLightbox(this.currentPhoto);
    }
}

// Global function for inline onclick handlers
function changePhoto(direction) {
    if (window.gallery) {
        window.gallery.changePhoto(direction);
    }
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new PhotoGallery();
});