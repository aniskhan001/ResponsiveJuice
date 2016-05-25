// Server config
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
	response.send('Hello World!');
})

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
})

// Juice test
var fs 	 = require("fs");
var html = fs.readFileSync("juice/index.html").toString('utf8');
var css  = fs.readFileSync("juice/style.css").toString('utf8');

// console.log(html);
var juice	= require('juice');
var result	= juice.inlineContent(html, css);
// console.log(result);

fs.writeFileSync("juice/rendered.html", result, 'utf8');
// console.log(result);

