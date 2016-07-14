/* Copyright 2016, Wang Wenlin */
"use strict";

const assert = require('assert');
const util = require('util');
const co = require('co');
const _ = require('../');

describe('promisee.js', function () {
  describe('promisee mode', function () {
    it('normal usages w/ co', function (done) {
      co(function* () {
        var r = _(), r2 = _();
        process.nextTick(() => r(null, 'ok'));
        process.nextTick(() => r2('err'));
        assert.equal(yield r, 'ok');
        assert.equal((yield r) + '!', 'ok!');
        try {
          yield r2;
        } catch (e) {
          return done();
        }
        throw Error('yield not throw');
      }).catch(done);
    });

    it('plain old promise', function (done) {
      var r = _(), r2 = _();
      process.nextTick(() => r(null, 'ok'));
      process.nextTick(() => r2('err'));
      r.then(v => assert.equal(v, 'ok'))
       .catch(e => done(e));
      r.then(v => assert.equal(v + '!', 'ok!'))
       .then(() => {
        r2.then(v => done(Error('r2 not throw')))
          .catch(e => done());
       })
       .catch(e => done(e));
    });
  });

  describe('then mode', function () {
    it('split err from callbacks', function () {
      _(null, function (res) {
        assert.equal(res, 1);
      })(null, 1);

      _(function (e) {
        assert.equal(e.message, 'err');
      })(Error('err'));
    });

    it('support multiple params', function () {
      _(null, function (res, r2, r3) {
        assert.equal(res, 1);
        assert.equal(r2, 2);
        assert.equal(r3, 3);
      })(null, 1, 2, 3);
    });
  });
});
