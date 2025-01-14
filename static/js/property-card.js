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

});

// Fetch locations from the backend and show the dropdown
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

// Show the dropdown with matched locations
function showLocationDropdown(locations) {
    let dropdown = document.getElementById('locationDropdown');

    // Create dropdown if it doesn't exist
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'locationDropdown';
        dropdown.className = 'absolute z-50 w-64 bg-white shadow-lg rounded-lg mt-1';
        document.getElementById('searchForm').appendChild(dropdown);
    }

    // Clear previous content
    dropdown.innerHTML = '';

    // Populate dropdown with matched locations
    if (locations.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'p-2 text-gray-500';
        noResults.textContent = 'No locations found';
        dropdown.appendChild(noResults);
        return;
    }

    locations.forEach(location => {
        const item = document.createElement('div');
        item.className = 'p-2 hover:bg-gray-100 cursor-pointer';
        item.textContent = location.Value; // Display location value
        item.onclick = () => {
            document.getElementById('searchInput').value = location.Value; // Set selected location
            updateURLAndDisplayData(location.Value); // Update URL and show data
            hideLocationDropdown(); // Hide dropdown after selection
        };
        dropdown.appendChild(item);
    });
}

// Hide the dropdown
function hideLocationDropdown() {
    const dropdown = document.getElementById('locationDropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

// Event listener for input changes in the search field
document.getElementById('searchInput').addEventListener('input', searchLocations);

// Event listener to close the search form
function closeSearch() {
    document.getElementById('searchForm').classList.add('hidden');
    hideLocationDropdown(); // Hide the dropdown when closing the form
}

// Update URL and fetch data based on selected location
function updateURLAndDisplayData(locationValue) {
    // Encode location for URL
    const encodedLocation = encodeURIComponent(locationValue);

    // Update the browser URL without reloading the page
    window.history.pushState({}, "", `/property/${encodedLocation}`);

    // Fetch data for the selected location
    fetch(`/property/${encodedLocation}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                displayLocationData(data); // Display data dynamically
            } else {
                console.error('Error fetching data for location:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
        });
}

// Display location data dynamically (you can customize this function)
function displayLocationData(data) {
    // Display the data in a section or elsewhere on the page
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = ''; // Clear previous data

    if (Array.isArray(data) && data.length > 0) {
        data.forEach(location => {
            const locationElement = document.createElement('div');
            locationElement.className = 'location-item';
            locationElement.innerHTML = `
                <h3>${location.Value}</h3>
                <p><strong>Location ID:</strong> ${location.LocationId}</p>
                <p><strong>Price:</strong> ${location.Price}</p>
                <!-- Add other data fields as necessary -->
            `;
            dataContainer.appendChild(locationElement);
        });
    } else {
        dataContainer.innerHTML = '<p>No data available for this location.</p>';
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