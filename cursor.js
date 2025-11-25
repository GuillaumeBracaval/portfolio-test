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

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
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

    animate();

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-tag, .tool-item');

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
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
})();
