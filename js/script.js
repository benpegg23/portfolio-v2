// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const titleBlock = document.querySelector('.title-block');
    const h1 = document.querySelector('.title-block h1');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        // Parallax: move the background image inside the text at a slower rate
        h1.style.backgroundPosition = `center ${scrolled * 0.4}px`;
        // Optionally, you can also move the text itself for a double parallax effect:
        // titleBlock.style.transform = `translateY(${scrolled * -0.2}px)`;
    });

    const dieReveal = document.querySelector('.die-reveal');

    document.addEventListener('mousemove', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        // Square-shaped, very soft reveal
        const mask = `radial-gradient(ellipse 350px 350px at ${x}px ${y}px, white 0%, white 20%, transparent 100%)`;
        dieReveal.style.webkitMaskImage = mask;
        dieReveal.style.maskImage = mask;
    });

    // Silver shimmer effect
    const silverShimmer = document.querySelector('.silver-shimmer');
    document.addEventListener('mousemove', function(e) {
        // Calculate background position as a percentage of viewport
        const x = Math.round((e.clientX / window.innerWidth) * 100);
        const y = Math.round((e.clientY / window.innerHeight) * 100);
        silverShimmer.style.backgroundPosition = `${x}% ${y}%`;
    });
}); 