
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

# 📚 Lecture 034: Events and Event-Driven Architecture

<img src="./img/section04-lecture 034-001.png">