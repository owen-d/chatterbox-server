/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var externalData = {'/classes/messages': []};
var url = require('url');

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var data = '';
  var statusCode = 405;
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  var key = url.parse(request.url).pathname;
  // The outgoing status.
  //Handle POST
  if (request.method === "POST") {
    request.on('data', function(postData) {
      data += postData;
    });
    request.on('end', function() {
      // console.log(data);
      var parsedData = JSON.parse(data);
      if (!externalData[key]) {
        externalData[key] = [];
      }
      externalData[key].push(parsedData);
      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end();
    });
  }

  if (request.method === "GET") {
    if (!externalData[key]) {
      statusCode = 404;
      if (key.split('/')[1] === 'classes') {
        statusCode = 200;
      }
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: []}));
    } else {
      // request.on('end', function(){
        data = {};
        data["results"] = externalData[key];
        statusCode = 200;
        // console.log(JSON.stringify(data));
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(data));
      // });
    }
  }
  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "JSON";
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
//------------------------------------------------------------------------------EXPORTS
var exports = module.exports = {};
exports.requestHandler = requestHandler;
