document.addEventListener("DOMContentLoaded", () => {
    const searchToggle = document.getElementById("searchToggle");
    const searchForm = document.getElementById("searchForm");
    const closeSearch = document.getElementById("closeSearch");

    // Show search form with animation
    searchToggle.addEventListener("click", () => {
        searchForm.classList.remove("hidden");
        searchForm.classList.add("visible");
    });

    // Hide search form with animation
    closeSearch.addEventListener("click", () => {
        searchForm.classList.remove("visible");
        searchForm.classList.add("hidden");
    });
});


function toggleDescription() {
    const descriptionText = document.getElementById('description-text');
    const showMoreBtn = document.querySelector('.show-more');
    
    if (descriptionText.style.maxHeight) {
        descriptionText.style.maxHeight = null;
        showMoreBtn.textContent = 'Show more';
    } else {
        descriptionText.style.maxHeight = descriptionText.scrollHeight + 'px';
        showMoreBtn.textContent = 'Show less';
    }
}

// Initialize description with truncated height
document.addEventListener('DOMContentLoaded', function() {
    const descriptionText = document.getElementById('description-text');
    descriptionText.style.maxHeight = '100px';
    descriptionText.style.overflow = 'hidden';
    descriptionText.style.transition = 'max-height 0.3s ease-out';
});
// Optional: Add click handlers for images
document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
        // Handle image click (e.g., open full-size gallery)
        console.log('Image clicked');
    });
});

// Optional: Add click handler for "View More Photos"
document.querySelector('.view-more-overlay').addEventListener('click', () => {
    // Handle view more photos click
    console.log('View more photos clicked');
});
