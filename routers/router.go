package routers

import (
	"rental_app/controllers"
	"github.com/beego/beego/v2/server/web"
)

func init() {
	
	ns := web.NewNamespace("/property",
		
		web.NSRouter("/list", &controllers.PropertyListController{}),
		web.NSRouter("/location", &controllers.PropertyLocController{}),
		web.NSRouter("/:location", &controllers.GetLocationController{}),
		web.NSRouter("/details/:idHotel", &controllers.PropertyDetailsController{}),
	)

	
	web.AddNamespace(ns)
}