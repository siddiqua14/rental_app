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

document.addEventListener("DOMContentLoaded", function() {
    // Function to convert plural to singular dynamically
    function convertToSingular(word) {
        word = word.trim(); // Trim spaces

        // If the word ends with 's' and is not a known irregular plural, remove the 's'
        if (word.endsWith('s') && !isIrregularPlural(word)) {
            return word.slice(0, -1); // Remove trailing 's' while preserving the original case
        }
        
        return word; // Return as-is if not plural
    }

    // Check if the word is an irregular plural (you can extend this logic based on your needs)
    function isIrregularPlural(word) {
        const irregularPlurals = ['Cactus', 'Focus', 'Analysis']; // Example of irregular plurals with proper case
        return irregularPlurals.includes(word);
    }

    // Handle plural-to-singular conversion for property types
    let propertyTypeElements = document.querySelectorAll('.property-type');
    propertyTypeElements.forEach(function(propertyTypeSpan) {
        let propertyType = propertyTypeSpan.innerText.trim();  // Get the property type from the element
        
        // Convert plural to singular while preserving case
        let singularPropertyType = convertToSingular(propertyType);
        
        // Update the element with the singular form
        propertyTypeSpan.innerText = singularPropertyType;

        console.log('Converted Property Type:', singularPropertyType); // For debugging
    });
});



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


// Function to handle the search when clicking a breadcrumb item
function navigateToLocation(locationValue) {
    // Update the URL based on the clicked breadcrumb item
    const encodedValue = encodeURIComponent(locationValue);
    window.location.href = `/property/${encodedValue}`;  // Navigate to the new URL

    // Optionally trigger a search for properties based on the selected location
    searchByValue(locationValue);
}

// Function to handle search logic (if needed)
function searchByValue(value) {
    // Example: send an API request or perform a local filter
    console.log("Searching properties for: " + value);
    // You would implement the actual search logic here to filter or fetch properties
}


