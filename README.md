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
  var r = _(), r2 = _();
  redis.get('r:1', r);
  redis.get('r:2', r2);
  console.log('r:1', yield r);
  console.log('r:2', yield r2);
  console.log('r:1 + r:2', (yield r) + (yield r2));
});
```

Works without `co` like plain old `Promise` too:

```javascript
var r = _();

redis.get('r:1', r);

r.then(...)
 .catch(...);
```

LICENSE: MIT
