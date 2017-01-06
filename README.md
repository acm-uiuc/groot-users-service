# groot-users-service
Users Services for Groot

To use,``` npm install ``` and ```node server.js```

Additionally, you must rename ```example.env``` to ```.env```, and put in your credentials in the ```.env``` file

---
###Endpoints for this User Service
POST `/users/pre`

  `{"token":token}`

  Returns a JSON list of all pre members(members who have signed up but not registered)
  
POST `/users/current`

  `{"token":token}`

  Returns a JSON list of all active members

POST `/users/:netid`

  `{"token":token}`

  Returns a JSON list of the information of a specific member

POST `/users/:netid/isMember`

  `{"token":token}`
  
  Returns either true or false if a specific person is an active member of ACM
  
POST `/newUser`
  
  `{"netid":netid, "first_name":firstName, "last_name":lastName, "uin":uin}`
  
  Creates a new pre user based off the information posted to this endpoint
      
POST `/user/paid`
  
  `{"token":token, "netid":netid}`
  
  Moves a user to the active members list.

## License

This project is licensed under the University of Illinois/NCSA Open Source License. For a full copy of this license take a look at the LICENSE file. 

When contributing new files to this project, preappend the following header to the file as a comment: 

```
Copyright © 2016, ACM@UIUC

This file is part of the Groot Project.  
 
The Groot Project is open source software, released under the University of Illinois/NCSA Open Source License. 
You should have received a copy of this license in a file with the distribution.
```
