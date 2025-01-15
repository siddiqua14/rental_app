package controllers

import (
    "encoding/json"
    "github.com/beego/beego/v2/server/web"
    "io"
    "log"
    "net/http"
    "strconv"
    "strings"
)

type PropertyDetailsController struct {
    web.Controller
}

func (c *PropertyDetailsController) Get() {
    // Get the HotelID from the URL parameters
    hotelIDStr := c.Ctx.Input.Param(":hotelID")
    if hotelIDStr == "" {
        log.Println("HotelID parameter is missing")
        c.Data["error"] = "HotelID is required"
        c.TplName = "property_details.tpl" // Render the error in the template
        return
    }

    // Convert hotelID to an integer
    hotelID, err := strconv.Atoi(hotelIDStr)
    if err != nil {
        log.Printf("Error converting HotelID to integer: %v", err)
        c.Data["error"] = "Invalid HotelID format"
        c.TplName = "property_details.tpl" // Render the error in the template
        return
    }

    // API URL to fetch the property details
    apiURL := "http://localhost:8080/v1/property/details"

    // Make a GET request to fetch the property details
    resp, err := http.Get(apiURL)
    if err != nil {
        log.Printf("Error fetching data from API: %v", err)
        c.Data["error"] = "Unable to fetch data from API"
        c.TplName = "property_details.tpl" // Render the error in the template
        return
    }
    defer resp.Body.Close()

    // Read the response body
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        log.Printf("Error reading response body: %v", err)
        c.Data["error"] = "Error reading response body"
        c.TplName = "property_details.tpl" // Render the error in the template
        return
    }

    // Parse the response into a list of properties
    var properties []map[string]interface{}
    err = json.Unmarshal(body, &properties)
    if err != nil {
        log.Printf("Error parsing response data: %v", err)
        c.Data["error"] = "Error parsing response data"
        c.TplName = "property_details.tpl" // Render the error in the template
        return
    }

    var matchedProperty map[string]interface{}
    for _, property := range properties {
        if idHotel, ok := property["IDHotel"].(int); ok && idHotel == hotelID {
            matchedProperty = property
            break
        }
    }

    // If a matching property is found, pass it to the template
    if matchedProperty != nil {
        // Extract breadcrumb details
        location, locationExists := matchedProperty["Location"].(string)
        locationData, locationDataExists := matchedProperty["value"].(string)

        if locationExists && locationDataExists {
            locationParts := strings.Split(location, ", ")
            valueParts := strings.Split(locationData, ", ")
            country := valueParts[len(valueParts)-1] // e.g., "United States"

            // Construct breadcrumb elements
            breadcrumb := map[string]string{
                "LocationRentals": locationParts[0] + " Rentals", // e.g., "Upper West Side Rentals"
                "Country":         country,                      // e.g., "United States"
                "State":           locationParts[1],             // e.g., "New York"
                "City":            locationParts[0],             // e.g., "Upper West Side"
            }

            c.Data["property"] = matchedProperty
            c.Data["breadcrumb"] = breadcrumb
            c.TplName = "property_details.tpl" // Render the template with the property details
        } else {
            log.Printf("Location data is missing for HotelID %d", hotelID)
            c.Data["error"] = "Location data is missing"
            c.TplName = "property_details.tpl" // Render the error in the template
        }
    } else {
        log.Printf("Property not found for HotelID %d", hotelID)
        c.Data["error"] = "Property not found"
        c.TplName = "property_details.tpl" // Render the error in the template
    }
}