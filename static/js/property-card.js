document.addEventListener("DOMContentLoaded", () => {
    const searchToggle = document.getElementById("searchToggle");
    const searchForm = document.getElementById("searchForm");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");
    const autocompleteSuggestions = document.getElementById("autocompleteSuggestions");

    let locationData = [];

    // Show search form with animation
    searchToggle?.addEventListener("click", () => {
        searchForm.classList.remove("hidden");
        searchForm.classList.add("visible");
        fetchLocations(); // Fetch locations when opening the search
    });

    // Hide search form with animation
    closeSearch.addEventListener("click", () => {
        searchForm.classList.remove("visible");
        searchForm.classList.add("hidden");
    });

    // Fetch locations from API
    async function fetchLocations() {
        try {
            const response = await fetch('http://localhost:8080/v1/property/location');
            const data = await response.json();
            locationData = Array.isArray(data) ? data : Object.entries(data).map(([key, value]) => ({
                LocationId: value.LocationId,
                Value: value.Value
            }));
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    }

    // Filter locations based on input
    function filterLocations(searchText) {
        return locationData.filter(location =>
            location.Value.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    // Display suggestions
    function displaySuggestions(suggestions) {
        autocompleteSuggestions.innerHTML = '';

        if (suggestions.length === 0) {
            autocompleteSuggestions.classList.add("hidden");
            return;
        }

        suggestions.forEach(location => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'suggestion-item';
            suggestionDiv.textContent = location.Value;
            suggestionDiv.addEventListener('click', () => {
                searchInput.value = location.Value;
                autocompleteSuggestions.classList.add("hidden");
            });
            autocompleteSuggestions.appendChild(suggestionDiv);
        });

        autocompleteSuggestions.classList.remove("hidden");
    }

    // Handle input changes with debounce
    let debounceTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimeout);

        const searchText = e.target.value;

        if (searchText === '') {
            autocompleteSuggestions.classList.add("hidden");
            return;
        }

        debounceTimeout = setTimeout(() => {
            const filteredLocations = filterLocations(searchText);
            displaySuggestions(filteredLocations);
        }, 300); // Debounce delay of 300ms
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (event) => {
        if (!searchForm.contains(event.target)) {
            autocompleteSuggestions.classList.add("hidden");
        }
    });

    // Initial fetch of locations
    fetchLocations();
});



async function loadProperties(query = '') {
    try {
        let apiURL = '/v1/property/list';
        if (query) {
            apiURL += `?location=${encodeURIComponent(query)}`;
        }
        const response = await fetch(apiURL);
        const data = await response.json();

        const propertiesContainer = document.querySelector('.properties-container');
        propertiesContainer.innerHTML = ''; // Clear existing content

        if (data.properties && Array.isArray(data.properties) && data.properties.length > 0) {
            data.properties.forEach(property => {
                property.details.forEach(detail => {
                    const propertyCard = document.createElement("div");
                    propertyCard.classList.add("property-card");

                    // Create image container and slider
                    const imageContainer = document.createElement("div");
                    imageContainer.classList.add("image-container");

                    const imageSlider = document.createElement("div");
                    imageSlider.classList.add("image-slider");

                    const sliderDots = document.createElement("div");
                    sliderDots.classList.add("slider-dots");

                    detail.Gallery.forEach((image, index) => {
                        const imgElement = document.createElement("img");
                        imgElement.src = image;
                        imgElement.alt = `Property Image ${index + 1}`;
                        imageSlider.appendChild(imgElement);

                        const dot = document.createElement("div");
                        dot.classList.add("dot");
                        if (index === 0) dot.classList.add("active");
                        dot.addEventListener("click", () => goToSlide(index));
                        sliderDots.appendChild(dot);
                    });

                    const priceTag = document.createElement("div");
                    priceTag.classList.add("price-tag");
                    priceTag.textContent = `From ${detail.Price}`;

                    const actionButtons = document.createElement("div");
                    actionButtons.classList.add("action-buttons");
                    actionButtons.innerHTML = `
                        <div class="action-button" title="View"><i class="fa fa-eye"></i></div>
                        <div class="action-button" title="Location"><i class="fa fa-map-marker"></i></div>
                        <div class="action-button" title="Save"><i class="fa fa-heart-o"></i></div>
                    `;

                    imageContainer.appendChild(imageSlider);
                    imageContainer.appendChild(sliderDots);
                    imageContainer.appendChild(priceTag);
                    imageContainer.appendChild(actionButtons);

                    const content = document.createElement("div");
                    content.classList.add("content");

                    const ratingContainer = document.createElement("div");
                    ratingContainer.classList.add("rating");
                    ratingContainer.innerHTML = `
                        <div class="rating-badge">${detail.Rating}</div>
                        <div class="reviews">(${detail.ReviewCount} Reviews)</div>
                        <div class="property-type">${detail.PropertyType}</div>
                    `;

                    const propertyName = document.createElement("div");
                    propertyName.classList.add("property-name");
                    propertyName.innerHTML = `<a href="/property/details/${detail.IDHotel}" target="_blank">${detail.HotelName}</a>`;

                    const features = document.createElement("div");
                    features.classList.add("features");
                    features.innerHTML = detail.Amenities.map(amenity => `<span>•</span><span>${amenity}</span>`).join('');

                    const locationWrapper = document.createElement("div");
                    locationWrapper.classList.add("location-wrapper");
                    locationWrapper.innerHTML = `
                        <div class="location-breadcrumb">
                            <a href="#">${detail.City || ''}</a>
                            <span class="separator">></span>
                            <a href="#">${detail.Area || ''}</a>
                        </div>
                        <button class="view-btn" onclick="window.location.href='/property/${detail.HotelID}'">View Availability</button>
                    `;


                    content.appendChild(ratingContainer);
                    content.appendChild(propertyName);
                    content.appendChild(features);
                    content.appendChild(locationWrapper);

                    propertyCard.appendChild(imageContainer);
                    propertyCard.appendChild(content);

                    propertiesContainer.appendChild(propertyCard);
                });
            });
        } else {
            propertiesContainer.innerHTML = "<p>No properties available.</p>";
        }
    } catch (error) {
        console.error("Error loading properties:", error);
        document.querySelector('.properties-container').innerHTML = "<p>Error loading properties. Please try again later.</p>";
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