package main

import(
	"github.com/acm-uiuc/groot-users-service/api/controllers"
	"github.com/acm-uiuc/groot-users-service/api/models"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/render"
)

func main() {

	app := martini.Classic()
	app.Map(models.Database())
	app.Use(render.Renderer())

	users := controllers.NewUsersController(models.Database())

	app.Get("/users", binding.Bind(models.Users{}), users.GetAllUsers)
	app.Post("/users", binding.Bind(models.Users{}), users.PostUser)
	app.Run()
}
