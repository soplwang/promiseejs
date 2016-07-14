promisee.js, Adapt promise with callback paradigm.
====

Usage:

```
npm i promisee
```

Desiged intentional works with `co`.

```javascript
const co = require('co');
const _ = require('promisee');

co(function* () {
  var tickets = _(), tr = _(), coins = _(), likes = _();
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
var r = _();
redis.get('r:1', r);
r.then(...).catch(...);
```

LICENSE: MIT
