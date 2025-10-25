//console.log(arguments);
//console.log(require('module').wrapper);

const C = require('./test-module-1');
const calc1 = new C();
//console.log("from test-module-1: calc1.add(2, 5) = ", calc1.add(2, 5));

const { add, multiply } = require('./test-module-2');
//console.log("from test-module-2: add(2, 5) = ", add(2, 5));
//console.log("from test-module-2: multiply(2, 5) = ", multiply(2, 5));

require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();

