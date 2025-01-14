package controllers

import (
	"encoding/json"
	"log"
	"net/http"
    "net/url"
	"strings"
    

	"github.com/beego/beego/v2/server/web"
)

type GetLocationController struct {
	web.Controller
}

func (c *GetLocationController) Get() {
    location := c.Ctx.Input.Param(":location")
    location = strings.ReplaceAll(location, "-", " ") // Convert dashes to spaces

    unescapedLocation, err := url.QueryUnescape(location)
    if err != nil {
        log.Println("Error decoding location:", err)
        c.CustomAbort(http.StatusBadRequest, "Invalid location format")
        return
    }

    location = unescapedLocation // Use the unescaped value

    apiURL := "http://localhost:3000/property/location"
    resp, err := http.Get(apiURL)
    if err != nil {
        log.Println("Error fetching data from API:", err)
        c.CustomAbort(http.StatusInternalServerError, "Unable to fetch data from API")
        return
    }
    defer resp.Body.Close()

    var allLocations []map[string]interface{}
    if err := json.NewDecoder(resp.Body).Decode(&allLocations); err != nil {
        log.Println("Error decoding API response:", err)
        c.CustomAbort(http.StatusInternalServerError, "Error parsing API response")
        return
    }

    filteredLocations := []map[string]interface{}{}
    for _, loc := range allLocations {
        if value, ok := loc["Value"].(string); ok {
            if strings.Contains(strings.ToLower(value), strings.ToLower(location)) {
                filteredLocations = append(filteredLocations, loc)
            }
        }
    }

    // Set the filtered locations to the template
    if len(filteredLocations) == 0 {
        c.Data["Locations"] = []map[string]interface{}{}
        c.Data["Message"] = "No matching locations found"
    } else {
        c.Data["Locations"] = filteredLocations
    }

    c.TplName = "locations.tpl" // Specify the template file
    c.Render()
}


