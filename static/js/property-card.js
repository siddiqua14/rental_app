document.addEventListener("DOMContentLoaded", () => {
    const searchToggle = document.getElementById("searchToggle");
    const searchForm = document.getElementById("searchForm");
    const closeSearch = document.getElementById("closeSearch");

    // Show search form with animation
    searchToggle?.addEventListener("click", () => {
        searchForm.classList.remove("hidden");
        searchForm.classList.add("visible");
    });

    // Hide search form with animation
    closeSearch.addEventListener("click", () => {
        searchForm.classList.remove("visible");
        searchForm.classList.add("hidden");
    });

    // Search button click event
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchLocations);
    }

    // Enter key press event
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchLocations(); // Trigger search when Enter key is pressed
            }
        });
    }
});



// Search location logic
document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value.trim();
    if (!query) {
        hideLocationDropdown();
        return;
    }

    fetch('/property/location')
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data)) {
                const matchedLocations = data.filter(location => location.Value.toLowerCase().includes(query.toLowerCase()));
                showLocationDropdown(matchedLocations);
            } else {
                hideLocationDropdown();
            }
        })
        .catch(() => hideLocationDropdown());
});

// Search location logic
function searchLocations() {
    const query = document.getElementById('searchInput').value.trim(); // Get user input
    if (!query) {
        hideLocationDropdown(); // Hide dropdown if query is empty
        return;
    }

    // Fetch locations from the backend
    fetch('/property/location', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            // Filter locations based on the query
            const matchedLocations = data.filter(location => 
                location.Value.toLowerCase().includes(query.toLowerCase())
            );
            showLocationDropdown(matchedLocations); // Show matched locations in dropdown
        } else {
            console.error('Invalid data format received:', data);
            hideLocationDropdown(); // Hide dropdown on error
        }
    })
    .catch(error => {
        console.error('Error fetching locations:', error);
        hideLocationDropdown(); // Hide dropdown on error
    });
}

// Show dropdown for matched locations
function showLocationDropdown(locations) {
    const dropdown = document.getElementById('locationDropdown');
    dropdown.innerHTML = locations.map(location => `
        <div class="p-2 hover:bg-gray-100 cursor-pointer" onclick="selectLocation('${location.Value}')">
            ${location.Value}
        </div>
    `).join('');
    dropdown.classList.remove('hidden');
}
// Hide location dropdown
function hideLocationDropdown() {
    const dropdown = document.getElementById('locationDropdown');
    dropdown.classList.add('hidden');
}

function selectLocation(locationValue) {
    document.getElementById('searchInput').value = locationValue;
    updateURLAndDisplayData(locationValue);
    hideLocationDropdown();
}

// Event listener to close the search form
function closeSearch() {
    document.getElementById('searchForm').classList.add('hidden');
    hideLocationDropdown(); // Hide the dropdown when closing the form
}
// Handle back/forward navigation
window.addEventListener('popstate', () => {
    const location = decodeURIComponent(window.location.pathname.split('/')[2]);
    if (location) {
        updateURLAndDisplayData(location);
    }
});

// Update URL and fetch data based on selected location
function updateURLAndDisplayData(locationValue) {
    const encodedLocation = encodeURIComponent(locationValue);
    window.history.pushState({}, "", `/property/${encodedLocation}`);

    fetch(`/property/${encodedLocation}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                displayPropertyCards(data);
            } else {
                console.error('Error fetching data for location:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
        });
}

// Render property cards dynamically
function displayPropertyCards(data) {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
        data.forEach(property => {
            Object.keys(property).forEach(key => {
                const details = property[key];
                const card = document.createElement('div');
                card.className = 'property-card shadow-lg rounded-md p-4 bg-white';

                card.innerHTML = `
                    <div class="image-container relative">
                        <div id="slider-${details.HotelID}" class="image-slider">
                            ${details.Gallery.map(img => `
                                <img src="${img}" alt="Property Image" class="w-full h-48 object-cover rounded-md">
                            `).join('')}
                        </div>
                        <div class="price-tag absolute top-2 left-2 bg-gray-900 text-white text-sm px-2 py-1 rounded-md">
                            From ${details.Price}
                        </div>
                    </div>
                    <div class="content mt-4">
                        <div class="flex justify-between items-center">
                            <div class="rating flex items-center">
                                <div class="rating-badge bg-green-500 text-white text-xs px-2 py-1 rounded-md">${details.Rating}</div>
                                <div class="reviews text-gray-500 text-sm ml-2">(${details.ReviewCount} Reviews)</div>
                            </div>
                            <div class="property-type text-gray-500 text-sm">${details.PropertyType}</div>
                        </div>
                        <div class="property-name mt-2 font-semibold text-lg text-blue-600">
                            <a href="/property/details/${details.IDHotel}" target="_blank">${details.HotelName}</a>
                        </div>
                        <div class="location text-gray-500 text-sm mt-1">${details.Location}</div>
                        <div class="features mt-2 text-gray-600 text-sm">
                            ${details.Amenities.map(amenity => `<span>• ${amenity}</span>`).join(' ')}
                        </div>
                    </div>
                `;
                dataContainer.appendChild(card);
            });
        });
    } else {
        dataContainer.innerHTML = '<p class="text-gray-500">No properties available for this location.</p>';
    }
}

// Handle popstate event to manage back and forward buttons without reload
window.addEventListener('popstate', function(event) {
    const location = window.location.pathname.split('/')[2];
    if (location) {
        fetch(`/property/${location}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    displayLocationData(data); // Display data dynamically when navigating via history
                }
            })
            .catch(error => {
                console.error('Error fetching location data on back/forward:', error);
            });
    }
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