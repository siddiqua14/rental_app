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

// When a location is selected
function selectLocation(locationValue) {
    const searchInput = document.getElementById('searchInput');
    const dropdown = document.getElementById('locationDropdown');

    // Set the selected location value in the search input
    searchInput.value = locationValue;

    // Update the URL with the new location
    const encodedLocation = encodeURIComponent(locationValue);
    window.history.pushState({}, "", `/property/${encodedLocation}`);

    // Fetch the new data based on the location
    updateURLAndDisplayData(locationValue);

    // Hide the dropdown
    dropdown.classList.add('hidden');
    dropdown.innerHTML = ''; // Clear dropdown content
}

// Function to handle AJAX and update the container with new data
function updateURLAndDisplayData(locationValue) {
    fetch(`/property/data/${encodeURIComponent(locationValue)}`)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data)) {
                updatePropertyContainer(data); // Call updatePropertyContainer with the fetched data
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to update the property cards in the container
function updatePropertyContainer(properties) {
    const propertiesContainer = document.getElementById('properties');
    propertiesContainer.innerHTML = ''; // Clear the previous properties

    // Loop over the new properties and render the cards
    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.classList.add('property-card');

        propertyCard.innerHTML = `
            <div class="image-container">
                <div class="image-slider">
                    ${property.Gallery.map(image => `<img src="${image}" alt="Property Image" class="property-image">`).join('')}
                </div>
                <div class="price-tag">From ${property.Price}</div>
                <div class="action-buttons">
                    <div class="action-button" title="View"><i class="fa fa-eye"></i></div>
                    <div class="action-button" title="Location"><i class="fa fa-map-marker"></i></div>
                    <div class="action-button" title="Save"><i class="fa fa-heart-o"></i></div>
                </div>
            </div>

            <div class="content">
                <div class="rating">
                    <span class="rating-badge">${property.Rating}</span>
                    <span class="reviews">(${property.ReviewCount} Reviews)</span>
                    <span class="property-type">${property.PropertyType}</span>
                </div>
                <div class="property-name">
                    <a href="/property/details/${property.IDHotel}" target="_blank">${property.HotelName}</a>
                </div>
                <div class="features">
                    ${property.Amenities.map(amenity => `<span>•</span><span>${amenity}</span>`).join('')}
                </div>
                <div class="location-wrapper">
                    <span class="location location-span">${property.Location}</span>
                </div>
                <div class="tiles-btn">
                    <div class="website-btn">
                        <a href="#"><img src="https://static.rentbyowner.com/release/28.0.6/static/images/booking.svg" alt="Booking.com"></a>
                    </div>
                    <div class="availability-btn col-sm-7 col-md-6">
                        <div class="view">
                            <a href="#">View Availability</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        propertiesContainer.appendChild(propertyCard);
    });
}
// Event listener to close the search form
function closeSearch() {
    document.getElementById('searchForm').classList.add('hidden');
    hideLocationDropdown(); // Hide the dropdown when closing the form
}
// Handle popstate event to manage back and forward buttons without reload
window.addEventListener('popstate', function(event) {
    const location = window.location.pathname.split('/')[2];
    if (location) {
        updateURLAndDisplayData(location); // Call the function with the current location
    }
});