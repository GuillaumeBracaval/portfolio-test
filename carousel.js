// =========================================
// CAROUSEL MANAGEMENT - Reliable Image Rotation
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Find all carousel containers
    const carousels = document.querySelectorAll('.ui-card-image.carousel');

    if (carousels.length === 0) return;

    carousels.forEach((carousel) => {
        const images = Array.from(carousel.querySelectorAll('img'));

        if (images.length === 0) return;

        let currentIndex = 0;
        const DISPLAY_DURATION = 4000; // 4 seconds per image
        const FADE_DURATION = 400; // 400ms fade transition

        // Initialize: show first image immediately
        images.forEach((img, index) => {
            img.style.opacity = index === 0 ? '1' : '0';
            img.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;
        });

        // Carousel rotation function
        function rotateImages() {
            const previousIndex = currentIndex;
            currentIndex = (currentIndex + 1) % images.length;

            // Fade out previous image
            images[previousIndex].style.opacity = '0';

            // Fade in current image
            images[currentIndex].style.opacity = '1';
        }

        // Start rotation
        setInterval(rotateImages, DISPLAY_DURATION);
    });
});
