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
    const searchInput = document.getElementById('searchInput');
    const dropdown = document.getElementById('locationDropdown');

    // Set the selected location value in the search input
    searchInput.value = locationValue;

    // Update the URL and fetch data based on the selected location
    updateURLAndDisplayData(locationValue);

    // Hide the dropdown
    dropdown.classList.add('hidden');
    dropdown.innerHTML = ''; // Clear dropdown content
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
                card.className = 'property-card';

                card.innerHTML = `
                    <div class="image-container">
                        <div class="image-slider">
                            ${property.Gallery.map(img => `
                                <img src="${img}" alt="Property Image" class="property-image">
                            `).join('')}
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
                        <div class="location">${property.Location}</div>
                        <div class="features">
                            ${property.Amenities.map(amenity => `<span class="feature-item">${amenity}</span>`).join('')}
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

