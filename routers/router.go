package routers

import (
	"rental_app/controllers"
	"github.com/beego/beego/v2/server/web"
)

func init() {
	web.Router("/property/list", &controllers.PropertyListController{})
	web.Router("/property/location", &controllers.PropertyLocController{})
	web.Router("/property/:location", &controllers.GetLocationController{})

	//web.Router("/property/details", &controllers.PropertyDetailsController{})
	web.Router("/property/details/:hotelID", &controllers.PropertyDetailsController{})
}
