
# ✅ Section 04: How Node.js works: A look behind the scenes


## 📚 Lecture 030: Node, V8, Libuv and C++
<img src="./img/section04-lecture030-001.png">


## 📚 Lecture 031: Processes, Threads and the Thread Pool
<img src="./img/section04-lecture031-001.png">

## 📚 Lecture 032: The Node.js Event Loop

<img src="./img/section04-lecture032-001.png">
<img src="./img/section04-lecture032-002.png">
<img src="./img/section04-lecture032-003.png">


## 📚 Lecture 033: The Event Loop in Practice

### 1. Having this project structure:
```
02-how-node-works
├── README.md
├── event-loop.js
├── img/
│   └── ...
└── test-file.txt
```

### 2. Know how Event loop works:
```js
const fs = require('fs');

setTimeout( () => console.log("1️⃣ Timer 1 finished"), 0);
setImmediate( () => console.log("2️⃣ Immediate 1 finished"));

fs.readFile('test-file.txt', () => {
  console.log('3️⃣ I/O finished');
})

console.log("4️⃣ Hello from the top level code")
```

#### Outcome:
```
4️⃣ Hello from the top level code
1️⃣ Timer 1 finished
2️⃣ Immediate 1 finished
3️⃣ I/O finished
```

### 3. New situation with 
```js
const fs = require('fs');

setTimeout( () => console.log("1️⃣ Timer 1 finished"), 0);
setImmediate( () => console.log("2️⃣ Immediate 1 finished"));

fs.readFile('test-file.txt', () => {
  console.log('3️⃣ I/O finished');
  setTimeout( () => console.log("4️⃣ Timer 2 finished"), 0);
  setTimeout( () => console.log("5️⃣ Timer 3 finished"), 3000);
  setImmediate( () => console.log("6️⃣ Immediate 1 finished"));
})

console.log("7️⃣ Hello from the top level code")
```

#### Outcome:
```txt
7️⃣ Hello from the top level code
1️⃣ Timer 1 finished
2️⃣ Immediate 1 finished
3️⃣ I/O finished
6️⃣ Immediate 1 finished
4️⃣ Timer 2 finished
5️⃣ Timer 3 finished // 3 seconds delayed
```

### 3. More complex situation:
```js
const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

setTimeout( () => console.log("1️⃣  Timer 1 finished"), 0);
setImmediate( () => console.log("2️⃣  Immediate 1 finished"));

fs.readFile('test-file.txt', () => {
  console.log('3️⃣  I/O finished');
  console.log("-----------------------")
  setTimeout( () => console.log("4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣"), 1000);
  setTimeout( () => console.log("5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣"), 3000);
  setImmediate( () => console.log("6️⃣  Immediate 1 finished"));
  
  process.nextTick( () => console.log("8️⃣  Next Tick 1 finished"))

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  })
})

console.log("7️⃣  Hello from the top level code")
```

#### outcome:
```
7️⃣  Hello from the top level code
1️⃣  Timer 1 finished
2️⃣  Immediate 1 finished
3️⃣  I/O finished
-----------------------
8️⃣  Next Tick 1 finished
6️⃣  Immediate 1 finished
515 Password encrypted
4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣
5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣
```

### 4. New situation with many crypto process:
```js
const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

setTimeout( () => console.log("1️⃣  Timer 1 finished"), 0);
setImmediate( () => console.log("2️⃣  Immediate 1 finished"));

fs.readFile('test-file.txt', () => {
  console.log('3️⃣  I/O finished');
  console.log("-----------------------")
  setTimeout( () => console.log("4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣"), 1000);
  setTimeout( () => console.log("5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣"), 3000);
  setImmediate( () => console.log("6️⃣  Immediate 1 finished"));
  
  process.nextTick( () => console.log("8️⃣  Next Tick 1 finished"))

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
})

console.log("7️⃣  Hello from the top level code")
```

#### outcome:
```
7️⃣  Hello from the top level code
1️⃣  Timer 1 finished
2️⃣  Immediate 1 finished
3️⃣  I/O finished
-----------------------
8️⃣  Next Tick 1 finished
6️⃣  Immediate 1 finished
561 Password encrypted
577 Password encrypted
588 Password encrypted
594 Password encrypted
4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣
5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣
```

### 5. One threadpoll_size only:
```js
const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1;

setTimeout( () => console.log("1️⃣  Timer 1 finished"), 0);
setImmediate( () => console.log("2️⃣  Immediate 1 finished"));

fs.readFile('test-file.txt', () => {
  console.log('3️⃣  I/O finished');
  console.log("-----------------------")
  setTimeout( () => console.log("4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣"), 1000);
  setTimeout( () => console.log("5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣"), 3000);
  setImmediate( () => console.log("6️⃣  Immediate 1 finished"));
  
  process.nextTick( () => console.log("8️⃣  Next Tick 1 finished"))

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt" , 100000, 1024,  "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
})

console.log("7️⃣  Hello from the top level code")
```

#### outcome:
```
7️⃣  Hello from the top level code
1️⃣  Timer 1 finished
2️⃣  Immediate 1 finished
3️⃣  I/O finished
-----------------------
8️⃣  Next Tick 1 finished
6️⃣  Immediate 1 finished
506 Password encrypted
1004 Password encrypted
4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣
1505 Password encrypted
2001 Password encrypted
5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣
```

### 6. pbkdf2Sync version:
```js
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
```

#### Outcome:
```
7️⃣  Hello from the top level code
1️⃣  Timer 1 finished
2️⃣  Immediate 1 finished
3️⃣  I/O finished
-----------------------
517 Password encrypted
1020 Password encrypted
1526 Password encrypted
2031 Password encrypted
2541 Password encrypted
8️⃣  Next Tick 1 finished
6️⃣  Immediate 1 finished
4️⃣  Timer 2 finished - 1 second after I/O & 6️⃣
5️⃣  Timer 3 finished - 3 seconds after I/O & 6️⃣
```

## 📚 Lecture 034: Events and Event-Driven Architecture

<img src="./img/section04-lecture 034-001.png">

## 📚 Lecture 035: Events in Practice

### 1. Create **`event.js`** file:
```js
// ./event.js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});
myEmitter.emit("newSale");
```

> then run **`node. event.js`** from terminal:
```bash
There was a new sale!
```

### 2. Add a new listener in **`event.js`** file:
```js
// ./event.js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});
myEmitter.on("newSale", () => {
  console.log("Customer name: Luiggie!");
});
myEmitter.emit("newSale");
```

> then run **`node. event.js`** from terminal:
```
There was a new sale!
Customer name: Luiggie!
```

### 3. Send an argument through a listener in **`event.js`** file:
```js
// ./event.js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

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
```

> then run **`node. event.js`** from terminal:
```
There was a new sale!
Customer name: Luiggie!
There are now 9 items left in stock.
```

### 4. Add a class as new Event Emitter object in **`event.js`** file:
```js
// ./event.js
const EventEmitter = require("events");
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
```

> then run **`node. event.js`** from terminal:
```
There was a new sale!
Customer name: Luiggie!
There are now 9 items left in stock.
```

### 5. Create a new server with http:
```js
// ./event.js
const EventEmitter = require("events");
const server = http.createServer();
server.on("request", (req, res) => {
  console.log("Request received!"); // see it from server/terminal
  res.end("Request received"); // see it from client/browser
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests... ⏰");
})
```
> then run **`node. event.js`** from terminal:

<img src="./img/section04-lecture035-001.png">

> open a browser with **`http://localhost:8000`**:

<img src="./img/section04-lecture035-002.png">
<img src="./img/section04-lecture035-003.png">

### 6. Crate more Request:
```js
// ./event.js
const EventEmitter = require("events");
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
```
> then run **`node. event.js`** from terminal:
> open a browser with **`http://localhost:8000`**:

<img src="./img/section04-lecture035-004.png">