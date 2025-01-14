document.querySelectorAll('.image-slider').forEach(slider => {
    const images = slider.querySelectorAll('img');
    const dots = slider.parentElement.querySelector('.slider-dots');
    images.forEach((img, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => {
            images.forEach((img, i) => img.style.display = i === index ? 'block' : 'none');
        });
        dots.appendChild(dot);
    });
    if (images.length) images[0].style.display = 'block';
});
