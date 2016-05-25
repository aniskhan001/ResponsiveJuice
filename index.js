// Server config
var express = require('express')
var http	= require('http')
var fs 		= require('fs')
var juice	= require('juice')
var bodyParser = require('body-parser')

var app	= express()


// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
	response.send('Hello World!')
})

// get the input box
app.get('/input', function(request, response) {
	fs.readFile('juice/input.html',function (error, data){
		response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length})
		response.write(data)
		response.end()
	})
})

// process the url 
app.post('/process', function(request, response) {
	var url = request.body.url

	// Parsing 'host' and 'path'
	var regEx = /\/\/([^\/]+)(.+)/g
	var match = regEx.exec(url)
	// console.log(match[1] + " " + match[2])
	// console.log(match)

	if ( match != null ) {
		// Download the file
		var html = ''
		var result = ''
		var d_options = {
			host: match[1],
			port: 80,
			path: match[2],
			method: 'POST'
		}

		var j_options = {
			applyStyleTags : true,
			removeStyleTags : true,
			preserveMediaQueries : true,
			preserveFontFaces : true,
			applyWidthAttributes : true,
			applyHeightAttributes : true,
			applyAttributesTableElements : true
		}

		var req = http.request(d_options, function(res) {
			res.setEncoding('utf8')
			res.on('data', function (chunk) {
				html = chunk

				// Juice Rendering
				result = juice(html, j_options)
				fs.writeFileSync("juice/rendered.html", result, 'utf8')
				// console.log(result)
			})
		})
		req.end()

		response.send('HTML Rendered. <a href="/view">Click to view</a>')
	} else {
		response.send('The given URL is not correct! <a href="/input">Try again</a>')
	}
})

// Show the rendered file
app.get('/view', function(request, response) {
	fs.readFile('juice/rendered.html',function (error, data){
		response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length})
		response.write(data)
		response.end()
	})
})


app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
})