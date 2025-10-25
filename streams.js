const fs = require('fs'); 
const server = require('http').createServer(); 

server.on('request', (req, res) => {
  //solution 01:
  /*
  fs.readFile("test-file.txt", (err, data) =>{
    if(err) console.log(err);
    res.end(data);
  })
  */

  //solution 02:
  /*
  const readable = fs.createReadStream('test-file.txt');
  readable.on('data', (chunk) => {
    res.write(chunk);
  });
  readable.on('end', () => {
    res.end();
  });
  readable.on('error', (err) => {
    console.log(err);
    res.statusCode = 500;
    res.end('Error: File not found');
  });
  */
  
  //solution 03:
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  // readableSource.pipe(writeableDestination)
  
})

server.listen(8000, "127.0.0.1", () =>{
  console.log('Listening to requests on port 8000... ⏰');
})