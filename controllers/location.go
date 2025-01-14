package controllers

import (
    "encoding/json"
    "io"
    "log"
    "net/http"
    "net/url"
    "strconv"
    "strings"

    "github.com/beego/beego/v2/server/web"
)

type PropertyLocController struct {
    web.Controller
}

func (c *PropertyLocController) Get() {
    location := c.GetString("location")
    apiURL := "http://localhost:8080/v1/property/location"
    if location != "" {
        apiURL += "?location=" + url.QueryEscape(location)
    }

    resp, err := http.Get(apiURL)
    if err != nil {
        log.Fatal(err)
        c.Data["json"] = map[string]string{"error": "Unable to fetch data from API"}
        c.ServeJSON()
        return
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        log.Fatal(err)
        c.Data["json"] = map[string]string{"error": "Error reading response body"}
        c.ServeJSON()
        return
    }

    var responseData []map[string]interface{}
    err = json.Unmarshal(body, &responseData)
    if err != nil {
        log.Fatal(err)
        c.Data["json"] = map[string]string{"error": "Error parsing response data"}
        c.ServeJSON()
        return
    }

    // Process the properties to handle plural types
    for _, propMap := range responseData {
        // Process the hotels
        if hotels, ok := propMap["hotels"].(map[string]interface{}); ok {
            for hotelID, detail := range hotels {
                if detailMap, ok := detail.(map[string]interface{}); ok {
                    // Process the location and add City and Area
                    if location, ok := detailMap["Location"].(string); ok {
                        parts := strings.Split(location, ", ")
                        if len(parts) >= 2 {
                            detailMap["City"] = strings.TrimSpace(parts[len(parts)-2]) // New York
                            detailMap["Area"] = strings.TrimSpace(parts[0]) // Upper West Side or other area
                        }
                    }

                    // Singularize PropertyType
                    if propertyType, ok := detailMap["PropertyType"].(string); ok {
                        detailMap["PropertyType"] = toSingularcon(propertyType)
                    }

                    // Handle Amenities
                    if amenities, ok := detailMap["Amenities"].([]interface{}); ok {
                        detailMap["Amenities"] = amenities
                    }

                    // Rename HotelID to PropertyID
                    if hotelID, ok := detailMap["HotelID"].(string); ok {
                        detailMap["PropertyID"] = hotelID
                    }

                    // Update the key with the new ID format
                    newHotelID := "id:" + strconv.Itoa(int(detailMap["IDHotel"].(float64)))
                    delete(hotels, hotelID)
                    hotels[newHotelID] = detailMap
                }
            }
            propMap["hotels"] = hotels
        }
    }

    c.Data["json"] = responseData
    c.ServeJSON()
}

func toSingularcon(propertyType string) string {
    // Implement the logic to convert plural property types to singular
    // For example, "Hostels" -> "Hostel"
    if strings.HasSuffix(propertyType, "s") {
        return strings.TrimSuffix(propertyType, "s")
    }
    return propertyType
}