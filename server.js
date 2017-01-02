/**
* Copyright © 2016, ACM@UIUC
*
* This file is part of the Groot Project.  
* 
* The Groot Project is open source software, released under the University of
* Illinois/NCSA Open Source License. You should have received a copy of
* this license in a file with the distribution.
**/
var path = require("path");
require('dotenv').config({path: path.resolve(__dirname) + '/.env'});

const PORT = 8001;
const SERVICES_URL = 'http://localhost:8000';
const GROOT_ACCESS_TOKEN = process.env.GROOT_ACCESS_TOKEN || "TEMP_STRING";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var request = require('request');
// require('request-debug')(request);


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.GROOT_DB_HOST,
  user     : process.env.GROOT_DB_USER,
  password : process.env.GROOT_DB_PASS,
  database : process.env.GROOT_DB_NAME
});

function validateToken(token, req, res, nextSteps)
{
	var options = {
		url: `${SERVICES_URL}/session/` + token,
		method:"GET",
		json: true,
		headers: {
			"Authorization": GROOT_ACCESS_TOKEN
		}, 
	};

	function callback(error, response, body)
	{
		if(!body || !body["token"])
		{
			res.status(401).end();//the token could not be validated
		}
		else
		{
			if(error)
				console.log("error: " + error);
			// if(body["reason"])
			// 	console.log("ISSUE: " + body["reason"]);
			
			nextSteps(req, res);
		}
	}
	request(options, callback);
}

function validateTokenAndUser(token, req, res, nextSteps)
{
	var options = {
		url: `${SERVICES_URL}/session/` + token,
		method:"GET",
		json: true,
		headers: {
			"Authorization": GROOT_ACCESS_TOKEN
		}, 
	};
	function callback(error, response, body)
	{
		if(!body || !body["token"])
		{
			res.status(401).end();//the token could not be validated
		}
		else
		{
			if(error)
				console.log("Error: " + error);
			if(body["reason"])
				console.log("ISSUE: " + body["reason"]);
			var netid = body["user"]["name"];

			checkIfAdmin(req, res, netid, function(isAdmin) {
				if(isAdmin)
				{
					// console.log("IS ADMIN");
					nextSteps(req, res);
				}
				else
				{
					// console.log("IS NOT ADMIN");
					checkIfTop4(req, res, netid, function(isTop4) {
						if(isTop4)
						{
							// console.log("IS TOP4");
							nextSteps(req, res);
						}
						else{
							// console.log("IS NOT T4");
							res.status(401).end();//the token could not be validated
						}

					});
				}
			});		
		}
	}
	request(options, callback);
}

//==========================================================================
//NEED TO FINISH validateTokenAndUser() with the below functions
//==========================================================================
function checkIfAdmin(req, res, netid, nextSteps)
{
	var options = {
		url: `${SERVICES_URL}/groups/committees/admin?isMember=${netid}`,
		headers: {
			"Authorization": GROOT_ACCESS_TOKEN
		},
		method:"GET"
	};

	function callback(error, response, body)
	{
		if(error)
			console.log("Error: " + error);
		if(body && JSON.parse(body).isValid === "true")
		{
			nextSteps(true);	
		}
		else
			nextSteps(false);
	}
	request(options, callback);
}

function checkIfTop4(req, res, netid, nextSteps)
{
	var options = {
		url: `${SERVICES_URL}/groups/committees/Top4?isMember=${netid}`,
		headers: {
			"Authorization": GROOT_ACCESS_TOKEN
		},
		method:"GET"
	};

	function callback(error, response, body)
	{
		if(error)
			console.log("Error: " + error);
		if(body && JSON.parse(body).isValid === "true")
		{
			nextSteps(true);	
		}
		else
			nextSteps(false);
	}
	request(options, callback);
}

app.post('/users/pre', function (req, res) {
	// console.log("POST /users/pre");
	validateToken(req.body.token, req, res, getPreUsers);
});

function getPreUsers(req, res)
{
	connection.query('SELECT * FROM intranet_premember ORDER BY created_at DESC', function(err, rows) {
		console.log("Returning pre_users row queries")
		if(err)
			console.log(err);
		return res.json(rows);
	});
}

app.post('/users/current', function (req, res) {
	validateToken(req.body.token, req, res, getCurrentUsers);
});

function getCurrentUsers(req, res)
{
	connection.query('SELECT * FROM groot_beta_all_users', function(err, rows) {
		// console.log(rows);
		return res.json(rows);
	});
}

app.post('/users/:netid', function(req, res){
	validateToken(req.body.token, req, res, getMemberInfo);
});

function getMemberInfo(req, res)
{
	var sql = "SELECT * FROM `groot_beta_all_users` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		return res.json(rows);
	});
}

app.post('/users/:netid/isMember', function(req, res){
	validateToken(req.body.token, req, res, getIsMember);
});

function getIsMember(req, res)
{
	var sql = "SELECT * FROM `groot_beta_all_users` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		if(rows != "")
			return res.json({"isMember" : "true"});
		return res.json({"isMember" : "false"});
	});
}


app.post('/newUser', function(req, res) {
	// console.log("POST /newUser");

	// per https://github.com/mysqljs/mysql#escaping-query-values, the following values are already escaped
	var sql = "INSERT INTO groot_beta.intranet_premember(netid, first_name, last_name, uin) " + 
							" VALUES (?, ?, ?, ?);";
	var inserts = [req.body.netid, req.body.first_name, req.body.last_name, req.body.uin];
	sql = mysql.format(sql, inserts);
	// console.log("INSERT QUERY: " + sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		res.status(200).end();
	});

});

app.post('/user/paid', function(req, res) {
	// console.log("POST /user/paid");
	// console.log(req.body.token + "\t" + req.body.netid);
	validateTokenAndUser(req.body.token, req, res, userPaid);
});

function userPaid(req, res)
{
	// console.log("userPaid()");
	// console.log("NETID: " + req.body.netid);
	var sql = "SELECT * FROM `intranet_premember` WHERE `netid` = " + mysql.escape(req.body.netid) + "";
	// console.log("SQL: " + sql);
	connection.query(sql, function(err, rows) {
		// console.log("ROWS:");
		if(rows === [])
			return res.status(500).end();
		else
		{	
			var results = JSON.stringify(rows);
			// console.log(rows);
			// console.log(rows["RowDataPacket"]);
			// console.log(results);
			var r = JSON.parse(results);
			if(r  && r[0] && r[0]["netid"])
			{
				// console.log(r[0]["netid"]);

				var sqlInsert = "INSERT INTO intranet_approved_member(netid, first_name, last_name, uin) " + 
								" VALUES (?, ?, ?, ?);";
				
				var inserts = [r[0]["netid"], r[0]["first_name"], r[0]["last_name"], r[0]["uin"]];
				sqlInsert = mysql.format(sqlInsert, inserts);

				connection.query(sqlInsert, function(err, rows) {
					// console.log(err);
					if(err)
					{
						console.log(err);
						return res.status(500).end();
					}
					else
					{
						var deleteSQL = "DELETE from intranet_premember WHERE `netid`= " + mysql.escape(req.body.netid);
						connection.query(deleteSQL, function(err, rows) {
							// console.log("deleted");
							if(err)
							{
								console.log(err);
							}
							// console.log(rows);
							console.log("added member " + mysql.escape(req.body.netid) + "to intranet_approved_member table")
							return res.status(200).end();

						});
					}	
				});
			}
			else
			{
				console.log("user does not exist in intranet_premember,  netid: " + mysql.escape(req.body.netid) + ", returning a 500 server error");
				return res.status(500).end();
			}
		}
	});


}

app.listen(PORT);
console.log('GROOT USER SERVICES is live on port ' + PORT + "!");
