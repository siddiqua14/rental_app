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
let currentLimit = 15; // Initial limit for properties to show
const propertiesContainer = document.querySelector('.properties-container');

async function loadProperties() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.properties && Array.isArray(data.properties) && data.properties.length > 0) {
            const propertiesContainer = document.querySelector('.properties-container');
            propertiesContainer.innerHTML = ''; // Clear existing content
            data.properties.forEach(property => {
                // Create a new property card
                const propertyCard = document.createElement("div");
                propertyCard.classList.add("property-card");

                // Create image container for sliding images
                const imageContainer = document.createElement("div");
                imageContainer.classList.add("image-container");
                
                const imageSlider = document.createElement("div");
                imageSlider.classList.add("image-slider");

                // Create slider dots container
                const sliderDots = document.createElement("div");
                sliderDots.classList.add("slider-dots");

                // Loop through the Gallery to add images dynamically
                property.Gallery.forEach((image, index) => {
                    const imgElement = document.createElement("img");
                    imgElement.src = image;
                    imgElement.alt = `Property Image ${index + 1}`;
                    imageSlider.appendChild(imgElement);

                    // Create dot for each image
                    const dot = document.createElement("div");
                    dot.classList.add("dot");
                    if (index === 0) dot.classList.add("active"); // Set the first dot as active
                    dot.addEventListener("click", () => goToSlide(index));
                    sliderDots.appendChild(dot);
                });

                // Add price tag and action buttons (if applicable)
                const priceTag = document.createElement("div");
                priceTag.classList.add("price-tag");
                priceTag.textContent = `From ₹${property.Price}`;

                const actionButtons = document.createElement("div");
                actionButtons.classList.add("action-buttons");
                actionButtons.innerHTML = `
                    <div class="action-button" title="View">👁️</div>
                    <div class="action-button" title="Location">📍</div>
                    <div class="action-button" title="Save">❤️</div>
                `;

                // Append elements to the image container
                imageContainer.appendChild(imageSlider);
                imageContainer.appendChild(sliderDots);
                imageContainer.appendChild(priceTag);
                imageContainer.appendChild(actionButtons);

                // Property name, rating, location, etc.
                const content = document.createElement("div");
                content.classList.add("content");

                const ratingContainer = document.createElement("div");
                ratingContainer.classList.add("rating");
                ratingContainer.innerHTML = `
                    <div class="rating-badge">${property.Rating}</div>
                    <div class="reviews">(${property.ReviewCount} Reviews)</div>
                    <div class="property-type">${property.PropertyType}</div>
                `;
                
                const propertyName = document.createElement("div");
                propertyName.classList.add("property-name");
                propertyName.textContent = property.HotelName;

                const features = document.createElement("div");
                features.classList.add("features");
                features.innerHTML = `
                    <span>${property.Feature1}</span>
                    <span>•</span>
                    <span>${property.Feature2}</span>
                `;

                const locationWrapper = document.createElement("div");
                locationWrapper.classList.add("location-wrapper");
                locationWrapper.innerHTML = `
                    <div class="location-breadcrumb">
                        <a href="#">${property.City}</a>
                        <span class="separator">></span>
                        <a href="#">${property.Location}</a>
                    </div>
                    <button class="view-btn" onclick="window.location.href='/property/${property.HotelID}'">View Availability</button>
                `;

                content.appendChild(ratingContainer);
                content.appendChild(propertyName);
                content.appendChild(features);
                content.appendChild(locationWrapper);

                // Append image container and content to the property card
                propertyCard.appendChild(imageContainer);
                propertyCard.appendChild(content);

                // Append property card to properties container
                propertiesContainer.appendChild(propertyCard);
            });
        } else {
            propertiesContainer.innerHTML = "<p>No properties available.</p>";
        }
    } catch (error) {
        console.error("Error loading properties:", error);
        propertiesContainer.innerHTML = "<p>Error loading properties. Please try again later.</p>";
    }
}

// Slider functionality (for dots, swipe, etc.)
let currentSlide = 0;

function goToSlide(index, sliderId) {
    const slider = document.querySelector(`#${sliderId} .image-slider`);
    const dots = document.querySelectorAll(`#${sliderId} .dot`);
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function startAutoSlide(sliderId) {
    const slider = document.querySelector(`#${sliderId} .image-slider`);
    const numberOfSlides = slider.querySelectorAll('img').length;
    let currentSlideIndex = 0;

    return setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % numberOfSlides;
        goToSlide(currentSlideIndex, sliderId);
    }, 5000); // Change image every 5 seconds
}

document.querySelectorAll('.image-slider').forEach((slider, index) => {
    const sliderId = `slider-${index}`;
    slider.id = sliderId;

    let autoSlideInterval = startAutoSlide(sliderId);

    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval); // Pause auto-slide on hover
    });
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = startAutoSlide(sliderId); // Resume auto-slide when mouse leaves
    });

    const dotsContainer = slider.closest('.property-card').querySelector('.slider-dots');
    slider.querySelectorAll('img').forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (idx === 0) dot.classList.add("active"); // Set the first dot as active
        dot.addEventListener("click", () => goToSlide(idx, sliderId));
        dotsContainer.appendChild(dot);
    });
});

// Example of dynamic actions or interactivity
document.addEventListener('DOMContentLoaded', function () {
    console.log("Property details page loaded.");
});