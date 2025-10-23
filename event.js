const EventEmitter = require("events");
const http = require("http");
/*
class Sales extends EventEmitter{
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Luiggie!");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", 9);
*/

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received!"); // see it from server/terminal
  console.log(req.url);
  res.end("Request received"); // see it from client/browser
});

server.on("request", (req, res) => {
  console.log("Another Request 🥳!"); 
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests... ⏰");
})