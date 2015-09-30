package controllers

import (
	"github.com/acm-uiuc/groot-users-service/api/modules"
	"github.com/martini-contrib/render"
	"labix.org/v2/mgo" //replace with lib/pq
	"labix.org/v2/mgo/bson"
	"os"
)

type (
	UserController struct {
		session *mgo.Session
	}
)

func NewUserController(s *mgo.Session) *UserController {
	return &UserController{s}
}

func (uc *UserController) GetAllUsers(r render.Render)  {
	users := []models.User{}
	session := us.session.DB(os.Getenv("DB_NAME")).C("users")
	err := session.Find(nil).Limit(100).All(&users)

	if err != nil {
		panic(err)
	}

	r.JSON(200, users)
}

func (uc *UserController) PostUser(user models.User, r render.Render) {
	session := uc.session.DB(os.Getenv("DB_NAME")).C("users")

	user.Id = bson.NewObjectId()
	user.FirstName = user.FirstName
	user.LastName = user.LastName
	user.UIN = user.UIN
	user.NetId = user.NetId
	session.Insert(user)

	r.JSON(201, user)
}
