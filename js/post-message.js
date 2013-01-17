/**
* A library for PostMessage, the correct way of sending cross domain messages between iframes
*
* Author: Rob McCann (@rob_mccann)
*
* Send
* ====
*
* PostMessage.send({
*	'action': 'submitted',
* }, 'http://destination-url.com');
*
* Listen
* ======
*
* PostMessage.listen(function(data) {
*	console.log(data);
*	switch(data.action) {
*		default:
*	}
* }, 'http://source-url.com');
*/

var PostMessage = {

	init: function () {
		if (window.postMessageAsyncInit) {
			setTimeout(window.postMessageAsyncInit, 500);
		}
	},

	/* json contains arbritrary data
	normally called on child page
	target is the destination url
	targetElement is the element to post the message on. this defaults to the window parent. */
	send: function(json, target, targetElement) {

		// some validation
		if (typeof target == "undefined") {
			throw new Error('You must supply a target as a string');
		}

		if (typeof targetElement == 'undefined') {
			targetElement = window.parent;
		}

		targetElement.postMessage(PostMessage._serialize(json), target);
	},

	/* Tip: use a variable called 'action' to decide what function to call in your callback
	origin is the source url. must be specified to prevent XSS. */
	listen: function(callback, origin) {
		if (typeof origin == "undefined") {
			throw new Error('You must supply an origin or an array of origins');
		}

		// check the origin matches what we expect. You can have an array of origins.
		var onHear = function(e) {
			if (typeof origin == "array") {
				if (origin.indexOf(e.origin) < 0) {
					return false;
				}
			} else {
				if (origin != e.origin) {
					return false;
				}
			}
			
			callback(PostMessage._unserialize(e.data));

		};
		// add the listener
		if ( window["addEventListener"] ) {
			window.addEventListener('message', onHear, false);
		} else {
			window.attachEvent('onmessage', onHear);
		}
	},

	/* a helper to sent the height of this document to the target
	used to auto resize iframes */
	sendHeight: function(target, targetElement) {
		var updateHeight = function() {
			// just a helper var to make things a bit easier to read
			var d = document;
			// a cross browser way of getting the height
			var height = Math.max(
				Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
				Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
				Math.max(d.body.clientHeight, d.documentElement.clientHeight)
			);

			PostMessage.send({
				'action' : 'height',
				'height': height
			}, target, targetElement);
		};

		// initial call
		updateHeight();
		// Call every half second
		// TODO allow for the interval time to be an option
		setInterval(updateHeight, 500);
	},

	_unserialize: function(string) {
		return JSON.parse(string);
	},

	_serialize: function(obj) {
		return JSON.stringify(obj);
	}
};

PostMessage.init();
