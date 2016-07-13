/* Copyright 2016, Wang Wenlin */
"use strict";

const then_ = Promise.prototype.then;
const catch_ = Promise.prototype.catch;

module.exports = function _() {
  if (arguments.length > 0) {
    return then(arguments[0], arguments[1]);
  }
  var thk;
  var o = new Promise((resolv, reject) => {
    thk = forward(resolv, reject);
  });
  thk.then = then_.bind(o);
  thk.catch = catch_.bind(o);
  return thk;
};

function forward(resolv, reject) {
  return function thk(err_, arg, args) {
    if (err_) {
      reject(err_);
    } else if (arguments.length <= 2) {
      resolv(arg);
    } else {
      var l = arguments.length;
      var args_ = new Array(l-1);
      for (var i = 1; i < l; i++) args_[i-1] = arguments[i];
      resolv(args_);
    }
  };
}

function then(err, cb) {
  return function thn(err_, arg, args) {
    if (err_) {
      err(err_);
    } else if (arguments.length <= 2) {
      cb(arg);
    } else {
      var l = arguments.length;
      var args_ = new Array(l-1);
      for (var i = 1; i < l; i++) args_[i-1] = arguments[i];
      cb.apply(null, args_);
    }
  };
}
