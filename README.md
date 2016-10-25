promisee.js, Adapt promise with callback paradigm.
====

Usage:

```
npm i promisee
```

Desiged intentional works with `co`:

```javascript
const promisee = require('promisee');
const co = require('co');

co(function* () {
  var tickets = promisee(), tr = promisee(), coins = promisee(), likes = promisee();
  redis.get('t:1', tickets);
  if ((yield tickets) - 100 >= 0) {
    redis.decr('t:1', 100, tr);
  }
  redis.mget(['c:1', 'c2:1'], coins);
  redis.incr('l:1', 1, likes);
  console.log((yield tr), (yield coins)[0]);
  return (yield tr);
});
```

Works without `co` like plain old `Promise` too:

```javascript
var r = promisee();
var r2 = promisee().catch(e => {});

redis.get('r:1', r);
redis.get('r:1', r2);

Promise.all(r, r2).then(values => {
  ...
}).catch(e => {
  ...
});
```

Or use the cornerstone `then`, that combines stand-alone error and success continuations into node.js style callback:

```javascript
const then = require('promisee').then;

redis.get('key', then(err, data => console.log(data)));
redis.get('key2', then(err, data => console.log(data)));
redis.get('key3', then(err, data => console.log(data)));

function err(e) {
  console.error(e);
}
```

LICENSE: MIT
