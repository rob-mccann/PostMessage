PostMessage
===========
A simple library for PostMessage, a way to send cross-domain messages between iframes.

Usage
-----

### Send
```
PostMessage.send({
  'action': 'submitted',
}, 'http://destination-url.com');
```

### Listen

```
PostMessage.listen(function(data) {
		switch(data.action) {
			default:
		}
}, 'http://source-url.com');
```

Todo
----

* Improve documentation
