// Check for touch device to apply different styles/logic
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

// --- Mouse Spotlight Effect ---
// Only add the event listener if it's not a touch device
if (!isTouchDevice) {
    window.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--x', e.clientX + 'px');
        document.documentElement.style.setProperty('--y', e.clientY + 'px');
    });
}

// --- Binary Background Effect ---
const binaryContainer = document.getElementById('binary-background');
let binaryInterval;

const generateBinary = () => {
    const size = Math.floor(window.innerWidth * window.innerHeight / 100); // Approximate character count
    let binaryString = '';
    for (let i = 0; i < size; i++) {
        binaryString += Math.round(Math.random());
    }
    binaryContainer.textContent = binaryString;
};

const startBinaryAnimation = () => {
    generateBinary();
    binaryInterval = setInterval(generateBinary, 200); // Update every 200ms
}

// --- Sticky Header Effect ---
const headerBar = document.getElementById('main-header-bar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        headerBar.classList.add('header-scrolled');
    } else {
        headerBar.classList.remove('header-scrolled');
    }
});

// Start animation when the window is loaded
window.addEventListener('load', () => {
    startBinaryAnimation();
    // Set initial header state with cursor
    header.innerHTML = 'BEN PEGG<span class="cursor-block"></span>';
});
// Regenerate on resize
window.addEventListener('resize', generateBinary);


// --- Interactive Header Effect ---
const header = document.getElementById('main-header');
const originalText = "BEN PEGG";
const asciiText = "66 69 78 32 80 69 71 71";
let isAnimating = false;
let isAsciiMode = false; // State variable to track current text

const runAnimation = (startText, endText) => {
    isAnimating = true;
    let currentIndex = startText.length;

    // Recursive function for deleting characters
    const deleteChar = () => {
        if (currentIndex > 0) {
            currentIndex--;
            header.innerHTML = startText.substring(0, currentIndex) + '<span class="cursor-block"></span>';
            setTimeout(deleteChar, 50); // Fast, consistent delete speed
        } else {
            // Deleting finished, start typing
            typeChar(0);
        }
    };

    // Recursive function for typing characters with random delay
    const typeChar = (index) => {
        if (index < endText.length) {
            header.innerHTML = endText.substring(0, index + 1) + '<span class="cursor-block"></span>';
            const delay = Math.random() * 100 + 50; // Random delay between 50ms and 150ms
            setTimeout(() => typeChar(index + 1), delay);
        } else {
            // Typing finished, animation is complete
            isAnimating = false;
        }
    };

    deleteChar(); // Start the animation chain
};

const toggleHeaderAnimation = () => {
    if (isAnimating) return;

    const fromText = isAsciiMode ? asciiText : originalText;
    const toText = isAsciiMode ? originalText : asciiText;

    isAsciiMode = !isAsciiMode; // Toggle the state for the next hover
    runAnimation(fromText, toText);
};

// Changed to 'click' to work on mobile devices
header.addEventListener('click', toggleHeaderAnimation);


// --- Scroll Animation Observer ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1
});

const elements = document.querySelectorAll('.scroll-animate');
elements.forEach(el => observer.observe(el));


// --- SVG Circuit Traces ---
// Changed to 'load' to ensure all assets (like fonts) are loaded before calculating element positions
window.addEventListener('load', () => {
    const svg = document.getElementById('circuit-traces-svg');
    const headerEl = document.getElementById('main-header');
    const sections = Array.from(document.querySelectorAll('.section-title'));

    // Function to create and update traces
    const createTraces = () => {
        // Clear existing paths
        svg.innerHTML = '';

        if (!headerEl || sections.length === 0) return;

        // Get bounding box of the containing div for relative coordinates
        const svgRect = svg.getBoundingClientRect();
        
        // Use the 'BEN PEGG' h1 as the starting point
        const startRect = headerEl.getBoundingClientRect();
        const startX = startRect.left + startRect.width / 2 - svgRect.left;
        const startY = startRect.bottom - svgRect.top + 10; // Start slightly below the header

        sections.forEach(section => {
            // Check if the section is the contact section and handle it differently if needed,
            // or just ensure it has a valid parent with an ID for our logic.
            // For now, we just ensure we have a valid element to get a bounding rect from.
            if (!section.parentElement) return;

            const endRect = section.getBoundingClientRect();
            const endX = endRect.left - svgRect.left;
            const endY = endRect.top + endRect.height / 2 - svgRect.top;
            
            // Create a path with right-angle turns
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${startX} ${startY} L ${startX} ${endY - 20} L ${endX} ${endY - 20} L ${endX} ${endY}`;
            
            path.setAttribute('d', d);
            path.setAttribute('class', 'trace-path');
            svg.appendChild(path);
        });
    };

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(createTraces, 250);
    });

    // Initial creation
    createTraces();
});

// --- Mouse-reacting blob effect ---
document.querySelectorAll('.glass-effect').forEach(card => {
    const initialPos = {
        blob1: { x: 0, y: 30 },
        blob2: { x: 100, y: 70 }
    };

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        
        // --- Horizontal Parallax Calculation ---
        const mouseX = e.clientX - rect.left;
        const centerX = rect.width / 2;
        const offsetX = mouseX - centerX;
        const intensityX = 0.1; // Controls horizontal movement
        const shiftX = offsetX * intensityX;

        // --- Direct Vertical Mapping ---
        const mouseY = e.clientY - rect.top;
        const blobY = mouseY;

        // Calculate final positions for both blobs
        const blob1X = (rect.width * (initialPos.blob1.x / 100)) - shiftX;
        const blob2X = (rect.width * (initialPos.blob2.x / 100)) - shiftX;

        card.style.setProperty('--mx1', `${blob1X}px`);
        card.style.setProperty('--my1', `${blobY}px`);
        card.style.setProperty('--mx2', `${blob2X}px`);
        card.style.setProperty('--my2', `${blobY}px`);
    });

    card.addEventListener('mouseleave', () => {
        // Reset the position to the initial corner values when the mouse leaves
        card.style.setProperty('--mx1', `${initialPos.blob1.x}%`);
        card.style.setProperty('--my1', `${initialPos.blob1.y}%`);
        card.style.setProperty('--mx2', `${initialPos.blob2.x}%`);
        card.style.setProperty('--my2', `${initialPos.blob2.y}%`);
    });
});

// --- Smooth Notes Dropdown Animations ---
document.querySelectorAll('.course-item').forEach(item => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('.note-content');
    
    // Set initial states
    if (item.hasAttribute('open')) {
        content.classList.add('open');
    } else {
        content.classList.add('closed');
    }
    
    summary.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default details behavior
        
        if (item.hasAttribute('open')) {
            // Close the item
            content.classList.remove('open');
            content.classList.add('closed');
            summary.querySelector('::before')?.style.setProperty('transform', 'rotate(0deg)');
            
            // Wait for animation to complete before removing 'open' attribute
            setTimeout(() => {
                item.removeAttribute('open');
            }, 300);
        } else {
            // Open the item
            item.setAttribute('open', '');
            content.classList.remove('closed');
            content.classList.add('open');
        }
    });
});
