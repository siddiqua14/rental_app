<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Listings</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="/static/css/property-card.css">
    <link rel="stylesheet" href="/static/css/style.css">
</head>

<body>
    <!-- Search Section -->
    <div id="searchSection">
        <input type="text" id="searchInput" placeholder="Search for a location..." />
        <div id="locationDropdown" class="hidden"></div>
        <button id="searchToggle">Search</button>
        <button id="closeSearch">Close</button>
    </div>

    <!-- Breadcrumb and Location Title -->
    <div id="breadcrumb">
        <span>Home</span> > <span id="locationBreadcrumb">Loading...</span>
    </div>

    <!-- Properties List Section -->
    <div id="propertiesSection">
        <h2>Properties in <span id="locationName">Loading...</span></h2>
        <div id="propertiesContainer">
            <!-- Property cards will be inserted here dynamically -->
        </div>
    </div>

    <script src="/static/js/property-card.js"></script>
</body>
</html>
        