# Groot Users Service

[![Build Status](https://travis-ci.org/acm-uiuc/groot-users-service.svg?branch=master)](https://travis-ci.org/acm-uiuc/groot-users-service)

[![Join the chat at https://acm-uiuc.slack.com/messages/C6XGZD212/](https://img.shields.io/badge/slack-groot-724D71.svg)](https://acm-uiuc.slack.com/messages/C6XGZD212/)


## Installing MySQL
```sh
brew install mysql
```

## Migrate DB after model alteration (clears all data)
```
rake db:migrate
```

## Create secrets.yaml and database.yaml

```
cp secrets.yaml.template secrets.yaml
```

## Create databases

You need to login to `mysql`, and create the database names for your development and test environments and fill it in `secrets.yaml`. For example,

In `mysql`:
```
CREATE DATABASE groot_users_service_dev
```

## Run Application (on port 8001)
```
ruby app.rb
```

## Routes (from `rake routes:show`)

:: GET ::

`/status`

`/users`

`/users/:netid`

`/users/:netid/is_member`


:: HEAD ::

`/status`

`/users`

`/users/:netid`

`/users/:netid/is_member`


:: POST ::

`/users`

`/users/login`

`/users/logout`


:: PUT ::

`/users/:netid/paid`


:: DELETE ::

`/users/:netid`


## Data Migration

Run `rake db:liquid` to migrate a table dump of previous users in csv format.

## License

This project is licensed under the University of Illinois/NCSA Open Source License. For a full copy of this license take a look at the LICENSE file. 

When contributing new files to this project, preappend the following header to the file as a comment: 

```
Copyright © 2017, ACM@UIUC

This file is part of the Groot Project.  
 
The Groot Project is open source software, released under the University of Illinois/NCSA Open Source License. 
You should have received a copy of this license in a file with the distribution.
```
