PostMessage
===========

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
