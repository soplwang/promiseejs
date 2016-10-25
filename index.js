/* Copyright 2016, Wang Wenlin under MIT License. */

"use strict";

module.exports = promisee;
module.exports.then = then;


/**
 * Adapt promise with callback paradigm by functor alike interface.
 * @returns {Function(e, v)} - node.js style callback w/ promise mixin
 */
function promisee() {
  var thk, cthk;
  var promise = new Promise((resolv, reject) => {
    thk = _then(reject, resolv);
  });
  thk.then = then_;
  thk.catch = catch_;
  return thk;

  function then_(ful, r) {
    if (!cthk) cthk = promisee();
    promise.then(ful, r).then(v => cthk(undefined, v), e => cthk(e));
    return cthk;
  }

  function catch_(r) {
    return then_(undefined, r);
  }
}


/**
 * Combine stand-alone error and success continuations into node.js style callback.
 * @param {Function(e)} err - error continuation
 * @param {Function(v)} next - success continuation
 * @returns {Function(e, v)} - node.js style callback
 */
function then(err, next) {
  err = err || noop;
  next = next || noop;

  return function t(err_, arg, arg2/*, ...*/) {
    if (err_) {
      err(err_);
    } else if (arguments.length <= 2) {
      next(arg);
    } else if (arguments.length <= 3) {
      next(arg, arg2);
    } else {
      var l = arguments.length;
      var args = new Array(l-1);
      for (var i = 1; i < l; i++) args[i-1] = arguments[i];
      next.apply(undefined, args);
    }
  };
}


/* Simplicitized version _then_ only for promisee().
 */
function _then(err, next) {
  return function _t(err_, arg/*, ...*/) {
    if (err_) {
      err(err_);
    } else if (arguments.length <= 2) {
      next(arg);
    } else {
      var l = arguments.length;
      var args = new Array(l-1);
      for (var i = 1; i < l; i++) args[i-1] = arguments[i];
      next(args);
    }
  };
}


function noop() {}
