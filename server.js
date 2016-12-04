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

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var request = require('request');
require('request-debug')(request);

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.GROOT_DB_HOST,
  user     : process.env.GROOT_DB_USER,
  password : process.env.GROOT_DB_PASS,
  database : process.env.GROOT_DB_NAME
});


app.post('/users/pre', function (req, res) {
	console.log("POST /users/pre");

	var token = req.body.token;

	var options = {
		url: process.env.TOKEN_VALIDATION_URL,
		method:"POST",
		json: true,
		body: {
			"token":token
		}
	};

	function callback(error, response, body)
	{
		if(!body || !body["token"])
		{
			res.status(420).end();//the token could not be validated
			// Changed 422 to 420 cuz dank memes
		}
		else
		{
			console.log("error: " + error);
			console.log("Response: " + response);
			console.log("Body: " + body);
			// if(error)
			// 	console.log("Error: " + error);
			// if(body["reason"])
			// 	console.log("ISSUE: " + body["reason"]);
			// else
			//	res.json(body).end();
			
			connection.query('SELECT * FROM groot_beta_pre_users', function(err, rows) {
				console.log("Returning pre_users row queries")
				if(err)
					console.log(err);
				console.log(rows);
				return res.json(rows);
			});
		}
	}

	request(options, callback);

});
/*{
	"authToken":token
}*/

app.post('/users/current', function (req, res) {
	
	var token = req.body.token;

	var options = {
		url: process.env.TOKEN_VALIDATION_URL,
		method:"POST",
		json: true,
		body: {
			"token":token
		}
	};

	function callback(error, response, body)
	{
		if(!body || !body["token"])
		{
			res.status(420).end();//the token could not be validated
			// Changed 422 to 420 cuz dank memes
		}
		else
		{
			console.log("error: " + error);
			console.log("Response: " + response);
			console.log("Body: " + body);
			// if(error)
			// 	console.log("Error: " + error);
			// if(body["reason"])
			// 	console.log("ISSUE: " + body["reason"]);
			// else
			//	res.json(body).end();
			
			connection.query('SELECT * FROM groot_beta_all_users', function(err, rows) {
				console.log(rows);
				return res.json(rows);
			});
		}
	}

	request(options, callback);

	// connection.query('SELECT * FROM user_info', function(err, rows) {
	// 	console.log(rows);
	// 	return res.json(rows);
	// });
});

app.post('/users/:netid', function(req, res){

	var token = req.body.token;

	var options = {
		url: process.env.TOKEN_VALIDATION_URL,
		method:"POST",
		json: true,
		body: {
			"token":token
		}
	};

	function callback(error, response, body)
	{
		if(!body || !body["token"])
		{
			res.status(420).end();//the token could not be validated
			// Changed 422 to 420 cuz dank memes
		}
		else
		{
			console.log("error: " + error);
			console.log("Response: " + response);
			console.log("Body: " + body);
			// if(error)
			// 	console.log("Error: " + error);
			// if(body["reason"])
			// 	console.log("ISSUE: " + body["reason"]);
			// else
			//	res.json(body).end();
			
			console.log("NETID: " + req.params["netid"]);
			var sql = "SELECT * FROM `groot_beta_all_users` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
			connection.query(sql, function(err, rows) {
				if (err) throw err;
				console.log(rows);
				return res.json(rows);
			});
		}
	}

	request(options, callback);
	// console.log("NETID: " + req.params["netid"]);
	// var sql = "SELECT * FROM `user_info` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
	// connection.query(sql, function(err, rows) {
	// 	if (err) throw err;
	// 	console.log(rows);
	// 	return res.json(rows);
	// });
});

app.post('/users/:netid/isMember', function(req, res){
	var token = req.body.token;

	var options = {
		url: process.env.TOKEN_VALIDATION_URL,
		method:"POST",
		json: true,
		body: {
			"token":token
		}
	};

	function callback(error, response, body)
	{
		if(!body || !body["token"])
		{
			res.status(420).end();//the token could not be validated
			// Changed 422 to 420 cuz dank memes
		}
		else
		{
			console.log("error: " + error);
			console.log("Response: " + response);
			console.log("Body: " + body);
			// if(error)
			// 	console.log("Error: " + error);
			// if(body["reason"])
			// 	console.log("ISSUE: " + body["reason"]);
			// else
			//	res.json(body).end();
			
			console.log("NETID: " + req.params["netid"]);
			var sql = "SELECT * FROM `groot_beta_all_users` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
			connection.query(sql, function(err, rows) {
				if (err) throw err;
				console.log("ROWS: " + rows);
				console.log(rows.netid);
				if(rows != "")
					return res.json({"isMember" : "true"});
				return res.json({"isMember" : "false"});
			});
		}
	}

	request(options, callback);

});


app.post('/newUser', function(req, res) {

	console.log(req.body);
	var sql = "INSERT INTO groot_beta_pre_users(netid, first_name, last_name, uin) " + 
							" VALUES (?, ?, ?, ?);";
	var inserts = [req.body.netid, req.body.first_name, req.body.last_name, req.body.uin];
	sql = mysql.format(sql, inserts);
	console.log("INSERT QUERY: " + sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		console.log('Rows: ', rows);
		res.status(200).end();
	});

	/*
		netid, UIN, first name, last name
	*/
});

app.post('/user/paid', function(req, res) {
		var token = req.body.token;

	var options = {
		url: process.env.TOKEN_VALIDATION_URL,
		method:"POST",
		json: true,
		body: {
			"token":token
		}
	};

	function callback(error, response, body)
	{
		if(!body || !body["token"])
		{
			res.status(420).end();//the token could not be validated
			// Changed 422 to 420 cuz dank memes			
		}
		else
		{
			console.log("error: " + error);
			console.log("Response: " + response);
			console.log("Body: " + body);
			// if(error)
			// 	console.log("Error: " + error);
			// if(body["reason"])
			// 	console.log("ISSUE: " + body["reason"]);
			// else
			//	res.json(body).end();
				request(options, callback);

			console.log("NETID: " + req.body.netid);
			var sql = "SELECT * FROM `groot_beta_pre_users` WHERE `netid` = " + mysql.escape(req.body.netid) + "";
			console.log("SQL: " + sql);
			connection.query(sql, function(err, rows) {

				if(rows === [])
					return res.status(400).end();
				else
				{
					console.log("hello");
					var results = JSON.stringify(rows);
					console.log(rows);
					console.log(rows["RowDataPacket"]);
					console.log(results);
					var r = JSON.parse(results);
					console.log(r[0]["netid"]);

					var sqlInsert = "INSERT INTO groot_beta_all_users(netid, first_name, last_name, uin)" +
					" VALUES ("+ mysql.escape(r[0]["netid"]) + ", " + mysql.escape(r[0]["first_name"]) + 
					" , " + mysql.escape(r[0]["last_name"])+", " +mysql.escape(r[0]["uin"]) + ")";
					connection.query(sqlInsert, function(err, rows) {
						console.log("inserted");
						console.log(err);
						if(err)
						{
							return res.status(500).end();
						}
						else
						{
							var deleteSQL = "DELETE from pre_users WHERE `netid`= " + mysql.escape(req.body.netid)
							connection.query(deleteSQL, function(err, rows) {
								console.log("deleted");
								if(err)
								{
									console.log(err);
								}
								console.log(rows);
							});
						}	
					});

					return res.status(200).end();
				}
			});
		}
	}

	request(options, callback);

});

app.post('/token', function(req, res){
	// passing
	// netid, password
	var netid = req.body.netid;
	var pass = req.body.password;

	var options = {
		uri: process.env.CROWD_URL + '/session',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': process.env.CROWD_APP_BASIC_AUTH
		},
		method:"POST",
		json: true,
		body: {
			"username" : netid,
			"password" : pass,
			"validation-factors" : {
			"validationFactors" : [
					{
						"name" : "remote_address",
						"value" : "127.0.0.1"
					}
				]
			}
		}
	};

	function callback(error, response, body)
	{
		if(error)
			console.log("Error: " + error);
		if(body["reason"])
			console.log("ISSUE: " + body["reason"]);
		if(!body["token"]) {
			res.status(420).end();
			// Changed 422 to 420 cuz dank memes			
		}
		else
			res.json(body).end();
	}

	request(options, callback);

});


app.post('/token/validate', function(req,res){
	console.log("POST /token/validate");

	var token = req.body.token;

	var options = {
		uri: process.env.CROWD_URL + '/session/' + token,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': process.env.CROWD_APP_BASIC_AUTH
		},
		method:"POST",
		json: true,
		body: {
		"validationFactors" : [
				{
					"name" : "remote_address",
					"value" : "127.0.0.1"
				}
			]
		}
	};

	function callback(error, response, body)
	{
		if(error)
			console.log("Error: " + error);
		if(body["reason"])
			console.log("ISSUE: " + body["reason"]);
		if(!body["token"]) {
			res.status(420).end();
			// Changed 422 to 420 cuz dank memes			
		}
		else
			res.json(body).end();
	}

	request(options, callback);

});

app.listen(PORT);
console.log('GROOT USER SERVICES is live on port ' + PORT + "!");

/*
debug console.log() statements
			console.log("error: " + error);
			console.log("Response: " + response);
			console.log("Body: " + body);
			// if(error)
			// 	console.log("Error: " + error);
			// if(body["reason"])
			// 	console.log("ISSUE: " + body["reason"]);
			// else
			//	res.json(body).end();
*/