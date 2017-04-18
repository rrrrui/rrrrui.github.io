var PromiseA = function (resolver) {
	var promiseA = this;
	promiseA._value = null;
	promiseA._reason = null;
	promiseA._status = 'PENDING';
	promiseA._resolves = [];
	promiseA._rejects = [];
	var resolve = function(value) {
		setTimeout(function () {
			promiseA._status = 'FULFILLED';
			promiseA._resolves.forEach(function (fn) {
				fn(value)
			})
		},0)
	}
	var reject = function(reason) {
		setTimeout(function () {
			promiseA._status = 'REJECTED';
			promiseA._rejects.forEach(function (fn) {
				fn(reason)
			})
		},0)
	}
	resolver(resolve,reject)
}
PromiseA.prototype = {
	'then' : function (onFulfilled, onRejected) {
		var promiseA = this;
		return new PromiseA(function (resolver,reject) {
			function handle(value) {
				var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
				// 判断是不是 promise 对象
				if (ret && typeof ret['then'] == 'function') {
					ret.then(function(value) {
						resolver(value);
					}, function(reason) {
						reject(reason);
					});
				} else {
					resolver(ret);
				}
			}
			function errback(reason) {
				reason = typeof onRejected === 'function' && onRejected(reason) || reason;
				reject(reason);
			}
			if (promiseA._status === 'PENDING') {
				promiseA._resolves.push(handle);
				promiseA._rejects.push(errback);
			} else if (promiseA._status === 'REJECTED') {
				errback(promiseA._reason);
			}
		})
	}
}
// var getData100 = function() {
// 	return new PromiseA(function(resolve, reject) {
// 		setTimeout(function() {
// 			resolve('100ms');
// 		}, 1000);
// 	});
// }
//
// var getData200 = function() {
// 	return new PromiseA(function(resolve, reject) {
// 		setTimeout(function() {
// 			resolve('200ms');
// 		}, 2000);
// 	});
// }
// var getData300 = function() {
// 	return new PromiseA(function(resolve, reject) {
// 		setTimeout(function() {
// 			reject('reject');
// 		}, 3000);
// 	});
// }
//
// getData100().then(function(data) {
// 	console.log(data); // 100ms
// 	return getData200();
// }).then(function(data) {
// 	console.log(data); // 200ms
// 	return getData300();
// }).then(function(data) {
// 	console.log(data); // 100ms
// }, function(data) {
// 	console.log(data);
// });