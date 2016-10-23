promisee.js, Adapt promise with callback paradigm.
====

Usage:

```
npm i promisee
```

Desiged intentional works with `co`.

```javascript
const co = require('co');
const promisee = require('promisee');

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
redis.get('r:1', r);
r.then(...)
 .catch(...);
```

Combine stand-alone error and success continuations into node.js style callback.

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
