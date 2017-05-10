// Server config
var express = require('express')
var https	= require('https')
var fs 		= require('fs')
var juice	= require('juice')
var bodyParser = require('body-parser')

var app	= express()


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
	response.send('Hello World!')
})

// get the url
app.get('/url/*?', function(request, response) {
	var url = request.params[0]
	console.log("The URL is: " + url)

	// Parsing 'host' and 'path'
	var regEx = /\/\/([^\/]+)(.+)/g
	var match = regEx.exec(url)

	if ( match != null ) {
		// Download the file
		var html = ''
		var result = ''
		var d_options = {
			host: match[1],
			port: 443,
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

		var req = https.request(d_options, function(res) {
			res.setEncoding('utf8')
			html = ''
			res.on('data', function (chunk) {
				html += chunk
				console.log("The HTML is: " + html);
			})

			res.on('end' , function() {
				// Juice Rendering
				result = juice(html, j_options)
				// fs.writeFileSync("juice/rendered.html", result, 'utf8')
				response.send(result)
			})
		})

		req.end()
		
	} else {
		response.send('The given URL is not correct! Please try again.')
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