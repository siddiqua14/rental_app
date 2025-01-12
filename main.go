package main

import (
	_ "rental_app/routers"
	"github.com/beego/beego/v2/server/web"
	"strings"
	
)

func main() {
	// Set static path for serving CSS, JS, and other static files
	web.SetStaticPath("/static", "static")
	web.AddFuncMap("trimSuffix", func(input string, suffix string) string {
        return strings.TrimSuffix(input, suffix)
    })
	// Optional: Configure template rendering
	web.BConfig.WebConfig.ViewsPath = "views"
	web.BConfig.WebConfig.TemplateLeft = "{{"
	web.BConfig.WebConfig.TemplateRight = "}}"
	
	// Start the Beego application
	web.Run()
}
