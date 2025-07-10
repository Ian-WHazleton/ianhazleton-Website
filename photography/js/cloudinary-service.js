class CloudinaryService {
    constructor(cloudName) {
        this.cloudName = cloudName;
        this.baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
    }

    // Build image URL with transformations
    buildImageUrl(publicId, transformations = []) {
        const transformStr = transformations.length > 0 ? transformations.join(',') + '/' : '';
        return `${this.baseUrl}${transformStr}${publicId}`;
    }

    // Predefined sizes for your gallery
    getThumbnail(publicId) {
        return this.buildImageUrl(publicId, [
            'w_400',
            'h_300', 
            'c_fill',
            'q_auto',
            'f_auto'
        ]);
    }

    getHeroImage(publicId) {
        return this.buildImageUrl(publicId, [
            'w_1920',
            'h_1080',
            'c_fill',
            'q_auto',
            'f_auto'
        ]);
    }

    getLightboxImage(publicId) {
        return this.buildImageUrl(publicId, [
            'w_1200',
            'h_900',
            'c_fit',
            'q_auto',
            'f_auto'
        ]);
    }
}

// Updated with your actual Cloudinary cloud name
const cloudinaryService = new CloudinaryService('dlknoacm4');