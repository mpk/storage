/**
 *	localStorage wrapper
 */
/**
 *	@constructor
 *	@param {string=} namespace
 */
function Store( namespace ) {
	this.namespace = namespace;
}

Store.prototype = {

	/**
	 *	Detect whether the localStorage and JSON serialization are available.
	 *
	 *	@see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
	 *	@type {boolean}
	 */
	enabled: (function() {
		try {
			localStorage.setItem('detect', 'detect');
			localStorage.removeItem('detect');
			return !!window.JSON;
		} catch ( ex ) {
			console.warn('localStorage or JSON is not available.');
			return false;
		}
	})(),

	/**
	 *	Retrieve the value stored for the specified key.
	 *
	 *	@param {string} key
	 *	@param {*=} defaultValue
	 *	@return {Result}
	 */
	get: function( key, defaultValue ) {
		if (!this.enabled) {
			return new Result(null, true);
		}

		var errorRaised = false;
		var storedValue;

		try {
			storedValue = JSON.parse(localStorage.getItem(this.getFullKeyName(key)));
		} catch ( ex ) {
			errorRaised = true;
		}

		if (errorRaised) {
			return new Result(null, true);
		} else if (storedValue && storedValue.data !== undefined) {
			return new Result(storedValue.data, false);
		}

		return new Result(defaultValue, false);
	},

	/**
	 *	Set the key to the specified value.
	 *	Note: NaN or Infinity values are stored as null (due to JSON serialization).
	 *
	 *	@param {string} key
	 *	@param {*} value
	 *	@return {Result}
	 */
	set: function( key, value ) {
		if (!this.enabled) {
			return new Result(null, true);
		}

		var errorRaised = false;

		if (value !== undefined) {
			try {
				localStorage.setItem(this.getFullKeyName(key), JSON.stringify({ data: value }));
			} catch ( ex ) {
				errorRaised = true;
			}
		}

		return new Result(null, errorRaised);
	},

	/**
	 *	Remove the key from the localStorage.
	 *
	 *	@param {string} key
	 *	@return {Result}
	 */
	remove: function( key ) {
		if (!this.enabled) {
			return new Result(null, true);
		}

		var errorRaised = false;

		try {
			localStorage.removeItem(this.getFullKeyName(key));
		} catch ( ex ) {
			errorRaised = true;
		}

		return new Result(null, errorRaised);
	},

	/**
	 *	Create full key name.
	 *
	 *	@private
	 *	@param {string} key
	 *	@return {string}
	 */
	getFullKeyName: function( key ) {
		if (this.namespace !== undefined) {
			return 'Storage_' + this.namespace + '.' + key;
		}

		return 'Storage_' + key;
	}

};

/**
 *	@constructor
 *	@param {*} value
 *	@param {boolean} error
 */
function Result( value, error ) {
	this.value = value;
	this.error = error;
}

/**
 *	Retrieve store instance with optional namespace.
 *
 *	@param {string=} namespace
 *	@return {Store}
 */
module.exports = function( namespace ) {
	return new Store(namespace);
};