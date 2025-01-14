<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Details</title>
    <link rel="stylesheet" href="/static/css/style.css">
    <link rel="stylesheet" href="/static/css/details.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>

<body>
    {{if .error}}
    <div id="error-message" style="color: red;">
        <p>{{.error}}</p>
    </div>
    {{else}}
    <nav class="navbar">
        <div class="navbar-brand">
            <img src="https://static.rentbyowner.com/release/28.0.6/static/images/sites/rentbyowner.com/header_logo.svg"
                alt="rentbyowner logo">
        </div>
        <button id="searchToggle" class="navbar-toggle"><i class="fa fa-search" aria-hidden="true"></i></button>
        <div id="searchForm" class="search-form hidden">
            <input id="searchInput" type="text" placeholder="Search locations..." autocomplete="off"/>
            <div id="autocompleteSuggestions" class="autocomplete-suggestions hidden"></div>
            <button class="search-button">Search</button>
            <a id="closeSearch" class="close-button">Close</a>
        </div>
    </nav>



    <div class="container">
        <div class="breadcrumb">
            <a href="http://localhost:3000/property/list" target="_blank" class="breadcrumb-item">
                {{.breadcrumb.LocationRentals}}
            </a>
            <a href="http://localhost:3000/property/list" target="_blank" class="breadcrumb-item">
                {{.breadcrumb.Country}}
            </a>
            <a href="http://localhost:3000/property/list" target="_blank" class="breadcrumb-item">
                {{.breadcrumb.State}}
            </a>
            <a href="http://localhost:3000/property/list" target="_blank" class="breadcrumb-item">
                {{.breadcrumb.City}}
            </a>
        </div>

        <div class="property-header">
            <h1 class="property-title">
                {{.property.HotelName}} |
                {{trimSuffix .property.PropertyType "s"}}
                {{.property.CityInTrans}}
            </h1>

            <div class="property-meta">
                <div class="rating">
                    <span class="rating-score">{{.property.Rating}}</span>
                    <span>({{.property.ReviewCount}} Reviews)</span>
                </div>

                <div class="amenity-tag">
                    <span><i class="fa fa-bed" aria-hidden="true"></i> {{.property.Bedrooms}} Bedrooms</span>
                </div>

                <div class="amenity-tag">
                    <span><i class="fa fa-bath" aria-hidden="true"></i>
                        {{.property.NumBaths}} Bathroom</span>
                </div>

                <div class="amenity-tag">
                    <span><i class="fa fa-user" aria-hidden="true"></i> {{.property.Guests}} Guests</span>
                </div>
            </div>
        </div>

        <div class="gallery">
            {{range $index, $image := .property.images}}
            {{if eq $index 0}}
            <img src="{{$image}}" alt="Property Image" class="main-image">
            {{else if lt $index 5}}
            <img src="{{$image}}" alt="Property Image">
            {{end}}
            {{end}}
        </div>
        <div class="property-summary">
            <span>{{.property.Bedrooms}} {{trimSuffix .property.PropertyType "s"}} Apartment in
                {{.property.Location}}</span>
        </div>
        <div class="description">
            <p id="description-text">{{.property.description}}</p>
            <span class="show-more" onclick="toggleDescription()">Show more</span>
        </div>
    </div>

    {{end}}

    <script src="/static/js/details.js"></script>
</body>

</html>