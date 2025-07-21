// Check for touch device to apply different styles/logic
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
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
    // Make the container visible before starting
    if (binaryContainer) {
        binaryContainer.style.display = 'block';
    }
    generateBinary();
    binaryInterval = setInterval(generateBinary, 200); // Update every 200ms
}

// --- Mouse Spotlight Effect ---
// Only add the event listener if it's not a touch device
if (!isTouchDevice) {
    window.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--x', e.clientX + 'px');
        document.documentElement.style.setProperty('--y', e.clientY + 'px');
    });

    // Start the binary animation only on the first mousemove
    window.addEventListener('mousemove', startBinaryAnimation, { once: true });
}

// --- Sticky Header Effect ---
const headerBar = document.getElementById('main-header-bar');
let headerIsScrolled = false;
let scrollTimeout;
const SCROLL_ADD = 50;  // point to add class (increased significantly)
const SCROLL_REMOVE = 0; // point to remove class (set to top)

window.addEventListener('scroll', () => {
    // Clear any existing timeout to debounce rapid scroll events
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        const y = window.scrollY;
        if (!headerIsScrolled && y > SCROLL_ADD) {
            headerIsScrolled = true;
            headerBar.classList.add('header-scrolled');
        } else if (headerIsScrolled && y <= SCROLL_REMOVE) {
            headerIsScrolled = false;
            headerBar.classList.remove('header-scrolled');
        }
    }, 10); // Small delay to prevent rapid state changes
});

// --- Homepage Header Typing Animation ---
function typeEffect(element, text, isDeleting, callback) {
    let i = isDeleting ? text.length - 1 : 0;
    const cursor = '<span class="cursor-block"></span>';
    let delay = isDeleting ? 30 : 60; // Deleting is faster

    function type() {
        const randomJitter = Math.random() * 40 - 20; // -20ms to +20ms jitter
        if (isDeleting) {
            if (i >= 0) {
                element.innerHTML = text.substring(0, i) + cursor;
                i--;
                setTimeout(type, delay + randomJitter);
            } else {
                element.innerHTML = cursor;
                if (callback) callback();
            }
        } else {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + cursor;
                i++;
                setTimeout(type, delay + randomJitter);
            } else {
                if (callback) callback();
            }
        }
    }
    type();
}

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


// --- SVG Circuit Traces & Unified Resize Handler ---
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

    // --- Unified Resize Handler ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resizing');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // createTraces(); // Redraw traces first
            if (binaryContainer) {
                generateBinary(); // Then regenerate binary background
            }
            document.body.classList.remove('resizing');
        }, 250);
    });

    // Initial creation
    // createTraces();
});

// --- Mouse-reacting blob effect ---
document.querySelectorAll('.glass-effect:not(.note-card)').forEach(card => {
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

// --- Function to handle opening a specific 'details' element based on URL hash ---
function openDetailsFromHash() {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement && targetElement.tagName.toLowerCase() === 'details') {
            targetElement.setAttribute('open', '');
            
            // Re-run the animation logic after opening
            const content = targetElement.querySelector('.note-content');
            if (content) {
                content.classList.remove('closed');
                content.classList.add('open');
            }

            // Optional: scroll the element into view
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// --- Run all initializations on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Header Animation Logic (Homepage Only) ---
    const header = document.getElementById('main-header');
    const isHomePage = window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location.pathname === '/portfoliov2/';

    let isAnimating = false;

    const codeSnippets = [
        'printf("Ben Pegg");',
        'std::cout << "Ben Pegg";',
        'print("Ben Pegg")',
        'System.out.println("Ben Pegg");',
        '.STRINGZ "Ben Pegg"',
        'initial $display("Ben Pegg");'
    ];

    if (header) {
        // Always set initial state with cursor
        header.innerHTML = 'BEN PEGG<span class="cursor-block"></span>';

        if (isHomePage) {
            header.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                const originalText = "BEN PEGG";
                // Select a random snippet
                const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];

                // 1. Delete "BEN PEGG"
                typeEffect(header, originalText, true, () => {
                    // 2. Type random code snippet
                    setTimeout(() => { // Pause before typing next
                        typeEffect(header, randomSnippet, false, () => {
                            // 3. Pause, then delete snippet
                            setTimeout(() => {
                                typeEffect(header, randomSnippet, true, () => {
                                    // 4. Type "BEN PEGG" again
                                    setTimeout(() => { // Pause before typing final
                                        typeEffect(header, originalText, false, () => {
                                            isAnimating = false; // Animation finished
                                        });
                                    }, 200);
                                });
                            }, 1000); // Pause for 1s
                        });
                    }, 200);
                });
            });
        }
    }

    // --- Note Dropdowns ---
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

    // Handle opening notes from hash
    openDetailsFromHash();

    // --- Clickable Project Cards ---
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Do not navigate if a link inside the card was clicked
            if (e.target.closest('a')) {
                return;
            }
            window.location.href = this.dataset.href;
        });
    });
});
