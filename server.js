var http	=		require('http'); //HTTP server and client functionality

var fs		=		require('fs'); //Filesystems

var path	= 	require('path'); // Filesystem paths

var mime	=		require('mime'); // Mime type from file extension

var cache = 	{}; // contents of cached files stored here

function send404(response) {
	response.writeHead(404, {'Content Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200, 
		{'content-type': mime.lookup(path.basename(filepath))}
	);
	response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) { 	// Check if saved in memory
		sendFile(response, absPath, cache[absPath])
	} else {
		fs.exists(absPath, function(exists) { // Check if file exists
			fs.readFile(absPath, function(err, data) { // Read file from disk
				if (err) {
					send404(response);
				} else {
					cache[absPath] = data;
					sendFile(response, absPath, data);
				}
			});
		}) else {
			send404(response);
		}
	}
}

var server = http.createServer(function(req, res) {
	var filePath = false;
	
	if (request.url == '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}
		
	var absPath = './' + filePath;
	serveStatic(res, cache, absPath);
});

server.listen(3000, function() {
	console.log('Server listening on port 3000.')
})