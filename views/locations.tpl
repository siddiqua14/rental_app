<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Locations</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="/static/css/property-card.css">
</head>

<body>
    <div class="container">
        <div id="properties" class="properties-container">
            <!-- Iterate over Locations -->
            {{range .Locations}}
            <!-- Iterate over each property under the location -->
            {{range $id, $property := .}}
            <!-- Skip rendering the Value and LocationId -->
            {{if or (eq $id "Value") (eq $id "LocationId")}}
            {{continue}} <!-- Skip these fields -->
            {{end}}

            <div class="property-card">
                <div class="image-container">
                    <div class="image-slider">
                        <!-- Render Property Images -->
                        {{range $property.Gallery}}
                        <img src="{{.}}" alt="Property Image" class="property-image">
                        {{end}}
                    </div>
                    <div class="price-tag">From {{.Price}}</div>
                    <div class="action-buttons">
                        <div class="action-button" title="View"><i class="fa fa-eye"></i></div>
                        <div class="action-button" title="Location"><i class="fa fa-map-marker"></i></div>
                        <div class="action-button" title="Save"><i class="fa fa-heart-o"></i></div>
                    </div>
                </div>

                <div class="content">
                    <div class="rating">
                        <span class="rating-badge">{{.Rating}}</span>
                        <span class="reviews">({{.ReviewCount}} Reviews)</span>
                        <span class="property-type">{{.PropertyType}}</span>
                    </div>
                    <div class="property-name">
                        <a href="/property/details/{{.IDHotel}}" target="_blank">{{.HotelName}}</a>
                    </div>
                    <div class="features">
                        <!-- Render Property Amenities -->
                        {{range .Amenities}}
                        <span class="feature-item">{{.}}</span>
                        {{end}}
                    </div>
                    <div class="location-wrapper">
                        <span class="location">{{.Location}}</span>
                    </div>
                    <div class="tiles-btn">
                        <div class="website-btn">
                            <a href="#"><img
                                    src="https://static.rentbyowner.com/release/28.0.6/static/images/booking.svg"
                                    alt="Booking.com"></a>
                        </div>
                        <div class="availability-btn col-sm-7 col-md-6">
                            <div class="view">
                                <a href="#">View Availability</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {{end}} <!-- End of properties loop -->
            {{end}} <!-- End of locations loop -->

        </div>
        <!-- Optionally render a "View More" button -->
        <button id="view-more-btn" class="view-more-btn" onclick="loadMoreProperties()">View More</button>
    </div>

    <script src="/static/js/locationlist.js"></script>
</body>

</html>