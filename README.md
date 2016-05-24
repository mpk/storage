# storage

localStorage wrapper.

- Uses JSON serialization to store objects and arrays
- Catches browser-raised errors (quota exceeded, localStorage disabled, ...) and indicates them in return values of the library methods

## Install

	npm install mpk/storage#c5cf8b0

## Usage

First you need to get a `Store` instance from the factory:

```javascript
var storage = require('storage');

var store = storage(); // returns Store instance
```

Alternatively, you can also specify a namespace string, which will be prepended to each key you use. This is useful if you have more projects on the same domain and want to "separate" their keys.
```javascript
var storeNS = storage('project_name');
```

### Properties and methods of `Store`

#### .enabled

Property that indicates whether the localStorage and JSON serialization are available.

For example, Safari with cookies disabled restricts access to localStorage, so in that case, the value will be `false`.

#### .get( key, [defaultValue] )

Retrieve the value stored for the specified key and return `Result` object (see the end of this section for details). If there is no value stored for the key, `undefined` or default value (if specified) is returned as value.

```javascript
store.get('foo'); // => Result({ error: false, value: 'bar' })
store.get('non_existent'); // => Result({ error: false, value: undefined })
store.get('non_existent', 'default'); // => Result({ error: false, value: 'default' })
```

#### .set( key, value )

Set the key to the specified value and return `Result` object.

Note: `NaN` and `Infinity` values are stored as null (due to JSON serialization).

```javascript
store.set('foo', 'bar'); // => Result({ error: false, value: null })
store.set('foo', { foo: 'bar' }); // => Result({ error: false, value: null })
store.set('foo', ['foo', 'bar']); // => Result({ error: false, value: null })
```

#### .remove( key )

Remove the key from the localStorage and return `Result` object.

```javascript
store.remove('foo'); // => Result({ error: false, value: null })
```

### `Result` object

All methods of `Store` instance return `Result` object. It contains the following properties:

- `.error`: If any error was raised, or the localStorage/JSON is not available, this property is set to `true`.
- `.value`: This property contains stored value from `.get()` method. For other methods, it is always `null`.

## License

MIT