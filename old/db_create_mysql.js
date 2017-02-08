/**
* Copyright © 2017, ACM@UIUC
*
* This file is part of the Groot Project.  
* 
* The Groot Project is open source software, released under the University of
* Illinois/NCSA Open Source License. You should have received a copy of
* this license in a file with the distribution.
**/
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

connection.connect();

/*
CREATE TABLE `groot_beta_all_users` (
  `uid` int(10) unsigned NOT NULL DEFAULT '0',
  `netid` varchar(8) DEFAULT NULL,
  `first_name` varchar(15) NOT NULL DEFAULT '',
  `last_name` varchar(30) NOT NULL DEFAULT '',
  `uin` varchar(9) DEFAULT NULL,
  `joined` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `left_uiuc` date DEFAULT NULL,
  `status` enum('active','inactive','frozen') NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `netid` (`netid`),
  UNIQUE KEY `uin` (`uin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
*/


/*
CREATE TABLE `groot_beta_pre_users` (
  `netid` varchar(8) DEFAULT NULL,
  `first_name` varchar(15) NOT NULL DEFAULT '',
  `last_name` varchar(30) NOT NULL DEFAULT '',
  `uin` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`uin`),
  UNIQUE KEY `netid` (`netid`),
  UNIQUE KEY `uin` (`uin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
*/



var fs = require("fs");
var contents = fs.readFileSync("users.json");
var users = JSON.parse(contents)['data'];

for(var i = 1; i < users.length; i++)
{
	console.log(users[i]);
	var sql = "INSERT INTO user_info(uid, netid, first_name, last_name, uin, joined, left_uiuc, status) " + 
							" VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
	var inserts = [users[i]['uid'], users[i]['netid'], users[i]['first_name'], users[i]['last_name'], users[i]['uin'], 
		users[i]['joined'], users[i]['left_uiuc'], users[i]['status']];
	sql = mysql.format(sql, inserts);

	connection.query(sql, function(err, rows, fields) {
	  if (err) throw err;

	  console.log('Rows: ', rows);
	});
}

connection.end();