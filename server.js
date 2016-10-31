require('dotenv').config();

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
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});


app.get('/users/pre', function (req, res) {
	console.log("GET /users/pre");
	connection.query('SELECT * FROM pre_users', function(err, rows) {
		console.log(err);
		console.log(rows);
		return res.json(rows);
	});
});

app.get('/users/current', function (req, res) {
	connection.query('SELECT * FROM user_info', function(err, rows) {
		console.log(rows);
		return res.json(rows);
	});
});

app.get('/users/:netid', function(req, res){
	console.log("NETID: " + req.params["netid"]);
	var sql = "SELECT * FROM `user_info` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		console.log(rows);
		return res.json(rows);
	});
});

app.get('/users/:netid/isMember', function(req, res){
	console.log("NETID: " + req.params["netid"]);
	var sql = "SELECT * FROM `user_info` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		console.log("ROWS: " + rows);
		console.log(rows.netid);
		if(rows != "")
			return res.json({"isMember" : "true"});
		return res.json({"isMember" : "false"});
	});
});


app.post('/newUser', function(req, res) {

	console.log(req.body);
	var sql = "INSERT INTO pre_users(netid, first_name, last_name, uin) " + 
							" VALUES (?, ?, ?, ?);";
	var inserts = [req.body.netid, req.body.firstName, req.body.lastName, req.body.uin];
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
	console.log("NETID: " + req.body.netid);
	var sql = "SELECT * FROM `pre_users` WHERE `netid` = " + mysql.escape(req.body.netid) + "";
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

			var sqlInsert = "INSERT INTO user_info(netid, first_name, last_name, uin)" +
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
		if(!body["token"])
			res.status(422).end();
		else
			res.json(body).end();
	}

	request(options, callback);

});


app.post('/token/validate', function(req,res){

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
		if(!body["token"])
			res.status(422).end();
		else
			res.json(body).end();
	}

	request(options, callback);

});

app.listen(PORT);
console.log('GROOT USER SERVICES is live on port ' + PORT + "!");
// console.log(users);