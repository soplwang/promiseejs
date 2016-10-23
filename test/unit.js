/* Copyright 2016, Wang Wenlin */
"use strict";

const assert = require('assert');
const util = require('util');
const co = require('co');
const promisee = require('../');
const then = require('../').then;

describe('promisee.js', function () {
  describe('promisee()', function () {
    it('normal usages w/ co', function (done) {
      co(function* () {
        var r = promisee(), r2 = promisee();
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
      var r = promisee(), r2 = promisee();
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

  describe('then()', function () {
    it('split err from callbacks', function () {
      then(undefined, function (res) {
        assert.equal(res, 1);
      })(undefined, 1);

      then(function (e) {
        assert.equal(e.message, 'err');
      })(Error('err'));
    });

    it('support multiple params', function () {
      then(undefined, function (res, r2, r3) {
        assert.equal(res, 1);
        assert.equal(r2, 2);
        assert.equal(r3, 3);
      })(undefined, 1, 2, 3);
    });
  });
});
