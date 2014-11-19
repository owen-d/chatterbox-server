/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var utils = require('./utils');
var externalData = {'/classes/messages': []};
var url = require('url');
var messages = [];
var objectID = 1;


var actions = {
  'GET': function(request, response){
    utils.sendResponse(response, {results: messages});
  },

  'POST': function(request, response){
    utils.collectData(request, function(message){
      message.objectID = ++objectID;
      messages.push(message);
      utils.sendResponse(response, {objectID: 1, status: 'Posted.'});
    });
  },

  'OPTIONS': function(request, response){
    utils.sendResponse(response);
  }

};

//------------------------------------------------------------------------------EXPORTS

module.exports = function(request, response){
  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    utils.sendResponse(response, "Not found", 404);
  }
};
