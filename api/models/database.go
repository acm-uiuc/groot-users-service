package models

import (
	"labix.org/v2/mgo" //replace with postgres asap
	"os"
)

func Database() *mgo.Session {
	session, err := mgo.Dial("users_db")

	if err != nil {
		panic(err)
	}

	session.SetNode(mgo.Monotonic, true)

	session.DB(os.Getenv("USER_DB"))

	return session
}
