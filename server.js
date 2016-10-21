require('dotenv').config();
// console.log(process.env.DB_HOST+ "\t" +  process.env.DB_USER + "\t" + process.env.DB_PASS + "\t" + process.env.DB_NAME);

const PORT = 8001;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});



app.get('/users/pre', function (req, res) {
	connection.query('SELECT * FROM pre_users', function(err, rows) {
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
	// "SELECT * FROM users where netid == $1", netid
	console.log("NETID: " + req.params["netid"]);
	var sql = "SELECT * FROM `user_info` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
	// var sql = "SELECT * FROM `user_info` WHERE `netid` = $";
	// var inserts = [req.params["netid"]];
	// sql = mysql.format(sql, inserts);
	// console.log("SQL: " + sql, "\tinserts: " + inserts);
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		console.log(rows);
		return res.json(rows);
	});
});


app.get('/users/:netid/isMember', function(req, res){
	// "SELECT * FROM users where netid == $1", netid
	console.log("NETID: " + req.params["netid"]);
	var sql = "SELECT * FROM `user_info` WHERE `netid` = " + mysql.escape(req.params["netid"]) + "";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		console.log("ROWS: " + rows);
		// console.log(JSON.parse());
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


app.listen(PORT);
console.log('GROOT USER SERVICES is live on port ' + PORT + "!");
// console.log(users);