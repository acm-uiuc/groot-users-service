# groot-users-service
Users Services for Groot

To use,``` npm install ``` and ```node server.js```

Additionally, you must rename ```.envEXAMPLE``` to ```.env```, and put in your credentials in the ```.env``` file

---
###Endpoints for this User Service
POST `/users/pre`

  `{"authToken":token}`

  Returns a JSON list of all pre members(members who have signed up but not registered)
  
POST `/users/current`

  `{"authToken":token}`

  Returns a JSON list of all active members

POST `/users/:netid`

  `{"authToken":token}`

  Returns a JSON list of the information of a specific member

POST `/users/:netid/isMember`

  `{"authToken":token}`
  
  Returns either true or false if a specific person is an active member of ACM
  
POST `/newUser`
  
  `{"netid":netid, "first_name":firstName, "last_name":lastName, "uin":uin}`
  
  Creates a new pre user based off the information posted to this endpoint
      
POST `/user/paid`
  
  `{"authToken":token, "netid":netid}`
  
  Moves a user to the active members list.

POST `/token`

  `{"netid":netid, "password":password}`
  
  Returns a token for the given user
  
POST `/token/validate`

  `{"token":token}`
  
  Validates the given token and returns the user's NETID








