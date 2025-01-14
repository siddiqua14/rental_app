package controllers

import (
    "encoding/json"
    "github.com/beego/beego/v2/server/web"
    "io"
    "log"
    "net/http"
    "strings"
    "net/url"
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
    location := c.GetString("location")
    apiURL := "http://localhost:8080/v1/property/list"
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

    var responseData map[string]interface{}
    err = json.Unmarshal(body, &responseData)
    if err != nil {
        log.Fatal(err)
        c.Data["json"] = map[string]string{"error": "Error parsing response data"}
        c.ServeJSON()
        return
    }

    // Process the properties to handle plural types
    var locations []string
    locationSet := make(map[string]struct{})

    if properties, ok := responseData["properties"].([]interface{}); ok {
        for _, property := range properties {
            if propMap, ok := property.(map[string]interface{}); ok {
                if loc, ok := propMap["Location"].(string); ok {
                    if _, exists := locationSet[loc]; !exists {
                        locations = append(locations, loc)
                        locationSet[loc] = struct{}{}
                    }
                }

                // Process the details
                if details, ok := propMap["details"].([]interface{}); ok {
                    for _, detail := range details {
                        if detailMap, ok := detail.(map[string]interface{}); ok {
                        

                            // Singularize PropertyType
                            if propertyType, ok := detailMap["PropertyType"].(string); ok {
                                detailMap["PropertyType"] = toSingular(propertyType)
                            }

                            // Handle Amenities
                            if amenities, ok := detailMap["Amenities"].([]interface{}); ok {
                                detailMap["Amenities"] = amenities
                            }

                            // Rename IDHotel to PropertyID
                            if idHotel, ok := detailMap["IDHotel"].(string); ok {
                                detailMap["PropertyID"] = idHotel
                            }
                        }
                    }
                    propMap["details"] = details
                }
            }
        }
        c.Data["properties"] = properties

        // Marshal locations to JSON and pass to template
        locationsJSON, err := json.Marshal(locations)
        if err != nil {
            log.Fatal(err)
        }
        c.Data["locationsJSON"] = string(locationsJSON)
    } else {
        c.Data["properties"] = nil
        c.Data["locationsJSON"] = "[]"
    }

    c.TplName = "rental.tpl"
    c.Render()
}