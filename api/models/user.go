package models

import (
	"labix.org/v2/mgo/bson"
)

type User struct {
	Id			bson.ObjectId `json:"id" bson:"_id"`
	FirstName 	string 		  `form:"FirstName" json:"FirstName"`
	LastName	string		  `form:"LastName" json:"LastName"`
	UIN			int			  `form:"UIN" json:"UIN"`
	NetId 		string		  `form:"netid" json:"netid"`
	Payed 		bool		  `form:"payed" json:"payed"`
}
