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
                            <a href="#">${detail.City}</a>
                            <span class="separator">></span>
                            <a href="#">${detail.Location}</a>
                        </div>
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

document.addEventListener("DOMContentLoaded", function() {
    // Get all location spans with the class 'location-span'
    let locationElements = document.querySelectorAll('.location-span');

    // Iterate over each location span
    locationElements.forEach(function(locationSpan) {
        // Get the location string from the element
        let location = locationSpan.innerText;

        // Split the location by comma and trim spaces
        let parts = location.split(',').map(part => part.trim());

        // Create a breadcrumb div
        let breadcrumbDiv = document.createElement('div');
        breadcrumbDiv.classList.add('breadcrumb');

        // Add breadcrumb items (City > Area > Country)
        parts.forEach(function(part, index) {
            const isLast = index === parts.length - 1;

            // Create breadcrumb item
            let breadcrumbItem = document.createElement('span');
            breadcrumbItem.classList.add('breadcrumb-item');
            breadcrumbItem.innerText = part;

            // Add a click event to navigate when clicked
            breadcrumbItem.onclick = function() {
                navigateToLocation(part); // Navigate to the selected location
            };

            // Append breadcrumb item to breadcrumb div
            breadcrumbDiv.appendChild(breadcrumbItem);

            // Add separator if not the last item
            if (!isLast) {
                let separator = document.createElement('span');
                separator.classList.add('breadcrumb-separator');
                separator.innerText = ' > ';
                breadcrumbDiv.appendChild(separator);
            }
        });

        // Replace the location span with the breadcrumb div
        locationSpan.parentElement.replaceChild(breadcrumbDiv, locationSpan);
    });
});

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