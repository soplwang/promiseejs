/* Copyright 2016, Wang Wenlin */
"use strict";

module.exports = promisee;
module.exports.then = then;

const then_ = Promise.prototype.then;
const catch_ = Promise.prototype.catch;


/**
 * Adapt promise with callback paradigm by functor alike interface.
 * @returns {Function(e, v)} - node.js style callback w/ promise mixin
 */
function promisee() {
  var thk;
  var o = new Promise((resolv, reject) => {
    thk = _then(reject, resolv);
  });
  thk.then = then_.bind(o);
  thk.catch = catch_.bind(o);
  return thk;
};


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
  return function t2(err_, arg/*, ...*/) {
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
