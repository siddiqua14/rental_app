package controllers

import (
    "encoding/json"
    "github.com/beego/beego/v2/server/web"
    "io"
    "log"
    "net/http"
    "strings"
)

type PropertyListController struct {
    web.Controller
}

// Helper function to convert plural to singular
func toSingular(input string) string {
    if strings.HasSuffix(input, "s") {
        return strings.TrimSuffix(input, "s")
    }
    return input
}

func (c *PropertyListController) Get() {
    resp, err := http.Get("http://localhost:8080/v1/property/list")
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

    var responseData map[string]interface{}
    err = json.Unmarshal(body, &responseData)
    if err != nil {
        log.Fatal(err)
        c.Data["json"] = map[string]string{"error": "Error parsing response data"}
        c.ServeJSON()
        return
    }

    // Process the properties to handle plural types
    if properties, ok := responseData["properties"].([]interface{}); ok {
        for _, property := range properties {
            if propMap, ok := property.(map[string]interface{}); ok {
                // Convert PropertyType to singular
                if propertyType, ok := propMap["PropertyType"].(string); ok {
                    propMap["PropertyType"] = toSingular(propertyType)
                }
                // Split location into city and area
                if location, ok := propMap["Location"].(string); ok {
                    parts := strings.Split(location, ", ")
                    if len(parts) == 2 {
                        propMap["City"] = strings.TrimSpace(parts[1]) // New York
                        propMap["Area"] = strings.TrimSpace(parts[0]) // Manhattan
                    }
                }
                // Pass amenities to the template
                if amenities, ok := propMap["Amenities"].([]interface{}); ok {
                    propMap["Amenities"] = amenities // Ensure Amenities are passed to the template
                }
                // Map HotelID if not already included
                if hotelID, ok := propMap["HotelID"].(string); ok {
                    propMap["PropertyID"] = hotelID // This will map HotelID to PropertyID if needed
                }
            }
        }
        c.Data["properties"] = properties
    } else {
        c.Data["properties"] = nil
    }

    c.Data["message"] = responseData["message"]
    c.TplName = "rental.tpl"
}
