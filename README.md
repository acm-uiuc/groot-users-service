# groot-users-service
Users Services for Groot

To use,``` npm install ``` and ```node server.js```

Additionally, you must rename the ```.envEXAMPLE``` to ```.env```, and put in your credentials for a database in this ```.env``` file

---
###Endpoints for this User Service
GET `/users/pre`

  Returns a JSON list of all pre members(members who have signed up but not registered)
  
GET `/users/current`

  Returns a JSON list of all active members

GET `/users/:netid`

  Returns a JSON list of the information of a specific member

GET `/users/:netid/isMember`
  
  Returns either true or false if a specific person is an active member of ACM
  
POST `/newUser`
  
  `{netid, first_name, last_name, uin)`
  
  Creates a new pre user based off the information posted to this endpoint
      
POST `/user/paid`
  
  `{"netid":netid}`
  
  Moves a user to the active members list.

POST `/token`

  `{"netid":netid, "password":password}`
  
  Returns a token for the given user
  
  POST `/token/validate`

  `{"token":token}`
  
  Validates the given token and returns the user's NETID
