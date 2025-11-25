// Custom Cursor Script (Desktop Only)
(function () {
    // Only initialize on desktop devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';

    const outline = document.createElement('div');
    outline.className = 'cursor-outline';

    cursor.appendChild(dot);
    cursor.appendChild(outline);
    document.body.appendChild(cursor);

    // Hide cursor initially
    cursor.style.opacity = '0';

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let hasMovedMouse = false;

    // Track mouse position
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Show cursor on first mouse movement
            if (!hasMovedMouse) {
                hasMovedMouse = true;
                cursor.style.opacity = '1';
                // Initialize positions to current mouse position
                dotX = mouseX;
                dotY = mouseY;
                outlineX = mouseX;
                outlineY = mouseY;
            }
        });
    });

    // Smooth animation loop
    function animate() {
        // Dot follows cursor immediately
        dotX += (mouseX - dotX) * 1;
        dotY += (mouseY - dotY) * 1;

        // Outline follows with delay for smooth effect
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';

        requestAnimationFrame(animate);
    }

    document.addEventListener('DOMContentLoaded', () => {
        animate();
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Add click effect
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        if (hasMovedMouse) {
            cursor.style.opacity = '0';
        }
    });

    document.addEventListener('mouseenter', () => {
        if (hasMovedMouse) {
            cursor.style.opacity = '1';
        }
    });
})();

