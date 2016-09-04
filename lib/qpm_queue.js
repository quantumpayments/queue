module.exports = {
  promiseWhile: promiseWhile
}

var Q = require('q')

/**
 * promise in a loop
 * @param  {function} condition returns true if go again
 * @param  {function} body      the actual promise
 * @return {function}           The return promise
 */
function promiseWhile (condition, body) {
  var done = Q.defer()

  function loop () {
        // When the result of calling `condition` is no longer true, we are
        // done.
    if (!condition()) return done.resolve()
        // Use `when`, in case `body` does not return a promise.
        // When it completes loop again otherwise, if it fails, reject the
        // done promise
    Q.when(body(), loop, done.reject)
  }

    // Start running the loop in the next tick so that this function is
    // completely async. It would be unexpected if `body` was called
    // synchronously the first time.
  Q.nextTick(loop)

    // The promise
  return done.promise
}
