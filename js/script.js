// Main JavaScript file for Portfolio v2 

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
}); 