function route(handle, pathname, response, request){
  console.log("About to Route a Request for " + pathname);
  if(typeof handle[pathname] === "function"){
    return handle[pathname](response, request);
  }else{
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 not found");
    response.end();
  }
}

exports.route = route;