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
        <div id="properties" class="properties-container">
            <!-- Cards will be dynamically rendered here -->
            {{range .properties}}
            {{range .details}}
            <div class="property-card">
                <div class="image-container">
                    <div id="slider-{{.HotelID}}" class="image-slider">
                        {{range .Gallery}}
                        <img src="{{.}}" alt="Property Image" class="property-image">
                        {{end}}
                    </div>
                    <div class="slider-dots"></div>
                    <div class="price-tag">From {{.Price}}</div>
                    <div class="action-buttons">
                        <div class="action-button" title="View"><i class="fa fa-eye"></i></div>
                        <div class="action-button" title="Location"><i class="fa fa-map-marker"></i></div>
                        <div class="action-button" title="Save"><i class="fa fa-heart-o"></i></div>
                    </div>
                </div>
                <div class="content">
                    <div class="rating">
                        <div class="rating-badge">{{.Rating}}</div>
                        <div class="reviews">({{.ReviewCount}} Reviews)</div>
                        <div class="property-type">{{.PropertyType}}</div>
                    </div>
                    <div class="property-name">
                        <a href="/property/details/{{.IDHotel}}" target="_blank">{{.HotelName}}</a>
                    </div>

                    <div class="features">
                        {{range .Amenities}}
                        <span>•</span>
                        <span>{{.}}</span>
                        {{end}}
                    </div>
                    {{range .properties}}
                    <div class="info">
                        {{range .details}}
                        <div class="detail-info">
                            <div class="location-breadcrumb">
                                <a href="#">{{.City}}</a>
                                <span class="separator">></span>
                                <a href="#">{{.Area}}</a>
                            </div>
                        </div>
                        {{end}}
                    </div>
                    {{end}}
                    <div class="tiles-btn">
                        <div class="website-btn col-xs-5 col-sm-5 col-md-6">
                            <a href="#">
                                <img src="https://static.rentbyowner.com/release/28.0.6/static/images/booking.svg"
                                    alt="Booking.com">
                            </a>
                        </div>
                        <div class="availability-btn col-sm-7 col-md-6">
                            <div class="view">
                                <a href="#">View Availability</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {{end}}
            {{else}}
            <p>No properties available.</p>
            {{end}}
        </div>
        <button id="view-more-btn" class="view-more-btn" onclick="loadMoreProperties()">View More</button>
    </div>
    <script src="/static/js/property-card.js"></script>

</body>

</html>