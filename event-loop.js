const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout( () => console.log("1️⃣  Timer 1 finished"), 0);
setImmediate( () => console.log("2️⃣  Immediate 1 finished"));

fs.readFile('test-file.txt', () => {
  console.log('3️⃣  I/O finished');
  console.log("-----------------------")
  setTimeout( () => console.log("4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣"), 1000);
  setTimeout( () => console.log("5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣"), 3000);
  setImmediate( () => console.log("6️⃣  Immediate 1 finished"));
  
  process.nextTick( () => console.log("8️⃣  Next Tick 1 finished"))

  // using Sync version of 
  crypto.pbkdf2Sync("password", "salt" , 100000, 1024,  "sha512")
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt" , 100000, 1024,  "sha512")
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt" , 100000, 1024,  "sha512")
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt" , 100000, 1024,  "sha512")
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt" , 100000, 1024,  "sha512")
  console.log(Date.now() - start, "Password encrypted");
})

console.log("7️⃣  Hello from the top level code")